var _Messenger_pollingInterval, _Messenger_polling, _Messenger_socket, _Messenger_axiosInstance, _Messenger_events, _Messenger_updatesHash, _Messenger_baseURL, _Messenger_token, _Messenger_tokenGetter;
import { __awaiter, __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { DeviceTypesEnum } from './types/types';
import { CustomAxiosInstance, localStg } from './utils';
const localUid = localStg.get('messengerDeviceUid');
const uid = localUid ? localUid : uuidV1();
localStg.set('messengerDeviceUid', uid);
let appVersion = '1.5.6';
// readFile(join(process.cwd() + '/package.json'))
//   .then((v) => {
//     const json = JSON.parse(v.toString());
//     appVersion = json.version;
//   })
//   .catch((err) => {
//     console.log(err);
//   });
const getDeviceModel = () => {
    if (ENV.isBrowser && typeof navigator !== 'undefined') {
        return `${navigator.userAgent} | ${navigator.platform}`;
    }
    else if (ENV.isNode && typeof process !== 'undefined') {
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
function queryStringify(obj, parentKey) {
    if (!obj) {
        return '';
    }
    return Object.keys(obj)
        .map((key) => {
        console.log(key, obj[key]);
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
    constructor({ baseURL, token, polling = null, socket = null, languageGetter = () => 'Uz-Latin', headers = {}, }, options = {}) {
        _Messenger_pollingInterval.set(this, void 0);
        _Messenger_polling.set(this, void 0);
        _Messenger_socket.set(this, void 0);
        _Messenger_axiosInstance.set(this, void 0);
        _Messenger_events.set(this, void 0);
        // Record<
        // EventName extends keyof IEvents,
        //   (EventName extends keyof IEvents ? IEvents[EventName] : (...args: any[]) => void)[]
        // >
        _Messenger_updatesHash.set(this, '');
        _Messenger_baseURL.set(this, void 0);
        _Messenger_token.set(this, void 0);
        _Messenger_tokenGetter.set(this, void 0);
        this.uid = uid;
        __classPrivateFieldSet(this, _Messenger_polling, polling, "f");
        __classPrivateFieldSet(this, _Messenger_socket, socket, "f");
        __classPrivateFieldSet(this, _Messenger_baseURL, baseURL, "f");
        __classPrivateFieldSet(this, _Messenger_events, { update: [], updateUser: [], updateMessage: [] }, "f");
        __classPrivateFieldSet(this, _Messenger_token, { access: '', refresh: '' }, "f");
        __classPrivateFieldSet(this, _Messenger_tokenGetter, token, "f");
        __classPrivateFieldSet(this, _Messenger_axiosInstance, new CustomAxiosInstance({ baseURL: baseURL, headers: requiredHeaders }, {
            refreshTokenUrl: '/v1/auth/refresh-token',
            languageGetter,
            tokenGetter: token,
        }).instance, "f");
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
    close() {
        if (this.socket) {
            this.socket.close();
            return;
        }
        clearInterval(__classPrivateFieldGet(this, _Messenger_pollingInterval, "f"));
        __classPrivateFieldSet(this, _Messenger_pollingInterval, undefined, "f");
    }
    initPolling() {
        if (__classPrivateFieldGet(this, _Messenger_pollingInterval, "f")) {
            clearInterval(__classPrivateFieldGet(this, _Messenger_pollingInterval, "f"));
        }
        const getUpdates = this.getUpdates;
        const polling = __classPrivateFieldGet(this, _Messenger_polling, "f");
        const events = __classPrivateFieldGet(this, _Messenger_events, "f");
        function intervalCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                const { updates } = yield getUpdates({ limit: polling.limit });
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
            });
        }
        __classPrivateFieldSet(this, _Messenger_pollingInterval, setInterval(intervalCallback, polling.interval), "f");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof __classPrivateFieldGet(this, _Messenger_tokenGetter, "f") === 'function') {
                __classPrivateFieldSet(this, _Messenger_token, yield __classPrivateFieldGet(this, _Messenger_tokenGetter, "f").call(this), "f");
            }
            else {
                __classPrivateFieldSet(this, _Messenger_token, __classPrivateFieldGet(this, _Messenger_tokenGetter, "f"), "f");
            }
            localStg.set('messengerToken', __classPrivateFieldGet(this, _Messenger_token, "f"));
            const { data: me } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f")
                .get('/v1/auth/me')
                .catch((err) => ({ data: { success: false } }));
            if (me.success) {
                this.user = me.data;
            }
            if (__classPrivateFieldGet(this, _Messenger_socket, "f") !== null) {
                this.socket = io(__classPrivateFieldGet(this, _Messenger_socket, "f").baseUrl, {
                    path: __classPrivateFieldGet(this, _Messenger_socket, "f").path,
                    auth: (cb) => cb(Object.assign(Object.assign({}, requiredHeaders), { token: __classPrivateFieldGet(this, _Messenger_token, "f").access })),
                    autoConnect: true,
                    reconnection: true, // default setting at present
                    reconnectionDelay: 1000, // default setting at present
                    reconnectionDelayMax: 5000, // default setting at present
                    reconnectionAttempts: Infinity, // default setting at present
                    // extraHeaders: { ...requiredHeaders, token: this.#token.access },
                });
            }
            if (__classPrivateFieldGet(this, _Messenger_polling, "f")) {
                this.initPolling();
                if (Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")['connect'])) {
                    __classPrivateFieldGet(this, _Messenger_events, "f")['connect'].map((cb) => cb({
                        message: `Polling successfully connected`,
                        socket: this.socket,
                    }));
                }
                return this;
            }
            const events = __classPrivateFieldGet(this, _Messenger_events, "f");
            return this.socket
                .connect()
                .on('connect', () => {
                if (!Array.isArray(events['connect'])) {
                    return;
                }
                events['connect'].map((cb) => cb({
                    message: `Socket successfully connected. socket.id: ${this.socket.id}`,
                    socket: this.socket,
                }));
            })
                .on('disconnect', (reason, details) => {
                if (!Array.isArray(events['disconnect'])) {
                    return;
                }
                events['disconnect'].map((cb) => cb({
                    reason,
                    details,
                    message: `Socket disconnected: id: ${this.socket.id}, reason: ${reason}, details: ${JSON.stringify(details)}`,
                    socket: this.socket,
                }));
            })
                .on('connect_error', (err) => {
                if (!events['socketConnectionError'] || !Array.isArray(events['socketConnectionError'])) {
                    return;
                }
                if (this.socket.active) {
                    events['socketConnectionError'].map((cb) => cb({
                        message: 'temporary failure, the socket will automatically try to reconnect',
                        error: err,
                    }));
                }
                else {
                    events['socketConnectionError'].map((cb) => cb({
                        message: `
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${err.message}
              `,
                        error: err,
                    }));
                }
            })
                .onAny((eventName, ...updates) => {
                switch (eventName) {
                    case 'message:new':
                        // ! buni keyin olib tashlash kerak
                        updates.map((update) => this.socket.emit('message:received', update.message._id));
                        events.update.map((cb) => cb.apply(null, updates));
                        return;
                    case 'message:read':
                        events.updateMessage.map((cb) => cb.apply(null, updates));
                        return;
                    case 'user:update':
                        events.updateUser.map((cb) => cb.apply(null, updates));
                        return;
                    default:
                        break;
                }
                if (!events[eventName]) {
                    return;
                }
                events[eventName].map((cb) => cb.apply(null, updates));
            });
        });
    }
    // public on<EventName extends keyof IEvents = 'update'>(
    //   event: EventName,
    //   cb: IEvents[EventName],
    // ): this;
    on(event, cb) {
        if (__classPrivateFieldGet(this, _Messenger_events, "f")[event] && Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")[event])) {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event].push(cb);
        }
        else {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event] = [cb];
        }
        return this;
    }
    eventNames() {
        return Object.keys(__classPrivateFieldGet(this, _Messenger_events, "f"));
    }
    removeAllListeners(event) {
        if (event) {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event] = [];
            return;
        }
        __classPrivateFieldSet(this, _Messenger_events, {}, "f");
        return this;
    }
    removeListener(event, callback) {
        if (!__classPrivateFieldGet(this, _Messenger_events, "f")[event] || !Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")[event])) {
            return;
        }
        __classPrivateFieldGet(this, _Messenger_events, "f")[event].filter((cb) => cb.name !== callback.name);
        return this;
    }
    /**
     *
     * @param search id or username
     * @returns {[]}
     */
    searchUser() {
        return __awaiter(this, arguments, void 0, function* (query = {
            limit: 20,
            page: 1,
            search: '',
        }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/users??${queryStringify(query)}`);
            return data;
        });
    }
    sendMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`/v1/chats/${chatId}/messages`, message);
            return data;
        });
    }
    sendMessageToNewUser(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`/v1/users/message`, message);
            return data;
        });
    }
    sendMessageToArea(filter, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`/v1/users/message-by-area`, {
                message,
                filter,
            });
            return data;
        });
    }
    getChatMessages(chatId_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, query = {
            limit: 20,
            page: 1,
            search: '',
        }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats/${chatId}/messages?${queryStringify(query)}`);
            return data;
        });
    }
    getChatInfo(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats/${chatId}`);
            return data;
        });
    }
    getChatMedia(chatId_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
            return [];
        });
    }
    getChatFiles(chatId_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
            return [];
        });
    }
    getChatAudios(chatId_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
            return [];
        });
    }
    getUpdates() {
        return __awaiter(this, arguments, void 0, function* ({ limit = __classPrivateFieldGet(this, _Messenger_polling, "f").limit, allowedUpdates = [], } = {}) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f")
                .get(`/v1/users/updates?limit=${limit}&hash=${__classPrivateFieldGet(this, _Messenger_updatesHash, "f")}`)
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
            __classPrivateFieldSet(this, _Messenger_updatesHash, data.meta.hash ? data.meta.hash : '', "f");
            return { updates: data.data, meta: data.meta };
        });
    }
    readMessage(chatId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").patch(`/v1/chats/${chatId}/messages`, message);
            return data;
        });
    }
    getChats() {
        return __awaiter(this, arguments, void 0, function* (query = { limit: 20, page: 1, type: null }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats?${queryStringify(query)}`);
            return data;
        });
    }
    ping() {
        if (this.socket) {
            this.socket.emit('ping', new Date().toISOString());
        }
        else {
            __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get('/check-health').catch();
        }
        return this;
    }
}
_Messenger_pollingInterval = new WeakMap(), _Messenger_polling = new WeakMap(), _Messenger_socket = new WeakMap(), _Messenger_axiosInstance = new WeakMap(), _Messenger_events = new WeakMap(), _Messenger_updatesHash = new WeakMap(), _Messenger_baseURL = new WeakMap(), _Messenger_token = new WeakMap(), _Messenger_tokenGetter = new WeakMap();
let messenger;
export function getMessenger(customOptions, options = {}) {
    if (messenger) {
        return messenger;
    }
    messenger = new Messenger(customOptions, options);
    return messenger;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWFBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXhELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDM0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFFekIsa0RBQWtEO0FBQ2xELG1CQUFtQjtBQUNuQiw2Q0FBNkM7QUFDN0MsaUNBQWlDO0FBQ2pDLE9BQU87QUFDUCxzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLFFBQVE7QUFFUixNQUFNLGNBQWMsR0FBRyxHQUFXLEVBQUU7SUFDbEMsSUFBSSxHQUFHLENBQUMsU0FBUyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ3RELE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxRCxDQUFDO1NBQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ3hELE9BQU8sR0FBRyxPQUFP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LENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWFuYWdlck9wdGlvbnMsIFNvY2tldCwgU29ja2V0T3B0aW9ucyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgdHlwZSB7IERlZmF1bHRFdmVudHNNYXAgfSBmcm9tICdAc29ja2V0LmlvL2NvbXBvbmVudC1lbWl0dGVyJztcclxuaW1wb3J0IHR5cGUgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgdHlwZSBGb3JtRGF0YSBmcm9tICdmb3JtLWRhdGEnO1xyXG5cclxuaW1wb3J0IHR5cGUgeyBJTWVzc2FnZSwgSVNlbmRNZXNzYWdlLCBJU2VuZE1lc3NhZ2VUb0FyZWEgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlJztcclxuaW1wb3J0IHR5cGUgeyBNeUFwaVJlc3BvbnNlIH0gZnJvbSAnLi90eXBlcy9hcGknO1xyXG5pbXBvcnQgdHlwZSB7IEZpbHRlclBvbHlnb25BcmVhIH0gZnJvbSAnLi90eXBlcy9hcGkvYXJlYS5maWx0ZXInO1xyXG5pbXBvcnQgdHlwZSB7IENoYXRUeXBlLCBJQ2hhdCB9IGZyb20gJy4vdHlwZXMvYXBpL2NoYXQnO1xyXG5pbXBvcnQgdHlwZSB7IElPblVwZGF0ZSwgTWVzc2FnZVR5cGUgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlLnR5cGVzJztcclxuaW1wb3J0IHR5cGUgeyBJVXNlciB9IGZyb20gJy4vdHlwZXMvYXBpL3VzZXInO1xyXG5pbXBvcnQgdHlwZSB7IEN1c3RvbU9wdGlvbnMsIElFdmVudHMsIElQb2xsaW5nT3B0aW9ucywgSVNvY2tldE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzL3R5cGVzJztcclxuXHJcbmltcG9ydCB7IGlvIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHYxIGFzIHV1aWRWMSB9IGZyb20gJ3V1aWQnO1xyXG5cclxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi9jb21tb24vY29uZmlnJztcclxuaW1wb3J0IHsgRGV2aWNlVHlwZXNFbnVtIH0gZnJvbSAnLi90eXBlcy90eXBlcyc7XHJcbmltcG9ydCB7IEN1c3RvbUF4aW9zSW5zdGFuY2UsIGxvY2FsU3RnIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5jb25zdCBsb2NhbFVpZCA9IGxvY2FsU3RnLmdldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJyk7XHJcbmNvbnN0IHVpZCA9IGxvY2FsVWlkID8gbG9jYWxVaWQgOiB1dWlkVjEoKTtcclxubG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJEZXZpY2VVaWQnLCB1aWQpO1xyXG5sZXQgYXBwVmVyc2lvbiA9ICcxLjUuNic7XHJcblxyXG4vLyByZWFkRmlsZShqb2luKHByb2Nlc3MuY3dkKCkgKyAnL3BhY2thZ2UuanNvbicpKVxyXG4vLyAgIC50aGVuKCh2KSA9PiB7XHJcbi8vICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZSh2LnRvU3RyaW5nKCkpO1xyXG4vLyAgICAgYXBwVmVyc2lvbiA9IGpzb24udmVyc2lvbjtcclxuLy8gICB9KVxyXG4vLyAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbi8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4vLyAgIH0pO1xyXG5cclxuY29uc3QgZ2V0RGV2aWNlTW9kZWwgPSAoKTogc3RyaW5nID0+IHtcclxuICBpZiAoRU5WLmlzQnJvd3NlciAmJiB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIGAke25hdmlnYXRvci51c2VyQWdlbnR9IHwgJHtuYXZpZ2F0b3IucGxhdGZvcm19YDtcclxuICB9IGVsc2UgaWYgKEVOVi5pc05vZGUgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICByZXR1cm4gYCR7cHJvY2Vzcy5wbGF0Zm9ybX0gfCAke3Byb2Nlc3MuYXJjaH0gfCBOb2RlanM6ICR7cHJvY2Vzcy52ZXJzaW9ufWA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gJ1Vua25vd24nO1xyXG59O1xyXG5cclxuY29uc3QgcmVxdWlyZWRIZWFkZXJzID0ge1xyXG4gICd4LWRldmljZS10eXBlJzogRGV2aWNlVHlwZXNFbnVtLldFQixcclxuICAneC1kZXZpY2UtbW9kZWwnOiBnZXREZXZpY2VNb2RlbCgpLFxyXG4gIC8vICd4LWFwcC1sYW5nJzogKGxhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgSTE4blR5cGUuTGFuZ1R5cGUsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuICAneC1hcHAtdmVyc2lvbic6IGFwcFZlcnNpb24sXHJcbiAgJ3gtYXBwLXVpZCc6IHVpZCxcclxufTtcclxuXHJcbmZ1bmN0aW9uIHF1ZXJ5U3RyaW5naWZ5KG9iajogUmVjb3JkPHN0cmluZywgYW55PiwgcGFyZW50S2V5Pzogc3RyaW5nKTogc3RyaW5nIHtcclxuICBpZiAoIW9iaikge1xyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iailcclxuICAgIC5tYXAoKGtleSkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhrZXksIG9ialtrZXldKTtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqW2tleV0pKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudEtleSkge1xyXG4gICAgICAgICAgcmV0dXJuIG9ialtrZXldXHJcbiAgICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IGAke3BhcmVudEtleX1bJHtrZXl9XT0ke2VuY29kZVVSSUNvbXBvbmVudChpdGVtKX1gKVxyXG4gICAgICAgICAgICAuam9pbignJicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9ialtrZXldLm1hcCgoaXRlbSkgPT4gYCR7a2V5fT0ke2VuY29kZVVSSUNvbXBvbmVudChpdGVtKX1gKS5qb2luKCcmJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudEtleSkge1xyXG4gICAgICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5naWZ5KG9ialtrZXldLCBgJHtwYXJlbnRLZXl9WyR7a2V5fV1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxdWVyeVN0cmluZ2lmeShvYmpba2V5XSwga2V5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9ialtrZXldID09PSBudWxsIHx8IG9ialtrZXldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmVudEtleSkge1xyXG4gICAgICAgIHJldHVybiBgJHtwYXJlbnRLZXl9WyR7a2V5fV09JHtlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pfWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBgJHtrZXl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKX1gO1xyXG4gICAgfSlcclxuICAgIC5maWx0ZXIoQm9vbGVhbilcclxuICAgIC5qb2luKCcmJyk7XHJcbn1cclxuXHJcbmNsYXNzIE1lc3NlbmdlciB7XHJcbiAgI3BvbGxpbmdJbnRlcnZhbDogTm9kZUpTLlRpbWVyO1xyXG4gIHJlYWRvbmx5ICNwb2xsaW5nOiBJUG9sbGluZ09wdGlvbnM7XHJcbiAgcmVhZG9ubHkgI3NvY2tldDogSVNvY2tldE9wdGlvbnM7XHJcbiAgcmVhZG9ubHkgI2F4aW9zSW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XHJcblxyXG4gIHVzZXI6IHtcclxuICAgIF9pZDogc3RyaW5nO1xyXG4gICAgaW1hZ2U6IHN0cmluZztcclxuICAgIGZpcnN0TmFtZTogc3RyaW5nO1xyXG4gICAgbGFzdE5hbWU6IHN0cmluZztcclxuICAgIG1pZGRsZU5hbWU6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgdXNlcm5hbWU6IHN0cmluZztcclxuICAgIHBob25lTnVtYmVyOiBzdHJpbmc7XHJcbiAgICBiaXJ0aGRheTogc3RyaW5nIHwgbnVsbDtcclxuICAgIGRldmljZVVpZDogc3RyaW5nIHwgbnVsbDtcclxuICAgIC8vIHBvc2l0aW9uOiBudWxsO1xyXG4gICAgLy8gZ3JvdXA6IG51bGw7XHJcbiAgICAvLyBtZnk6IG51bGw7XHJcbiAgICAvLyBnb206IG51bGw7XHJcbiAgICAvLyBkaXN0cmljdDogbnVsbDtcclxuICAgIC8vIGRpdmlzaW9uSWQ6IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgI2V2ZW50czogUGFydGlhbDx7XHJcbiAgICBbRXZlbnROYW1lIGluIGtleW9mIElFdmVudHNdOiBJRXZlbnRzW0V2ZW50TmFtZV1bXTtcclxuICB9PjtcclxuICAvLyBSZWNvcmQ8XHJcbiAgLy8gRXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyxcclxuICAvLyAgIChFdmVudE5hbWUgZXh0ZW5kcyBrZXlvZiBJRXZlbnRzID8gSUV2ZW50c1tFdmVudE5hbWVdIDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKVtdXHJcbiAgLy8gPlxyXG4gICN1cGRhdGVzSGFzaDogc3RyaW5nID0gJyc7XHJcbiAgcmVhZG9ubHkgI2Jhc2VVUkw6IHN0cmluZztcclxuICAjdG9rZW46IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9O1xyXG4gIHJlYWRvbmx5ICN0b2tlbkdldHRlcjpcclxuICAgIHwgeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH1cclxuICAgIHwgKCgpID0+IFByb21pc2U8eyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH0+KTtcclxuXHJcbiAgcHVibGljIHVpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyBzb2NrZXQ6IFNvY2tldDxEZWZhdWx0RXZlbnRzTWFwLCBEZWZhdWx0RXZlbnRzTWFwPiB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAge1xyXG4gICAgICBiYXNlVVJMLFxyXG4gICAgICB0b2tlbixcclxuICAgICAgcG9sbGluZyA9IG51bGwsXHJcbiAgICAgIHNvY2tldCA9IG51bGwsXHJcbiAgICAgIGxhbmd1YWdlR2V0dGVyID0gKCkgPT4gJ1V6LUxhdGluJyxcclxuICAgICAgaGVhZGVycyA9IHt9LFxyXG4gICAgfTogQ3VzdG9tT3B0aW9ucyxcclxuICAgIG9wdGlvbnM6IFBhcnRpYWw8TWFuYWdlck9wdGlvbnMgJiBTb2NrZXRPcHRpb25zPiA9IHt9LFxyXG4gICkge1xyXG4gICAgdGhpcy51aWQgPSB1aWQ7XHJcbiAgICB0aGlzLiNwb2xsaW5nID0gcG9sbGluZztcclxuICAgIHRoaXMuI3NvY2tldCA9IHNvY2tldDtcclxuICAgIHRoaXMuI2Jhc2VVUkwgPSBiYXNlVVJMO1xyXG4gICAgdGhpcy4jZXZlbnRzID0geyB1cGRhdGU6IFtdLCB1cGRhdGVVc2VyOiBbXSwgdXBkYXRlTWVzc2FnZTogW10gfTtcclxuICAgIHRoaXMuI3Rva2VuID0geyBhY2Nlc3M6ICcnLCByZWZyZXNoOiAnJyB9O1xyXG4gICAgdGhpcy4jdG9rZW5HZXR0ZXIgPSB0b2tlbjtcclxuICAgIHRoaXMuI2F4aW9zSW5zdGFuY2UgPSBuZXcgQ3VzdG9tQXhpb3NJbnN0YW5jZShcclxuICAgICAgeyBiYXNlVVJMOiBiYXNlVVJMLCBoZWFkZXJzOiByZXF1aXJlZEhlYWRlcnMgfSxcclxuICAgICAge1xyXG4gICAgICAgIHJlZnJlc2hUb2tlblVybDogJy92MS9hdXRoL3JlZnJlc2gtdG9rZW4nLFxyXG4gICAgICAgIGxhbmd1YWdlR2V0dGVyLFxyXG4gICAgICAgIHRva2VuR2V0dGVyOiB0b2tlbixcclxuICAgICAgfSxcclxuICAgICkuaW5zdGFuY2U7XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0UG9sbGluZyA9IHRoaXMuaW5pdFBvbGxpbmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlYXJjaFVzZXIgPSB0aGlzLnNlYXJjaFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzID0gdGhpcy5nZXRDaGF0TWVzc2FnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdEluZm8gPSB0aGlzLmdldENoYXRJbmZvLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZWRpYSA9IHRoaXMuZ2V0Q2hhdE1lZGlhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRGaWxlcyA9IHRoaXMuZ2V0Q2hhdEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRBdWRpb3MgPSB0aGlzLmdldENoYXRBdWRpb3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkTWVzc2FnZSA9IHRoaXMucmVhZE1lc3NhZ2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdHMgPSB0aGlzLmdldENoYXRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9BcmVhID0gdGhpcy5zZW5kTWVzc2FnZVRvQXJlYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFBvbGxpbmcoKSB7XHJcbiAgICBpZiAodGhpcy4jcG9sbGluZ0ludGVydmFsKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRVcGRhdGVzID0gdGhpcy5nZXRVcGRhdGVzO1xyXG4gICAgY29uc3QgcG9sbGluZyA9IHRoaXMuI3BvbGxpbmc7XHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XHJcbiAgICBhc3luYyBmdW5jdGlvbiBpbnRlcnZhbENhbGxiYWNrKCkge1xyXG4gICAgICBjb25zdCB7IHVwZGF0ZXMgfSA9IGF3YWl0IGdldFVwZGF0ZXMoeyBsaW1pdDogcG9sbGluZy5saW1pdCB9KTtcclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlJ10gJiYgdXBkYXRlcy51cGRhdGVzKSB7XHJcbiAgICAgICAgdXBkYXRlcy51cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVVc2VyJ10gJiYgdXBkYXRlcy51c2Vycykge1xyXG4gICAgICAgIHVwZGF0ZXMudXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZVVzZXInXS5tYXAoKGNiKSA9PiBjYih1c2VyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXSAmJiB1cGRhdGVzLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgdXBkYXRlcy5tZXNzYWdlcy5tYXAoKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgIGV2ZW50c1sndXBkYXRlTWVzc2FnZSddLm1hcCgoY2IpID0+IGNiKG1lc3NhZ2UpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKGludGVydmFsQ2FsbGJhY2ssIHBvbGxpbmcuaW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW5pdCgpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy4jdG9rZW5HZXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSBhd2FpdCB0aGlzLiN0b2tlbkdldHRlcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSB0aGlzLiN0b2tlbkdldHRlcjtcclxuICAgIH1cclxuICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB0aGlzLiN0b2tlbik7XHJcblxyXG4gICAgY29uc3QgeyBkYXRhOiBtZSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZVxyXG4gICAgICAuZ2V0KCcvdjEvYXV0aC9tZScpXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiAoeyBkYXRhOiB7IHN1Y2Nlc3M6IGZhbHNlIH0gfSkpO1xyXG4gICAgaWYgKG1lLnN1Y2Nlc3MpIHtcclxuICAgICAgdGhpcy51c2VyID0gbWUuZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy4jc29ja2V0ICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc29ja2V0ID0gaW8odGhpcy4jc29ja2V0LmJhc2VVcmwsIHtcclxuICAgICAgICBwYXRoOiB0aGlzLiNzb2NrZXQucGF0aCxcclxuICAgICAgICBhdXRoOiAoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIC4uLnJlcXVpcmVkSGVhZGVycyxcclxuICAgICAgICAgICAgdG9rZW46IHRoaXMuI3Rva2VuLmFjY2VzcyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgIGF1dG9Db25uZWN0OiB0cnVlLFxyXG4gICAgICAgIHJlY29ubmVjdGlvbjogdHJ1ZSwgLy8gZGVmYXVsdCBzZXR0aW5nIGF0IHByZXNlbnRcclxuICAgICAgICByZWNvbm5lY3Rpb25EZWxheTogMTAwMCwgLy8gZGVmYXVsdCBzZXR0aW5nIGF0IHByZXNlbnRcclxuICAgICAgICByZWNvbm5lY3Rpb25EZWxheU1heDogNTAwMCwgLy8gZGVmYXVsdCBzZXR0aW5nIGF0IHByZXNlbnRcclxuICAgICAgICByZWNvbm5lY3Rpb25BdHRlbXB0czogSW5maW5pdHksIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgLy8gZXh0cmFIZWFkZXJzOiB7IC4uLnJlcXVpcmVkSGVhZGVycywgdG9rZW46IHRoaXMuI3Rva2VuLmFjY2VzcyB9LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy4jcG9sbGluZykge1xyXG4gICAgICB0aGlzLmluaXRQb2xsaW5nKCk7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1snY29ubmVjdCddKSkge1xyXG4gICAgICAgIHRoaXMuI2V2ZW50c1snY29ubmVjdCddLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBQb2xsaW5nIHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWRgLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMuI2V2ZW50cztcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zb2NrZXRcclxuICAgICAgLmNvbm5lY3QoKVxyXG4gICAgICAub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50c1snY29ubmVjdCddKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudHNbJ2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBgU29ja2V0IHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQuIHNvY2tldC5pZDogJHt0aGlzLnNvY2tldC5pZH1gLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdkaXNjb25uZWN0JywgKHJlYXNvbiwgZGV0YWlscykgPT4ge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudHNbJ2Rpc2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50c1snZGlzY29ubmVjdCddLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIHJlYXNvbixcclxuICAgICAgICAgICAgZGV0YWlscyxcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBkaXNjb25uZWN0ZWQ6IGlkOiAke1xyXG4gICAgICAgICAgICAgIHRoaXMuc29ja2V0LmlkXHJcbiAgICAgICAgICAgIH0sIHJlYXNvbjogJHtyZWFzb259LCBkZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbHMpfWAsXHJcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgICAub24oJ2Nvbm5lY3RfZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgaWYgKCFldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddIHx8ICFBcnJheS5pc0FycmF5KGV2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zb2NrZXQuYWN0aXZlKSB7XHJcbiAgICAgICAgICBldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAndGVtcG9yYXJ5IGZhaWx1cmUsIHRoZSBzb2NrZXQgd2lsbCBhdXRvbWF0aWNhbGx5IHRyeSB0byByZWNvbm5lY3QnLFxyXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogYFxyXG4gICAgICAgICAgICAgICAgdGhlIGNvbm5lY3Rpb24gd2FzIGRlbmllZCBieSB0aGUgc2VydmVyXHJcbiAgICAgICAgICAgICAgICBpbiB0aGF0IGNhc2UsIHNvY2tldC5jb25uZWN0KCkgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgaW4gb3JkZXIgdG8gcmVjb25uZWN0LlxyXG4gICAgICAgICAgICAgICAgRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAub25BbnkoKGV2ZW50TmFtZSwgLi4udXBkYXRlcykgPT4ge1xyXG4gICAgICAgIHN3aXRjaCAoZXZlbnROYW1lKSB7XHJcbiAgICAgICAgICBjYXNlICdtZXNzYWdlOm5ldyc6XHJcbiAgICAgICAgICAgIC8vICEgYnVuaSBrZXlpbiBvbGliIHRhc2hsYXNoIGtlcmFrXHJcbiAgICAgICAgICAgIHVwZGF0ZXMubWFwKCh1cGRhdGUpID0+IHRoaXMuc29ja2V0LmVtaXQoJ21lc3NhZ2U6cmVjZWl2ZWQnLCB1cGRhdGUubWVzc2FnZS5faWQpKTtcclxuICAgICAgICAgICAgZXZlbnRzLnVwZGF0ZS5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGNhc2UgJ21lc3NhZ2U6cmVhZCc6XHJcbiAgICAgICAgICAgIGV2ZW50cy51cGRhdGVNZXNzYWdlLm1hcCgoY2I6ICguLi5hcmdzOiBhbnkpID0+IHZvaWQpID0+IGNiLmFwcGx5KG51bGwsIHVwZGF0ZXMpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgY2FzZSAndXNlcjp1cGRhdGUnOlxyXG4gICAgICAgICAgICBldmVudHMudXBkYXRlVXNlci5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZXZlbnRzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50c1tldmVudE5hbWVdLm1hcCgoY2I6ICguLi5hcmdzOiBhbnkpID0+IHZvaWQpID0+IGNiLmFwcGx5KG51bGwsIHVwZGF0ZXMpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgb248RXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyA9ICd1cGRhdGUnPihcclxuICAvLyAgIGV2ZW50OiBFdmVudE5hbWUsXHJcbiAgLy8gICBjYjogSUV2ZW50c1tFdmVudE5hbWVdLFxyXG4gIC8vICk6IHRoaXM7XHJcbiAgb248RXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyA9ICd1cGRhdGUnPihldmVudDogRXZlbnROYW1lLCBjYjogSUV2ZW50c1tFdmVudE5hbWVdKTogdGhpcyB7XHJcbiAgICBpZiAodGhpcy4jZXZlbnRzW2V2ZW50XSAmJiBBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1tldmVudF0pKSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0ucHVzaChjYik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gW2NiXSBhcyBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXZlbnROYW1lcygpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy4jZXZlbnRzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQ/OiBrZXlvZiBJRXZlbnRzKTogdGhpcyB7XHJcbiAgICBpZiAoZXZlbnQpIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XSA9IFtdO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZXZlbnRzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVMaXN0ZW5lcihldmVudDoga2V5b2YgSUV2ZW50cywgY2FsbGJhY2s6IGFueSk6IHRoaXMge1xyXG4gICAgaWYgKCF0aGlzLiNldmVudHNbZXZlbnRdIHx8ICFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1tldmVudF0pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNldmVudHNbZXZlbnRdLmZpbHRlcigoY2IpID0+IGNiLm5hbWUgIT09IGNhbGxiYWNrLm5hbWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBzZWFyY2ggaWQgb3IgdXNlcm5hbWVcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIHNlYXJjaFVzZXIoXHJcbiAgICBxdWVyeTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gJiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xyXG4gICAgICBsaW1pdDogMjAsXHJcbiAgICAgIHBhZ2U6IDEsXHJcbiAgICAgIHNlYXJjaDogJycsXHJcbiAgICB9LFxyXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQ8TXlBcGlSZXNwb25zZTxJVXNlcj4+KFxyXG4gICAgICBgL3YxL3VzZXJzPz8ke3F1ZXJ5U3RyaW5naWZ5KHF1ZXJ5KX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgbWVzc2FnZTogSVNlbmRNZXNzYWdlIHwgRm9ybURhdGEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvTmV3VXNlcihtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2VgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvQXJlYShcclxuICAgIGZpbHRlcjogRmlsdGVyUG9seWdvbkFyZWEsXHJcbiAgICBtZXNzYWdlOiBJU2VuZE1lc3NhZ2VUb0FyZWEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS91c2Vycy9tZXNzYWdlLWJ5LWFyZWFgLCB7XHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICAgIGZpbHRlcixcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZXNzYWdlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgcXVlcnk6IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXI7IHNlYXJjaD86IHN0cmluZyB9ICYgUmVjb3JkPHN0cmluZywgYW55PiA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PihcclxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/JHtxdWVyeVN0cmluZ2lmeShxdWVyeSl9YCxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEluZm8oY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cy8ke2NoYXRJZH1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0TWVkaWEoXHJcbiAgICBjaGF0SWQ6IHN0cmluZyxcclxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlciB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEgfSxcclxuICApOiBQcm9taXNlPHVua25vd25bXT4ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRGaWxlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEF1ZGlvcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0VXBkYXRlcyh7XHJcbiAgICBsaW1pdCA9IHRoaXMuI3BvbGxpbmcubGltaXQsXHJcbiAgICBhbGxvd2VkVXBkYXRlcyA9IFtdLFxyXG4gIH06IHtcclxuICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgcGFnZT86IG51bWJlcjtcclxuICAgIGFsbG93ZWRVcGRhdGVzPzogTWVzc2FnZVR5cGVbXTtcclxuICB9ID0ge30pOiBQcm9taXNlPHtcclxuICAgIHVwZGF0ZXM6IHtcclxuICAgICAgdXBkYXRlczogSU9uVXBkYXRlW107XHJcbiAgICAgIHVzZXJzOiB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgaXNPbmxpbmU6IGJvb2xlYW47XHJcbiAgICAgIH1bXTtcclxuICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICByZWFkQXQ6IHN0cmluZztcclxuICAgICAgfVtdO1xyXG4gICAgfTtcclxuICAgIG1ldGE6IGFueTtcclxuICB9PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2VcclxuICAgICAgLmdldChgL3YxL3VzZXJzL3VwZGF0ZXM/bGltaXQ9JHtsaW1pdH0maGFzaD0ke3RoaXMuI3VwZGF0ZXNIYXNofWApXHJcbiAgICAgIC5jYXRjaCgoKSA9PiAoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgbWV0YToge1xyXG4gICAgICAgICAgICBoYXNoOiBudWxsLFxyXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwMCxcclxuICAgICAgICAgICAgdG90YWxDb3VudDogMCxcclxuICAgICAgICAgICAgdG90YWxQYWdlczogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSkpO1xyXG5cclxuICAgIHRoaXMuI3VwZGF0ZXNIYXNoID0gZGF0YS5tZXRhLmhhc2ggPyBkYXRhLm1ldGEuaGFzaCA6ICcnO1xyXG5cclxuICAgIHJldHVybiB7IHVwZGF0ZXM6IGRhdGEuZGF0YSwgbWV0YTogZGF0YS5tZXRhIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcmVhZE1lc3NhZ2UoY2hhdElkOiBzdHJpbmcsIG1lc3NhZ2U6IHsgbWVzc2FnZUlkOiBzdHJpbmc7IG1lc3NhZ2VSZWFkQXQ6IHN0cmluZyB9KSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucGF0Y2goYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRzKFxyXG4gICAgcXVlcnk6IHtcclxuICAgICAgbGltaXQ/OiBudW1iZXI7XHJcbiAgICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICAgIHNlYXJjaD86IHN0cmluZztcclxuICAgICAgdHlwZT86IENoYXRUeXBlO1xyXG4gICAgfSAmIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSwgdHlwZTogbnVsbCB9LFxyXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJQ2hhdD4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cz8ke3F1ZXJ5U3RyaW5naWZ5KHF1ZXJ5KX1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3BpbmcnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoJy9jaGVjay1oZWFsdGgnKS5jYXRjaCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgbWVzc2VuZ2VyOiBNZXNzZW5nZXI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2VuZ2VyKFxyXG4gIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbnMsXHJcbiAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbikge1xyXG4gIGlmIChtZXNzZW5nZXIpIHtcclxuICAgIHJldHVybiBtZXNzZW5nZXI7XHJcbiAgfVxyXG5cclxuICBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKGN1c3RvbU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIHJldHVybiBtZXNzZW5nZXI7XHJcbn1cclxuIl19