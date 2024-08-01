import { DefaultEventsMap } from '@socket.io/component-emitter';
import { green, red } from 'ansis';
import { AxiosInstance } from 'axios';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { localStg } from './utils';
import CustomAxiosInstance from './utils/request/instance';

enum DeviceTypesEnum {
  WEB = 'web',
  APP = 'app',
  DESKTOP = 'desktop',
}

interface IPollingOptions {
  limit: number;
  interval: number; // in milliseconds
}

type CustomOptions = {
  baseURL: string;
  polling?: IPollingOptions;
  token:
    | { access: string; refresh: string }
    | (() => { access: string; refresh: string } | Promise<{ access: string; refresh: string }>);
  languageGetter?: () => I18nType.LangType;
  headers?: Record<string, string>;
};

interface IEvents {
  update: (data: Messenger.IOnUpdate) => void;
  chatAction: (action: Messenger.IChatAction) => void;
  connect: () => void;
}

const localUid = localStg.get('uid');
const uid = localUid ? localUid : uuidV1();
localStg.set('uid', uid);

let languageGetter = () => 'Uz-Uz-Latin';
let appVersion = '0.0.0';

const requiredHeaders = {
  'x-device-type': DeviceTypesEnum.WEB,
  'x-device-model': ENV.isBrowser
    ? `${navigator.userAgent} | ${navigator.platform}`
    : ENV.isNode
    ? `${process.platform} | ${process.arch} | Nodejs: ${process.version}`
    : 'Unknown', // dynamically fetching device model info
  'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
  'x-app-version': appVersion,
  'x-app-uid': uid,
};

class Messenger {
  // #tokenGetter:
  //   | { access: string; refresh: string }
  //   | (() => { access: string; refresh: string } | Promise<{ access: string; refresh: string }>);
  #interval: NodeJS.Timer;
  #polling: IPollingOptions;
  #axiosInstance: AxiosInstance;
  #events: Partial<Record<keyof IEvents, (...args: any) => void>>;
  #updatesHash: string | null = null;

  #token: { access: string; refresh: string };
  // public languageGetter: () => string;
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
    // this.#tokenGetter = token;
    languageGetter = languageGetter;
    this.uid = uid;
    this.#polling = polling;
    this.#events = {};
    this.#axiosInstance = new CustomAxiosInstance(
      { baseURL: baseURL, headers: requiredHeaders },
      {
        refreshTokenUrl: '/v1/auth/refresh-token',
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

    clearInterval(this.#interval);
    this.#interval = undefined;
  }

  private initPolling() {
    if (this.#interval) {
      clearInterval(this.#interval);
    }

    const getUpdates = this.getUpdates;
    const polling = this.#polling;
    const events = this.#events;
    async function intervalCallback() {
      const { updates, meta } = await getUpdates({ limit: polling.limit });
      if (events['update']) {
        updates.map((update) => {
          events['update'](update);
        });
      }
    }

    this.#interval = setInterval(intervalCallback, polling.interval);
  }

  async init(
    token:
      | { access: string; refresh: string }
      | (() => { access: string; refresh: string } | Promise<{ access: string; refresh: string }>),
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
        console.log(green(`Socket successfully connected. socket.id: ${this.socket.id}`));
      })
      .on('disconnect', (reason, details) => {
        console.log(
          red(
            `Socket disconnected: id: ${
              this.socket.id
            }, reason: ${reason}, details: ${JSON.stringify(details)}`,
          ),
        );
      })
      .on('connect_error', (err) => {
        if (this.socket.active) {
          console.log(red('temporary failure, the socket will automatically try to reconnect'));
        } else {
          // the connection was denied by the server
          // in that case, `socket.connect()` must be manually called in order to reconnect
          console.log(
            red(
              `
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${err.message}
              `,
            ),
          );
        }
      });
  }

  public on<Ev extends string = keyof IEvents>(
    event: Ev,
    cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void,
  ): this;
  on<Ev extends string = keyof IEvents>(event: Ev, cb: (data: Messenger.IOnUpdate) => void): this {
    this.#events[event as keyof IEvents] = cb;
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
      `/users?search=${search}`,
    );

    return data.data;
  }

  public async sendMessage(
    message: ApiMessageManagement.ISendMessage,
  ): Promise<Api.MyApiResponse<ApiUserManagement.IUser>> {
    const data = await this.#axiosInstance.post(`v1/chats/${message.to.chatId}/messages`, message);

    return data.data;
  }

  public async getChatMessages(
    chatId: string,
    { limit = 20, page = 1, search = '' }: { limit?: number; page?: number; search?: string },
  ): Promise<Api.MyApiResponse<ApiMessageManagement.IMessage>> {
    const data = await this.#axiosInstance.get<Api.MyApiResponse<ApiMessageManagement.IMessage>>(
      `/chats/${chatId}?search=${search}&limit=${limit}&page=${page}`,
    );

    return data.data;
  }

  public async getChatInfo(chatId: string): Promise<unknown> {
    const data = await this.#axiosInstance.get(`/chats/${chatId}`);

    return data.data;
  }

  public async getChatMedia(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number },
  ): Promise<unknown> {
    return {};
  }

  public async getChatFiles(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number },
  ): Promise<unknown> {
    return [];
  }

  public async getChatAudios(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number },
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
          this.#updatesHash ? this.#updatesHash : ''
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
    }

    return { updates: data.data, meta: data.meta };
  }

  public updateMessages(messages: []) {
    return []; // kim qachon o'qidi...
  }

  public async getChats(
    userId: string,
    {
      limit = 100,
      page = 1,
      type = 'private',
    }: { limit?: number; page?: number; type?: Messenger.ChatType },
  ) {
    const data = await this.#axiosInstance.get(`/chats?type=${type}&limit=${limit}&page=${page}`);

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
