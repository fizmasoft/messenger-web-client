import { DefaultEventsMap } from '@socket.io/component-emitter';
import { AxiosInstance } from 'axios';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { MyApiResponse } from './types/api';
import { FilterPolygonArea } from './types/api/area.filter';
import { ChatType, IChat } from './types/api/chat';
import { IMessage, ISendMessage, ISendMessageToArea } from './types/api/message';
import { IOnUpdate, MessageType } from './types/api/message.types';
import { IUser } from './types/api/user';
import { CustomOptions, DeviceTypesEnum, IEvents, IPollingOptions } from './types/types';
import { CustomAxiosInstance, localStg } from './utils';

const localUid = localStg.get('messengerDeviceUid');
const uid = localUid ? localUid : uuidV1();
localStg.set('messengerDeviceUid', uid);

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
  #updatesHash: string = '';

  #token: { access: string; refresh: string };
  #tokenGetter:
    | { access: string; refresh: string }
    | (() => Promise<{ access: string; refresh: string }>);

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
    this.#tokenGetter = token;
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
    this.readMessage = this.readMessage.bind(this);
    this.getChats = this.getChats.bind(this);
    this.sendMessageToArea = this.sendMessageToArea.bind(this);
    this.init();
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
      if (events['update'] && updates.updates) {
        updates.updates.map((update) => {
          events['update'].map((cb) => cb(update));
        });
      }

      if (events['updateUser'] && updates.users) {
        updates.users.map((user) => {
          events['updateUser'].map((cb) => cb(user));
        });
      }

      if (events['updateMessage'] && updates.messages) {
        updates.messages.map((message) => {
          events['updateMessage'].map((cb) => cb(message));
        });
      }
    }

    this.#pollingInterval = setInterval(intervalCallback, polling.interval);
  }

  async init() {
    if (typeof this.#tokenGetter === 'function') {
      this.#token = await this.#tokenGetter();
    } else {
      this.#token = this.#tokenGetter;
    }
    localStg.set('messengerToken', this.#token);

    if (this.#polling) {
      this.initPolling();
      this.#events.connect.map((cb) =>
        cb({
          message: `Polling successfully connected`,
          socket: this.socket,
        }),
      );
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
  on<Ev extends keyof IEvents = keyof IEvents>(event: Ev, cb: (data: IOnUpdate) => void): this {
    if (this.#events[event]) {
      this.#events[event].push(cb);
    } else {
      this.#events[event] = [cb];
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
  public async searchUser(search: string): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.get<MyApiResponse<IUser>>(
      `/v1/users?search=${search}`,
    );

    return data;
  }

  public async sendMessage(message: ISendMessage): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.post(
      `/v1/chats/${message.to.chatId}/messages`,
      message,
    );

    return data;
  }

  public async sendMessageToNewUser(message: ISendMessage): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.post(`/v1/users/message`, message);

    return data;
  }

  public async sendMessageToArea(
    filter: FilterPolygonArea,
    message: ISendMessageToArea,
  ): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.post(`/v1/users/message-by-area`, {
      message,
      filter,
    });

    return data;
  }

  public async getChatMessages(
    chatId: string,
    { limit = 20, page = 1, search = '' }: { limit?: number; page?: number; search?: string } = {
      limit: 20,
      page: 1,
      search: '',
    },
  ): Promise<MyApiResponse<IMessage>> {
    const { data } = await this.#axiosInstance.get<MyApiResponse<IMessage>>(
      `/v1/chats/${chatId}/messages?search=${search}&limit=${limit}&page=${page}`,
    );

    return data;
  }

  public async getChatInfo(chatId: string): Promise<unknown> {
    const { data } = await this.#axiosInstance.get(`/v1/chats/${chatId}`);

    return data;
  }

  public async getChatMedia(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown[]> {
    return [];
  }

  public async getChatFiles(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown[]> {
    return [];
  }

  public async getChatAudios(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown[]> {
    return [];
  }

  public async getUpdates({
    limit = this.#polling.limit,
    page = 1,
    allowedUpdates = [],
  }: {
    limit?: number;
    page?: number;
    allowedUpdates?: MessageType[];
  } = {}): Promise<{
    updates: {
      updates: IOnUpdate[];
      users: {
        _id: string;
        isOnline: boolean;
      }[];
      messages: {
        _id: string;
        readAt: string;
      }[];
    };
    meta: any;
  }> {
    const { data } = await this.#axiosInstance
      .get(`/v1/users/updates?page=${page}&limit=${limit}&hash=${this.#updatesHash}`)
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

    this.#updatesHash = data.meta.hash ? data.meta.hash : '';

    return { updates: data.data, meta: data.meta };
  }

  public async readMessage(chatId: string, message: { messageId: string; messageReadAt: string }) {
    const { data } = await this.#axiosInstance.patch(`/v1/chats/${chatId}/messages`, message);
    return data;
  }

  public async getChats(
    {
      limit = 100,
      page = 1,
      type = null,
    }: {
      limit?: number;
      page?: number;
      type?: ChatType;
    } = { limit: 20, page: 1, type: null },
  ): Promise<MyApiResponse<IChat>> {
    const { data } = await this.#axiosInstance.get(
      `/v1/chats?limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`,
    );

    return data;
  }

  public ping() {
    if (this.socket) {
      this.socket.emit('ping', new Date().toISOString());
    } else {
      this.#axiosInstance.get('/check-health').catch();
    }
    return this;
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
