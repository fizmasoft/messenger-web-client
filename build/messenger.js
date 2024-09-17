var _Messenger_pollingInterval, _Messenger_polling, _Messenger_axiosInstance, _Messenger_events, _Messenger_updatesHash, _Messenger_baseURL, _Messenger_token, _Messenger_tokenGetter;
import { __awaiter, __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { readFile } from 'fs/promises';
import { join } from 'path';
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { DeviceTypesEnum } from './types/types';
import { CustomAxiosInstance, localStg } from './utils';
const localUid = localStg.get('messengerDeviceUid');
const uid = localUid ? localUid : uuidV1();
localStg.set('messengerDeviceUid', uid);
let appVersion = '0.0.0';
readFile(join(process.cwd() + '/package.json'))
    .then((v) => {
    const json = JSON.parse(v.toString());
    appVersion = json.version;
})
    .catch((err) => {
    console.log(err);
});
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
        _Messenger_updatesHash.set(this, '');
        _Messenger_baseURL.set(this, void 0);
        _Messenger_token.set(this, void 0);
        _Messenger_tokenGetter.set(this, void 0);
        this.uid = uid;
        __classPrivateFieldSet(this, _Messenger_polling, polling, "f");
        __classPrivateFieldSet(this, _Messenger_baseURL, baseURL, "f");
        __classPrivateFieldSet(this, _Messenger_events, {}, "f");
        __classPrivateFieldSet(this, _Messenger_token, { access: '', refresh: '' }, "f");
        __classPrivateFieldSet(this, _Messenger_tokenGetter, token, "f");
        __classPrivateFieldSet(this, _Messenger_axiosInstance, new CustomAxiosInstance({ baseURL: baseURL, headers: requiredHeaders }, {
            refreshTokenUrl: '/v1/auth/refresh-token',
            languageGetter,
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
                const { updates, meta } = yield getUpdates({ limit: polling.limit });
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
            if (__classPrivateFieldGet(this, _Messenger_polling, "f") === null) {
                this.socket = io(__classPrivateFieldGet(this, _Messenger_baseURL, "f"), {
                    path: '/messenger',
                    autoConnect: false,
                    auth: (cb) => cb(Object.assign(Object.assign({}, requiredHeaders), { token: __classPrivateFieldGet(this, _Messenger_token, "f").access })),
                    extraHeaders: Object.assign(Object.assign({}, requiredHeaders), { token: __classPrivateFieldGet(this, _Messenger_token, "f").access }),
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
                .on('update', (update) => {
                if (!Array.isArray(__classPrivateFieldGet(this, _Messenger_events, "f")['update'])) {
                    return;
                }
                __classPrivateFieldGet(this, _Messenger_events, "f")['update'].map((cb) => cb(update));
            });
        });
    }
    // public on(event: Ev, cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void): this;
    on(event, cb) {
        if (__classPrivateFieldGet(this, _Messenger_events, "f")[event]) {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event].push(cb);
        }
        else {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event] = [cb];
        }
        // let a: Record<keyof IEvents, (...args: any) => void>;
        // if (this.socket) {
        //   this.socket.on(event, cb as any);
        // }
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
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`/v1/chats/${message.to.chatId}/messages`, message);
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
        return __awaiter(this, arguments, void 0, function* ({ limit = __classPrivateFieldGet(this, _Messenger_polling, "f").limit, page = 1, allowedUpdates = [], } = {}) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f")
                .get(`/v1/users/updates?page=${page}&limit=${limit}&hash=${__classPrivateFieldGet(this, _Messenger_updatesHash, "f")}`)
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
        return __awaiter(this, arguments, void 0, function* ({ limit = 100, page = 1, type = null, } = { limit: 20, page: 1, type: null }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats?limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU1QixPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDdEMsT0FBTyxFQUFFLEVBQUUsSUFBSSxNQUFNLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBT3RDLE9BQU8sRUFBaUIsZUFBZSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXhELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDM0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFFekIsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUM7S0FDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDVixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzVCLENBQUMsQ0FBQztLQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFF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Q1IsSUFBSSxHQUFHLElBQUksTUFLVCxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1lBRXRDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQzVDLG1CQUFtQixLQUFLLFNBQVMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ3RFLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVNLElBQUk7UUFDVCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7YUFBTSxDQUFDO1lBQ04sdUJBQUEsSUFBSSxnQ0FBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNuRCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7O0FBRUQsSUFBSSxTQUFvQixDQUFDO0FBRXpCLE1BQU0sVUFBVSxZQUFZLENBQzFCLGFBQTRCLEVBQzVCLFVBQW1ELEVBQUU7SUFFckQsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEZWZhdWx0RXZlbnRzTWFwIH0gZnJvbSAnQHNvY2tldC5pby9jb21wb25lbnQtZW1pdHRlcic7XHJcbmltcG9ydCB7IEF4aW9zSW5zdGFuY2UgfSBmcm9tICdheGlvcyc7XHJcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB0eXBlIHsgTWFuYWdlck9wdGlvbnMsIFNvY2tldCwgU29ja2V0T3B0aW9ucyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBpbyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyB2MSBhcyB1dWlkVjEgfSBmcm9tICd1dWlkJztcclxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi9jb21tb24vY29uZmlnJztcclxuaW1wb3J0IHsgTXlBcGlSZXNwb25zZSB9IGZyb20gJy4vdHlwZXMvYXBpJztcclxuaW1wb3J0IHsgRmlsdGVyUG9seWdvbkFyZWEgfSBmcm9tICcuL3R5cGVzL2FwaS9hcmVhLmZpbHRlcic7XHJcbmltcG9ydCB7IENoYXRUeXBlLCBJQ2hhdCB9IGZyb20gJy4vdHlwZXMvYXBpL2NoYXQnO1xyXG5pbXBvcnQgeyBJTWVzc2FnZSwgSVNlbmRNZXNzYWdlLCBJU2VuZE1lc3NhZ2VUb0FyZWEgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlJztcclxuaW1wb3J0IHsgSU9uVXBkYXRlLCBNZXNzYWdlVHlwZSB9IGZyb20gJy4vdHlwZXMvYXBpL21lc3NhZ2UudHlwZXMnO1xyXG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdHlwZXMvYXBpL3VzZXInO1xyXG5pbXBvcnQgeyBDdXN0b21PcHRpb25zLCBEZXZpY2VUeXBlc0VudW0sIElFdmVudHMsIElQb2xsaW5nT3B0aW9ucyB9IGZyb20gJy4vdHlwZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21BeGlvc0luc3RhbmNlLCBsb2NhbFN0ZyB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY29uc3QgbG9jYWxVaWQgPSBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlckRldmljZVVpZCcpO1xyXG5jb25zdCB1aWQgPSBsb2NhbFVpZCA/IGxvY2FsVWlkIDogdXVpZFYxKCk7XHJcbmxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJywgdWlkKTtcclxubGV0IGFwcFZlcnNpb24gPSAnMC4wLjAnO1xyXG5cclxucmVhZEZpbGUoam9pbihwcm9jZXNzLmN3ZCgpICsgJy9wYWNrYWdlLmpzb24nKSlcclxuICAudGhlbigodikgPT4ge1xyXG4gICAgY29uc3QganNvbiA9IEpTT04ucGFyc2Uodi50b1N0cmluZygpKTtcclxuICAgIGFwcFZlcnNpb24gPSBqc29uLnZlcnNpb247XHJcbiAgfSlcclxuICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9KTtcclxuXHJcbmNvbnN0IHJlcXVpcmVkSGVhZGVycyA9IHtcclxuICAneC1kZXZpY2UtdHlwZSc6IERldmljZVR5cGVzRW51bS5XRUIsXHJcbiAgJ3gtZGV2aWNlLW1vZGVsJzogRU5WLmlzQnJvd3NlclxyXG4gICAgPyBgJHtuYXZpZ2F0b3IudXNlckFnZW50fSB8ICR7bmF2aWdhdG9yLnBsYXRmb3JtfWBcclxuICAgIDogRU5WLmlzTm9kZVxyXG4gICAgPyBgJHtwcm9jZXNzLnBsYXRmb3JtfSB8ICR7cHJvY2Vzcy5hcmNofSB8IE5vZGVqczogJHtwcm9jZXNzLnZlcnNpb259YFxyXG4gICAgOiAnVW5rbm93bicsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGRldmljZSBtb2RlbCBpbmZvXHJcbiAgLy8gJ3gtYXBwLWxhbmcnOiAobGFuZ3VhZ2VHZXR0ZXIoKSB8fCAnVXotTGF0aW4nKSBhcyBJMThuVHlwZS5MYW5nVHlwZSwgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgbGFuZ3VhZ2UgaW5mb1xyXG4gICd4LWFwcC12ZXJzaW9uJzogYXBwVmVyc2lvbixcclxuICAneC1hcHAtdWlkJzogdWlkLFxyXG59O1xyXG5cclxuY2xhc3MgTWVzc2VuZ2VyPEV2IGV4dGVuZHMgc3RyaW5nID0ga2V5b2YgSUV2ZW50cz4ge1xyXG4gICNwb2xsaW5nSW50ZXJ2YWw6IE5vZGVKUy5UaW1lcjtcclxuICByZWFkb25seSAjcG9sbGluZzogSVBvbGxpbmdPcHRpb25zO1xyXG4gIHJlYWRvbmx5ICNheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xyXG4gICNldmVudHM6IFBhcnRpYWw8UmVjb3JkPEV2LCAoKC4uLmFyZ3M6IGFueSkgPT4gdm9pZClbXT4+O1xyXG4gICN1cGRhdGVzSGFzaDogc3RyaW5nID0gJyc7XHJcbiAgcmVhZG9ubHkgI2Jhc2VVUkw6IHN0cmluZztcclxuICAjdG9rZW46IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9O1xyXG4gIHJlYWRvbmx5ICN0b2tlbkdldHRlcjpcclxuICAgIHwgeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH1cclxuICAgIHwgKCgpID0+IFByb21pc2U8eyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH0+KTtcclxuXHJcbiAgcHVibGljIHVpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyBzb2NrZXQ6IFNvY2tldDxEZWZhdWx0RXZlbnRzTWFwLCBEZWZhdWx0RXZlbnRzTWFwPiB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAge1xyXG4gICAgICBiYXNlVVJMLFxyXG4gICAgICB0b2tlbixcclxuICAgICAgcG9sbGluZyA9IG51bGwsXHJcbiAgICAgIGxhbmd1YWdlR2V0dGVyID0gKCkgPT4gJ1V6LUxhdGluJyxcclxuICAgICAgaGVhZGVycyA9IHt9LFxyXG4gICAgfTogQ3VzdG9tT3B0aW9ucyxcclxuICAgIG9wdGlvbnM6IFBhcnRpYWw8TWFuYWdlck9wdGlvbnMgJiBTb2NrZXRPcHRpb25zPiA9IHt9LFxyXG4gICkge1xyXG4gICAgdGhpcy51aWQgPSB1aWQ7XHJcbiAgICB0aGlzLiNwb2xsaW5nID0gcG9sbGluZztcclxuICAgIHRoaXMuI2Jhc2VVUkwgPSBiYXNlVVJMO1xyXG4gICAgdGhpcy4jZXZlbnRzID0ge307XHJcbiAgICB0aGlzLiN0b2tlbiA9IHsgYWNjZXNzOiAnJywgcmVmcmVzaDogJycgfTtcclxuICAgIHRoaXMuI3Rva2VuR2V0dGVyID0gdG9rZW47XHJcbiAgICB0aGlzLiNheGlvc0luc3RhbmNlID0gbmV3IEN1c3RvbUF4aW9zSW5zdGFuY2UoXHJcbiAgICAgIHsgYmFzZVVSTDogYmFzZVVSTCwgaGVhZGVyczogcmVxdWlyZWRIZWFkZXJzIH0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWZyZXNoVG9rZW5Vcmw6ICcvdjEvYXV0aC9yZWZyZXNoLXRva2VuJyxcclxuICAgICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgICAgfSxcclxuICAgICkuaW5zdGFuY2U7XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0UG9sbGluZyA9IHRoaXMuaW5pdFBvbGxpbmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlYXJjaFVzZXIgPSB0aGlzLnNlYXJjaFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzID0gdGhpcy5nZXRDaGF0TWVzc2FnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdEluZm8gPSB0aGlzLmdldENoYXRJbmZvLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZWRpYSA9IHRoaXMuZ2V0Q2hhdE1lZGlhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRGaWxlcyA9IHRoaXMuZ2V0Q2hhdEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRBdWRpb3MgPSB0aGlzLmdldENoYXRBdWRpb3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkTWVzc2FnZSA9IHRoaXMucmVhZE1lc3NhZ2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdHMgPSB0aGlzLmdldENoYXRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9BcmVhID0gdGhpcy5zZW5kTWVzc2FnZVRvQXJlYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFBvbGxpbmcoKSB7XHJcbiAgICBpZiAodGhpcy4jcG9sbGluZ0ludGVydmFsKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRVcGRhdGVzID0gdGhpcy5nZXRVcGRhdGVzO1xyXG4gICAgY29uc3QgcG9sbGluZyA9IHRoaXMuI3BvbGxpbmc7XHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XHJcbiAgICBhc3luYyBmdW5jdGlvbiBpbnRlcnZhbENhbGxiYWNrKCkge1xyXG4gICAgICBjb25zdCB7IHVwZGF0ZXMsIG1ldGEgfSA9IGF3YWl0IGdldFVwZGF0ZXMoeyBsaW1pdDogcG9sbGluZy5saW1pdCB9KTtcclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlJ10gJiYgdXBkYXRlcy51cGRhdGVzKSB7XHJcbiAgICAgICAgdXBkYXRlcy51cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVVc2VyJ10gJiYgdXBkYXRlcy51c2Vycykge1xyXG4gICAgICAgIHVwZGF0ZXMudXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZVVzZXInXS5tYXAoKGNiKSA9PiBjYih1c2VyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXSAmJiB1cGRhdGVzLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgdXBkYXRlcy5tZXNzYWdlcy5tYXAoKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgIGV2ZW50c1sndXBkYXRlTWVzc2FnZSddLm1hcCgoY2IpID0+IGNiKG1lc3NhZ2UpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKGludGVydmFsQ2FsbGJhY2ssIHBvbGxpbmcuaW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW5pdCgpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy4jdG9rZW5HZXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSBhd2FpdCB0aGlzLiN0b2tlbkdldHRlcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSB0aGlzLiN0b2tlbkdldHRlcjtcclxuICAgIH1cclxuICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB0aGlzLiN0b2tlbik7XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zb2NrZXQgPSBpbyh0aGlzLiNiYXNlVVJMLCB7XHJcbiAgICAgICAgcGF0aDogJy9tZXNzZW5nZXInLFxyXG4gICAgICAgIGF1dG9Db25uZWN0OiBmYWxzZSxcclxuICAgICAgICBhdXRoOiAoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIC4uLnJlcXVpcmVkSGVhZGVycyxcclxuICAgICAgICAgICAgdG9rZW46IHRoaXMuI3Rva2VuLmFjY2VzcyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgIGV4dHJhSGVhZGVyczogeyAuLi5yZXF1aXJlZEhlYWRlcnMsIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MgfSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcpIHtcclxuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICB0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBgUG9sbGluZyBzdWNjZXNzZnVsbHkgY29ubmVjdGVkYCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XHJcbiAgICAgIC5jb25uZWN0KClcclxuICAgICAgLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4jZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBzdWNjZXNzZnVsbHkgY29ubmVjdGVkLiBzb2NrZXQuaWQ6ICR7dGhpcy5zb2NrZXQuaWR9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignZGlzY29ubmVjdCcsIChyZWFzb24sIGRldGFpbHMpID0+IHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydkaXNjb25uZWN0J10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiNldmVudHNbJ2Rpc2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICByZWFzb24sXHJcbiAgICAgICAgICAgIGRldGFpbHMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgZGlzY29ubmVjdGVkOiBpZDogJHtcclxuICAgICAgICAgICAgICB0aGlzLnNvY2tldC5pZFxyXG4gICAgICAgICAgICB9LCByZWFzb246ICR7cmVhc29ufSwgZGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShkZXRhaWxzKX1gLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdjb25uZWN0X2Vycm9yJywgKGVycikgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICF0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddIHx8XHJcbiAgICAgICAgICAhQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgdGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXS5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3RlbXBvcmFyeSBmYWlsdXJlLCB0aGUgc29ja2V0IHdpbGwgYXV0b21hdGljYWxseSB0cnkgdG8gcmVjb25uZWN0JyxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuI2V2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10ubWFwKChjYikgPT5cclxuICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBcclxuICAgICAgICAgICAgICAgIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgaW4gdGhhdCBjYXNlLCBzb2NrZXQuY29ubmVjdCgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIGluIG9yZGVyIHRvIHJlY29ubmVjdC5cclxuICAgICAgICAgICAgICAgIEVycm9yOiAke2Vyci5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLm9uKCd1cGRhdGUnLCAodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1sndXBkYXRlJ10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuI2V2ZW50c1sndXBkYXRlJ10ubWFwKChjYikgPT4gY2IodXBkYXRlKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcHVibGljIG9uKGV2ZW50OiBFdiwgY2I6IEV2IGV4dGVuZHMga2V5b2YgSUV2ZW50cyA/IElFdmVudHNbRXZdIDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKTogdGhpcztcclxuICBvbihldmVudDogRXYsIGNiOiBFdiBleHRlbmRzIGtleW9mIElFdmVudHMgPyBJRXZlbnRzW0V2XSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCk6IHRoaXMge1xyXG4gICAgaWYgKHRoaXMuI2V2ZW50c1tldmVudF0pIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XS5wdXNoKGNiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbY2JdO1xyXG4gICAgfVxyXG4gICAgLy8gbGV0IGE6IFJlY29yZDxrZXlvZiBJRXZlbnRzLCAoLi4uYXJnczogYW55KSA9PiB2b2lkPjtcclxuICAgIC8vIGlmICh0aGlzLnNvY2tldCkge1xyXG4gICAgLy8gICB0aGlzLnNvY2tldC5vbihldmVudCwgY2IgYXMgYW55KTtcclxuICAgIC8vIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBldmVudE5hbWVzKCk6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLiNldmVudHMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVycyhldmVudD86IEV2KTogdGhpcyB7XHJcbiAgICBpZiAoZXZlbnQpIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XSA9IFtdO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZXZlbnRzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVMaXN0ZW5lcihldmVudDogRXYsIGNhbGxiYWNrOiBhbnkpOiB0aGlzIHtcclxuICAgIGlmICghdGhpcy4jZXZlbnRzW2V2ZW50XSB8fCAhQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbZXZlbnRdKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGNiKSA9PiBjYi5uYW1lICE9PSBjYWxsYmFjay5uYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VhcmNoIGlkIG9yIHVzZXJuYW1lXHJcbiAgICogQHJldHVybnMge1tdfVxyXG4gICAqL1xyXG4gIHB1YmxpYyBhc3luYyBzZWFyY2hVc2VyKFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XHJcbiAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElVc2VyPj4oXHJcbiAgICAgIGAvdjEvdXNlcnM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChcclxuICAgICAgYC92MS9jaGF0cy8ke21lc3NhZ2UudG8uY2hhdElkfS9tZXNzYWdlc2AsXHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9OZXdVc2VyKG1lc3NhZ2U6IElTZW5kTWVzc2FnZSk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvdXNlcnMvbWVzc2FnZWAsIG1lc3NhZ2UpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9BcmVhKFxyXG4gICAgZmlsdGVyOiBGaWx0ZXJQb2x5Z29uQXJlYSxcclxuICAgIG1lc3NhZ2U6IElTZW5kTWVzc2FnZVRvQXJlYSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2UtYnktYXJlYWAsIHtcclxuICAgICAgbWVzc2FnZSxcclxuICAgICAgZmlsdGVyLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lc3NhZ2VzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxLCBzZWFyY2ggPSAnJyB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyOyBzZWFyY2g/OiBzdHJpbmcgfSA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PihcclxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0SW5mbyhjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChgL3YxL2NoYXRzLyR7Y2hhdElkfWApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZWRpYShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0QXVkaW9zKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRVcGRhdGVzKHtcclxuICAgIGxpbWl0ID0gdGhpcy4jcG9sbGluZy5saW1pdCxcclxuICAgIHBhZ2UgPSAxLFxyXG4gICAgYWxsb3dlZFVwZGF0ZXMgPSBbXSxcclxuICB9OiB7XHJcbiAgICBsaW1pdD86IG51bWJlcjtcclxuICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICBhbGxvd2VkVXBkYXRlcz86IE1lc3NhZ2VUeXBlW107XHJcbiAgfSA9IHt9KTogUHJvbWlzZTx7XHJcbiAgICB1cGRhdGVzOiB7XHJcbiAgICAgIHVwZGF0ZXM6IElPblVwZGF0ZVtdO1xyXG4gICAgICB1c2Vyczoge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIGlzT25saW5lOiBib29sZWFuO1xyXG4gICAgICB9W107XHJcbiAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgcmVhZEF0OiBzdHJpbmc7XHJcbiAgICAgIH1bXTtcclxuICAgIH07XHJcbiAgICBtZXRhOiBhbnk7XHJcbiAgfT4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlXHJcbiAgICAgIC5nZXQoYC92MS91c2Vycy91cGRhdGVzP3BhZ2U9JHtwYWdlfSZsaW1pdD0ke2xpbWl0fSZoYXNoPSR7dGhpcy4jdXBkYXRlc0hhc2h9YClcclxuICAgICAgLmNhdGNoKCgpID0+ICh7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICBtZXRhOiB7XHJcbiAgICAgICAgICAgIGhhc2g6IG51bGwsXHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICAgICAgICBsaW1pdDogMTAwLFxyXG4gICAgICAgICAgICB0b3RhbENvdW50OiAwLFxyXG4gICAgICAgICAgICB0b3RhbFBhZ2VzOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSk7XHJcblxyXG4gICAgdGhpcy4jdXBkYXRlc0hhc2ggPSBkYXRhLm1ldGEuaGFzaCA/IGRhdGEubWV0YS5oYXNoIDogJyc7XHJcblxyXG4gICAgcmV0dXJuIHsgdXBkYXRlczogZGF0YS5kYXRhLCBtZXRhOiBkYXRhLm1ldGEgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyByZWFkTWVzc2FnZShjaGF0SWQ6IHN0cmluZywgbWVzc2FnZTogeyBtZXNzYWdlSWQ6IHN0cmluZzsgbWVzc2FnZVJlYWRBdDogc3RyaW5nIH0pIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wYXRjaChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdHMoXHJcbiAgICB7XHJcbiAgICAgIGxpbWl0ID0gMTAwLFxyXG4gICAgICBwYWdlID0gMSxcclxuICAgICAgdHlwZSA9IG51bGwsXHJcbiAgICB9OiB7XHJcbiAgICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgICBwYWdlPzogbnVtYmVyO1xyXG4gICAgICB0eXBlPzogQ2hhdFR5cGU7XHJcbiAgICB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEsIHR5cGU6IG51bGwgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SUNoYXQ+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KFxyXG4gICAgICBgL3YxL2NoYXRzP2xpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfSR7dHlwZSA/IGAmdHlwZT0ke3R5cGV9YCA6ICcnfWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBpbmcoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGluZycsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNheGlvc0luc3RhbmNlLmdldCgnL2NoZWNrLWhlYWx0aCcpLmNhdGNoKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbmxldCBtZXNzZW5nZXI6IE1lc3NlbmdlcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzZW5nZXIoXHJcbiAgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9ucyxcclxuICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuKSB7XHJcbiAgaWYgKG1lc3Nlbmdlcikge1xyXG4gICAgcmV0dXJuIG1lc3NlbmdlcjtcclxuICB9XHJcblxyXG4gIG1lc3NlbmdlciA9IG5ldyBNZXNzZW5nZXIoY3VzdG9tT3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIG1lc3NlbmdlcjtcclxufVxyXG4iXX0=