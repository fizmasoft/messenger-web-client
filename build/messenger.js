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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixrREFBa0Q7QUFDbEQsbUJBQW1CO0FBQ25CLDZDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsT0FBTztBQUNQLHNCQUFzQjtBQUN0Qix3QkFBd0I7QUFDeEIsUUFBUTtBQUVSLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRztJQUNwQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsU0FBUztRQUM3QixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDbEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQ1osQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsTUFBTSxPQUFPLENBQUMsSUFBSSxjQUFjLE9BQU8s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SSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQzthQUFNLENBQUM7WUFDTix1QkFBQSxJQUFJLGdDQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25ELENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjs7QUFFRCxJQUFJLFNBQW9CLENBQUM7QUFFekIsTUFBTSxVQUFVLFlBQVksQ0FDMUIsYUFBNEIsRUFDNUIsVUFBbUQsRUFBRTtJQUVyRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlZmF1bHRFdmVudHNNYXAgfSBmcm9tICdAc29ja2V0LmlvL2NvbXBvbmVudC1lbWl0dGVyJztcbmltcG9ydCB7IEF4aW9zSW5zdGFuY2UgfSBmcm9tICdheGlvcyc7XG5pbXBvcnQgRm9ybURhdGEgZnJvbSAnZm9ybS1kYXRhJztcbmltcG9ydCB0eXBlIHsgTWFuYWdlck9wdGlvbnMsIFNvY2tldCwgU29ja2V0T3B0aW9ucyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuaW1wb3J0IHsgaW8gfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCB7IHYxIGFzIHV1aWRWMSB9IGZyb20gJ3V1aWQnO1xuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi9jb21tb24vY29uZmlnJztcbmltcG9ydCB7IE15QXBpUmVzcG9uc2UgfSBmcm9tICcuL3R5cGVzL2FwaSc7XG5pbXBvcnQgeyBGaWx0ZXJQb2x5Z29uQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL2FyZWEuZmlsdGVyJztcbmltcG9ydCB7IENoYXRUeXBlLCBJQ2hhdCB9IGZyb20gJy4vdHlwZXMvYXBpL2NoYXQnO1xuaW1wb3J0IHsgSU1lc3NhZ2UsIElTZW5kTWVzc2FnZSwgSVNlbmRNZXNzYWdlVG9BcmVhIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZSc7XG5pbXBvcnQgeyBJT25VcGRhdGUsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZS50eXBlcyc7XG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdHlwZXMvYXBpL3VzZXInO1xuaW1wb3J0IHsgQ3VzdG9tT3B0aW9ucywgRGV2aWNlVHlwZXNFbnVtLCBJRXZlbnRzLCBJUG9sbGluZ09wdGlvbnMgfSBmcm9tICcuL3R5cGVzL3R5cGVzJztcbmltcG9ydCB7IEN1c3RvbUF4aW9zSW5zdGFuY2UsIGxvY2FsU3RnIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGxvY2FsVWlkID0gbG9jYWxTdGcuZ2V0KCdtZXNzZW5nZXJEZXZpY2VVaWQnKTtcbmNvbnN0IHVpZCA9IGxvY2FsVWlkID8gbG9jYWxVaWQgOiB1dWlkVjEoKTtcbmxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJywgdWlkKTtcbmxldCBhcHBWZXJzaW9uID0gJzAuMC4wJztcblxuLy8gcmVhZEZpbGUoam9pbihwcm9jZXNzLmN3ZCgpICsgJy9wYWNrYWdlLmpzb24nKSlcbi8vICAgLnRoZW4oKHYpID0+IHtcbi8vICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZSh2LnRvU3RyaW5nKCkpO1xuLy8gICAgIGFwcFZlcnNpb24gPSBqc29uLnZlcnNpb247XG4vLyAgIH0pXG4vLyAgIC5jYXRjaCgoZXJyKSA9PiB7XG4vLyAgICAgY29uc29sZS5sb2coZXJyKTtcbi8vICAgfSk7XG5cbmNvbnN0IHJlcXVpcmVkSGVhZGVycyA9IHtcbiAgJ3gtZGV2aWNlLXR5cGUnOiBEZXZpY2VUeXBlc0VudW0uV0VCLFxuICAneC1kZXZpY2UtbW9kZWwnOiBFTlYuaXNCcm93c2VyXG4gICAgPyBgJHtuYXZpZ2F0b3IudXNlckFnZW50fSB8ICR7bmF2aWdhdG9yLnBsYXRmb3JtfWBcbiAgICA6IEVOVi5pc05vZGVcbiAgICA/IGAke3Byb2Nlc3MucGxhdGZvcm19IHwgJHtwcm9jZXNzLmFyY2h9IHwgTm9kZWpzOiAke3Byb2Nlc3MudmVyc2lvbn1gXG4gICAgOiAnVW5rbm93bicsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGRldmljZSBtb2RlbCBpbmZvXG4gIC8vICd4LWFwcC1sYW5nJzogKGxhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgSTE4blR5cGUuTGFuZ1R5cGUsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cbiAgJ3gtYXBwLXZlcnNpb24nOiBhcHBWZXJzaW9uLFxuICAneC1hcHAtdWlkJzogdWlkLFxufTtcblxuY2xhc3MgTWVzc2VuZ2VyPEV2IGV4dGVuZHMgc3RyaW5nID0ga2V5b2YgSUV2ZW50cz4ge1xuICAjcG9sbGluZ0ludGVydmFsOiBOb2RlSlMuVGltZXI7XG4gIHJlYWRvbmx5ICNwb2xsaW5nOiBJUG9sbGluZ09wdGlvbnM7XG4gIHJlYWRvbmx5ICNheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xuICAjZXZlbnRzOiBQYXJ0aWFsPFJlY29yZDxFdiwgKCguLi5hcmdzOiBhbnkpID0+IHZvaWQpW10+PjtcbiAgI3VwZGF0ZXNIYXNoOiBzdHJpbmcgPSAnJztcbiAgcmVhZG9ubHkgI2Jhc2VVUkw6IHN0cmluZztcbiAgI3Rva2VuOiB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfTtcbiAgcmVhZG9ubHkgI3Rva2VuR2V0dGVyOlxuICAgIHwgeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH1cbiAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XG5cbiAgcHVibGljIHVpZDogc3RyaW5nO1xuICBwdWJsaWMgc29ja2V0OiBTb2NrZXQ8RGVmYXVsdEV2ZW50c01hcCwgRGVmYXVsdEV2ZW50c01hcD4gfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHtcbiAgICAgIGJhc2VVUkwsXG4gICAgICB0b2tlbixcbiAgICAgIHBvbGxpbmcgPSBudWxsLFxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIgPSAoKSA9PiAnVXotTGF0aW4nLFxuICAgICAgaGVhZGVycyA9IHt9LFxuICAgIH06IEN1c3RvbU9wdGlvbnMsXG4gICAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXG4gICkge1xuICAgIHRoaXMudWlkID0gdWlkO1xuICAgIHRoaXMuI3BvbGxpbmcgPSBwb2xsaW5nO1xuICAgIHRoaXMuI2Jhc2VVUkwgPSBiYXNlVVJMO1xuICAgIHRoaXMuI2V2ZW50cyA9IHt9O1xuICAgIHRoaXMuI3Rva2VuID0geyBhY2Nlc3M6ICcnLCByZWZyZXNoOiAnJyB9O1xuICAgIHRoaXMuI3Rva2VuR2V0dGVyID0gdG9rZW47XG4gICAgdGhpcy4jYXhpb3NJbnN0YW5jZSA9IG5ldyBDdXN0b21BeGlvc0luc3RhbmNlKFxuICAgICAgeyBiYXNlVVJMOiBiYXNlVVJMLCBoZWFkZXJzOiByZXF1aXJlZEhlYWRlcnMgfSxcbiAgICAgIHtcbiAgICAgICAgcmVmcmVzaFRva2VuVXJsOiAnL3YxL2F1dGgvcmVmcmVzaC10b2tlbicsXG4gICAgICAgIGxhbmd1YWdlR2V0dGVyLFxuICAgICAgfSxcbiAgICApLmluc3RhbmNlO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXRQb2xsaW5nID0gdGhpcy5pbml0UG9sbGluZy5iaW5kKHRoaXMpO1xuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZWFyY2hVc2VyID0gdGhpcy5zZWFyY2hVc2VyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRDaGF0TWVzc2FnZXMgPSB0aGlzLmdldENoYXRNZXNzYWdlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Q2hhdEluZm8gPSB0aGlzLmdldENoYXRJbmZvLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRDaGF0TWVkaWEgPSB0aGlzLmdldENoYXRNZWRpYS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Q2hhdEZpbGVzID0gdGhpcy5nZXRDaGF0RmlsZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldENoYXRBdWRpb3MgPSB0aGlzLmdldENoYXRBdWRpb3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRNZXNzYWdlID0gdGhpcy5yZWFkTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Q2hhdHMgPSB0aGlzLmdldENoYXRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZW5kTWVzc2FnZVRvQXJlYSA9IHRoaXMuc2VuZE1lc3NhZ2VUb0FyZWEuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNwb2xsaW5nSW50ZXJ2YWwpO1xuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFBvbGxpbmcoKSB7XG4gICAgaWYgKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCkge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNwb2xsaW5nSW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXM7XG4gICAgY29uc3QgcG9sbGluZyA9IHRoaXMuI3BvbGxpbmc7XG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy4jZXZlbnRzO1xuICAgIGFzeW5jIGZ1bmN0aW9uIGludGVydmFsQ2FsbGJhY2soKSB7XG4gICAgICBjb25zdCB7IHVwZGF0ZXMsIG1ldGEgfSA9IGF3YWl0IGdldFVwZGF0ZXMoeyBsaW1pdDogcG9sbGluZy5saW1pdCB9KTtcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZSddICYmIHVwZGF0ZXMudXBkYXRlcykge1xuICAgICAgICB1cGRhdGVzLnVwZGF0ZXMubWFwKCh1cGRhdGUpID0+IHtcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlVXNlciddICYmIHVwZGF0ZXMudXNlcnMpIHtcbiAgICAgICAgdXBkYXRlcy51c2Vycy5tYXAoKHVzZXIpID0+IHtcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZVVzZXInXS5tYXAoKGNiKSA9PiBjYih1c2VyKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVNZXNzYWdlJ10gJiYgdXBkYXRlcy5tZXNzYWdlcykge1xuICAgICAgICB1cGRhdGVzLm1lc3NhZ2VzLm1hcCgobWVzc2FnZSkgPT4ge1xuICAgICAgICAgIGV2ZW50c1sndXBkYXRlTWVzc2FnZSddLm1hcCgoY2IpID0+IGNiKG1lc3NhZ2UpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4jcG9sbGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoaW50ZXJ2YWxDYWxsYmFjaywgcG9sbGluZy5pbnRlcnZhbCk7XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy4jdG9rZW5HZXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuI3Rva2VuID0gYXdhaXQgdGhpcy4jdG9rZW5HZXR0ZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jdG9rZW4gPSB0aGlzLiN0b2tlbkdldHRlcjtcbiAgICB9XG4gICAgbG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJUb2tlbicsIHRoaXMuI3Rva2VuKTtcblxuICAgIGlmICh0aGlzLiNwb2xsaW5nID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNvY2tldCA9IGlvKHRoaXMuI2Jhc2VVUkwsIHtcbiAgICAgICAgcGF0aDogJy9tZXNzZW5nZXInLFxuICAgICAgICBhdXRvQ29ubmVjdDogZmFsc2UsXG4gICAgICAgIGF1dGg6IChjYikgPT5cbiAgICAgICAgICBjYih7XG4gICAgICAgICAgICAuLi5yZXF1aXJlZEhlYWRlcnMsXG4gICAgICAgICAgICB0b2tlbjogdGhpcy4jdG9rZW4uYWNjZXNzLFxuICAgICAgICAgIH0pLFxuICAgICAgICBleHRyYUhlYWRlcnM6IHsgLi4ucmVxdWlyZWRIZWFkZXJzLCB0b2tlbjogdGhpcy4jdG9rZW4uYWNjZXNzIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy4jcG9sbGluZykge1xuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydjb25uZWN0J10pKSB7XG4gICAgICAgIHRoaXMuI2V2ZW50c1snY29ubmVjdCddLm1hcCgoY2IpID0+XG4gICAgICAgICAgY2Ioe1xuICAgICAgICAgICAgbWVzc2FnZTogYFBvbGxpbmcgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZGAsXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XG4gICAgICAuY29ubmVjdCgpXG4gICAgICAub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Nvbm5lY3QnXSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4jZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cbiAgICAgICAgICBjYih7XG4gICAgICAgICAgICBtZXNzYWdlOiBgU29ja2V0IHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQuIHNvY2tldC5pZDogJHt0aGlzLnNvY2tldC5pZH1gLFxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2Rpc2Nvbm5lY3QnLCAocmVhc29uLCBkZXRhaWxzKSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ2Rpc2Nvbm5lY3QnXSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNldmVudHNbJ2Rpc2Nvbm5lY3QnXS5tYXAoKGNiKSA9PlxuICAgICAgICAgIGNiKHtcbiAgICAgICAgICAgIHJlYXNvbixcbiAgICAgICAgICAgIGRldGFpbHMsXG4gICAgICAgICAgICBtZXNzYWdlOiBgU29ja2V0IGRpc2Nvbm5lY3RlZDogaWQ6ICR7XG4gICAgICAgICAgICAgIHRoaXMuc29ja2V0LmlkXG4gICAgICAgICAgICB9LCByZWFzb246ICR7cmVhc29ufSwgZGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShkZXRhaWxzKX1gLFxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2Nvbm5lY3RfZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXSB8fFxuICAgICAgICAgICFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10pXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldC5hY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddLm1hcCgoY2IpID0+XG4gICAgICAgICAgICBjYih7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICd0ZW1wb3JhcnkgZmFpbHVyZSwgdGhlIHNvY2tldCB3aWxsIGF1dG9tYXRpY2FsbHkgdHJ5IHRvIHJlY29ubmVjdCcsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuI2V2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10ubWFwKChjYikgPT5cbiAgICAgICAgICAgIGNiKHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogYFxuICAgICAgICAgICAgICAgIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgIGluIHRoYXQgY2FzZSwgc29ja2V0LmNvbm5lY3QoKSBtdXN0IGJlIG1hbnVhbGx5IGNhbGxlZCBpbiBvcmRlciB0byByZWNvbm5lY3QuXG4gICAgICAgICAgICAgICAgRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9XG4gICAgICAgICAgICAgIGAsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCd1cGRhdGUnLCAodXBkYXRlKSA9PiB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ3VwZGF0ZSddKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiNldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBwdWJsaWMgb24oZXZlbnQ6IEV2LCBjYjogRXYgZXh0ZW5kcyBrZXlvZiBJRXZlbnRzID8gSUV2ZW50c1tFdl0gOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpOiB0aGlzO1xuICBvbihldmVudDogRXYsIGNiOiBFdiBleHRlbmRzIGtleW9mIElFdmVudHMgPyBJRXZlbnRzW0V2XSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCk6IHRoaXMge1xuICAgIGlmICh0aGlzLiNldmVudHNbZXZlbnRdKSB7XG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdLnB1c2goY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gW2NiXTtcbiAgICB9XG4gICAgLy8gbGV0IGE6IFJlY29yZDxrZXlvZiBJRXZlbnRzLCAoLi4uYXJnczogYW55KSA9PiB2b2lkPjtcbiAgICAvLyBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAvLyAgIHRoaXMuc29ja2V0Lm9uKGV2ZW50LCBjYiBhcyBhbnkpO1xuICAgIC8vIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGV2ZW50TmFtZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLiNldmVudHMpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVycyhldmVudD86IEV2KTogdGhpcyB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gW107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4jZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6IEV2LCBjYWxsYmFjazogYW55KTogdGhpcyB7XG4gICAgaWYgKCF0aGlzLiNldmVudHNbZXZlbnRdIHx8ICFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1tldmVudF0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4jZXZlbnRzW2V2ZW50XS5maWx0ZXIoKGNiKSA9PiBjYi5uYW1lICE9PSBjYWxsYmFjay5uYW1lKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gc2VhcmNoIGlkIG9yIHVzZXJuYW1lXG4gICAqIEByZXR1cm5zIHtbXX1cbiAgICovXG4gIHB1YmxpYyBhc3luYyBzZWFyY2hVc2VyKFxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEsIHNlYXJjaCA9ICcnIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXI7IHNlYXJjaD86IHN0cmluZyB9ID0ge1xuICAgICAgbGltaXQ6IDIwLFxuICAgICAgcGFnZTogMSxcbiAgICAgIHNlYXJjaDogJycsXG4gICAgfSxcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQ8TXlBcGlSZXNwb25zZTxJVXNlcj4+KFxuICAgICAgYC92MS91c2Vycz9zZWFyY2g9JHtzZWFyY2h9JmxpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfWAsXG4gICAgKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlKFxuICAgIGNoYXRJZDogc3RyaW5nLFxuICAgIG1lc3NhZ2U6IElTZW5kTWVzc2FnZSB8IEZvcm1EYXRhLFxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9OZXdVc2VyKG1lc3NhZ2U6IElTZW5kTWVzc2FnZSk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2VgLCBtZXNzYWdlKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9BcmVhKFxuICAgIGZpbHRlcjogRmlsdGVyUG9seWdvbkFyZWEsXG4gICAgbWVzc2FnZTogSVNlbmRNZXNzYWdlVG9BcmVhLFxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS91c2Vycy9tZXNzYWdlLWJ5LWFyZWFgLCB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgZmlsdGVyLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lc3NhZ2VzKFxuICAgIGNoYXRJZDogc3RyaW5nLFxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEsIHNlYXJjaCA9ICcnIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXI7IHNlYXJjaD86IHN0cmluZyB9ID0ge1xuICAgICAgbGltaXQ6IDIwLFxuICAgICAgcGFnZTogMSxcbiAgICAgIHNlYXJjaDogJycsXG4gICAgfSxcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElNZXNzYWdlPj4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQ8TXlBcGlSZXNwb25zZTxJTWVzc2FnZT4+KFxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxuICAgICk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0SW5mbyhjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cy8ke2NoYXRJZH1gKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYXRNZWRpYShcbiAgICBjaGF0SWQ6IHN0cmluZyxcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYXRGaWxlcyhcbiAgICBjaGF0SWQ6IHN0cmluZyxcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYXRBdWRpb3MoXG4gICAgY2hhdElkOiBzdHJpbmcsXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxuICApOiBQcm9taXNlPHVua25vd25bXT4ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRVcGRhdGVzKHtcbiAgICBsaW1pdCA9IHRoaXMuI3BvbGxpbmcubGltaXQsXG4gICAgcGFnZSA9IDEsXG4gICAgYWxsb3dlZFVwZGF0ZXMgPSBbXSxcbiAgfToge1xuICAgIGxpbWl0PzogbnVtYmVyO1xuICAgIHBhZ2U/OiBudW1iZXI7XG4gICAgYWxsb3dlZFVwZGF0ZXM/OiBNZXNzYWdlVHlwZVtdO1xuICB9ID0ge30pOiBQcm9taXNlPHtcbiAgICB1cGRhdGVzOiB7XG4gICAgICB1cGRhdGVzOiBJT25VcGRhdGVbXTtcbiAgICAgIHVzZXJzOiB7XG4gICAgICAgIF9pZDogc3RyaW5nO1xuICAgICAgICBpc09ubGluZTogYm9vbGVhbjtcbiAgICAgIH1bXTtcbiAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgIF9pZDogc3RyaW5nO1xuICAgICAgICByZWFkQXQ6IHN0cmluZztcbiAgICAgIH1bXTtcbiAgICB9O1xuICAgIG1ldGE6IGFueTtcbiAgfT4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZVxuICAgICAgLmdldChgL3YxL3VzZXJzL3VwZGF0ZXM/cGFnZT0ke3BhZ2V9JmxpbWl0PSR7bGltaXR9Jmhhc2g9JHt0aGlzLiN1cGRhdGVzSGFzaH1gKVxuICAgICAgLmNhdGNoKCgpID0+ICh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgICBoYXNoOiBudWxsLFxuICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXG4gICAgICAgICAgICBsaW1pdDogMTAwLFxuICAgICAgICAgICAgdG90YWxDb3VudDogMCxcbiAgICAgICAgICAgIHRvdGFsUGFnZXM6IDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgIHRoaXMuI3VwZGF0ZXNIYXNoID0gZGF0YS5tZXRhLmhhc2ggPyBkYXRhLm1ldGEuaGFzaCA6ICcnO1xuXG4gICAgcmV0dXJuIHsgdXBkYXRlczogZGF0YS5kYXRhLCBtZXRhOiBkYXRhLm1ldGEgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZWFkTWVzc2FnZShjaGF0SWQ6IHN0cmluZywgbWVzc2FnZTogeyBtZXNzYWdlSWQ6IHN0cmluZzsgbWVzc2FnZVJlYWRBdDogc3RyaW5nIH0pIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucGF0Y2goYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0cyhcbiAgICB7XG4gICAgICBsaW1pdCA9IDEwMCxcbiAgICAgIHBhZ2UgPSAxLFxuICAgICAgdHlwZSA9IG51bGwsXG4gICAgfToge1xuICAgICAgbGltaXQ/OiBudW1iZXI7XG4gICAgICBwYWdlPzogbnVtYmVyO1xuICAgICAgdHlwZT86IENoYXRUeXBlO1xuICAgIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSwgdHlwZTogbnVsbCB9LFxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SUNoYXQ+PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChcbiAgICAgIGAvdjEvY2hhdHM/bGltaXQ9JHtsaW1pdH0mcGFnZT0ke3BhZ2V9JHt0eXBlID8gYCZ0eXBlPSR7dHlwZX1gIDogJyd9YCxcbiAgICApO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwdWJsaWMgcGluZygpIHtcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3BpbmcnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNheGlvc0luc3RhbmNlLmdldCgnL2NoZWNrLWhlYWx0aCcpLmNhdGNoKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbmxldCBtZXNzZW5nZXI6IE1lc3NlbmdlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lc3NlbmdlcihcbiAgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9ucyxcbiAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXG4pIHtcbiAgaWYgKG1lc3Nlbmdlcikge1xuICAgIHJldHVybiBtZXNzZW5nZXI7XG4gIH1cblxuICBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKGN1c3RvbU9wdGlvbnMsIG9wdGlvbnMpO1xuICByZXR1cm4gbWVzc2VuZ2VyO1xufVxuIl19