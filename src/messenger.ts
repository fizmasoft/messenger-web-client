import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import type { AxiosInstance } from 'axios';

import type { IMessage, ISendMessage, ISendMessageToArea } from './types/api/message';
import type { MyApiResponse } from './types/api';
import type { FilterPolygonArea } from './types/api/area.filter';
import type { ChatType, IChat } from './types/api/chat';
import type { IOnUpdate, MessageType } from './types/api/message.types';
import type { IUser } from './types/api/user';
import type { CustomOptions, IEvents, IPollingOptions, ISocketOptions } from './types/types';

import io from 'socket.io-client';
import FormData from 'form-data';

import { ENV } from './common/config';
import { DeviceTypesEnum } from './types/types';
import { CustomAxiosInstance, localStg } from './utils';

function generateUUIDv4Like() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8; // 'y' uchun 8, 9, A, B ni beradi
    return v.toString(16);
  });
}

const localUid = localStg.get('messengerDeviceUid');
const uid = localUid ? localUid : generateUUIDv4Like();
localStg.set('messengerDeviceUid', uid);
let appVersion = '1.5.6';

// readFile(join(process.cwd() + '/package.json'))
//   .then((v) => {
//     const json = JSON.parse(v.toString());
//     appVersion = json.version;
//   })
//   .catch((err) => {
//   });

const getDeviceModel = (): string => {
  if (ENV.isBrowser && typeof navigator !== 'undefined') {
    return `${navigator.userAgent} | ${navigator.platform}`;
  } else if (ENV.isNode && typeof process !== 'undefined') {
    return `${process.platform} | ${process.arch} | Nodejs: ${process.version}`;
  }

  return 'Unknown';
};

const requiredHeaders = {
  'x-device-type': DeviceTypesEnum.WEB,
  'x-device-model': getDeviceModel(),
  // 'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
  'x-app-version': appVersion,
  'x-app-uid': uid,
};

function queryStringify(obj: Record<string, any>, parentKey?: string): string {
  if (!obj) {
    return '';
  }

  return Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key])) {
        if (parentKey) {
          return obj[key]
            .map((item) => `${parentKey}[${key}]=${encodeURIComponent(item)}`)
            .join('&');
        }

        return obj[key].map((item) => `${key}=${encodeURIComponent(item)}`).join('&');
      }

      if (typeof obj[key] === 'object') {
        if (parentKey) {
          return queryStringify(obj[key], `${parentKey}[${key}]`);
        }

        return queryStringify(obj[key], key);
      }

      if (obj[key] === null || obj[key] === undefined) {
        return null;
      }

      if (parentKey) {
        return `${parentKey}[${key}]=${encodeURIComponent(obj[key])}`;
      }

      return `${key}=${encodeURIComponent(obj[key])}`;
    })
    .filter(Boolean)
    .join('&');
}

class Messenger {
  #pollingInterval: NodeJS.Timer;
  readonly #polling: IPollingOptions;
  readonly #socket: ISocketOptions;
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
      socket = null,
      languageGetter = () => 'Uz-Latin',
      headers = {},
    }: CustomOptions,
    options: Partial<ManagerOptions & SocketOptions> = {},
  ) {
    this.uid = uid;
    this.#polling = polling;
    this.#socket = socket;
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

    if (this.#socket !== null) {
      this.socket = io(this.#socket.baseUrl, {
        path: this.#socket.path,
        auth: (cb) =>
          cb({
            ...requiredHeaders,
            token: this.#token.access,
          }),
        autoConnect: true,
        reconnection: true, // default setting at present
        reconnectionDelay: 1000, // default setting at present
        reconnectionDelayMax: 5000, // default setting at present
        reconnectionAttempts: Infinity, // default setting at present
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
    const events = this.#events;

    return this.socket
      .connect()
      .on('connect', () => {
        if (!Array.isArray(events['connect'])) {
          return;
        }
        events['connect'].map((cb) =>
          cb({
            message: `Socket successfully connected. socket.id: ${this.socket.id}`,
            socket: this.socket,
          }),
        );
      })
      .on('disconnect', (reason, details) => {
        if (!Array.isArray(events['disconnect'])) {
          return;
        }

        events['disconnect'].map((cb) =>
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
        if (!events['socketConnectionError'] || !Array.isArray(events['socketConnectionError'])) {
          return;
        }

        if (this.socket.active) {
          events['socketConnectionError'].map((cb) =>
            cb({
              message: 'temporary failure, the socket will automatically try to reconnect',
              error: err,
            }),
          );
        } else {
          events['socketConnectionError'].map((cb) =>
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
            events.update.map((cb: (...args: any) => void) => cb.apply(null, updates));
            return;
          case 'message:read':
            events.updateMessage.map((cb: (...args: any) => void) => cb.apply(null, updates));
            return;
          case 'user:update':
            events.updateUser.map((cb: (...args: any) => void) => cb.apply(null, updates));
            return;

          default:
            break;
        }

        if (!events[eventName]) {
          return;
        }

        events[eventName].map((cb: (...args: any) => void) => cb.apply(null, updates));
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

    this.#events[event] = this.#events[event].filter((cb) => cb.name !== callback.name) as any;
    return this;
  }

  /**
   *
   * @param search id or username
   * @returns {[]}
   */
  public async searchUser(
    query: { limit?: number; page?: number; search?: string } & Record<string, any> = {
      limit: 20,
      page: 1,
      search: '',
    },
  ): Promise<MyApiResponse<IUser>> {
    const { data } = await this.#axiosInstance.get<MyApiResponse<IUser>>(
      `/v1/users?${queryStringify(query)}`,
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
    query: { limit?: number; page?: number; search?: string } & Record<string, any> = {
      limit: 20,
      page: 1,
      search: '',
    },
  ): Promise<MyApiResponse<IMessage>> {
    const { data } = await this.#axiosInstance.get<MyApiResponse<IMessage>>(
      `/v1/chats/${chatId}/messages?${queryStringify(query)}`,
    );

    return data;
  }

  public async getChatInfo(chatId: string): Promise<unknown> {
    const { data } = await this.#axiosInstance.get(`/v1/chats/${chatId}`);

    return data;
  }

  // TODO:
  public async getChatMedia(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown[]> {
    return [];
  }

  // TODO:
  public async getChatFiles(
    chatId: string,
    { limit = 20, page = 1 }: { limit?: number; page?: number } = { limit: 20, page: 1 },
  ): Promise<unknown[]> {
    return [];
  }

  // TODO:
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
    query: {
      limit?: number;
      page?: number;
      search?: string;
      type?: ChatType;
    } & Record<string, any> = { limit: 20, page: 1, type: null },
  ): Promise<MyApiResponse<IChat>> {
    const { data } = await this.#axiosInstance.get(`/v1/chats?${queryStringify(query)}`);

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
