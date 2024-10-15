import { DefaultEventsMap } from '@socket.io/component-emitter';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';
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

// readFile(join(process.cwd() + '/package.json'))
//   .then((v) => {
//     const json = JSON.parse(v.toString());
//     appVersion = json.version;
//   })
//   .catch((err) => {
//     console.log(err);
//   });

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
  readonly #polling: IPollingOptions;
  readonly #axiosInstance: AxiosInstance;

  user: {
    _id: string;
    image: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string | null;
    username: string;
    phoneNumber: string;
    birthday: string | null;
    deviceUid: string | null;
    // position: null;
    // group: null;
    // mfy: null;
    // gom: null;
    // district: null;
    // divisionId: null;
  };

  #events: Partial<{
    [EventName in keyof IEvents]: IEvents[EventName][];
  }>;
  // Record<
  // EventName extends keyof IEvents,
  //   (EventName extends keyof IEvents ? IEvents[EventName] : (...args: any[]) => void)[]
  // >
  #updatesHash: string = '';
  readonly #baseURL: string;
  #token: { access: string; refresh: string };
  readonly #tokenGetter:
    | { access: string; refresh: string }
    | (() => Promise<{ access: string; refresh: string }>);

  public uid: string;
  public socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;

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
    this.#baseURL = baseURL;
    this.#events = { update: [], updateUser: [], updateMessage: [] };
    this.#token = { access: '', refresh: '' };
    this.#tokenGetter = token;
    this.#axiosInstance = new CustomAxiosInstance(
      { baseURL: baseURL, headers: requiredHeaders },
      {
        refreshTokenUrl: '/v1/auth/refresh-token',
        languageGetter,
        tokenGetter: token,
      },
    ).instance;

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
      const { updates } = await getUpdates({ limit: polling.limit });
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

    const { data: me } = await this.#axiosInstance
      .get('/v1/auth/me')
      .catch((err) => ({ data: { success: false } }));
    if (me.success) {
      this.user = me.data;
    }
    console.log(this.user);

    if (this.#polling === null) {
      this.socket = io(this.#baseURL, {
        path: '/messenger',
        auth: (cb) =>
          cb({
            ...requiredHeaders,
            token: this.#token.access,
          }),
        // extraHeaders: { ...requiredHeaders, token: this.#token.access },
      });
    }

    if (this.#polling) {
      this.initPolling();
      if (Array.isArray(this.#events['connect'])) {
        this.#events['connect'].map((cb) =>
          cb({
            message: `Polling successfully connected`,
            socket: this.socket,
          }),
        );
      }
      return this;
    }

    return this.socket
      .connect()
      .on('connect', () => {
        if (!Array.isArray(this.#events['connect'])) {
          return;
        }
        this.#events['connect'].map((cb) =>
          cb({
            message: `Socket successfully connected. socket.id: ${this.socket.id}`,
            socket: this.socket,
          }),
        );
      })
      .on('disconnect', (reason, details) => {
        if (!Array.isArray(this.#events['disconnect'])) {
          return;
        }

        this.#events['disconnect'].map((cb) =>
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
        if (
          !this.#events['socketConnectionError'] ||
          !Array.isArray(this.#events['socketConnectionError'])
        ) {
          return;
        }

        if (this.socket.active) {
          this.#events['socketConnectionError'].map((cb) =>
            cb({
              message: 'temporary failure, the socket will automatically try to reconnect',
              error: err,
            }),
          );
        } else {
          this.#events['socketConnectionError'].map((cb) =>
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
      })
      .onAny((eventName, ...updates) => {
        switch (eventName) {
          case 'message:new':
            // ! buni keyin olib tashlash kerak
            updates.map((update) => this.socket.emit('message:received', update.message._id));
            this.#events.update.map((cb: (...args: any) => void) => cb.apply(null, updates));
            return;
          case 'message:read':
            this.#events.updateMessage.map((cb: (...args: any) => void) => cb.apply(null, updates));
            return;
          case 'user:update':
            this.#events.updateUser.map((cb: (...args: any) => void) => cb.apply(null, updates));
            return;

          default:
            break;
        }

        if (!this.#events[eventName]) {
          return;
        }

        this.#events[eventName].map((cb: (...args: any) => void) => cb.apply(null, updates));
      });
  }

  // public on<EventName extends keyof IEvents = 'update'>(
  //   event: EventName,
  //   cb: IEvents[EventName],
  // ): this;
  on<EventName extends keyof IEvents = 'update'>(event: EventName, cb: IEvents[EventName]): this {
    if (this.#events[event] && Array.isArray(this.#events[event])) {
      this.#events[event].push(cb);
    } else {
      this.#events[event] = [cb] as any;
    }

    return this;
  }

  public eventNames(): string[] {
    return Object.keys(this.#events);
  }

  public removeAllListeners(event?: keyof IEvents): this {
    if (event) {
      this.#events[event] = [];
      return;
    }

    this.#events = {};
    return this;
  }

  public removeListener(event: keyof IEvents, callback: any): this {
    if (!this.#events[event] || !Array.isArray(this.#events[event])) {
      return;
    }

    this.#events[event].filter((cb) => cb.name !== callback.name);
    return this;
  }

  /**
   *
   * @param search id or username
   * @returns {[]}
   */
  public async searchUser(
    { limit = 20, page = 1, search = '' }: { limit?: number; page?: number; search?: string } = {
      limit: 20,
      page: 1,
      search: '',
    },
  ): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.get<MyApiResponse<IUser>>(
      `/v1/users?search=${search}&limit=${limit}&page=${page}`,
    );

    return data;
  }

  public async sendMessage(
    chatId: string,
    message: ISendMessage | FormData,
  ): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.post(`/v1/chats/${chatId}/messages`, message);

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
      .get(`/v1/users/updates?limit=${limit}&hash=${this.#updatesHash}`)
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
      search,
      type = null,
    }: {
      limit?: number;
      page?: number;
      search?: string;
      type?: ChatType;
    } = { limit: 20, page: 1, type: null },
  ): Promise<MyApiResponse<IChat>> {
    const { data } = await this.#axiosInstance.get(
      `/v1/chats?search=${search}&limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`,
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
