var _Messenger_pollingInterval, _Messenger_polling, _Messenger_axiosInstance, _Messenger_events, _Messenger_updatesHash, _Messenger_token, _Messenger_tokenGetter;
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
        _Messenger_token.set(this, void 0);
        _Messenger_tokenGetter.set(this, void 0);
        this.uid = uid;
        __classPrivateFieldSet(this, _Messenger_polling, polling, "f");
        __classPrivateFieldSet(this, _Messenger_events, {}, "f");
        __classPrivateFieldSet(this, _Messenger_tokenGetter, token, "f");
        __classPrivateFieldSet(this, _Messenger_axiosInstance, new CustomAxiosInstance({ baseURL: baseURL, headers: requiredHeaders }, {
            refreshTokenUrl: '/v1/auth/refresh-token',
            languageGetter,
        }).instance, "f");
        if (polling === null) {
            this.socket = io(baseURL, Object.assign({ path: '/messenger', auth: Object.assign(Object.assign(Object.assign({}, requiredHeaders), headers), { token: __classPrivateFieldGet(this, _Messenger_token, "f") }), extraHeaders: Object.assign(Object.assign({}, requiredHeaders), headers) }, options));
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
            if (__classPrivateFieldGet(this, _Messenger_polling, "f")) {
                this.initPolling();
                __classPrivateFieldGet(this, _Messenger_events, "f").connect.map((cb) => cb({
                    message: `Polling successfully connected`,
                    socket: this.socket,
                }));
                return this;
            }
            return this.socket
                .connect()
                .on('connect', () => {
                __classPrivateFieldGet(this, _Messenger_events, "f").connect.map((cb) => cb({
                    message: `Socket successfully connected. socket.id: ${this.socket.id}`,
                    socket: this.socket,
                }));
            })
                .on('disconnect', (reason, details) => {
                __classPrivateFieldGet(this, _Messenger_events, "f").disconnect.map((cb) => cb({
                    reason,
                    details,
                    message: `Socket disconnected: id: ${this.socket.id}, reason: ${reason}, details: ${JSON.stringify(details)}`,
                    socket: this.socket,
                }));
            })
                .on('connect_error', (err) => {
                if (this.socket.active) {
                    __classPrivateFieldGet(this, _Messenger_events, "f").socketConnectionError.map((cb) => cb({
                        message: 'temporary failure, the socket will automatically try to reconnect',
                        error: err,
                    }));
                }
                else {
                    __classPrivateFieldGet(this, _Messenger_events, "f").socketConnectionError.map((cb) => cb({
                        message: `
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${err.message}
              `,
                        error: err,
                    }));
                }
            });
        });
    }
    on(event, cb) {
        if (__classPrivateFieldGet(this, _Messenger_events, "f")[event]) {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event].push(cb);
        }
        else {
            __classPrivateFieldGet(this, _Messenger_events, "f")[event] = [cb];
        }
        // let a: Record<keyof IEvents, (...args: any) => void>;
        if (this.socket) {
            this.socket.on(event, cb);
        }
        return this;
    }
    /**
     *
     * @param search id or username
     * @returns {[]}
     */
    searchUser(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/users?search=${search}`);
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
_Messenger_pollingInterval = new WeakMap(), _Messenger_polling = new WeakMap(), _Messenger_axiosInstance = new WeakMap(), _Messenger_events = new WeakMap(), _Messenger_updatesHash = new WeakMap(), _Messenger_token = new WeakMap(), _Messenger_tokenGetter = new WeakMap();
let messenger;
export function getMessenger(customOptions, options = {}) {
    if (messenger) {
        return messenger;
    }
    messenger = new Messenger(customOptions, options);
    return messenger;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXhDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixNQUFNLGVBQWUsR0FBRztJQUN0QixlQUFlLEVBQUUsZUFBZSxDQUFDLEdBQUc7SUFDcEMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFNBQVM7UUFDN0IsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsTUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQ2xELENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtZQUNaLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLE1BQU0sT0FBTyxDQUFDLElBQUksY0FBYyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3RFLENBQUMsQ0FBQyxTQUFTLEVBQUUseUNBQXlDO0lBQ3hELDZHQUE2RztJQUM3RyxlQUFlLEVBQUUsVUFBVTtJQUMzQixXQUFXLEVBQUUs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UUFDVCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7YUFBTSxDQUFDO1lBQ04sdUJBQUEsSUFBSSxnQ0FBZSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNuRCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7O0FBRUQsSUFBSSxTQUFvQixDQUFDO0FBRXpCLE1BQU0sVUFBVSxZQUFZLENBQzFCLGFBQTRCLEVBQzVCLFVBQW1ELEVBQUU7SUFFckQsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEZWZhdWx0RXZlbnRzTWFwIH0gZnJvbSAnQHNvY2tldC5pby9jb21wb25lbnQtZW1pdHRlcic7XHJcbmltcG9ydCB7IEF4aW9zSW5zdGFuY2UgfSBmcm9tICdheGlvcyc7XHJcbmltcG9ydCB0eXBlIHsgTWFuYWdlck9wdGlvbnMsIFNvY2tldCwgU29ja2V0T3B0aW9ucyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBpbyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyB2MSBhcyB1dWlkVjEgfSBmcm9tICd1dWlkJztcclxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi9jb21tb24vY29uZmlnJztcclxuaW1wb3J0IHsgTXlBcGlSZXNwb25zZSB9IGZyb20gJy4vdHlwZXMvYXBpJztcclxuaW1wb3J0IHsgRmlsdGVyUG9seWdvbkFyZWEgfSBmcm9tICcuL3R5cGVzL2FwaS9hcmVhLmZpbHRlcic7XHJcbmltcG9ydCB7IENoYXRUeXBlLCBJQ2hhdCB9IGZyb20gJy4vdHlwZXMvYXBpL2NoYXQnO1xyXG5pbXBvcnQgeyBJTWVzc2FnZSwgSVNlbmRNZXNzYWdlLCBJU2VuZE1lc3NhZ2VUb0FyZWEgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlJztcclxuaW1wb3J0IHsgSU9uVXBkYXRlLCBNZXNzYWdlVHlwZSB9IGZyb20gJy4vdHlwZXMvYXBpL21lc3NhZ2UudHlwZXMnO1xyXG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdHlwZXMvYXBpL3VzZXInO1xyXG5pbXBvcnQgeyBDdXN0b21PcHRpb25zLCBEZXZpY2VUeXBlc0VudW0sIElFdmVudHMsIElQb2xsaW5nT3B0aW9ucyB9IGZyb20gJy4vdHlwZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21BeGlvc0luc3RhbmNlLCBsb2NhbFN0ZyB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY29uc3QgbG9jYWxVaWQgPSBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlckRldmljZVVpZCcpO1xyXG5jb25zdCB1aWQgPSBsb2NhbFVpZCA/IGxvY2FsVWlkIDogdXVpZFYxKCk7XHJcbmxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJywgdWlkKTtcclxuXHJcbmxldCBhcHBWZXJzaW9uID0gJzAuMC4wJztcclxuXHJcbmNvbnN0IHJlcXVpcmVkSGVhZGVycyA9IHtcclxuICAneC1kZXZpY2UtdHlwZSc6IERldmljZVR5cGVzRW51bS5XRUIsXHJcbiAgJ3gtZGV2aWNlLW1vZGVsJzogRU5WLmlzQnJvd3NlclxyXG4gICAgPyBgJHtuYXZpZ2F0b3IudXNlckFnZW50fSB8ICR7bmF2aWdhdG9yLnBsYXRmb3JtfWBcclxuICAgIDogRU5WLmlzTm9kZVxyXG4gICAgPyBgJHtwcm9jZXNzLnBsYXRmb3JtfSB8ICR7cHJvY2Vzcy5hcmNofSB8IE5vZGVqczogJHtwcm9jZXNzLnZlcnNpb259YFxyXG4gICAgOiAnVW5rbm93bicsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGRldmljZSBtb2RlbCBpbmZvXHJcbiAgLy8gJ3gtYXBwLWxhbmcnOiAobGFuZ3VhZ2VHZXR0ZXIoKSB8fCAnVXotTGF0aW4nKSBhcyBJMThuVHlwZS5MYW5nVHlwZSwgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgbGFuZ3VhZ2UgaW5mb1xyXG4gICd4LWFwcC12ZXJzaW9uJzogYXBwVmVyc2lvbixcclxuICAneC1hcHAtdWlkJzogdWlkLFxyXG59O1xyXG5cclxuY2xhc3MgTWVzc2VuZ2VyIHtcclxuICAjcG9sbGluZ0ludGVydmFsOiBOb2RlSlMuVGltZXI7XHJcbiAgI3BvbGxpbmc6IElQb2xsaW5nT3B0aW9ucztcclxuICAjYXhpb3NJbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcclxuICAjZXZlbnRzOiBQYXJ0aWFsPFJlY29yZDxrZXlvZiBJRXZlbnRzLCAoKC4uLmFyZ3M6IGFueSkgPT4gdm9pZClbXT4+O1xyXG4gICN1cGRhdGVzSGFzaDogc3RyaW5nID0gJyc7XHJcblxyXG4gICN0b2tlbjogeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH07XHJcbiAgI3Rva2VuR2V0dGVyOlxyXG4gICAgfCB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfVxyXG4gICAgfCAoKCkgPT4gUHJvbWlzZTx7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfT4pO1xyXG5cclxuICBwdWJsaWMgdWlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHNvY2tldDogU29ja2V0PERlZmF1bHRFdmVudHNNYXAsIERlZmF1bHRFdmVudHNNYXA+IHwgbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB7XHJcbiAgICAgIGJhc2VVUkwsXHJcbiAgICAgIHRva2VuLFxyXG4gICAgICBwb2xsaW5nID0gbnVsbCxcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIgPSAoKSA9PiAnVXotTGF0aW4nLFxyXG4gICAgICBoZWFkZXJzID0ge30sXHJcbiAgICB9OiBDdXN0b21PcHRpb25zLFxyXG4gICAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbiAgKSB7XHJcbiAgICB0aGlzLnVpZCA9IHVpZDtcclxuICAgIHRoaXMuI3BvbGxpbmcgPSBwb2xsaW5nO1xyXG4gICAgdGhpcy4jZXZlbnRzID0ge307XHJcbiAgICB0aGlzLiN0b2tlbkdldHRlciA9IHRva2VuO1xyXG4gICAgdGhpcy4jYXhpb3NJbnN0YW5jZSA9IG5ldyBDdXN0b21BeGlvc0luc3RhbmNlKFxyXG4gICAgICB7IGJhc2VVUkw6IGJhc2VVUkwsIGhlYWRlcnM6IHJlcXVpcmVkSGVhZGVycyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgcmVmcmVzaFRva2VuVXJsOiAnL3YxL2F1dGgvcmVmcmVzaC10b2tlbicsXHJcbiAgICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXHJcbiAgICAgIH0sXHJcbiAgICApLmluc3RhbmNlO1xyXG5cclxuICAgIGlmIChwb2xsaW5nID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc29ja2V0ID0gaW8oYmFzZVVSTCwge1xyXG4gICAgICAgIHBhdGg6ICcvbWVzc2VuZ2VyJyxcclxuICAgICAgICBhdXRoOiB7XHJcbiAgICAgICAgICAuLi5yZXF1aXJlZEhlYWRlcnMsXHJcbiAgICAgICAgICAuLi5oZWFkZXJzLFxyXG4gICAgICAgICAgdG9rZW46IHRoaXMuI3Rva2VuLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXh0cmFIZWFkZXJzOiB7IC4uLnJlcXVpcmVkSGVhZGVycywgLi4uaGVhZGVycyB9LFxyXG4gICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdFBvbGxpbmcgPSB0aGlzLmluaXRQb2xsaW5nLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWFyY2hVc2VyID0gdGhpcy5zZWFyY2hVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZXNzYWdlcyA9IHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRJbmZvID0gdGhpcy5nZXRDaGF0SW5mby5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0TWVkaWEgPSB0aGlzLmdldENoYXRNZWRpYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0RmlsZXMgPSB0aGlzLmdldENoYXRGaWxlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0QXVkaW9zID0gdGhpcy5nZXRDaGF0QXVkaW9zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZE1lc3NhZ2UgPSB0aGlzLnJlYWRNZXNzYWdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRzID0gdGhpcy5nZXRDaGF0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZW5kTWVzc2FnZVRvQXJlYSA9IHRoaXMuc2VuZE1lc3NhZ2VUb0FyZWEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRQb2xsaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcztcclxuICAgIGNvbnN0IHBvbGxpbmcgPSB0aGlzLiNwb2xsaW5nO1xyXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy4jZXZlbnRzO1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gaW50ZXJ2YWxDYWxsYmFjaygpIHtcclxuICAgICAgY29uc3QgeyB1cGRhdGVzLCBtZXRhIH0gPSBhd2FpdCBnZXRVcGRhdGVzKHsgbGltaXQ6IHBvbGxpbmcubGltaXQgfSk7XHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZSddICYmIHVwZGF0ZXMudXBkYXRlcykge1xyXG4gICAgICAgIHVwZGF0ZXMudXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGUnXS5tYXAoKGNiKSA9PiBjYih1cGRhdGUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlVXNlciddICYmIHVwZGF0ZXMudXNlcnMpIHtcclxuICAgICAgICB1cGRhdGVzLnVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGVVc2VyJ10ubWFwKChjYikgPT4gY2IodXNlcikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVNZXNzYWdlJ10gJiYgdXBkYXRlcy5tZXNzYWdlcykge1xyXG4gICAgICAgIHVwZGF0ZXMubWVzc2FnZXMubWFwKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXS5tYXAoKGNiKSA9PiBjYihtZXNzYWdlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChpbnRlcnZhbENhbGxiYWNrLCBwb2xsaW5nLmludGVydmFsKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXQoKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuI3Rva2VuR2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gYXdhaXQgdGhpcy4jdG9rZW5HZXR0ZXIoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gdGhpcy4jdG9rZW5HZXR0ZXI7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywgdGhpcy4jdG9rZW4pO1xyXG5cclxuICAgIGlmICh0aGlzLiNwb2xsaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5pdFBvbGxpbmcoKTtcclxuICAgICAgdGhpcy4jZXZlbnRzLmNvbm5lY3QubWFwKChjYikgPT5cclxuICAgICAgICBjYih7XHJcbiAgICAgICAgICBtZXNzYWdlOiBgUG9sbGluZyBzdWNjZXNzZnVsbHkgY29ubmVjdGVkYCxcclxuICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgfSksXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNvY2tldFxyXG4gICAgICAuY29ubmVjdCgpXHJcbiAgICAgIC5vbignY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICB0aGlzLiNldmVudHMuY29ubmVjdC5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBgU29ja2V0IHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQuIHNvY2tldC5pZDogJHt0aGlzLnNvY2tldC5pZH1gLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdkaXNjb25uZWN0JywgKHJlYXNvbiwgZGV0YWlscykgPT4ge1xyXG4gICAgICAgIHRoaXMuI2V2ZW50cy5kaXNjb25uZWN0Lm1hcCgoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIHJlYXNvbixcclxuICAgICAgICAgICAgZGV0YWlscyxcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBkaXNjb25uZWN0ZWQ6IGlkOiAke1xyXG4gICAgICAgICAgICAgIHRoaXMuc29ja2V0LmlkXHJcbiAgICAgICAgICAgIH0sIHJlYXNvbjogJHtyZWFzb259LCBkZXRhaWxzOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbHMpfWAsXHJcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgICAub24oJ2Nvbm5lY3RfZXJyb3InLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0LmFjdGl2ZSkge1xyXG4gICAgICAgICAgdGhpcy4jZXZlbnRzLnNvY2tldENvbm5lY3Rpb25FcnJvci5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3RlbXBvcmFyeSBmYWlsdXJlLCB0aGUgc29ja2V0IHdpbGwgYXV0b21hdGljYWxseSB0cnkgdG8gcmVjb25uZWN0JyxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuI2V2ZW50cy5zb2NrZXRDb25uZWN0aW9uRXJyb3IubWFwKChjYikgPT5cclxuICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBcclxuICAgICAgICAgICAgICAgIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgaW4gdGhhdCBjYXNlLCBzb2NrZXQuY29ubmVjdCgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIGluIG9yZGVyIHRvIHJlY29ubmVjdC5cclxuICAgICAgICAgICAgICAgIEVycm9yOiAke2Vyci5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb248RXYgZXh0ZW5kcyBzdHJpbmcgPSBrZXlvZiBJRXZlbnRzPihcclxuICAgIGV2ZW50OiBFdixcclxuICAgIGNiOiBFdiBleHRlbmRzIGtleW9mIElFdmVudHMgPyBJRXZlbnRzW0V2XSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCxcclxuICApOiB0aGlzO1xyXG4gIG9uPEV2IGV4dGVuZHMga2V5b2YgSUV2ZW50cyA9IGtleW9mIElFdmVudHM+KGV2ZW50OiBFdiwgY2I6IChkYXRhOiBJT25VcGRhdGUpID0+IHZvaWQpOiB0aGlzIHtcclxuICAgIGlmICh0aGlzLiNldmVudHNbZXZlbnRdKSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0ucHVzaChjYik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gW2NiXTtcclxuICAgIH1cclxuICAgIC8vIGxldCBhOiBSZWNvcmQ8a2V5b2YgSUV2ZW50cywgKC4uLmFyZ3M6IGFueSkgPT4gdm9pZD47XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQub24oZXZlbnQsIGNiIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBzZWFyY2ggaWQgb3IgdXNlcm5hbWVcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIHNlYXJjaFVzZXIoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SVVzZXI+PihcclxuICAgICAgYC92MS91c2Vycz9zZWFyY2g9JHtzZWFyY2h9YCxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgc2VuZE1lc3NhZ2UobWVzc2FnZTogSVNlbmRNZXNzYWdlKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoXHJcbiAgICAgIGAvdjEvY2hhdHMvJHttZXNzYWdlLnRvLmNoYXRJZH0vbWVzc2FnZXNgLFxyXG4gICAgICBtZXNzYWdlLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvTmV3VXNlcihtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2VgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZVRvQXJlYShcclxuICAgIGZpbHRlcjogRmlsdGVyUG9seWdvbkFyZWEsXHJcbiAgICBtZXNzYWdlOiBJU2VuZE1lc3NhZ2VUb0FyZWEsXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElVc2VyPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYC92MS91c2Vycy9tZXNzYWdlLWJ5LWFyZWFgLCB7XHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICAgIGZpbHRlcixcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZXNzYWdlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XHJcbiAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElNZXNzYWdlPj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElNZXNzYWdlPj4oXHJcbiAgICAgIGAvdjEvY2hhdHMvJHtjaGF0SWR9L21lc3NhZ2VzP3NlYXJjaD0ke3NlYXJjaH0mbGltaXQ9JHtsaW1pdH0mcGFnZT0ke3BhZ2V9YCxcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEluZm8oY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHVua25vd24+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoYC92MS9jaGF0cy8ke2NoYXRJZH1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0TWVkaWEoXHJcbiAgICBjaGF0SWQ6IHN0cmluZyxcclxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlciB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEgfSxcclxuICApOiBQcm9taXNlPHVua25vd25bXT4ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRGaWxlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEF1ZGlvcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0VXBkYXRlcyh7XHJcbiAgICBsaW1pdCA9IHRoaXMuI3BvbGxpbmcubGltaXQsXHJcbiAgICBwYWdlID0gMSxcclxuICAgIGFsbG93ZWRVcGRhdGVzID0gW10sXHJcbiAgfToge1xyXG4gICAgbGltaXQ/OiBudW1iZXI7XHJcbiAgICBwYWdlPzogbnVtYmVyO1xyXG4gICAgYWxsb3dlZFVwZGF0ZXM/OiBNZXNzYWdlVHlwZVtdO1xyXG4gIH0gPSB7fSk6IFByb21pc2U8e1xyXG4gICAgdXBkYXRlczoge1xyXG4gICAgICB1cGRhdGVzOiBJT25VcGRhdGVbXTtcclxuICAgICAgdXNlcnM6IHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICBpc09ubGluZTogYm9vbGVhbjtcclxuICAgICAgfVtdO1xyXG4gICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIHJlYWRBdDogc3RyaW5nO1xyXG4gICAgICB9W107XHJcbiAgICB9O1xyXG4gICAgbWV0YTogYW55O1xyXG4gIH0+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZVxyXG4gICAgICAuZ2V0KGAvdjEvdXNlcnMvdXBkYXRlcz9wYWdlPSR7cGFnZX0mbGltaXQ9JHtsaW1pdH0maGFzaD0ke3RoaXMuI3VwZGF0ZXNIYXNofWApXHJcbiAgICAgIC5jYXRjaCgoKSA9PiAoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgbWV0YToge1xyXG4gICAgICAgICAgICBoYXNoOiBudWxsLFxyXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwMCxcclxuICAgICAgICAgICAgdG90YWxDb3VudDogMCxcclxuICAgICAgICAgICAgdG90YWxQYWdlczogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSkpO1xyXG5cclxuICAgIHRoaXMuI3VwZGF0ZXNIYXNoID0gZGF0YS5tZXRhLmhhc2ggPyBkYXRhLm1ldGEuaGFzaCA6ICcnO1xyXG5cclxuICAgIHJldHVybiB7IHVwZGF0ZXM6IGRhdGEuZGF0YSwgbWV0YTogZGF0YS5tZXRhIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcmVhZE1lc3NhZ2UoY2hhdElkOiBzdHJpbmcsIG1lc3NhZ2U6IHsgbWVzc2FnZUlkOiBzdHJpbmc7IG1lc3NhZ2VSZWFkQXQ6IHN0cmluZyB9KSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucGF0Y2goYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRzKFxyXG4gICAge1xyXG4gICAgICBsaW1pdCA9IDEwMCxcclxuICAgICAgcGFnZSA9IDEsXHJcbiAgICAgIHR5cGUgPSBudWxsLFxyXG4gICAgfToge1xyXG4gICAgICBsaW1pdD86IG51bWJlcjtcclxuICAgICAgcGFnZT86IG51bWJlcjtcclxuICAgICAgdHlwZT86IENoYXRUeXBlO1xyXG4gICAgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxLCB0eXBlOiBudWxsIH0sXHJcbiAgKTogUHJvbWlzZTxNeUFwaVJlc3BvbnNlPElDaGF0Pj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChcclxuICAgICAgYC92MS9jaGF0cz9saW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX0ke3R5cGUgPyBgJnR5cGU9JHt0eXBlfWAgOiAnJ31gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBwaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3BpbmcnLCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQoJy9jaGVjay1oZWFsdGgnKS5jYXRjaCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgbWVzc2VuZ2VyOiBNZXNzZW5nZXI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2VuZ2VyKFxyXG4gIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbnMsXHJcbiAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbikge1xyXG4gIGlmIChtZXNzZW5nZXIpIHtcclxuICAgIHJldHVybiBtZXNzZW5nZXI7XHJcbiAgfVxyXG5cclxuICBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKGN1c3RvbU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIHJldHVybiBtZXNzZW5nZXI7XHJcbn1cclxuIl19