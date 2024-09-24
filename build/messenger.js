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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixrREFBa0Q7QUFDbEQsbUJBQW1CO0FBQ25CLDZDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsT0FBTztBQUNQLHNCQUFzQjtBQUN0Qix3QkFBd0I7QUFDeEIsUUFBUTtBQUVSLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRztJQUNwQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsU0FBUztRQUM3QixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDbEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQ1osQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsTUFBTSxPQUFPLENBQUMsSUFBSSxjQUFjLE9BQU8s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TSxJQUFJO1FBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBQU0sQ0FBQztZQUNOLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGOztBQUVELElBQUksU0FBb0IsQ0FBQztBQUV6QixNQUFNLFVBQVUsWUFBWSxDQUMxQixhQUE0QixFQUM1QixVQUFtRCxFQUFFO0lBRXJELElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVmYXVsdEV2ZW50c01hcCB9IGZyb20gJ0Bzb2NrZXQuaW8vY29tcG9uZW50LWVtaXR0ZXInO1xuaW1wb3J0IHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCBGb3JtRGF0YSBmcm9tICdmb3JtLWRhdGEnO1xuaW1wb3J0IHR5cGUgeyBNYW5hZ2VyT3B0aW9ucywgU29ja2V0LCBTb2NrZXRPcHRpb25zIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5pbXBvcnQgeyBpbyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuaW1wb3J0IHsgdjEgYXMgdXVpZFYxIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuL2NvbW1vbi9jb25maWcnO1xuaW1wb3J0IHsgTXlBcGlSZXNwb25zZSB9IGZyb20gJy4vdHlwZXMvYXBpJztcbmltcG9ydCB7IEZpbHRlclBvbHlnb25BcmVhIH0gZnJvbSAnLi90eXBlcy9hcGkvYXJlYS5maWx0ZXInO1xuaW1wb3J0IHsgQ2hhdFR5cGUsIElDaGF0IH0gZnJvbSAnLi90eXBlcy9hcGkvY2hhdCc7XG5pbXBvcnQgeyBJTWVzc2FnZSwgSVNlbmRNZXNzYWdlLCBJU2VuZE1lc3NhZ2VUb0FyZWEgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlJztcbmltcG9ydCB7IElPblVwZGF0ZSwgTWVzc2FnZVR5cGUgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlLnR5cGVzJztcbmltcG9ydCB7IElVc2VyIH0gZnJvbSAnLi90eXBlcy9hcGkvdXNlcic7XG5pbXBvcnQgeyBDdXN0b21PcHRpb25zLCBEZXZpY2VUeXBlc0VudW0sIElFdmVudHMsIElQb2xsaW5nT3B0aW9ucyB9IGZyb20gJy4vdHlwZXMvdHlwZXMnO1xuaW1wb3J0IHsgQ3VzdG9tQXhpb3NJbnN0YW5jZSwgbG9jYWxTdGcgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgbG9jYWxVaWQgPSBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlckRldmljZVVpZCcpO1xuY29uc3QgdWlkID0gbG9jYWxVaWQgPyBsb2NhbFVpZCA6IHV1aWRWMSgpO1xubG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJEZXZpY2VVaWQnLCB1aWQpO1xubGV0IGFwcFZlcnNpb24gPSAnMC4wLjAnO1xuXG4vLyByZWFkRmlsZShqb2luKHByb2Nlc3MuY3dkKCkgKyAnL3BhY2thZ2UuanNvbicpKVxuLy8gICAudGhlbigodikgPT4ge1xuLy8gICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHYudG9TdHJpbmcoKSk7XG4vLyAgICAgYXBwVmVyc2lvbiA9IGpzb24udmVyc2lvbjtcbi8vICAgfSlcbi8vICAgLmNhdGNoKChlcnIpID0+IHtcbi8vICAgICBjb25zb2xlLmxvZyhlcnIpO1xuLy8gICB9KTtcblxuY29uc3QgcmVxdWlyZWRIZWFkZXJzID0ge1xuICAneC1kZXZpY2UtdHlwZSc6IERldmljZVR5cGVzRW51bS5XRUIsXG4gICd4LWRldmljZS1tb2RlbCc6IEVOVi5pc0Jyb3dzZXJcbiAgICA/IGAke25hdmlnYXRvci51c2VyQWdlbnR9IHwgJHtuYXZpZ2F0b3IucGxhdGZvcm19YFxuICAgIDogRU5WLmlzTm9kZVxuICAgID8gYCR7cHJvY2Vzcy5wbGF0Zm9ybX0gfCAke3Byb2Nlc3MuYXJjaH0gfCBOb2RlanM6ICR7cHJvY2Vzcy52ZXJzaW9ufWBcbiAgICA6ICdVbmtub3duJywgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgZGV2aWNlIG1vZGVsIGluZm9cbiAgLy8gJ3gtYXBwLWxhbmcnOiAobGFuZ3VhZ2VHZXR0ZXIoKSB8fCAnVXotTGF0aW4nKSBhcyBJMThuVHlwZS5MYW5nVHlwZSwgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgbGFuZ3VhZ2UgaW5mb1xuICAneC1hcHAtdmVyc2lvbic6IGFwcFZlcnNpb24sXG4gICd4LWFwcC11aWQnOiB1aWQsXG59O1xuXG5jbGFzcyBNZXNzZW5nZXI8RXYgZXh0ZW5kcyBzdHJpbmcgPSBrZXlvZiBJRXZlbnRzPiB7XG4gICNwb2xsaW5nSW50ZXJ2YWw6IE5vZGVKUy5UaW1lcjtcbiAgcmVhZG9ubHkgI3BvbGxpbmc6IElQb2xsaW5nT3B0aW9ucztcbiAgcmVhZG9ubHkgI2F4aW9zSW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XG4gICNldmVudHM6IFBhcnRpYWw8UmVjb3JkPEV2LCAoKC4uLmFyZ3M6IGFueSkgPT4gdm9pZClbXT4+O1xuICAjdXBkYXRlc0hhc2g6IHN0cmluZyA9ICcnO1xuICByZWFkb25seSAjYmFzZVVSTDogc3RyaW5nO1xuICAjdG9rZW46IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9O1xuICByZWFkb25seSAjdG9rZW5HZXR0ZXI6XG4gICAgfCB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfVxuICAgIHwgKCgpID0+IFByb21pc2U8eyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH0+KTtcblxuICBwdWJsaWMgdWlkOiBzdHJpbmc7XG4gIHB1YmxpYyBzb2NrZXQ6IFNvY2tldDxEZWZhdWx0RXZlbnRzTWFwLCBEZWZhdWx0RXZlbnRzTWFwPiB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAge1xuICAgICAgYmFzZVVSTCxcbiAgICAgIHRva2VuLFxuICAgICAgcG9sbGluZyA9IG51bGwsXG4gICAgICBsYW5ndWFnZUdldHRlciA9ICgpID0+ICdVei1MYXRpbicsXG4gICAgICBoZWFkZXJzID0ge30sXG4gICAgfTogQ3VzdG9tT3B0aW9ucyxcbiAgICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcbiAgKSB7XG4gICAgdGhpcy51aWQgPSB1aWQ7XG4gICAgdGhpcy4jcG9sbGluZyA9IHBvbGxpbmc7XG4gICAgdGhpcy4jYmFzZVVSTCA9IGJhc2VVUkw7XG4gICAgdGhpcy4jZXZlbnRzID0ge307XG4gICAgdGhpcy4jdG9rZW4gPSB7IGFjY2VzczogJycsIHJlZnJlc2g6ICcnIH07XG4gICAgdGhpcy4jdG9rZW5HZXR0ZXIgPSB0b2tlbjtcbiAgICB0aGlzLiNheGlvc0luc3RhbmNlID0gbmV3IEN1c3RvbUF4aW9zSW5zdGFuY2UoXG4gICAgICB7IGJhc2VVUkw6IGJhc2VVUkwsIGhlYWRlcnM6IHJlcXVpcmVkSGVhZGVycyB9LFxuICAgICAge1xuICAgICAgICByZWZyZXNoVG9rZW5Vcmw6ICcvdjEvYXV0aC9yZWZyZXNoLXRva2VuJyxcbiAgICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXG4gICAgICB9LFxuICAgICkuaW5zdGFuY2U7XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdFBvbGxpbmcgPSB0aGlzLmluaXRQb2xsaW5nLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbiA9IHRoaXMub24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlYXJjaFVzZXIgPSB0aGlzLnNlYXJjaFVzZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldENoYXRNZXNzYWdlcyA9IHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRDaGF0SW5mbyA9IHRoaXMuZ2V0Q2hhdEluZm8uYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldENoYXRNZWRpYSA9IHRoaXMuZ2V0Q2hhdE1lZGlhLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRDaGF0RmlsZXMgPSB0aGlzLmdldENoYXRGaWxlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Q2hhdEF1ZGlvcyA9IHRoaXMuZ2V0Q2hhdEF1ZGlvcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVhZE1lc3NhZ2UgPSB0aGlzLnJlYWRNZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRDaGF0cyA9IHRoaXMuZ2V0Q2hhdHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9BcmVhID0gdGhpcy5zZW5kTWVzc2FnZVRvQXJlYS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHVibGljIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XG4gICAgdGhpcy4jcG9sbGluZ0ludGVydmFsID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0UG9sbGluZygpIHtcbiAgICBpZiAodGhpcy4jcG9sbGluZ0ludGVydmFsKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcztcbiAgICBjb25zdCBwb2xsaW5nID0gdGhpcy4jcG9sbGluZztcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XG4gICAgYXN5bmMgZnVuY3Rpb24gaW50ZXJ2YWxDYWxsYmFjaygpIHtcbiAgICAgIGNvbnN0IHsgdXBkYXRlcywgbWV0YSB9ID0gYXdhaXQgZ2V0VXBkYXRlcyh7IGxpbWl0OiBwb2xsaW5nLmxpbWl0IH0pO1xuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlJ10gJiYgdXBkYXRlcy51cGRhdGVzKSB7XG4gICAgICAgIHVwZGF0ZXMudXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4ge1xuICAgICAgICAgIGV2ZW50c1sndXBkYXRlJ10ubWFwKChjYikgPT4gY2IodXBkYXRlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVVc2VyJ10gJiYgdXBkYXRlcy51c2Vycykge1xuICAgICAgICB1cGRhdGVzLnVzZXJzLm1hcCgodXNlcikgPT4ge1xuICAgICAgICAgIGV2ZW50c1sndXBkYXRlVXNlciddLm1hcCgoY2IpID0+IGNiKHVzZXIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXSAmJiB1cGRhdGVzLm1lc3NhZ2VzKSB7XG4gICAgICAgIHVwZGF0ZXMubWVzc2FnZXMubWFwKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGVNZXNzYWdlJ10ubWFwKChjYikgPT4gY2IobWVzc2FnZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChpbnRlcnZhbENhbGxiYWNrLCBwb2xsaW5nLmludGVydmFsKTtcbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLiN0b2tlbkdldHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy4jdG9rZW4gPSBhd2FpdCB0aGlzLiN0b2tlbkdldHRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiN0b2tlbiA9IHRoaXMuI3Rva2VuR2V0dGVyO1xuICAgIH1cbiAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywgdGhpcy4jdG9rZW4pO1xuXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuc29ja2V0ID0gaW8odGhpcy4jYmFzZVVSTCwge1xuICAgICAgICBwYXRoOiAnL21lc3NlbmdlcicsXG4gICAgICAgIGF1dG9Db25uZWN0OiBmYWxzZSxcbiAgICAgICAgYXV0aDogKGNiKSA9PlxuICAgICAgICAgIGNiKHtcbiAgICAgICAgICAgIC4uLnJlcXVpcmVkSGVhZGVycyxcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MsXG4gICAgICAgICAgfSksXG4gICAgICAgIGV4dHJhSGVhZGVyczogeyAuLi5yZXF1aXJlZEhlYWRlcnMsIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiNwb2xsaW5nKSB7XG4gICAgICB0aGlzLmluaXRQb2xsaW5nKCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcbiAgICAgICAgdGhpcy4jZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cbiAgICAgICAgICBjYih7XG4gICAgICAgICAgICBtZXNzYWdlOiBgUG9sbGluZyBzdWNjZXNzZnVsbHkgY29ubmVjdGVkYCxcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zb2NrZXRcbiAgICAgIC5jb25uZWN0KClcbiAgICAgIC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1snY29ubmVjdCddKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxuICAgICAgICAgIGNiKHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZC4gc29ja2V0LmlkOiAke3RoaXMuc29ja2V0LmlkfWAsXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5vbignZGlzY29ubmVjdCcsIChyZWFzb24sIGRldGFpbHMpID0+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1snZGlzY29ubmVjdCddKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI2V2ZW50c1snZGlzY29ubmVjdCddLm1hcCgoY2IpID0+XG4gICAgICAgICAgY2Ioe1xuICAgICAgICAgICAgcmVhc29uLFxuICAgICAgICAgICAgZGV0YWlscyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgZGlzY29ubmVjdGVkOiBpZDogJHtcbiAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuaWRcbiAgICAgICAgICAgIH0sIHJlYXNvbjogJHtyZWFzb259LCBkZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbHMpfWAsXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC5vbignY29ubmVjdF9lcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICF0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddIHx8XG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc29ja2V0LmFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuI2V2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10ubWFwKChjYikgPT5cbiAgICAgICAgICAgIGNiKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3RlbXBvcmFyeSBmYWlsdXJlLCB0aGUgc29ja2V0IHdpbGwgYXV0b21hdGljYWxseSB0cnkgdG8gcmVjb25uZWN0JyxcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXS5tYXAoKGNiKSA9PlxuICAgICAgICAgICAgY2Ioe1xuICAgICAgICAgICAgICBtZXNzYWdlOiBgXG4gICAgICAgICAgICAgICAgdGhlIGNvbm5lY3Rpb24gd2FzIGRlbmllZCBieSB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgaW4gdGhhdCBjYXNlLCBzb2NrZXQuY29ubmVjdCgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIGluIG9yZGVyIHRvIHJlY29ubmVjdC5cbiAgICAgICAgICAgICAgICBFcnJvcjogJHtlcnIubWVzc2FnZX1cbiAgICAgICAgICAgICAgYCxcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAub24oJ3VwZGF0ZScsICh1cGRhdGUpID0+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1sndXBkYXRlJ10pKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuI2V2ZW50c1sndXBkYXRlJ10ubWFwKChjYikgPT4gY2IodXBkYXRlKSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vIHB1YmxpYyBvbihldmVudDogRXYsIGNiOiBFdiBleHRlbmRzIGtleW9mIElFdmVudHMgPyBJRXZlbnRzW0V2XSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCk6IHRoaXM7XG4gIG9uKGV2ZW50OiBFdiwgY2I6IEV2IGV4dGVuZHMga2V5b2YgSUV2ZW50cyA/IElFdmVudHNbRXZdIDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkKTogdGhpcyB7XG4gICAgaWYgKHRoaXMuI2V2ZW50c1tldmVudF0pIHtcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0ucHVzaChjYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbY2JdO1xuICAgIH1cbiAgICAvLyBsZXQgYTogUmVjb3JkPGtleW9mIElFdmVudHMsICguLi5hcmdzOiBhbnkpID0+IHZvaWQ+O1xuICAgIC8vIGlmICh0aGlzLnNvY2tldCkge1xuICAgIC8vICAgdGhpcy5zb2NrZXQub24oZXZlbnQsIGNiIGFzIGFueSk7XG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgZXZlbnROYW1lcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuI2V2ZW50cyk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50PzogRXYpOiB0aGlzIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiNldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVMaXN0ZW5lcihldmVudDogRXYsIGNhbGxiYWNrOiBhbnkpOiB0aGlzIHtcbiAgICBpZiAoIXRoaXMuI2V2ZW50c1tldmVudF0gfHwgIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzW2V2ZW50XSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLiNldmVudHNbZXZlbnRdLmZpbHRlcigoY2IpID0+IGNiLm5hbWUgIT09IGNhbGxiYWNrLm5hbWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBzZWFyY2ggaWQgb3IgdXNlcm5hbWVcbiAgICogQHJldHVybnMge1tdfVxuICAgKi9cbiAgcHVibGljIGFzeW5jIHNlYXJjaFVzZXIoXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XG4gICAgICBsaW1pdDogMjAsXG4gICAgICBwYWdlOiAxLFxuICAgICAgc2VhcmNoOiAnJyxcbiAgICB9LFxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElVc2VyPj4oXG4gICAgICBgL3YxL3VzZXJzP3NlYXJjaD0ke3NlYXJjaH0mbGltaXQ9JHtsaW1pdH0mcGFnZT0ke3BhZ2V9YCxcbiAgICApO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2VuZE1lc3NhZ2UoXG4gICAgY2hhdElkOiBzdHJpbmcsXG4gICAgbWVzc2FnZTogSVNlbmRNZXNzYWdlIHwgRm9ybURhdGEsXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2VuZE1lc3NhZ2VUb05ld1VzZXIobWVzc2FnZTogSVNlbmRNZXNzYWdlKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvdXNlcnMvbWVzc2FnZWAsIG1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2VuZE1lc3NhZ2VUb0FyZWEoXG4gICAgZmlsdGVyOiBGaWx0ZXJQb2x5Z29uQXJlYSxcbiAgICBtZXNzYWdlOiBJU2VuZE1lc3NhZ2VUb0FyZWEsXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2UtYnktYXJlYWAsIHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBmaWx0ZXIsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0TWVzc2FnZXMoXG4gICAgY2hhdElkOiBzdHJpbmcsXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XG4gICAgICBsaW1pdDogMjAsXG4gICAgICBwYWdlOiAxLFxuICAgICAgc2VhcmNoOiAnJyxcbiAgICB9LFxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElNZXNzYWdlPj4oXG4gICAgICBgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlcz9zZWFyY2g9JHtzZWFyY2h9JmxpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfWAsXG4gICAgKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYXRJbmZvKGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx1bmtub3duPiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChgL3YxL2NoYXRzLyR7Y2hhdElkfWApO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lZGlhKFxuICAgIGNoYXRJZDogc3RyaW5nLFxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlciB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEgfSxcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxuICAgIGNoYXRJZDogc3RyaW5nLFxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlciB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEgfSxcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEF1ZGlvcyhcbiAgICBjaGF0SWQ6IHN0cmluZyxcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFVwZGF0ZXMoe1xuICAgIGxpbWl0ID0gdGhpcy4jcG9sbGluZy5saW1pdCxcbiAgICBwYWdlID0gMSxcbiAgICBhbGxvd2VkVXBkYXRlcyA9IFtdLFxuICB9OiB7XG4gICAgbGltaXQ/OiBudW1iZXI7XG4gICAgcGFnZT86IG51bWJlcjtcbiAgICBhbGxvd2VkVXBkYXRlcz86IE1lc3NhZ2VUeXBlW107XG4gIH0gPSB7fSk6IFByb21pc2U8e1xuICAgIHVwZGF0ZXM6IHtcbiAgICAgIHVwZGF0ZXM6IElPblVwZGF0ZVtdO1xuICAgICAgdXNlcnM6IHtcbiAgICAgICAgX2lkOiBzdHJpbmc7XG4gICAgICAgIGlzT25saW5lOiBib29sZWFuO1xuICAgICAgfVtdO1xuICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgX2lkOiBzdHJpbmc7XG4gICAgICAgIHJlYWRBdDogc3RyaW5nO1xuICAgICAgfVtdO1xuICAgIH07XG4gICAgbWV0YTogYW55O1xuICB9PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlXG4gICAgICAuZ2V0KGAvdjEvdXNlcnMvdXBkYXRlcz9wYWdlPSR7cGFnZX0mbGltaXQ9JHtsaW1pdH0maGFzaD0ke3RoaXMuI3VwZGF0ZXNIYXNofWApXG4gICAgICAuY2F0Y2goKCkgPT4gKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgIGhhc2g6IG51bGwsXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgICAgICAgIGxpbWl0OiAxMDAsXG4gICAgICAgICAgICB0b3RhbENvdW50OiAwLFxuICAgICAgICAgICAgdG90YWxQYWdlczogMCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuXG4gICAgdGhpcy4jdXBkYXRlc0hhc2ggPSBkYXRhLm1ldGEuaGFzaCA/IGRhdGEubWV0YS5oYXNoIDogJyc7XG5cbiAgICByZXR1cm4geyB1cGRhdGVzOiBkYXRhLmRhdGEsIG1ldGE6IGRhdGEubWV0YSB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlYWRNZXNzYWdlKGNoYXRJZDogc3RyaW5nLCBtZXNzYWdlOiB7IG1lc3NhZ2VJZDogc3RyaW5nOyBtZXNzYWdlUmVhZEF0OiBzdHJpbmcgfSkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wYXRjaChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYXRzKFxuICAgIHtcbiAgICAgIGxpbWl0ID0gMTAwLFxuICAgICAgcGFnZSA9IDEsXG4gICAgICBzZWFyY2gsXG4gICAgICB0eXBlID0gbnVsbCxcbiAgICB9OiB7XG4gICAgICBsaW1pdD86IG51bWJlcjtcbiAgICAgIHBhZ2U/OiBudW1iZXI7XG4gICAgICBzZWFyY2g/OiBzdHJpbmc7XG4gICAgICB0eXBlPzogQ2hhdFR5cGU7XG4gICAgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxLCB0eXBlOiBudWxsIH0sXG4gICk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJQ2hhdD4+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KFxuICAgICAgYC92MS9jaGF0cz9zZWFyY2g9JHtzZWFyY2h9JmxpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfSR7dHlwZSA/IGAmdHlwZT0ke3R5cGV9YCA6ICcnfWAsXG4gICAgKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIHBpbmcoKSB7XG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdwaW5nJywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoJy9jaGVjay1oZWFsdGgnKS5jYXRjaCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5sZXQgbWVzc2VuZ2VyOiBNZXNzZW5nZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzZW5nZXIoXG4gIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbnMsXG4gIG9wdGlvbnM6IFBhcnRpYWw8TWFuYWdlck9wdGlvbnMgJiBTb2NrZXRPcHRpb25zPiA9IHt9LFxuKSB7XG4gIGlmIChtZXNzZW5nZXIpIHtcbiAgICByZXR1cm4gbWVzc2VuZ2VyO1xuICB9XG5cbiAgbWVzc2VuZ2VyID0gbmV3IE1lc3NlbmdlcihjdXN0b21PcHRpb25zLCBvcHRpb25zKTtcbiAgcmV0dXJuIG1lc3Nlbmdlcjtcbn1cbiJdfQ==