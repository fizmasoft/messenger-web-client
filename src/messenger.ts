import { DefaultEventsMap } from '@socket.io/component-emitter';
import { AxiosInstance } from 'axios';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { CustomOptions, DeviceTypesEnum, IEvents, IPollingOptions } from './types';
import { CustomAxiosInstance, localStg } from './utils';

const localUid = localStg.get('uid');
const uid = localUid ? localUid : uuidV1();
localStg.set('uid', uid);

let appVersion = '0.0.0';

const requiredHeaders = {
  'x-device-type': DeviceTypesEnum.WEB,
  'x-device-model': ENV.isBrowser
    ? `${navigator.userAgent} | ${navigator.platform}`
    : ENV.isNode
    ? `${process.platform} | ${process.arch} | Nodejs: ${process.version}`
    : 'Unknown', // dynamically fetching device model info
  // 'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
  'x-app-version': appVersion,
  'x-app-uid': uid,
};

class Messenger {
  #pollingInterval: NodeJS.Timer;
  #polling: IPollingOptions;
  #axiosInstance: AxiosInstance;
  #events: Partial<Record<keyof IEvents, ((...args: any) => void)[]>>;
  #updatesHash: string | null = '';

  #token: { access: string; refresh: string };

  public uid: string;
  public readonly socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;

  constructor(
    {
      baseURL,
      token,
      polling = null,
      languageGetter = () => 'Uz-Latin',
      headers = {},
    }: CustomOptions,
    options: Partial<ManagerOptions & SocketOptions> = {},
  ) {
    this.uid = uid;
    this.#polling = polling;
    this.#events = {};
    this.#axiosInstance = new CustomAxiosInstance(
      { baseURL: baseURL, headers: requiredHeaders },
      {
        refreshTokenUrl: '/v1/auth/refresh-token',
        languageGetter,
      },
    ).instance;

    if (polling === null) {
      this.socket = io(baseURL, {
        path: '/messenger',
        auth: {
          ...requiredHeaders,
          ...headers,
          token: this.#token,
        },
        extraHeaders: { ...requiredHeaders, ...headers },
        ...options,
      });
    }

    this.init = this.init.bind(this);
    this.close = this.close.bind(this);
    this.initPolling = this.initPolling.bind(this);
    this.on = this.on.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.getChatMessages = this.getChatMessages.bind(this);
    this.getChatInfo = this.getChatInfo.bind(this);
    this.getChatMedia = this.getChatMedia.bind(this);
    this.getChatFiles = this.getChatFiles.bind(this);
    this.getChatAudios = this.getChatAudios.bind(this);
    this.getUpdates = this.getUpdates.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.getChats = this.getChats.bind(this);
    this.init(token);
  }

  public close() {
    if (this.socket) {
      this.socket.close();
      return;
    }

    clearInterval(this.#pollingInterval);
    this.#pollingInterval = undefined;
  }

  private initPolling() {
    if (this.#pollingInterval) {
      clearInterval(this.#pollingInterval);
    }

    const getUpdates = this.getUpdates;
    const polling = this.#polling;
    const events = this.#events;
    async function intervalCallback() {
      const { updates, meta } = await getUpdates({ limit: polling.limit });
      if (events['update']) {
        updates.map((update) => {
          events['update'].map((cb) => cb(update));
        });
      }
    }

    this.#pollingInterval = setInterval(intervalCallback, polling.interval);
  }

  async init(
    token:
      | { access: string; refresh: string }
      | (() => Promise<{ access: string; refresh: string }>),
  ) {
    if (typeof token === 'function') {
      this.#token = await token();
    } else {
      this.#token = token;
    }
    localStg.set('token', this.#token);

    if (this.#polling) {
      this.initPolling();
      return this;
    }

    return this.socket
      .connect()
      .on('connect', () => {
        this.#events.connect.map((cb) =>
          cb({
            message: `Socket successfully connected. socket.id: ${this.socket.id}`,
            socket: this.socket,
          }),
        );
      })
      .on('disconnect', (reason, details) => {
        this.#events.disconnect.map((cb) =>
          cb({
            reason,
            details,
            message: `Socket disconnected: id: ${
              this.socket.id
            }, reason: ${reason}, details: ${JSON.stringify(details)}`,
            socket: this.socket,
          }),
        );
      })
      .on('connect_error', (err) => {
        if (this.socket.active) {
          this.#events.socketConnectionError.map((cb) =>
            cb({
              message: 'temporary failure, the socket will automatically try to reconnect',
              error: err,
            }),
          );
        } else {
          this.#events.socketConnectionError.map((cb) =>
            cb({
              message: `
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${err.message}
              `,
              error: err,
            }),
          );
        }
      });
  }

  public on<Ev extends string = keyof IEvents>(
    event: Ev,
    cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void,
  ): this;
  on<Ev extends string = keyof IEvents>(event: Ev, cb: (data: Messenger.IOnUpdate) => void): this {
    if (this.#events[event as keyof IEvents]) {
      this.#events[event as keyof IEvents].push(cb);
    } else {
      this.#events[event as keyof IEvents] = [cb];
    }
    // let a: Record<keyof IEvents, (...args: any) => void>;
    if (this.socket) {
      this.socket.on(event, cb as any);
    }

    return this;
  }

  /**
   *
   * @param search id or username
   * @returns {[]}
   */
  public async searchUser(search: string): Promise<Api.MyApiResponse<ApiUserManagement.IUser>> {
    const data = await this.#axiosInstance.get<Api.MyApiResponse<ApiUserManagement.IUser>>(
      `/v1/users?search=${search}`,
    );

    return data.data;
  }

  public async sendMessage(
    message: ApiMessageManagement.ISendMessage,
  ): Promise<Api.MyApiResponse<ApiUserManagement.IUser>> {
    const data = await this.#axiosInstance.post(`/v1/chats/${message.to.chatId}/messages`, message);

    return data.data;
  }

  public async sendMessageToArea(
    filter: {
      radius: number;
      right: number;
      left: number;
      coordinates: [number, number];
      polygon: {
        type: 'Polygon' | 'Point' | 'Polygon' | 'MultiPolygon' | 'LineString';
        geometry: {
          type: string;
          coordinates: number[];
        };
        properties: {};
      };
    },
    message: ApiMessageManagement.ISendMessage,
  ): Promise<Api.MyApiResponse<ApiUserManagement.IUser>> {
    const { data } = await this.#axiosInstance.post(`/v1/users/message`, message);

    return data;
  }

  public async getChatMessages(
    chatId: string,
    { limit = 20, page = 1, search = '' }: { limit?: number; page?: number; search?: string } = {
      limit: 20,
      page: 1,
      search: '',
    },
  ): Promise<Api.MyApiResponse<ApiMessageManagement.IMessage>> {
    const { data } = await this.#axiosInstance.get<
      Api.MyApiResponse<ApiMessageManagement.IMessage>
    >(`/v1/chats/${chatId}?search=${search}&limit=${limit}&page=${page}`);

    return data;
  }

  public async getChatInfo(chatId: string): Promise<unknown> {
    const { data } = await this.#axiosInstance.get(`/chats/${chatId}`);

    return data;
  }

  public async getChatMedia(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown> {
    return {};
  }

  public async getChatFiles(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown> {
    return [];
  }

  public async getChatAudios(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown> {
    return [];
  }

  public async getUpdates({
    limit = this.#polling.limit,
    page = 1,
    allowedUpdates = [],
  }: {
    limit?: number;
    page?: number;
    allowedUpdates?: Messenger.MessageType[];
  } = {}): Promise<{ updates: Messenger.IOnUpdate[]; meta: any }> {
    const { data } = await this.#axiosInstance
      .get(
        `/v1/users/updates?page=${page}&limit=${limit}&hash=${
          this.#updatesHash
          // this.#updatesHash ? this.#updatesHash : ''
        }`,
      )
      .catch(() => ({
        data: {
          data: [],
          meta: {
            hash: null,
            currentPage: 1,
            limit: 100,
            totalCount: 0,
            totalPages: 0,
          },
        },
      }));

    if (data.meta.hash) {
      this.#updatesHash = data.meta.hash;
    } else {
      this.#updatesHash = '';
    }

    return { updates: data.data, meta: data.meta };
  }

  public updateMessages(messages: []) {
    return []; // kim qachon o'qidi...
  }

  public async getChats(
    {
      limit = 100,
      page = 1,
      type = null,
    }: {
      limit?: number;
      page?: number;
      type?: Messenger.ChatType;
    } = { limit: 20, page: 1, type: null },
  ) {
    const data = await this.#axiosInstance.get(
      `/v1/chats?limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`,
    );

    return data.data;
  }

  public ping() {
    if (this.socket) {
      this.socket.send('hello');
      this.socket.emit('ping', new Date().toISOString());
    } else {
      this.#axiosInstance.get('/check-health').catch();
    }
  }
}

let messenger: Messenger;

export function getMessenger(
  customOptions: CustomOptions,
  options: Partial<ManagerOptions & SocketOptions> = {},
) {
  if (messenger) {
    return messenger;
  }

  messenger = new Messenger(customOptions, options);
  return messenger;
}
