var _Messenger_pollingInterval, _Messenger_polling, _Messenger_axiosInstance, _Messenger_events, _Messenger_updatesHash, _Messenger_baseURL, _Messenger_token, _Messenger_tokenGetter;
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
    constructor({ baseURL, token, polling = null, languageGetter = () => 'Uz-Latin', headers = {}, }, options = {}) {
        _Messenger_pollingInterval.set(this, void 0);
        _Messenger_polling.set(this, void 0);
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
            console.log(this.user);
            if (__classPrivateFieldGet(this, _Messenger_polling, "f") === null) {
                this.socket = io(__classPrivateFieldGet(this, _Messenger_baseURL, "f"), {
                    path: '/messenger',
                    auth: (cb) => cb(Object.assign(Object.assign({}, requiredHeaders), { token: __classPrivateFieldGet(this, _Messenger_token, "f").access })),
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
            return this.socket
                .connect()
                .on('connect', () => {
                if (!Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")['connect'])) {
                    return;
                }
                __classPrivateFieldGet(this, _Messenger_events, "f")['connect'].map((cb) => cb({
                    message: `Socket successfully connected. socket.id: ${this.socket.id}`,
                    socket: this.socket,
                }));
            })
                .on('disconnect', (reason, details) => {
                if (!Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")['disconnect'])) {
                    return;
                }
                __classPrivateFieldGet(this, _Messenger_events, "f")['disconnect'].map((cb) => cb({
                    reason,
                    details,
                    message: `Socket disconnected: id: ${this.socket.id}, reason: ${reason}, details: ${JSON.stringify(details)}`,
                    socket: this.socket,
                }));
            })
                .on('connect_error', (err) => {
                if (!__classPrivateFieldGet(this, _Messenger_events, "f")['socketConnectionError'] ||
                    !Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")['socketConnectionError'])) {
                    return;
                }
                if (this.socket.active) {
                    __classPrivateFieldGet(this, _Messenger_events, "f")['socketConnectionError'].map((cb) => cb({
                        message: 'temporary failure, the socket will automatically try to reconnect',
                        error: err,
                    }));
                }
                else {
                    __classPrivateFieldGet(this, _Messenger_events, "f")['socketConnectionError'].map((cb) => cb({
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
                        __classPrivateFieldGet(this, _Messenger_events, "f").update.map((cb) => cb.apply(null, updates));
                        return;
                    case 'message:read':
                        __classPrivateFieldGet(this, _Messenger_events, "f").updateMessage.map((cb) => cb.apply(null, updates));
                        return;
                    case 'user:update':
                        __classPrivateFieldGet(this, _Messenger_events, "f").updateUser.map((cb) => cb.apply(null, updates));
                        return;
                    default:
                        break;
                }
                if (!__classPrivateFieldGet(this, _Messenger_events, "f")[eventName]) {
                    return;
                }
                __classPrivateFieldGet(this, _Messenger_events, "f")[eventName].map((cb) => cb.apply(null, updates));
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
_Messenger_pollingInterval = new WeakMap(), _Messenger_polling = new WeakMap(), _Messenger_axiosInstance = new WeakMap(), _Messenger_events = new WeakMap(), _Messenger_updatesHash = new WeakMap(), _Messenger_baseURL = new WeakMap(), _Messenger_token = new WeakMap(), _Messenger_tokenGetter = new WeakMap();
let messenger;
export function getMessenger(customOptions, options = {}) {
    if (messenger) {
        return messenger;
    }
    messenger = new Messenger(customOptions, options);
    return messenger;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixrREFBa0Q7QUFDbEQsbUJBQW1CO0FBQ25CLDZDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsT0FBTztBQUNQLHNCQUFzQjtBQUN0Qix3QkFBd0I7QUFDeEIsUUFBUTtBQUVSLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRztJQUNwQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsU0FBUztRQUM3QixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDbEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQ1osQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsTUFBTSxPQUFPLENBQUMsSUFBSSxjQUFjLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDdEUsQ0FBQyxDQUFDLFNBQVMsRUFBRSx5Q0FBeUM7SUFDeEQsNkdBQTZHO0lBQzdHLGVBQWUsRUFBRSxVQUFVO0lBQzNCLFdBQVcsRUFBRSxHQUFHO0NBQ2pCLENBQUM7QUFFRixNQUFNLFNBQVM7SUF5Q2IsWUFDRSxFQUNFLE9BQU8sRUFDUCxLQUFLLEVBQ0wsT0FBTyxHQUFHLElBQUksRUFDZCxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUNqQyxPQUFPLEdBQUcsRUFBRSxHQUNFLEVBQ2hCLFVBQW1ELEVBQUU7UUFoRHZELDZDQUErQjtRQUN0QixxQ0FBMEI7UUFDMUIsMkNBQThCO1FBcUJ2QyxvQ0FFRztRQUNILFVBQVU7UUFDVixtQ0FBbUM7UUFDbkMsd0ZBQXdGO1FBQ3hGLElBQUk7UUFDSixpQ0FBdUIsRUFBRSxFQUFDO1FBQ2pCLHFDQUFpQjtRQUMxQixtQ0FBNEM7UUFDbkMseUNBRWdEO1FBZXZELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsdUJBQUEsSUFBSSxzQkFBWSxPQUFPLE1BQUEsQ0FBQztRQUN4Qix1QkFBQSxJQUFJLHNCQUFZLE9BQU8sTUFBQSxDQUFDO1FBQ3hCLHVCQUFBLElBQUkscUJBQVcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsYUFBYSxFQUFFLEVBQUUsRUFBRSxNQUFBLENBQUM7UUFDakUsdUJBQUEsSUFBSSxvQkFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFBLENBQUM7UUFDMUMsdUJBQUEsSUFBSSwwQkFBZ0IsS0FBSyxNQUFBLENBQUM7UUFDMUIsdUJBQUEsSUFBSSw0QkFBa0IsSUFBSSxtQkFBbUIsQ0FDM0MsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsRUFDOUM7WUFDRSxlQUFlLEVBQUUsd0JBQXdCO1lBQ3pDLGNBQWM7WUFDZCxXQUFXLEVBQUUsS0FBSztTQUNuQixDQUNGLENBQUMsUUFBUSxNQUFBLENBQUM7UUFFWCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxLQUFLO1FBQ1YsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixPQUFPO1FBQ1QsQ0FBQztRQUVELGFBQWEsQ0FBQyx1QkFBQSxJQUFJLGtDQUFpQixDQUFDLENBQUM7UUFDckMsdUJBQUEsSUFBSSw4QkFBb0IsU0FBUyxNQUFBLENBQUM7SUFDcEMsQ0FBQztJQUVPLFdBQVc7UUFDakIsSUFBSSx1QkFBQSxJQUFJLGtDQUFpQixFQUFFLENBQUM7WUFDMUIsYUFBYSxDQUFDLHVCQUFBLElBQUksa0NBQWlCLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBRyx1QkFBQSxJQUFJLDBCQUFTLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsdUJBQUEsSUFBSSx5QkFBUSxDQUFDO1FBQzVCLFNBQWUsZ0JBQWdCOztnQkFDN0IsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7d0JBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUVELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3QkFDekIsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzdDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNoRCxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO3dCQUMvQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUM7U0FBQTtRQUVELHVCQUFBLElBQUksOEJBQW9CLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQUEsQ0FBQztJQUMxRSxDQUFDO0lBRUssSUFBSTs7WUFDUixJQUFJLE9BQU8sdUJBQUEsSUFBSSw4QkFBYSxLQUFLLFVBQVUsRUFBRSxDQUFDO2dCQUM1Qyx1QkFBQSxJQUFJLG9CQUFVLE1BQU0sdUJBQUEsSUFBSSw4QkFBYSxNQUFqQixJQUFJLENBQWUsTUFBQSxDQUFDO1lBQzFDLENBQUM7aUJBQU0sQ0FBQztnQkFDTix1QkFBQSxJQUFJLG9CQUFVLHVCQUFBLElBQUksOEJBQWEsTUFBQSxDQUFDO1lBQ2xDLENBQUM7WUFDRCxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHVCQUFBLElBQUksd0JBQU8sQ0FBQyxDQUFDO1lBRTVDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsTUFBTSx1QkFBQSxJQUFJLGdDQUFlO2lCQUMzQyxHQUFHLENBQUMsYUFBYSxDQUFDO2lCQUNsQixLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ3RCLENBQUM7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2QixJQUFJLHVCQUFBLElBQUksMEJBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsdUJBQUEsSUFBSSwwQkFBUyxFQUFFO29CQUM5QixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDWCxFQUFFLGlDQUNHLGVBQWUsS0FDbEIsS0FBSyxFQUFFLHVCQUFBLElBQUksd0JBQU8sQ0FBQyxNQUFNLElBQ3pCO29CQUNKLG1FQUFtRTtpQkFDcEUsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksdUJBQUEsSUFBSSwwQkFBUyxFQUFFLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQzNDLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNqQyxFQUFFLENBQUM7d0JBQ0QsT0FBTyxFQUFFLGdDQUFnQzt3QkFDekMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO3FCQUNwQixDQUFDLENBQ0gsQ0FBQztnQkFDSixDQUFDO2dCQUNELE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUVELE9BQU8sSUFBSSxDQUFDLE1BQU07aUJBQ2YsT0FBTyxFQUFFO2lCQUNULEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBQSxJQUFJLHlCQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUM1QyxPQUFPO2dCQUNULENBQUM7Z0JBQ0QsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQ2pDLEVBQUUsQ0FBQztvQkFDRCxPQUFPLEVBQUUsNkNBQTZDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO29CQUN0RSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ3BCLENBQUMsQ0FDSCxDQUFDO1lBQ0osQ0FBQyxDQUFDO2lCQUNELEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQy9DLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCx1QkFBQSxJQUFJLHlCQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FDcEMsRUFBRSxDQUFDO29CQUNELE1BQU07b0JBQ04sT0FBTztvQkFDUCxPQUFPLEVBQUUsNEJBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNkLGFBQWEsTUFBTSxjQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzFELE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEIsQ0FBQyxDQUNILENBQUM7WUFDSixDQUFDLENBQUM7aUJBQ0QsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUMzQixJQUNFLENBQUMsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLHVCQUF1QixDQUFDO29CQUN0QyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFDckQsQ0FBQztvQkFDRCxPQUFPO2dCQUNULENBQUM7Z0JBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUN2Qix1QkFBQSxJQUFJLHlCQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUMvQyxFQUFFLENBQUM7d0JBQ0QsT0FBTyxFQUFFLG1FQUFtRTt3QkFDNUUsS0FBSyxFQUFFLEdBQUc7cUJBQ1gsQ0FBQyxDQUNILENBQUM7Z0JBQ0osQ0FBQztxQkFBTSxDQUFDO29CQUNOLHVCQUFBLElBQUkseUJBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQy9DLEVBQUUsQ0FBQzt3QkFDRCxPQUFPLEVBQUU7Ozt5QkFHRSxHQUFHLENBQUMsT0FBTztlQUNyQjt3QkFDRCxLQUFLLEVBQUUsR0FBRztxQkFDWCxDQUFDLENBQ0gsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxHQUFHLE9BQU8sRUFBRSxFQUFFO2dCQUMvQixRQUFRLFNBQVMsRUFBRSxDQUFDO29CQUNsQixLQUFLLGFBQWE7d0JBQ2hCLG1DQUFtQzt3QkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNsRix1QkFBQSxJQUFJLHlCQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTBCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ2pGLE9BQU87b0JBQ1QsS0FBSyxjQUFjO3dCQUNqQix1QkFBQSxJQUFJLHlCQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTBCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ3hGLE9BQU87b0JBQ1QsS0FBSyxhQUFhO3dCQUNoQix1QkFBQSxJQUFJLHlCQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQTBCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ3JGLE9BQU87b0JBRVQ7d0JBQ0UsTUFBTTtnQkFDVixDQUFDO2dCQUVELElBQUksQ0FBQyx1QkFBQSxJQUFJLHlCQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztvQkFDN0IsT0FBTztnQkFDVCxDQUFDO2dCQUVELHVCQUFBLElBQUkseUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUEwQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3ZGLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0lBRUQseURBQXlEO0lBQ3pELHNCQUFzQjtJQUN0Qiw0QkFBNEI7SUFDNUIsV0FBVztJQUNYLEVBQUUsQ0FBNkMsS0FBZ0IsRUFBRSxFQUFzQjtRQUNyRixJQUFJLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUQsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixDQUFDO2FBQU0sQ0FBQztZQUNOLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBUSxDQUFDO1FBQ3BDLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxVQUFVO1FBQ2YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUFBLElBQUkseUJBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxLQUFxQjtRQUM3QyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1YsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN6QixPQUFPO1FBQ1QsQ0FBQztRQUVELHVCQUFBLElBQUkscUJBQVcsRUFBRSxNQUFBLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sY0FBYyxDQUFDLEtBQW9CLEVBQUUsUUFBYTtRQUN2RCxJQUFJLENBQUMsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBQSxJQUFJLHlCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2hFLE9BQU87UUFDVCxDQUFDO1FBRUQsdUJBQUEsSUFBSSx5QkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLFVBQVU7NkRBQ3JCLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLEtBQXlEO1lBQzFGLEtBQUssRUFBRSxFQUFFO1lBQ1QsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsRUFBRTtTQUNYO1lBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sdUJBQUEsSUFBSSxnQ0FBZSxDQUFDLEdBQUcsQ0FDNUMsb0JBQW9CLE1BQU0sVUFBVSxLQUFLLFNBQVMsSUFBSSxFQUFFLENBQ3pELENBQUM7WUFFRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVZLFdBQVcsQ0FDdEIsTUFBYyxFQUNkLE9BQWdDOztZQUVoQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBQSxJQUFJLGdDQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsTUFBTSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFekYsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFWSxvQkFBb0IsQ0FBQyxPQUFxQjs7WUFDckQsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sdUJBQUEsSUFBSSxnQ0FBZSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUU5RSxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVZLGlCQUFpQixDQUM1QixNQUF5QixFQUN6QixPQUEyQjs7WUFFM0IsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sdUJBQUEsSUFBSSxnQ0FBZSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRTtnQkFDM0UsT0FBTztnQkFDUCxNQUFNO2FBQ1AsQ0FBQyxDQUFDO1lBRUgsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFWSxlQUFlOzZEQUMxQixNQUFjLEVBQ2QsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsS0FBeUQ7WUFDMUYsS0FBSyxFQUFFLEVBQUU7WUFDVCxJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU0sRUFBRSxFQUFFO1NBQ1g7WUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBQSxJQUFJLGdDQUFlLENBQUMsR0FBRyxDQUM1QyxhQUFhLE1BQU0sb0JBQW9CLE1BQU0sVUFBVSxLQUFLLFNBQVMsSUFBSSxFQUFFLENBQzVFLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVZLFdBQVcsQ0FBQyxNQUFjOztZQUNyQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBQSxJQUFJLGdDQUFlLENBQUMsR0FBRyxDQUFDLGFBQWEsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUV0RSxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVZLFlBQVk7NkRBQ3ZCLE1BQWMsRUFDZCxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsS0FBd0MsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7WUFFcEYsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO0tBQUE7SUFFWSxZQUFZOzZEQUN2QixNQUFjLEVBQ2QsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxDQUFDLEtBQXdDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBRXBGLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztLQUFBO0lBRVksYUFBYTs2REFDeEIsTUFBYyxFQUNkLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxLQUF3QyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUVwRixPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtJQUVZLFVBQVU7NkRBQUMsRUFDdEIsS0FBSyxHQUFHLHVCQUFBLElBQUksMEJBQVMsQ0FBQyxLQUFLLEVBQzNCLGNBQWMsR0FBRyxFQUFFLE1BS2pCLEVBQUU7WUFjSixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBQSxJQUFJLGdDQUFlO2lCQUN2QyxHQUFHLENBQUMsMkJBQTJCLEtBQUssU0FBUyx1QkFBQSxJQUFJLDhCQUFhLEVBQUUsQ0FBQztpQkFDakUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ1osSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxFQUFFO29CQUNSLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsSUFBSTt3QkFDVixXQUFXLEVBQUUsQ0FBQzt3QkFDZCxLQUFLLEVBQUUsR0FBRzt3QkFDVixVQUFVLEVBQUUsQ0FBQzt3QkFDYixVQUFVLEVBQUUsQ0FBQztxQkFDZDtpQkFDRjthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRU4sdUJBQUEsSUFBSSwwQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQUEsQ0FBQztZQUV6RCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRCxDQUFDO0tBQUE7SUFFWSxXQUFXLENBQUMsTUFBYyxFQUFFLE9BQXFEOztZQUM1RixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBQSxJQUFJLGdDQUFlLENBQUMsS0FBSyxDQUFDLGFBQWEsTUFBTSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUYsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFWSxRQUFROzZEQUNuQixFQUNFLEtBQUssR0FBRyxHQUFHLEVBQ1gsSUFBSSxHQUFHLENBQUMsRUFDUixNQUFNLEVBQ04sSUFBSSxHQUFHLElBQUksTUFNVCxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1lBRXRDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQzVDLG9CQUFvQixNQUFNLFVBQVUsS0FBSyxTQUFTLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUN2RixDQUFDO1lBRUYsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFTSxJQUFJO1FBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBQU0sQ0FBQztZQUNOLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGOztBQUVELElBQUksU0FBb0IsQ0FBQztBQUV6QixNQUFNLFVBQVUsWUFBWSxDQUMxQixhQUE0QixFQUM1QixVQUFtRCxFQUFFO0lBRXJELElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVmYXVsdEV2ZW50c01hcCB9IGZyb20gJ0Bzb2NrZXQuaW8vY29tcG9uZW50LWVtaXR0ZXInO1xyXG5pbXBvcnQgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnZm9ybS1kYXRhJztcclxuaW1wb3J0IHR5cGUgeyBNYW5hZ2VyT3B0aW9ucywgU29ja2V0LCBTb2NrZXRPcHRpb25zIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IGlvIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHYxIGFzIHV1aWRWMSB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuL2NvbW1vbi9jb25maWcnO1xyXG5pbXBvcnQgeyBNeUFwaVJlc3BvbnNlIH0gZnJvbSAnLi90eXBlcy9hcGknO1xyXG5pbXBvcnQgeyBGaWx0ZXJQb2x5Z29uQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL2FyZWEuZmlsdGVyJztcclxuaW1wb3J0IHsgQ2hhdFR5cGUsIElDaGF0IH0gZnJvbSAnLi90eXBlcy9hcGkvY2hhdCc7XHJcbmltcG9ydCB7IElNZXNzYWdlLCBJU2VuZE1lc3NhZ2UsIElTZW5kTWVzc2FnZVRvQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL21lc3NhZ2UnO1xyXG5pbXBvcnQgeyBJT25VcGRhdGUsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZS50eXBlcyc7XHJcbmltcG9ydCB7IElVc2VyIH0gZnJvbSAnLi90eXBlcy9hcGkvdXNlcic7XHJcbmltcG9ydCB7IEN1c3RvbU9wdGlvbnMsIERldmljZVR5cGVzRW51bSwgSUV2ZW50cywgSVBvbGxpbmdPcHRpb25zIH0gZnJvbSAnLi90eXBlcy90eXBlcyc7XHJcbmltcG9ydCB7IEN1c3RvbUF4aW9zSW5zdGFuY2UsIGxvY2FsU3RnIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5jb25zdCBsb2NhbFVpZCA9IGxvY2FsU3RnLmdldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJyk7XHJcbmNvbnN0IHVpZCA9IGxvY2FsVWlkID8gbG9jYWxVaWQgOiB1dWlkVjEoKTtcclxubG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJEZXZpY2VVaWQnLCB1aWQpO1xyXG5sZXQgYXBwVmVyc2lvbiA9ICcwLjAuMCc7XHJcblxyXG4vLyByZWFkRmlsZShqb2luKHByb2Nlc3MuY3dkKCkgKyAnL3BhY2thZ2UuanNvbicpKVxyXG4vLyAgIC50aGVuKCh2KSA9PiB7XHJcbi8vICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZSh2LnRvU3RyaW5nKCkpO1xyXG4vLyAgICAgYXBwVmVyc2lvbiA9IGpzb24udmVyc2lvbjtcclxuLy8gICB9KVxyXG4vLyAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbi8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4vLyAgIH0pO1xyXG5cclxuY29uc3QgcmVxdWlyZWRIZWFkZXJzID0ge1xyXG4gICd4LWRldmljZS10eXBlJzogRGV2aWNlVHlwZXNFbnVtLldFQixcclxuICAneC1kZXZpY2UtbW9kZWwnOiBFTlYuaXNCcm93c2VyXHJcbiAgICA/IGAke25hdmlnYXRvci51c2VyQWdlbnR9IHwgJHtuYXZpZ2F0b3IucGxhdGZvcm19YFxyXG4gICAgOiBFTlYuaXNOb2RlXHJcbiAgICA/IGAke3Byb2Nlc3MucGxhdGZvcm19IHwgJHtwcm9jZXNzLmFyY2h9IHwgTm9kZWpzOiAke3Byb2Nlc3MudmVyc2lvbn1gXHJcbiAgICA6ICdVbmtub3duJywgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgZGV2aWNlIG1vZGVsIGluZm9cclxuICAvLyAneC1hcHAtbGFuZyc6IChsYW5ndWFnZUdldHRlcigpIHx8ICdVei1MYXRpbicpIGFzIEkxOG5UeXBlLkxhbmdUeXBlLCAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXHJcbiAgJ3gtYXBwLXZlcnNpb24nOiBhcHBWZXJzaW9uLFxyXG4gICd4LWFwcC11aWQnOiB1aWQsXHJcbn07XHJcblxyXG5jbGFzcyBNZXNzZW5nZXIge1xyXG4gICNwb2xsaW5nSW50ZXJ2YWw6IE5vZGVKUy5UaW1lcjtcclxuICByZWFkb25seSAjcG9sbGluZzogSVBvbGxpbmdPcHRpb25zO1xyXG4gIHJlYWRvbmx5ICNheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xyXG5cclxuICB1c2VyOiB7XHJcbiAgICBfaWQ6IHN0cmluZztcclxuICAgIGltYWdlOiBzdHJpbmc7XHJcbiAgICBmaXJzdE5hbWU6IHN0cmluZztcclxuICAgIGxhc3ROYW1lOiBzdHJpbmc7XHJcbiAgICBtaWRkbGVOYW1lOiBzdHJpbmc7XHJcbiAgICBlbWFpbDogc3RyaW5nIHwgbnVsbDtcclxuICAgIHVzZXJuYW1lOiBzdHJpbmc7XHJcbiAgICBwaG9uZU51bWJlcjogc3RyaW5nO1xyXG4gICAgYmlydGhkYXk6IHN0cmluZyB8IG51bGw7XHJcbiAgICBkZXZpY2VVaWQ6IHN0cmluZyB8IG51bGw7XHJcbiAgICAvLyBwb3NpdGlvbjogbnVsbDtcclxuICAgIC8vIGdyb3VwOiBudWxsO1xyXG4gICAgLy8gbWZ5OiBudWxsO1xyXG4gICAgLy8gZ29tOiBudWxsO1xyXG4gICAgLy8gZGlzdHJpY3Q6IG51bGw7XHJcbiAgICAvLyBkaXZpc2lvbklkOiBudWxsO1xyXG4gIH07XHJcblxyXG4gICNldmVudHM6IFBhcnRpYWw8e1xyXG4gICAgW0V2ZW50TmFtZSBpbiBrZXlvZiBJRXZlbnRzXTogSUV2ZW50c1tFdmVudE5hbWVdW107XHJcbiAgfT47XHJcbiAgLy8gUmVjb3JkPFxyXG4gIC8vIEV2ZW50TmFtZSBleHRlbmRzIGtleW9mIElFdmVudHMsXHJcbiAgLy8gICAoRXZlbnROYW1lIGV4dGVuZHMga2V5b2YgSUV2ZW50cyA/IElFdmVudHNbRXZlbnROYW1lXSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZClbXVxyXG4gIC8vID5cclxuICAjdXBkYXRlc0hhc2g6IHN0cmluZyA9ICcnO1xyXG4gIHJlYWRvbmx5ICNiYXNlVVJMOiBzdHJpbmc7XHJcbiAgI3Rva2VuOiB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfTtcclxuICByZWFkb25seSAjdG9rZW5HZXR0ZXI6XHJcbiAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XHJcblxyXG4gIHB1YmxpYyB1aWQ6IHN0cmluZztcclxuICBwdWJsaWMgc29ja2V0OiBTb2NrZXQ8RGVmYXVsdEV2ZW50c01hcCwgRGVmYXVsdEV2ZW50c01hcD4gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHtcclxuICAgICAgYmFzZVVSTCxcclxuICAgICAgdG9rZW4sXHJcbiAgICAgIHBvbGxpbmcgPSBudWxsLFxyXG4gICAgICBsYW5ndWFnZUdldHRlciA9ICgpID0+ICdVei1MYXRpbicsXHJcbiAgICAgIGhlYWRlcnMgPSB7fSxcclxuICAgIH06IEN1c3RvbU9wdGlvbnMsXHJcbiAgICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuICApIHtcclxuICAgIHRoaXMudWlkID0gdWlkO1xyXG4gICAgdGhpcy4jcG9sbGluZyA9IHBvbGxpbmc7XHJcbiAgICB0aGlzLiNiYXNlVVJMID0gYmFzZVVSTDtcclxuICAgIHRoaXMuI2V2ZW50cyA9IHsgdXBkYXRlOiBbXSwgdXBkYXRlVXNlcjogW10sIHVwZGF0ZU1lc3NhZ2U6IFtdIH07XHJcbiAgICB0aGlzLiN0b2tlbiA9IHsgYWNjZXNzOiAnJywgcmVmcmVzaDogJycgfTtcclxuICAgIHRoaXMuI3Rva2VuR2V0dGVyID0gdG9rZW47XHJcbiAgICB0aGlzLiNheGlvc0luc3RhbmNlID0gbmV3IEN1c3RvbUF4aW9zSW5zdGFuY2UoXHJcbiAgICAgIHsgYmFzZVVSTDogYmFzZVVSTCwgaGVhZGVyczogcmVxdWlyZWRIZWFkZXJzIH0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWZyZXNoVG9rZW5Vcmw6ICcvdjEvYXV0aC9yZWZyZXNoLXRva2VuJyxcclxuICAgICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgICAgICB0b2tlbkdldHRlcjogdG9rZW4sXHJcbiAgICAgIH0sXHJcbiAgICApLmluc3RhbmNlO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdFBvbGxpbmcgPSB0aGlzLmluaXRQb2xsaW5nLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWFyY2hVc2VyID0gdGhpcy5zZWFyY2hVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZXNzYWdlcyA9IHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRJbmZvID0gdGhpcy5nZXRDaGF0SW5mby5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0TWVkaWEgPSB0aGlzLmdldENoYXRNZWRpYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0RmlsZXMgPSB0aGlzLmdldENoYXRGaWxlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0QXVkaW9zID0gdGhpcy5nZXRDaGF0QXVkaW9zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZE1lc3NhZ2UgPSB0aGlzLnJlYWRNZXNzYWdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRzID0gdGhpcy5nZXRDaGF0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZW5kTWVzc2FnZVRvQXJlYSA9IHRoaXMuc2VuZE1lc3NhZ2VUb0FyZWEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRQb2xsaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcztcclxuICAgIGNvbnN0IHBvbGxpbmcgPSB0aGlzLiNwb2xsaW5nO1xyXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy4jZXZlbnRzO1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gaW50ZXJ2YWxDYWxsYmFjaygpIHtcclxuICAgICAgY29uc3QgeyB1cGRhdGVzIH0gPSBhd2FpdCBnZXRVcGRhdGVzKHsgbGltaXQ6IHBvbGxpbmcubGltaXQgfSk7XHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZSddICYmIHVwZGF0ZXMudXBkYXRlcykge1xyXG4gICAgICAgIHVwZGF0ZXMudXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGUnXS5tYXAoKGNiKSA9PiBjYih1cGRhdGUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlVXNlciddICYmIHVwZGF0ZXMudXNlcnMpIHtcclxuICAgICAgICB1cGRhdGVzLnVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGVVc2VyJ10ubWFwKChjYikgPT4gY2IodXNlcikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVNZXNzYWdlJ10gJiYgdXBkYXRlcy5tZXNzYWdlcykge1xyXG4gICAgICAgIHVwZGF0ZXMubWVzc2FnZXMubWFwKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXS5tYXAoKGNiKSA9PiBjYihtZXNzYWdlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChpbnRlcnZhbENhbGxiYWNrLCBwb2xsaW5nLmludGVydmFsKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXQoKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuI3Rva2VuR2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gYXdhaXQgdGhpcy4jdG9rZW5HZXR0ZXIoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gdGhpcy4jdG9rZW5HZXR0ZXI7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywgdGhpcy4jdG9rZW4pO1xyXG5cclxuICAgIGNvbnN0IHsgZGF0YTogbWUgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2VcclxuICAgICAgLmdldCgnL3YxL2F1dGgvbWUnKVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4gKHsgZGF0YTogeyBzdWNjZXNzOiBmYWxzZSB9IH0pKTtcclxuICAgIGlmIChtZS5zdWNjZXNzKSB7XHJcbiAgICAgIHRoaXMudXNlciA9IG1lLmRhdGE7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnVzZXIpO1xyXG5cclxuICAgIGlmICh0aGlzLiNwb2xsaW5nID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc29ja2V0ID0gaW8odGhpcy4jYmFzZVVSTCwge1xyXG4gICAgICAgIHBhdGg6ICcvbWVzc2VuZ2VyJyxcclxuICAgICAgICBhdXRoOiAoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIC4uLnJlcXVpcmVkSGVhZGVycyxcclxuICAgICAgICAgICAgdG9rZW46IHRoaXMuI3Rva2VuLmFjY2VzcyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgIC8vIGV4dHJhSGVhZGVyczogeyAuLi5yZXF1aXJlZEhlYWRlcnMsIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MgfSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcpIHtcclxuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICB0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBgUG9sbGluZyBzdWNjZXNzZnVsbHkgY29ubmVjdGVkYCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XHJcbiAgICAgIC5jb25uZWN0KClcclxuICAgICAgLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4jZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBzdWNjZXNzZnVsbHkgY29ubmVjdGVkLiBzb2NrZXQuaWQ6ICR7dGhpcy5zb2NrZXQuaWR9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignZGlzY29ubmVjdCcsIChyZWFzb24sIGRldGFpbHMpID0+IHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydkaXNjb25uZWN0J10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiNldmVudHNbJ2Rpc2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICByZWFzb24sXHJcbiAgICAgICAgICAgIGRldGFpbHMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgZGlzY29ubmVjdGVkOiBpZDogJHtcclxuICAgICAgICAgICAgICB0aGlzLnNvY2tldC5pZFxyXG4gICAgICAgICAgICB9LCByZWFzb246ICR7cmVhc29ufSwgZGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShkZXRhaWxzKX1gLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdjb25uZWN0X2Vycm9yJywgKGVycikgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICF0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddIHx8XHJcbiAgICAgICAgICAhQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgdGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3RlbXBvcmFyeSBmYWlsdXJlLCB0aGUgc29ja2V0IHdpbGwgYXV0b21hdGljYWxseSB0cnkgdG8gcmVjb25uZWN0JyxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuI2V2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10ubWFwKChjYikgPT5cclxuICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBcclxuICAgICAgICAgICAgICAgIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgaW4gdGhhdCBjYXNlLCBzb2NrZXQuY29ubmVjdCgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIGluIG9yZGVyIHRvIHJlY29ubmVjdC5cclxuICAgICAgICAgICAgICAgIEVycm9yOiAke2Vyci5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLm9uQW55KChldmVudE5hbWUsIC4uLnVwZGF0ZXMpID0+IHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xyXG4gICAgICAgICAgY2FzZSAnbWVzc2FnZTpuZXcnOlxyXG4gICAgICAgICAgICAvLyAhIGJ1bmkga2V5aW4gb2xpYiB0YXNobGFzaCBrZXJha1xyXG4gICAgICAgICAgICB1cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB0aGlzLnNvY2tldC5lbWl0KCdtZXNzYWdlOnJlY2VpdmVkJywgdXBkYXRlLm1lc3NhZ2UuX2lkKSk7XHJcbiAgICAgICAgICAgIHRoaXMuI2V2ZW50cy51cGRhdGUubWFwKChjYjogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZCkgPT4gY2IuYXBwbHkobnVsbCwgdXBkYXRlcykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBjYXNlICdtZXNzYWdlOnJlYWQnOlxyXG4gICAgICAgICAgICB0aGlzLiNldmVudHMudXBkYXRlTWVzc2FnZS5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIGNhc2UgJ3VzZXI6dXBkYXRlJzpcclxuICAgICAgICAgICAgdGhpcy4jZXZlbnRzLnVwZGF0ZVVzZXIubWFwKChjYjogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZCkgPT4gY2IuYXBwbHkobnVsbCwgdXBkYXRlcykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuI2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiNldmVudHNbZXZlbnROYW1lXS5tYXAoKGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiBjYi5hcHBseShudWxsLCB1cGRhdGVzKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIG9uPEV2ZW50TmFtZSBleHRlbmRzIGtleW9mIElFdmVudHMgPSAndXBkYXRlJz4oXHJcbiAgLy8gICBldmVudDogRXZlbnROYW1lLFxyXG4gIC8vICAgY2I6IElFdmVudHNbRXZlbnROYW1lXSxcclxuICAvLyApOiB0aGlzO1xyXG4gIG9uPEV2ZW50TmFtZSBleHRlbmRzIGtleW9mIElFdmVudHMgPSAndXBkYXRlJz4oZXZlbnQ6IEV2ZW50TmFtZSwgY2I6IElFdmVudHNbRXZlbnROYW1lXSk6IHRoaXMge1xyXG4gICAgaWYgKHRoaXMuI2V2ZW50c1tldmVudF0gJiYgQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbZXZlbnRdKSkge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdLnB1c2goY2IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XSA9IFtjYl0gYXMgYW55O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV2ZW50TmFtZXMoKTogc3RyaW5nW10ge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuI2V2ZW50cyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50Pzoga2V5b2YgSUV2ZW50cyk6IHRoaXMge1xyXG4gICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbXTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI2V2ZW50cyA9IHt9O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6IGtleW9mIElFdmVudHMsIGNhbGxiYWNrOiBhbnkpOiB0aGlzIHtcclxuICAgIGlmICghdGhpcy4jZXZlbnRzW2V2ZW50XSB8fCAhQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbZXZlbnRdKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGNiKSA9PiBjYi5uYW1lICE9PSBjYWxsYmFjay5uYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VhcmNoIGlkIG9yIHVzZXJuYW1lXHJcbiAgICogQHJldHVybnMge1tdfVxyXG4gICAqL1xyXG4gIHB1YmxpYyBhc3luYyBzZWFyY2hVc2VyKFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XHJcbiAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElVc2VyPj4oXHJcbiAgICAgIGAvdjEvdXNlcnM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgbWVzc2FnZTogSVNlbmRNZXNzYWdlIHwgRm9ybURhdGEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvTmV3VXNlcihtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2VgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvQXJlYShcclxuICAgIGZpbHRlcjogRmlsdGVyUG9seWdvbkFyZWEsXHJcbiAgICBtZXNzYWdlOiBJU2VuZE1lc3NhZ2VUb0FyZWEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS91c2Vycy9tZXNzYWdlLWJ5LWFyZWFgLCB7XHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICAgIGZpbHRlcixcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZXNzYWdlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XHJcbiAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElNZXNzYWdlPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElNZXNzYWdlPj4oXHJcbiAgICAgIGAvdjEvY2hhdHMvJHtjaGF0SWR9L21lc3NhZ2VzP3NlYXJjaD0ke3NlYXJjaH0mbGltaXQ9JHtsaW1pdH0mcGFnZT0ke3BhZ2V9YCxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEluZm8oY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cy8ke2NoYXRJZH1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0TWVkaWEoXHJcbiAgICBjaGF0SWQ6IHN0cmluZyxcclxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlciB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEgfSxcclxuICApOiBQcm9taXNlPHVua25vd25bXT4ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRGaWxlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEF1ZGlvcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0VXBkYXRlcyh7XHJcbiAgICBsaW1pdCA9IHRoaXMuI3BvbGxpbmcubGltaXQsXHJcbiAgICBhbGxvd2VkVXBkYXRlcyA9IFtdLFxyXG4gIH06IHtcclxuICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgcGFnZT86IG51bWJlcjtcclxuICAgIGFsbG93ZWRVcGRhdGVzPzogTWVzc2FnZVR5cGVbXTtcclxuICB9ID0ge30pOiBQcm9taXNlPHtcclxuICAgIHVwZGF0ZXM6IHtcclxuICAgICAgdXBkYXRlczogSU9uVXBkYXRlW107XHJcbiAgICAgIHVzZXJzOiB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgaXNPbmxpbmU6IGJvb2xlYW47XHJcbiAgICAgIH1bXTtcclxuICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICByZWFkQXQ6IHN0cmluZztcclxuICAgICAgfVtdO1xyXG4gICAgfTtcclxuICAgIG1ldGE6IGFueTtcclxuICB9PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2VcclxuICAgICAgLmdldChgL3YxL3VzZXJzL3VwZGF0ZXM/bGltaXQ9JHtsaW1pdH0maGFzaD0ke3RoaXMuI3VwZGF0ZXNIYXNofWApXHJcbiAgICAgIC5jYXRjaCgoKSA9PiAoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgbWV0YToge1xyXG4gICAgICAgICAgICBoYXNoOiBudWxsLFxyXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwMCxcclxuICAgICAgICAgICAgdG90YWxDb3VudDogMCxcclxuICAgICAgICAgICAgdG90YWxQYWdlczogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSkpO1xyXG5cclxuICAgIHRoaXMuI3VwZGF0ZXNIYXNoID0gZGF0YS5tZXRhLmhhc2ggPyBkYXRhLm1ldGEuaGFzaCA6ICcnO1xyXG5cclxuICAgIHJldHVybiB7IHVwZGF0ZXM6IGRhdGEuZGF0YSwgbWV0YTogZGF0YS5tZXRhIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcmVhZE1lc3NhZ2UoY2hhdElkOiBzdHJpbmcsIG1lc3NhZ2U6IHsgbWVzc2FnZUlkOiBzdHJpbmc7IG1lc3NhZ2VSZWFkQXQ6IHN0cmluZyB9KSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucGF0Y2goYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRzKFxyXG4gICAge1xyXG4gICAgICBsaW1pdCA9IDEwMCxcclxuICAgICAgcGFnZSA9IDEsXHJcbiAgICAgIHNlYXJjaCxcclxuICAgICAgdHlwZSA9IG51bGwsXHJcbiAgICB9OiB7XHJcbiAgICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgICBwYWdlPzogbnVtYmVyO1xyXG4gICAgICBzZWFyY2g/OiBzdHJpbmc7XHJcbiAgICAgIHR5cGU/OiBDaGF0VHlwZTtcclxuICAgIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSwgdHlwZTogbnVsbCB9LFxyXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJQ2hhdD4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoXHJcbiAgICAgIGAvdjEvY2hhdHM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX0ke3R5cGUgPyBgJnR5cGU9JHt0eXBlfWAgOiAnJ31gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3BpbmcnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoJy9jaGVjay1oZWFsdGgnKS5jYXRjaCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgbWVzc2VuZ2VyOiBNZXNzZW5nZXI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2VuZ2VyKFxyXG4gIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbnMsXHJcbiAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbikge1xyXG4gIGlmIChtZXNzZW5nZXIpIHtcclxuICAgIHJldHVybiBtZXNzZW5nZXI7XHJcbiAgfVxyXG5cclxuICBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKGN1c3RvbU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIHJldHVybiBtZXNzZW5nZXI7XHJcbn1cclxuIl19