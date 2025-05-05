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
        return __awaiter(this, arguments, void 0, function* ({ limit = 20, page = 1, search = '' } = {
            limit: 20,
            page: 1,
            search: '',
        }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/users?search=${search}&limit=${limit}&page=${page}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWFBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXhELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDM0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFFekIsa0RBQWtEO0FBQ2xELG1CQUFtQjtBQUNuQiw2Q0FBNkM7QUFDN0MsaUNBQWlDO0FBQ2pDLE9BQU87QUFDUCxzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLFFBQVE7QUFFUixNQUFNLGNBQWMsR0FBRyxHQUFXLEVBQUU7SUFDbEMsSUFBSSxHQUFHLENBQUMsU0FBUyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ3RELE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxRCxDQUFDO1NBQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRSxDQUFDO1FBQ3hELE9BQU8sR0FBRyxPQUFP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QzFCLGFBQTRCLEVBQzVCLFVBQW1ELEVBQUU7SUFFckQsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1hbmFnZXJPcHRpb25zLCBTb2NrZXQsIFNvY2tldE9wdGlvbnMgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHR5cGUgeyBEZWZhdWx0RXZlbnRzTWFwIH0gZnJvbSAnQHNvY2tldC5pby9jb21wb25lbnQtZW1pdHRlcic7XHJcbmltcG9ydCB0eXBlIHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHR5cGUgRm9ybURhdGEgZnJvbSAnZm9ybS1kYXRhJztcclxuXHJcbmltcG9ydCB0eXBlIHsgSU1lc3NhZ2UsIElTZW5kTWVzc2FnZSwgSVNlbmRNZXNzYWdlVG9BcmVhIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZSc7XHJcbmltcG9ydCB0eXBlIHsgTXlBcGlSZXNwb25zZSB9IGZyb20gJy4vdHlwZXMvYXBpJztcclxuaW1wb3J0IHR5cGUgeyBGaWx0ZXJQb2x5Z29uQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL2FyZWEuZmlsdGVyJztcclxuaW1wb3J0IHR5cGUgeyBDaGF0VHlwZSwgSUNoYXQgfSBmcm9tICcuL3R5cGVzL2FwaS9jaGF0JztcclxuaW1wb3J0IHR5cGUgeyBJT25VcGRhdGUsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZS50eXBlcyc7XHJcbmltcG9ydCB0eXBlIHsgSVVzZXIgfSBmcm9tICcuL3R5cGVzL2FwaS91c2VyJztcclxuaW1wb3J0IHR5cGUgeyBDdXN0b21PcHRpb25zLCBJRXZlbnRzLCBJUG9sbGluZ09wdGlvbnMsIElTb2NrZXRPcHRpb25zIH0gZnJvbSAnLi90eXBlcy90eXBlcyc7XHJcblxyXG5pbXBvcnQgeyBpbyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyB2MSBhcyB1dWlkVjEgfSBmcm9tICd1dWlkJztcclxuXHJcbmltcG9ydCB7IEVOViB9IGZyb20gJy4vY29tbW9uL2NvbmZpZyc7XHJcbmltcG9ydCB7IERldmljZVR5cGVzRW51bSB9IGZyb20gJy4vdHlwZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21BeGlvc0luc3RhbmNlLCBsb2NhbFN0ZyB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY29uc3QgbG9jYWxVaWQgPSBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlckRldmljZVVpZCcpO1xyXG5jb25zdCB1aWQgPSBsb2NhbFVpZCA/IGxvY2FsVWlkIDogdXVpZFYxKCk7XHJcbmxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJywgdWlkKTtcclxubGV0IGFwcFZlcnNpb24gPSAnMS41LjYnO1xyXG5cclxuLy8gcmVhZEZpbGUoam9pbihwcm9jZXNzLmN3ZCgpICsgJy9wYWNrYWdlLmpzb24nKSlcclxuLy8gICAudGhlbigodikgPT4ge1xyXG4vLyAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2Uodi50b1N0cmluZygpKTtcclxuLy8gICAgIGFwcFZlcnNpb24gPSBqc29uLnZlcnNpb247XHJcbi8vICAgfSlcclxuLy8gICAuY2F0Y2goKGVycikgPT4ge1xyXG4vLyAgICAgY29uc29sZS5sb2coZXJyKTtcclxuLy8gICB9KTtcclxuXHJcbmNvbnN0IGdldERldmljZU1vZGVsID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgaWYgKEVOVi5pc0Jyb3dzZXIgJiYgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHJldHVybiBgJHtuYXZpZ2F0b3IudXNlckFnZW50fSB8ICR7bmF2aWdhdG9yLnBsYXRmb3JtfWA7XHJcbiAgfSBlbHNlIGlmIChFTlYuaXNOb2RlICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgcmV0dXJuIGAke3Byb2Nlc3MucGxhdGZvcm19IHwgJHtwcm9jZXNzLmFyY2h9IHwgTm9kZWpzOiAke3Byb2Nlc3MudmVyc2lvbn1gO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuICdVbmtub3duJztcclxufTtcclxuXHJcbmNvbnN0IHJlcXVpcmVkSGVhZGVycyA9IHtcclxuICAneC1kZXZpY2UtdHlwZSc6IERldmljZVR5cGVzRW51bS5XRUIsXHJcbiAgJ3gtZGV2aWNlLW1vZGVsJzogZ2V0RGV2aWNlTW9kZWwoKSxcclxuICAvLyAneC1hcHAtbGFuZyc6IChsYW5ndWFnZUdldHRlcigpIHx8ICdVei1MYXRpbicpIGFzIEkxOG5UeXBlLkxhbmdUeXBlLCAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXHJcbiAgJ3gtYXBwLXZlcnNpb24nOiBhcHBWZXJzaW9uLFxyXG4gICd4LWFwcC11aWQnOiB1aWQsXHJcbn07XHJcblxyXG5mdW5jdGlvbiBxdWVyeVN0cmluZ2lmeShvYmo6IFJlY29yZDxzdHJpbmcsIGFueT4sIHBhcmVudEtleT86IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgaWYgKCFvYmopIHtcclxuICAgIHJldHVybiAnJztcclxuICB9XHJcblxyXG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopXHJcbiAgICAubWFwKChrZXkpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coa2V5LCBvYmpba2V5XSk7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9ialtrZXldKSkge1xyXG4gICAgICAgIGlmIChwYXJlbnRLZXkpIHtcclxuICAgICAgICAgIHJldHVybiBvYmpba2V5XVxyXG4gICAgICAgICAgICAubWFwKChpdGVtKSA9PiBgJHtwYXJlbnRLZXl9WyR7a2V5fV09JHtlbmNvZGVVUklDb21wb25lbnQoaXRlbSl9YClcclxuICAgICAgICAgICAgLmpvaW4oJyYnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvYmpba2V5XS5tYXAoKGl0ZW0pID0+IGAke2tleX09JHtlbmNvZGVVUklDb21wb25lbnQoaXRlbSl9YCkuam9pbignJicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGlmIChwYXJlbnRLZXkpIHtcclxuICAgICAgICAgIHJldHVybiBxdWVyeVN0cmluZ2lmeShvYmpba2V5XSwgYCR7cGFyZW50S2V5fVske2tleX1dYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcXVlcnlTdHJpbmdpZnkob2JqW2tleV0sIGtleSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvYmpba2V5XSA9PT0gbnVsbCB8fCBvYmpba2V5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJlbnRLZXkpIHtcclxuICAgICAgICByZXR1cm4gYCR7cGFyZW50S2V5fVske2tleX1dPSR7ZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKX1gO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYCR7a2V5fT0ke2VuY29kZVVSSUNvbXBvbmVudChvYmpba2V5XSl9YDtcclxuICAgIH0pXHJcbiAgICAuZmlsdGVyKEJvb2xlYW4pXHJcbiAgICAuam9pbignJicpO1xyXG59XHJcblxyXG5jbGFzcyBNZXNzZW5nZXIge1xyXG4gICNwb2xsaW5nSW50ZXJ2YWw6IE5vZGVKUy5UaW1lcjtcclxuICByZWFkb25seSAjcG9sbGluZzogSVBvbGxpbmdPcHRpb25zO1xyXG4gIHJlYWRvbmx5ICNzb2NrZXQ6IElTb2NrZXRPcHRpb25zO1xyXG4gIHJlYWRvbmx5ICNheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xyXG5cclxuICB1c2VyOiB7XHJcbiAgICBfaWQ6IHN0cmluZztcclxuICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICBmaXJzdE5hbWU6IHN0cmluZztcclxuICAgIGxhc3ROYW1lOiBzdHJpbmc7XHJcbiAgICBtaWRkbGVOYW1lOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nIHwgbnVsbDtcclxuICAgIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgICBwaG9uZU51bWJlcjogc3RyaW5nO1xyXG4gICAgYmlydGhkYXk6IHN0cmluZyB8IG51bGw7XHJcbiAgICBkZXZpY2VVaWQ6IHN0cmluZyB8IG51bGw7XHJcbiAgICAvLyBwb3NpdGlvbjogbnVsbDtcclxuICAgIC8vIGdyb3VwOiBudWxsO1xyXG4gICAgLy8gbWZ5OiBudWxsO1xyXG4gICAgLy8gZ29tOiBudWxsO1xyXG4gICAgLy8gZGlzdHJpY3Q6IG51bGw7XHJcbiAgICAvLyBkaXZpc2lvbklkOiBudWxsO1xyXG4gIH07XHJcblxyXG4gICNldmVudHM6IFBhcnRpYWw8e1xyXG4gICAgW0V2ZW50TmFtZSBpbiBrZXlvZiBJRXZlbnRzXTogSUV2ZW50c1tFdmVudE5hbWVdW107XHJcbiAgfT47XHJcbiAgLy8gUmVjb3JkPFxyXG4gIC8vIEV2ZW50TmFtZSBleHRlbmRzIGtleW9mIElFdmVudHMsXHJcbiAgLy8gICAoRXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyA/IElFdmVudHNbRXZlbnROYW1lXSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZClbXVxyXG4gIC8vID5cclxuICAjdXBkYXRlc0hhc2g6IHN0cmluZyA9ICcnO1xyXG4gIHJlYWRvbmx5ICNiYXNlVVJMOiBzdHJpbmc7XHJcbiAgI3Rva2VuOiB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfTtcclxuICByZWFkb25seSAjdG9rZW5HZXR0ZXI6XHJcbiAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XHJcblxyXG4gIHB1YmxpYyB1aWQ6IHN0cmluZztcclxuICBwdWJsaWMgc29ja2V0OiBTb2NrZXQ8RGVmYXVsdEV2ZW50c01hcCwgRGVmYXVsdEV2ZW50c01hcD4gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHtcclxuICAgICAgYmFzZVVSTCxcclxuICAgICAgdG9rZW4sXHJcbiAgICAgIHBvbGxpbmcgPSBudWxsLFxyXG4gICAgICBzb2NrZXQgPSBudWxsLFxyXG4gICAgICBsYW5ndWFnZUdldHRlciA9ICgpID0+ICdVei1MYXRpbicsXHJcbiAgICAgIGhlYWRlcnMgPSB7fSxcclxuICAgIH06IEN1c3RvbU9wdGlvbnMsXHJcbiAgICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuICApIHtcclxuICAgIHRoaXMudWlkID0gdWlkO1xyXG4gICAgdGhpcy4jcG9sbGluZyA9IHBvbGxpbmc7XHJcbiAgICB0aGlzLiNzb2NrZXQgPSBzb2NrZXQ7XHJcbiAgICB0aGlzLiNiYXNlVVJMID0gYmFzZVVSTDtcclxuICAgIHRoaXMuI2V2ZW50cyA9IHsgdXBkYXRlOiBbXSwgdXBkYXRlVXNlcjogW10sIHVwZGF0ZU1lc3NhZ2U6IFtdIH07XHJcbiAgICB0aGlzLiN0b2tlbiA9IHsgYWNjZXNzOiAnJywgcmVmcmVzaDogJycgfTtcclxuICAgIHRoaXMuI3Rva2VuR2V0dGVyID0gdG9rZW47XHJcbiAgICB0aGlzLiNheGlvc0luc3RhbmNlID0gbmV3IEN1c3RvbUF4aW9zSW5zdGFuY2UoXHJcbiAgICAgIHsgYmFzZVVSTDogYmFzZVVSTCwgaGVhZGVyczogcmVxdWlyZWRIZWFkZXJzIH0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWZyZXNoVG9rZW5Vcmw6ICcvdjEvYXV0aC9yZWZyZXNoLXRva2VuJyxcclxuICAgICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgICAgICB0b2tlbkdldHRlcjogdG9rZW4sXHJcbiAgICAgIH0sXHJcbiAgICApLmluc3RhbmNlO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdFBvbGxpbmcgPSB0aGlzLmluaXRQb2xsaW5nLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWFyY2hVc2VyID0gdGhpcy5zZWFyY2hVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZXNzYWdlcyA9IHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRJbmZvID0gdGhpcy5nZXRDaGF0SW5mby5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0TWVkaWEgPSB0aGlzLmdldENoYXRNZWRpYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0RmlsZXMgPSB0aGlzLmdldENoYXRGaWxlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0QXVkaW9zID0gdGhpcy5nZXRDaGF0QXVkaW9zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZE1lc3NhZ2UgPSB0aGlzLnJlYWRNZXNzYWdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRzID0gdGhpcy5nZXRDaGF0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZW5kTWVzc2FnZVRvQXJlYSA9IHRoaXMuc2VuZE1lc3NhZ2VUb0FyZWEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRQb2xsaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcztcclxuICAgIGNvbnN0IHBvbGxpbmcgPSB0aGlzLiNwb2xsaW5nO1xyXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy4jZXZlbnRzO1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gaW50ZXJ2YWxDYWxsYmFjaygpIHtcclxuICAgICAgY29uc3QgeyB1cGRhdGVzIH0gPSBhd2FpdCBnZXRVcGRhdGVzKHsgbGltaXQ6IHBvbGxpbmcubGltaXQgfSk7XHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZSddICYmIHVwZGF0ZXMudXBkYXRlcykge1xyXG4gICAgICAgIHVwZGF0ZXMudXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGUnXS5tYXAoKGNiKSA9PiBjYih1cGRhdGUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlVXNlciddICYmIHVwZGF0ZXMudXNlcnMpIHtcclxuICAgICAgICB1cGRhdGVzLnVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGVVc2VyJ10ubWFwKChjYikgPT4gY2IodXNlcikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVNZXNzYWdlJ10gJiYgdXBkYXRlcy5tZXNzYWdlcykge1xyXG4gICAgICAgIHVwZGF0ZXMubWVzc2FnZXMubWFwKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXS5tYXAoKGNiKSA9PiBjYihtZXNzYWdlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChpbnRlcnZhbENhbGxiYWNrLCBwb2xsaW5nLmludGVydmFsKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXQoKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuI3Rva2VuR2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gYXdhaXQgdGhpcy4jdG9rZW5HZXR0ZXIoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gdGhpcy4jdG9rZW5HZXR0ZXI7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywgdGhpcy4jdG9rZW4pO1xyXG5cclxuICAgIGNvbnN0IHsgZGF0YTogbWUgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2VcclxuICAgICAgLmdldCgnL3YxL2F1dGgvbWUnKVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4gKHsgZGF0YTogeyBzdWNjZXNzOiBmYWxzZSB9IH0pKTtcclxuICAgIGlmIChtZS5zdWNjZXNzKSB7XHJcbiAgICAgIHRoaXMudXNlciA9IG1lLmRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuI3NvY2tldCAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnNvY2tldCA9IGlvKHRoaXMuI3NvY2tldC5iYXNlVXJsLCB7XHJcbiAgICAgICAgcGF0aDogdGhpcy4jc29ja2V0LnBhdGgsXHJcbiAgICAgICAgYXV0aDogKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAuLi5yZXF1aXJlZEhlYWRlcnMsXHJcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBhdXRvQ29ubmVjdDogdHJ1ZSxcclxuICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IEluZmluaXR5LCAvLyBkZWZhdWx0IHNldHRpbmcgYXQgcHJlc2VudFxyXG4gICAgICAgIC8vIGV4dHJhSGVhZGVyczogeyAuLi5yZXF1aXJlZEhlYWRlcnMsIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MgfSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcpIHtcclxuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICB0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBgUG9sbGluZyBzdWNjZXNzZnVsbHkgY29ubmVjdGVkYCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XHJcbiAgICAgIC5jb25uZWN0KClcclxuICAgICAgLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBzdWNjZXNzZnVsbHkgY29ubmVjdGVkLiBzb2NrZXQuaWQ6ICR7dGhpcy5zb2NrZXQuaWR9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignZGlzY29ubmVjdCcsIChyZWFzb24sIGRldGFpbHMpID0+IHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnRzWydkaXNjb25uZWN0J10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHNbJ2Rpc2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICByZWFzb24sXHJcbiAgICAgICAgICAgIGRldGFpbHMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgZGlzY29ubmVjdGVkOiBpZDogJHtcclxuICAgICAgICAgICAgICB0aGlzLnNvY2tldC5pZFxyXG4gICAgICAgICAgICB9LCByZWFzb246ICR7cmVhc29ufSwgZGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShkZXRhaWxzKX1gLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdjb25uZWN0X2Vycm9yJywgKGVycikgPT4ge1xyXG4gICAgICAgIGlmICghZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXSB8fCAhQXJyYXkuaXNBcnJheShldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3RlbXBvcmFyeSBmYWlsdXJlLCB0aGUgc29ja2V0IHdpbGwgYXV0b21hdGljYWxseSB0cnkgdG8gcmVjb25uZWN0JyxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGV2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10ubWFwKChjYikgPT5cclxuICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBcclxuICAgICAgICAgICAgICAgIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgaW4gdGhhdCBjYXNlLCBzb2NrZXQuY29ubmVjdCgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIGluIG9yZGVyIHRvIHJlY29ubmVjdC5cclxuICAgICAgICAgICAgICAgIEVycm9yOiAke2Vyci5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLm9uQW55KChldmVudE5hbWUsIC4uLnVwZGF0ZXMpID0+IHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgY2FzZSAnbWVzc2FnZTpuZXcnOlxyXG4gICAgICAgICAgICAvLyAhIGJ1bmkga2V5aW4gb2xpYiB0YXNobGFzaCBrZXJha1xyXG4gICAgICAgICAgICB1cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB0aGlzLnNvY2tldC5lbWl0KCdtZXNzYWdlOnJlY2VpdmVkJywgdXBkYXRlLm1lc3NhZ2UuX2lkKSk7XHJcbiAgICAgICAgICAgIGV2ZW50cy51cGRhdGUubWFwKChjYjogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZCkgPT4gY2IuYXBwbHkobnVsbCwgdXBkYXRlcykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBjYXNlICdtZXNzYWdlOnJlYWQnOlxyXG4gICAgICAgICAgICBldmVudHMudXBkYXRlTWVzc2FnZS5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGNhc2UgJ3VzZXI6dXBkYXRlJzpcclxuICAgICAgICAgICAgZXZlbnRzLnVwZGF0ZVVzZXIubWFwKChjYjogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZCkgPT4gY2IuYXBwbHkobnVsbCwgdXBkYXRlcykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWV2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHNbZXZlbnROYW1lXS5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIG9uPEV2ZW50TmFtZSBleHRlbmRzIGtleW9mIElFdmVudHMgPSAndXBkYXRlJz4oXHJcbiAgLy8gICBldmVudDogRXZlbnROYW1lLFxyXG4gIC8vICAgY2I6IElFdmVudHNbRXZlbnROYW1lXSxcclxuICAvLyApOiB0aGlzO1xyXG4gIG9uPEV2ZW50TmFtZSBleHRlbmRzIGtleW9mIElFdmVudHMgPSAndXBkYXRlJz4oZXZlbnQ6IEV2ZW50TmFtZSwgY2I6IElFdmVudHNbRXZlbnROYW1lXSk6IHRoaXMge1xyXG4gICAgaWYgKHRoaXMuI2V2ZW50c1tldmVudF0gJiYgQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbZXZlbnRdKSkge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdLnB1c2goY2IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XSA9IFtjYl0gYXMgYW55O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV2ZW50TmFtZXMoKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuI2V2ZW50cyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50Pzoga2V5b2YgSUV2ZW50cyk6IHRoaXMge1xyXG4gICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbXTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI2V2ZW50cyA9IHt9O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6IGtleW9mIElFdmVudHMsIGNhbGxiYWNrOiBhbnkpOiB0aGlzIHtcclxuICAgIGlmICghdGhpcy4jZXZlbnRzW2V2ZW50XSB8fCAhQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbZXZlbnRdKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGNiKSA9PiBjYi5uYW1lICE9PSBjYWxsYmFjay5uYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VhcmNoIGlkIG9yIHVzZXJuYW1lXHJcbiAgICogQHJldHVybnMge1tdfVxyXG4gICAqL1xyXG4gIHB1YmxpYyBhc3luYyBzZWFyY2hVc2VyKFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XHJcbiAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElVc2VyPj4oXHJcbiAgICAgIGAvdjEvdXNlcnM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgbWVzc2FnZTogSVNlbmRNZXNzYWdlIHwgRm9ybURhdGEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvTmV3VXNlcihtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2VgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvQXJlYShcclxuICAgIGZpbHRlcjogRmlsdGVyUG9seWdvbkFyZWEsXHJcbiAgICBtZXNzYWdlOiBJU2VuZE1lc3NhZ2VUb0FyZWEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS91c2Vycy9tZXNzYWdlLWJ5LWFyZWFgLCB7XHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICAgIGZpbHRlcixcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZXNzYWdlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgcXVlcnk6IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXI7IHNlYXJjaD86IHN0cmluZyB9ICYgUmVjb3JkPHN0cmluZywgYW55PiA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PihcclxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/JHtxdWVyeVN0cmluZ2lmeShxdWVyeSl9YCxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEluZm8oY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cy8ke2NoYXRJZH1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0TWVkaWEoXHJcbiAgICBjaGF0SWQ6IHN0cmluZyxcclxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlciB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEgfSxcclxuICApOiBQcm9taXNlPHVua25vd25bXT4ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRGaWxlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEF1ZGlvcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0VXBkYXRlcyh7XHJcbiAgICBsaW1pdCA9IHRoaXMuI3BvbGxpbmcubGltaXQsXHJcbiAgICBhbGxvd2VkVXBkYXRlcyA9IFtdLFxyXG4gIH06IHtcclxuICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgcGFnZT86IG51bWJlcjtcclxuICAgIGFsbG93ZWRVcGRhdGVzPzogTWVzc2FnZVR5cGVbXTtcclxuICB9ID0ge30pOiBQcm9taXNlPHtcclxuICAgIHVwZGF0ZXM6IHtcclxuICAgICAgdXBkYXRlczogSU9uVXBkYXRlW107XHJcbiAgICAgIHVzZXJzOiB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgaXNPbmxpbmU6IGJvb2xlYW47XHJcbiAgICAgIH1bXTtcclxuICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICByZWFkQXQ6IHN0cmluZztcclxuICAgICAgfVtdO1xyXG4gICAgfTtcclxuICAgIG1ldGE6IGFueTtcclxuICB9PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2VcclxuICAgICAgLmdldChgL3YxL3VzZXJzL3VwZGF0ZXM/bGltaXQ9JHtsaW1pdH0maGFzaD0ke3RoaXMuI3VwZGF0ZXNIYXNofWApXHJcbiAgICAgIC5jYXRjaCgoKSA9PiAoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgbWV0YToge1xyXG4gICAgICAgICAgICBoYXNoOiBudWxsLFxyXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwMCxcclxuICAgICAgICAgICAgdG90YWxDb3VudDogMCxcclxuICAgICAgICAgICAgdG90YWxQYWdlczogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSkpO1xyXG5cclxuICAgIHRoaXMuI3VwZGF0ZXNIYXNoID0gZGF0YS5tZXRhLmhhc2ggPyBkYXRhLm1ldGEuaGFzaCA6ICcnO1xyXG5cclxuICAgIHJldHVybiB7IHVwZGF0ZXM6IGRhdGEuZGF0YSwgbWV0YTogZGF0YS5tZXRhIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcmVhZE1lc3NhZ2UoY2hhdElkOiBzdHJpbmcsIG1lc3NhZ2U6IHsgbWVzc2FnZUlkOiBzdHJpbmc7IG1lc3NhZ2VSZWFkQXQ6IHN0cmluZyB9KSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucGF0Y2goYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRzKFxyXG4gICAgcXVlcnk6IHtcclxuICAgICAgbGltaXQ/OiBudW1iZXI7XHJcbiAgICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICAgIHNlYXJjaD86IHN0cmluZztcclxuICAgICAgdHlwZT86IENoYXRUeXBlO1xyXG4gICAgfSAmIFJlY29yZDxzdHJpbmcsIGFueT4gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSwgdHlwZTogbnVsbCB9LFxyXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJQ2hhdD4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cz8ke3F1ZXJ5U3RyaW5naWZ5KHF1ZXJ5KX1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3BpbmcnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoJy9jaGVjay1oZWFsdGgnKS5jYXRjaCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgbWVzc2VuZ2VyOiBNZXNzZW5nZXI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2VuZ2VyKFxyXG4gIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbnMsXHJcbiAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbikge1xyXG4gIGlmIChtZXNzZW5nZXIpIHtcclxuICAgIHJldHVybiBtZXNzZW5nZXI7XHJcbiAgfVxyXG5cclxuICBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKGN1c3RvbU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIHJldHVybiBtZXNzZW5nZXI7XHJcbn1cclxuIl19