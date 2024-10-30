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
            console.log(__classPrivateFieldGet(this, _Messenger_socket, "f").baseUrl);
            // await new Promise(res => setTimeout(() => res(1), 2000))
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
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1, search = '' } = {
            limit: 20,
            page: 1,
            search: '',
        }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats/${chatId}/messages?search=${search}&limit=${limit}&page=${page}`);
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
        return __awaiter(this, arguments, void 0, function* ({ limit = 100, page = 1, search, type = null, } = { limit: 20, page: 1, type: null }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats?search=${search}&limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRDLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixrREFBa0Q7QUFDbEQsbUJBQW1CO0FBQ25CLDZDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsT0FBTztBQUNQLHNCQUFzQjtBQUN0Qix3QkFBd0I7QUFDeEIsUUFBUTtBQUVSLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRztJQUNwQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsU0FBUztRQUM3QixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDbEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsTUFBTSxPQUFPLENBQUMsSUFBSSxjQUFjLE9BQU8s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R0FBRyxHQUFHLEVBQ1gsSUFBSSxHQUFHLENBQUMsRUFDUixNQUFNLEVBQ04sSUFBSSxHQUFHLElBQUksTUFNVCxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1lBRXRDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQzVDLG9CQUFvQixNQUFNLFVBQVUsS0FBSyxTQUFTLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUN2RixDQUFDO1lBRUYsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFTSxJQUFJO1FBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBQU0sQ0FBQztZQUNOLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGOztBQUVELElBQUksU0FBb0IsQ0FBQztBQUV6QixNQUFNLFVBQVUsWUFBWSxDQUMxQixhQUE0QixFQUM1QixVQUFtRCxFQUFFO0lBRXJELElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVmYXVsdEV2ZW50c01hcCB9IGZyb20gJ0Bzb2NrZXQuaW8vY29tcG9uZW50LWVtaXR0ZXInO1xyXG5pbXBvcnQgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnZm9ybS1kYXRhJztcclxuaW1wb3J0IHR5cGUgeyBNYW5hZ2VyT3B0aW9ucywgU29ja2V0LCBTb2NrZXRPcHRpb25zIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IGlvIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHYxIGFzIHV1aWRWMSB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuL2NvbW1vbi9jb25maWcnO1xyXG5pbXBvcnQgeyBNeUFwaVJlc3BvbnNlIH0gZnJvbSAnLi90eXBlcy9hcGknO1xyXG5pbXBvcnQgeyBGaWx0ZXJQb2x5Z29uQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL2FyZWEuZmlsdGVyJztcclxuaW1wb3J0IHsgQ2hhdFR5cGUsIElDaGF0IH0gZnJvbSAnLi90eXBlcy9hcGkvY2hhdCc7XHJcbmltcG9ydCB7IElNZXNzYWdlLCBJU2VuZE1lc3NhZ2UsIElTZW5kTWVzc2FnZVRvQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL21lc3NhZ2UnO1xyXG5pbXBvcnQgeyBJT25VcGRhdGUsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZS50eXBlcyc7XHJcbmltcG9ydCB7IElVc2VyIH0gZnJvbSAnLi90eXBlcy9hcGkvdXNlcic7XHJcbmltcG9ydCB7IEN1c3RvbU9wdGlvbnMsIERldmljZVR5cGVzRW51bSwgSUV2ZW50cywgSVBvbGxpbmdPcHRpb25zLCBJU29ja2V0T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21BeGlvc0luc3RhbmNlLCBsb2NhbFN0ZyB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY29uc3QgbG9jYWxVaWQgPSBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlckRldmljZVVpZCcpO1xyXG5jb25zdCB1aWQgPSBsb2NhbFVpZCA/IGxvY2FsVWlkIDogdXVpZFYxKCk7XHJcbmxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJywgdWlkKTtcclxubGV0IGFwcFZlcnNpb24gPSAnMC4wLjAnO1xyXG5cclxuLy8gcmVhZEZpbGUoam9pbihwcm9jZXNzLmN3ZCgpICsgJy9wYWNrYWdlLmpzb24nKSlcclxuLy8gICAudGhlbigodikgPT4ge1xyXG4vLyAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2Uodi50b1N0cmluZygpKTtcclxuLy8gICAgIGFwcFZlcnNpb24gPSBqc29uLnZlcnNpb247XHJcbi8vICAgfSlcclxuLy8gICAuY2F0Y2goKGVycikgPT4ge1xyXG4vLyAgICAgY29uc29sZS5sb2coZXJyKTtcclxuLy8gICB9KTtcclxuXHJcbmNvbnN0IHJlcXVpcmVkSGVhZGVycyA9IHtcclxuICAneC1kZXZpY2UtdHlwZSc6IERldmljZVR5cGVzRW51bS5XRUIsXHJcbiAgJ3gtZGV2aWNlLW1vZGVsJzogRU5WLmlzQnJvd3NlclxyXG4gICAgPyBgJHtuYXZpZ2F0b3IudXNlckFnZW50fSB8ICR7bmF2aWdhdG9yLnBsYXRmb3JtfWBcclxuICAgIDogRU5WLmlzTm9kZVxyXG4gICAgICA/IGAke3Byb2Nlc3MucGxhdGZvcm19IHwgJHtwcm9jZXNzLmFyY2h9IHwgTm9kZWpzOiAke3Byb2Nlc3MudmVyc2lvbn1gXHJcbiAgICAgIDogJ1Vua25vd24nLCAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBkZXZpY2UgbW9kZWwgaW5mb1xyXG4gIC8vICd4LWFwcC1sYW5nJzogKGxhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgSTE4blR5cGUuTGFuZ1R5cGUsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuICAneC1hcHAtdmVyc2lvbic6IGFwcFZlcnNpb24sXHJcbiAgJ3gtYXBwLXVpZCc6IHVpZCxcclxufTtcclxuXHJcbmNsYXNzIE1lc3NlbmdlciB7XHJcbiAgI3BvbGxpbmdJbnRlcnZhbDogTm9kZUpTLlRpbWVyO1xyXG4gIHJlYWRvbmx5ICNwb2xsaW5nOiBJUG9sbGluZ09wdGlvbnM7XHJcbiAgcmVhZG9ubHkgI3NvY2tldDogSVNvY2tldE9wdGlvbnM7XHJcbiAgcmVhZG9ubHkgI2F4aW9zSW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XHJcblxyXG4gIHVzZXI6IHtcclxuICAgIF9pZDogc3RyaW5nO1xyXG4gICAgaW1hZ2U6IHN0cmluZztcclxuICAgIGZpcnN0TmFtZTogc3RyaW5nO1xyXG4gICAgbGFzdE5hbWU6IHN0cmluZztcclxuICAgIG1pZGRsZU5hbWU6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgdXNlcm5hbWU6IHN0cmluZztcclxuICAgIHBob25lTnVtYmVyOiBzdHJpbmc7XHJcbiAgICBiaXJ0aGRheTogc3RyaW5nIHwgbnVsbDtcclxuICAgIGRldmljZVVpZDogc3RyaW5nIHwgbnVsbDtcclxuICAgIC8vIHBvc2l0aW9uOiBudWxsO1xyXG4gICAgLy8gZ3JvdXA6IG51bGw7XHJcbiAgICAvLyBtZnk6IG51bGw7XHJcbiAgICAvLyBnb206IG51bGw7XHJcbiAgICAvLyBkaXN0cmljdDogbnVsbDtcclxuICAgIC8vIGRpdmlzaW9uSWQ6IG51bGw7XHJcbiAgfTtcclxuXHJcbiAgI2V2ZW50czogUGFydGlhbDx7XHJcbiAgICBbRXZlbnROYW1lIGluIGtleW9mIElFdmVudHNdOiBJRXZlbnRzW0V2ZW50TmFtZV1bXTtcclxuICB9PjtcclxuICAvLyBSZWNvcmQ8XHJcbiAgLy8gRXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyxcclxuICAvLyAgIChFdmVudE5hbWUgZXh0ZW5kcyBrZXlvZiBJRXZlbnRzID8gSUV2ZW50c1tFdmVudE5hbWVdIDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKVtdXHJcbiAgLy8gPlxyXG4gICN1cGRhdGVzSGFzaDogc3RyaW5nID0gJyc7XHJcbiAgcmVhZG9ubHkgI2Jhc2VVUkw6IHN0cmluZztcclxuICAjdG9rZW46IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9O1xyXG4gIHJlYWRvbmx5ICN0b2tlbkdldHRlcjpcclxuICAgIHwgeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH1cclxuICAgIHwgKCgpID0+IFByb21pc2U8eyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH0+KTtcclxuXHJcbiAgcHVibGljIHVpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyBzb2NrZXQ6IFNvY2tldDxEZWZhdWx0RXZlbnRzTWFwLCBEZWZhdWx0RXZlbnRzTWFwPiB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAge1xyXG4gICAgICBiYXNlVVJMLFxyXG4gICAgICB0b2tlbixcclxuICAgICAgcG9sbGluZyA9IG51bGwsXHJcbiAgICAgIHNvY2tldCA9IG51bGwsXHJcbiAgICAgIGxhbmd1YWdlR2V0dGVyID0gKCkgPT4gJ1V6LUxhdGluJyxcclxuICAgICAgaGVhZGVycyA9IHt9LFxyXG4gICAgfTogQ3VzdG9tT3B0aW9ucyxcclxuICAgIG9wdGlvbnM6IFBhcnRpYWw8TWFuYWdlck9wdGlvbnMgJiBTb2NrZXRPcHRpb25zPiA9IHt9LFxyXG4gICkge1xyXG4gICAgdGhpcy51aWQgPSB1aWQ7XHJcbiAgICB0aGlzLiNwb2xsaW5nID0gcG9sbGluZztcclxuICAgIHRoaXMuI3NvY2tldCA9IHNvY2tldDtcclxuICAgIHRoaXMuI2Jhc2VVUkwgPSBiYXNlVVJMO1xyXG4gICAgdGhpcy4jZXZlbnRzID0geyB1cGRhdGU6IFtdLCB1cGRhdGVVc2VyOiBbXSwgdXBkYXRlTWVzc2FnZTogW10gfTtcclxuICAgIHRoaXMuI3Rva2VuID0geyBhY2Nlc3M6ICcnLCByZWZyZXNoOiAnJyB9O1xyXG4gICAgdGhpcy4jdG9rZW5HZXR0ZXIgPSB0b2tlbjtcclxuICAgIHRoaXMuI2F4aW9zSW5zdGFuY2UgPSBuZXcgQ3VzdG9tQXhpb3NJbnN0YW5jZShcclxuICAgICAgeyBiYXNlVVJMOiBiYXNlVVJMLCBoZWFkZXJzOiByZXF1aXJlZEhlYWRlcnMgfSxcclxuICAgICAge1xyXG4gICAgICAgIHJlZnJlc2hUb2tlblVybDogJy92MS9hdXRoL3JlZnJlc2gtdG9rZW4nLFxyXG4gICAgICAgIGxhbmd1YWdlR2V0dGVyLFxyXG4gICAgICAgIHRva2VuR2V0dGVyOiB0b2tlbixcclxuICAgICAgfSxcclxuICAgICkuaW5zdGFuY2U7XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0UG9sbGluZyA9IHRoaXMuaW5pdFBvbGxpbmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlYXJjaFVzZXIgPSB0aGlzLnNlYXJjaFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzID0gdGhpcy5nZXRDaGF0TWVzc2FnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdEluZm8gPSB0aGlzLmdldENoYXRJbmZvLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZWRpYSA9IHRoaXMuZ2V0Q2hhdE1lZGlhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRGaWxlcyA9IHRoaXMuZ2V0Q2hhdEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRBdWRpb3MgPSB0aGlzLmdldENoYXRBdWRpb3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkTWVzc2FnZSA9IHRoaXMucmVhZE1lc3NhZ2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdHMgPSB0aGlzLmdldENoYXRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9BcmVhID0gdGhpcy5zZW5kTWVzc2FnZVRvQXJlYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFBvbGxpbmcoKSB7XHJcbiAgICBpZiAodGhpcy4jcG9sbGluZ0ludGVydmFsKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRVcGRhdGVzID0gdGhpcy5nZXRVcGRhdGVzO1xyXG4gICAgY29uc3QgcG9sbGluZyA9IHRoaXMuI3BvbGxpbmc7XHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XHJcbiAgICBhc3luYyBmdW5jdGlvbiBpbnRlcnZhbENhbGxiYWNrKCkge1xyXG4gICAgICBjb25zdCB7IHVwZGF0ZXMgfSA9IGF3YWl0IGdldFVwZGF0ZXMoeyBsaW1pdDogcG9sbGluZy5saW1pdCB9KTtcclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlJ10gJiYgdXBkYXRlcy51cGRhdGVzKSB7XHJcbiAgICAgICAgdXBkYXRlcy51cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVVc2VyJ10gJiYgdXBkYXRlcy51c2Vycykge1xyXG4gICAgICAgIHVwZGF0ZXMudXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZVVzZXInXS5tYXAoKGNiKSA9PiBjYih1c2VyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXSAmJiB1cGRhdGVzLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgdXBkYXRlcy5tZXNzYWdlcy5tYXAoKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgIGV2ZW50c1sndXBkYXRlTWVzc2FnZSddLm1hcCgoY2IpID0+IGNiKG1lc3NhZ2UpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKGludGVydmFsQ2FsbGJhY2ssIHBvbGxpbmcuaW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW5pdCgpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy4jdG9rZW5HZXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSBhd2FpdCB0aGlzLiN0b2tlbkdldHRlcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSB0aGlzLiN0b2tlbkdldHRlcjtcclxuICAgIH1cclxuICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB0aGlzLiN0b2tlbik7XHJcblxyXG4gICAgY29uc3QgeyBkYXRhOiBtZSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZVxyXG4gICAgICAuZ2V0KCcvdjEvYXV0aC9tZScpXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiAoeyBkYXRhOiB7IHN1Y2Nlc3M6IGZhbHNlIH0gfSkpO1xyXG4gICAgaWYgKG1lLnN1Y2Nlc3MpIHtcclxuICAgICAgdGhpcy51c2VyID0gbWUuZGF0YTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKHRoaXMuI3NvY2tldC5iYXNlVXJsKTtcclxuICAgIC8vIGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KCgpID0+IHJlcygxKSwgMjAwMCkpXHJcblxyXG4gICAgaWYgKHRoaXMuI3NvY2tldCAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnNvY2tldCA9IGlvKHRoaXMuI3NvY2tldC5iYXNlVXJsLCB7XHJcbiAgICAgICAgcGF0aDogdGhpcy4jc29ja2V0LnBhdGgsXHJcbiAgICAgICAgYXV0aDogKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAuLi5yZXF1aXJlZEhlYWRlcnMsXHJcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBhdXRvQ29ubmVjdDogdHJ1ZSxcclxuICAgICAgICByZWNvbm5lY3Rpb246IHRydWUsIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgcmVjb25uZWN0aW9uRGVsYXlNYXg6IDUwMDAsIC8vIGRlZmF1bHQgc2V0dGluZyBhdCBwcmVzZW50XHJcbiAgICAgICAgcmVjb25uZWN0aW9uQXR0ZW1wdHM6IEluZmluaXR5LCAvLyBkZWZhdWx0IHNldHRpbmcgYXQgcHJlc2VudFxyXG4gICAgICAgIC8vIGV4dHJhSGVhZGVyczogeyAuLi5yZXF1aXJlZEhlYWRlcnMsIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MgfSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcpIHtcclxuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICB0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBgUG9sbGluZyBzdWNjZXNzZnVsbHkgY29ubmVjdGVkYCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XHJcbiAgICAgIC5jb25uZWN0KClcclxuICAgICAgLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBzdWNjZXNzZnVsbHkgY29ubmVjdGVkLiBzb2NrZXQuaWQ6ICR7dGhpcy5zb2NrZXQuaWR9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignZGlzY29ubmVjdCcsIChyZWFzb24sIGRldGFpbHMpID0+IHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnRzWydkaXNjb25uZWN0J10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudHNbJ2Rpc2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICByZWFzb24sXHJcbiAgICAgICAgICAgIGRldGFpbHMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgZGlzY29ubmVjdGVkOiBpZDogJHt0aGlzLnNvY2tldC5pZFxyXG4gICAgICAgICAgICAgIH0sIHJlYXNvbjogJHtyZWFzb259LCBkZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbHMpfWAsXHJcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgICAub24oJ2Nvbm5lY3RfZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgaWYgKCFldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddIHx8ICFBcnJheS5pc0FycmF5KGV2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zb2NrZXQuYWN0aXZlKSB7XHJcbiAgICAgICAgICBldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAndGVtcG9yYXJ5IGZhaWx1cmUsIHRoZSBzb2NrZXQgd2lsbCBhdXRvbWF0aWNhbGx5IHRyeSB0byByZWNvbm5lY3QnLFxyXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogYFxyXG4gICAgICAgICAgICAgICAgdGhlIGNvbm5lY3Rpb24gd2FzIGRlbmllZCBieSB0aGUgc2VydmVyXHJcbiAgICAgICAgICAgICAgICBpbiB0aGF0IGNhc2UsIHNvY2tldC5jb25uZWN0KCkgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgaW4gb3JkZXIgdG8gcmVjb25uZWN0LlxyXG4gICAgICAgICAgICAgICAgRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAub25BbnkoKGV2ZW50TmFtZSwgLi4udXBkYXRlcykgPT4ge1xyXG4gICAgICAgIHN3aXRjaCAoZXZlbnROYW1lKSB7XHJcbiAgICAgICAgICBjYXNlICdtZXNzYWdlOm5ldyc6XHJcbiAgICAgICAgICAgIC8vICEgYnVuaSBrZXlpbiBvbGliIHRhc2hsYXNoIGtlcmFrXHJcbiAgICAgICAgICAgIHVwZGF0ZXMubWFwKCh1cGRhdGUpID0+IHRoaXMuc29ja2V0LmVtaXQoJ21lc3NhZ2U6cmVjZWl2ZWQnLCB1cGRhdGUubWVzc2FnZS5faWQpKTtcclxuICAgICAgICAgICAgZXZlbnRzLnVwZGF0ZS5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGNhc2UgJ21lc3NhZ2U6cmVhZCc6XHJcbiAgICAgICAgICAgIGV2ZW50cy51cGRhdGVNZXNzYWdlLm1hcCgoY2I6ICguLi5hcmdzOiBhbnkpID0+IHZvaWQpID0+IGNiLmFwcGx5KG51bGwsIHVwZGF0ZXMpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgY2FzZSAndXNlcjp1cGRhdGUnOlxyXG4gICAgICAgICAgICBldmVudHMudXBkYXRlVXNlci5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZXZlbnRzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50c1tldmVudE5hbWVdLm1hcCgoY2I6ICguLi5hcmdzOiBhbnkpID0+IHZvaWQpID0+IGNiLmFwcGx5KG51bGwsIHVwZGF0ZXMpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgb248RXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyA9ICd1cGRhdGUnPihcclxuICAvLyAgIGV2ZW50OiBFdmVudE5hbWUsXHJcbiAgLy8gICBjYjogSUV2ZW50c1tFdmVudE5hbWVdLFxyXG4gIC8vICk6IHRoaXM7XHJcbiAgb248RXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyA9ICd1cGRhdGUnPihldmVudDogRXZlbnROYW1lLCBjYjogSUV2ZW50c1tFdmVudE5hbWVdKTogdGhpcyB7XHJcbiAgICBpZiAodGhpcy4jZXZlbnRzW2V2ZW50XSAmJiBBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1tldmVudF0pKSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0ucHVzaChjYik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gW2NiXSBhcyBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXZlbnROYW1lcygpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy4jZXZlbnRzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQ/OiBrZXlvZiBJRXZlbnRzKTogdGhpcyB7XHJcbiAgICBpZiAoZXZlbnQpIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XSA9IFtdO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZXZlbnRzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVMaXN0ZW5lcihldmVudDoga2V5b2YgSUV2ZW50cywgY2FsbGJhY2s6IGFueSk6IHRoaXMge1xyXG4gICAgaWYgKCF0aGlzLiNldmVudHNbZXZlbnRdIHx8ICFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1tldmVudF0pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNldmVudHNbZXZlbnRdLmZpbHRlcigoY2IpID0+IGNiLm5hbWUgIT09IGNhbGxiYWNrLm5hbWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBzZWFyY2ggaWQgb3IgdXNlcm5hbWVcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIHNlYXJjaFVzZXIoXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxLCBzZWFyY2ggPSAnJyB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyOyBzZWFyY2g/OiBzdHJpbmcgfSA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SVVzZXI+PihcclxuICAgICAgYC92MS91c2Vycz9zZWFyY2g9JHtzZWFyY2h9JmxpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICBtZXNzYWdlOiBJU2VuZE1lc3NhZ2UgfCBGb3JtRGF0YSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9OZXdVc2VyKG1lc3NhZ2U6IElTZW5kTWVzc2FnZSk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvdXNlcnMvbWVzc2FnZWAsIG1lc3NhZ2UpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9BcmVhKFxyXG4gICAgZmlsdGVyOiBGaWx0ZXJQb2x5Z29uQXJlYSxcclxuICAgIG1lc3NhZ2U6IElTZW5kTWVzc2FnZVRvQXJlYSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2UtYnktYXJlYWAsIHtcclxuICAgICAgbWVzc2FnZSxcclxuICAgICAgZmlsdGVyLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lc3NhZ2VzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxLCBzZWFyY2ggPSAnJyB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyOyBzZWFyY2g/OiBzdHJpbmcgfSA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PihcclxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0SW5mbyhjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChgL3YxL2NoYXRzLyR7Y2hhdElkfWApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZWRpYShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0QXVkaW9zKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRVcGRhdGVzKHtcclxuICAgIGxpbWl0ID0gdGhpcy4jcG9sbGluZy5saW1pdCxcclxuICAgIGFsbG93ZWRVcGRhdGVzID0gW10sXHJcbiAgfToge1xyXG4gICAgbGltaXQ/OiBudW1iZXI7XHJcbiAgICBwYWdlPzogbnVtYmVyO1xyXG4gICAgYWxsb3dlZFVwZGF0ZXM/OiBNZXNzYWdlVHlwZVtdO1xyXG4gIH0gPSB7fSk6IFByb21pc2U8e1xyXG4gICAgdXBkYXRlczoge1xyXG4gICAgICB1cGRhdGVzOiBJT25VcGRhdGVbXTtcclxuICAgICAgdXNlcnM6IHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICBpc09ubGluZTogYm9vbGVhbjtcclxuICAgICAgfVtdO1xyXG4gICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIHJlYWRBdDogc3RyaW5nO1xyXG4gICAgICB9W107XHJcbiAgICB9O1xyXG4gICAgbWV0YTogYW55O1xyXG4gIH0+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZVxyXG4gICAgICAuZ2V0KGAvdjEvdXNlcnMvdXBkYXRlcz9saW1pdD0ke2xpbWl0fSZoYXNoPSR7dGhpcy4jdXBkYXRlc0hhc2h9YClcclxuICAgICAgLmNhdGNoKCgpID0+ICh7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICBtZXRhOiB7XHJcbiAgICAgICAgICAgIGhhc2g6IG51bGwsXHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICAgICAgICBsaW1pdDogMTAwLFxyXG4gICAgICAgICAgICB0b3RhbENvdW50OiAwLFxyXG4gICAgICAgICAgICB0b3RhbFBhZ2VzOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSk7XHJcblxyXG4gICAgdGhpcy4jdXBkYXRlc0hhc2ggPSBkYXRhLm1ldGEuaGFzaCA/IGRhdGEubWV0YS5oYXNoIDogJyc7XHJcblxyXG4gICAgcmV0dXJuIHsgdXBkYXRlczogZGF0YS5kYXRhLCBtZXRhOiBkYXRhLm1ldGEgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyByZWFkTWVzc2FnZShjaGF0SWQ6IHN0cmluZywgbWVzc2FnZTogeyBtZXNzYWdlSWQ6IHN0cmluZzsgbWVzc2FnZVJlYWRBdDogc3RyaW5nIH0pIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wYXRjaChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdHMoXHJcbiAgICB7XHJcbiAgICAgIGxpbWl0ID0gMTAwLFxyXG4gICAgICBwYWdlID0gMSxcclxuICAgICAgc2VhcmNoLFxyXG4gICAgICB0eXBlID0gbnVsbCxcclxuICAgIH06IHtcclxuICAgICAgbGltaXQ/OiBudW1iZXI7XHJcbiAgICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICAgIHNlYXJjaD86IHN0cmluZztcclxuICAgICAgdHlwZT86IENoYXRUeXBlO1xyXG4gICAgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxLCB0eXBlOiBudWxsIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElDaGF0Pj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChcclxuICAgICAgYC92MS9jaGF0cz9zZWFyY2g9JHtzZWFyY2h9JmxpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfSR7dHlwZSA/IGAmdHlwZT0ke3R5cGV9YCA6ICcnfWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBpbmcoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGluZycsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNheGlvc0luc3RhbmNlLmdldCgnL2NoZWNrLWhlYWx0aCcpLmNhdGNoKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbmxldCBtZXNzZW5nZXI6IE1lc3NlbmdlcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzZW5nZXIoXHJcbiAgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9ucyxcclxuICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuKSB7XHJcbiAgaWYgKG1lc3Nlbmdlcikge1xyXG4gICAgcmV0dXJuIG1lc3NlbmdlcjtcclxuICB9XHJcblxyXG4gIG1lc3NlbmdlciA9IG5ldyBNZXNzZW5nZXIoY3VzdG9tT3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIG1lc3NlbmdlcjtcclxufVxyXG4iXX0=