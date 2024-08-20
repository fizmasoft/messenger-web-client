var _Messenger_pollingInterval, _Messenger_polling, _Messenger_axiosInstance, _Messenger_events, _Messenger_updatesHash, _Messenger_token;
import { __awaiter, __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { DeviceTypesEnum } from './types';
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
        this.uid = uid;
        __classPrivateFieldSet(this, _Messenger_polling, polling, "f");
        __classPrivateFieldSet(this, _Messenger_events, {}, "f");
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
        this.updateMessages = this.updateMessages.bind(this);
        this.getChats = this.getChats.bind(this);
        this.init(token);
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
                if (events['update']) {
                    updates.map((update) => {
                        events['update'].map((cb) => cb(update));
                    });
                }
            });
        }
        __classPrivateFieldSet(this, _Messenger_pollingInterval, setInterval(intervalCallback, polling.interval), "f");
    }
    init(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof token === 'function') {
                __classPrivateFieldSet(this, _Messenger_token, yield token(), "f");
            }
            else {
                __classPrivateFieldSet(this, _Messenger_token, token, "f");
            }
            localStg.set('messengerToken', __classPrivateFieldGet(this, _Messenger_token, "f"));
            if (__classPrivateFieldGet(this, _Messenger_polling, "f")) {
                this.initPolling();
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
            const data = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/users?search=${search}`);
            return data.data;
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`/v1/chats/${message.to.chatId}/messages`, message);
            return data.data;
        });
    }
    sendMessageToArea(filter, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`/v1/users/message`, message);
            return data;
        });
    }
    getChatMessages(chatId_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1, search = '' } = {
            limit: 20,
            page: 1,
            search: '',
        }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats/${chatId}?search=${search}&limit=${limit}&page=${page}`);
            return data;
        });
    }
    getChatInfo(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/chats/${chatId}`);
            return data;
        });
    }
    getChatMedia(chatId_1) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 } = { limit: 20, page: 1 }) {
            return {};
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
                .get(`/v1/users/updates?page=${page}&limit=${limit}&hash=${__classPrivateFieldGet(this, _Messenger_updatesHash, "f")
            // this.#updatesHash ? this.#updatesHash : ''
            }`)
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
            if (data.meta.hash) {
                __classPrivateFieldSet(this, _Messenger_updatesHash, data.meta.hash, "f");
            }
            else {
                __classPrivateFieldSet(this, _Messenger_updatesHash, '', "f");
            }
            return { updates: data.data, meta: data.meta };
        });
    }
    updateMessages(messages) {
        return []; // kim qachon o'qidi...
    }
    getChats() {
        return __awaiter(this, arguments, void 0, function* ({ limit = 100, page = 1, type = null, } = { limit: 20, page: 1, type: null }) {
            const data = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/v1/chats?limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`);
            return data.data;
        });
    }
    ping() {
        if (this.socket) {
            this.socket.send('hello');
            this.socket.emit('ping', new Date().toISOString());
        }
        else {
            __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get('/check-health').catch();
        }
    }
}
_Messenger_pollingInterval = new WeakMap(), _Messenger_polling = new WeakMap(), _Messenger_axiosInstance = new WeakMap(), _Messenger_events = new WeakMap(), _Messenger_updatesHash = new WeakMap(), _Messenger_token = new WeakMap();
let messenger;
export function getMessenger(customOptions, options = {}) {
    if (messenger) {
        return messenger;
    }
    messenger = new Messenger(customOptions, options);
    return messenger;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sU0FBUyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXhDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixNQUFNLGVBQWUsR0FBRztJQUN0QixlQUFlLEVBQUUsZUFBZSxDQUFDLEdBQUc7SUFDcEMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFNBQVM7UUFDN0IsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsTUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQ2xELENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtZQUNaLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLE1BQU0sT0FBTyxDQUFDLElBQUksY0FBYyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3RFLENBQUMsQ0FBQyxTQUFTLEVBQUUseUNBQXlDO0lBQ3hELDZHQUE2RztJQUM3RyxlQUFlLEVBQUUsVUFBVTtJQUMzQixXQUFXLEVBQUUs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QUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO2FBQU0sQ0FBQztZQUNOLHVCQUFBLElBQUksZ0NBQWUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkQsQ0FBQztJQUNILENBQUM7Q0FDRjs7QUFFRCxJQUFJLFNBQW9CLENBQUM7QUFFekIsTUFBTSxVQUFVLFlBQVksQ0FDMUIsYUFBNEIsRUFDNUIsVUFBbUQsRUFBRTtJQUVyRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlZmF1bHRFdmVudHNNYXAgfSBmcm9tICdAc29ja2V0LmlvL2NvbXBvbmVudC1lbWl0dGVyJztcclxuaW1wb3J0IHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHR5cGUgeyBNYW5hZ2VyT3B0aW9ucywgU29ja2V0LCBTb2NrZXRPcHRpb25zIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IGlvIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHYxIGFzIHV1aWRWMSB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuL2NvbW1vbi9jb25maWcnO1xyXG5pbXBvcnQgeyBDdXN0b21PcHRpb25zLCBEZXZpY2VUeXBlc0VudW0sIElFdmVudHMsIElQb2xsaW5nT3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21BeGlvc0luc3RhbmNlLCBsb2NhbFN0ZyB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY29uc3QgbG9jYWxVaWQgPSBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlckRldmljZVVpZCcpO1xyXG5jb25zdCB1aWQgPSBsb2NhbFVpZCA/IGxvY2FsVWlkIDogdXVpZFYxKCk7XHJcbmxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJywgdWlkKTtcclxuXHJcbmxldCBhcHBWZXJzaW9uID0gJzAuMC4wJztcclxuXHJcbmNvbnN0IHJlcXVpcmVkSGVhZGVycyA9IHtcclxuICAneC1kZXZpY2UtdHlwZSc6IERldmljZVR5cGVzRW51bS5XRUIsXHJcbiAgJ3gtZGV2aWNlLW1vZGVsJzogRU5WLmlzQnJvd3NlclxyXG4gICAgPyBgJHtuYXZpZ2F0b3IudXNlckFnZW50fSB8ICR7bmF2aWdhdG9yLnBsYXRmb3JtfWBcclxuICAgIDogRU5WLmlzTm9kZVxyXG4gICAgPyBgJHtwcm9jZXNzLnBsYXRmb3JtfSB8ICR7cHJvY2Vzcy5hcmNofSB8IE5vZGVqczogJHtwcm9jZXNzLnZlcnNpb259YFxyXG4gICAgOiAnVW5rbm93bicsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGRldmljZSBtb2RlbCBpbmZvXHJcbiAgLy8gJ3gtYXBwLWxhbmcnOiAobGFuZ3VhZ2VHZXR0ZXIoKSB8fCAnVXotTGF0aW4nKSBhcyBJMThuVHlwZS5MYW5nVHlwZSwgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgbGFuZ3VhZ2UgaW5mb1xyXG4gICd4LWFwcC12ZXJzaW9uJzogYXBwVmVyc2lvbixcclxuICAneC1hcHAtdWlkJzogdWlkLFxyXG59O1xyXG5cclxuY2xhc3MgTWVzc2VuZ2VyIHtcclxuICAjcG9sbGluZ0ludGVydmFsOiBOb2RlSlMuVGltZXI7XHJcbiAgI3BvbGxpbmc6IElQb2xsaW5nT3B0aW9ucztcclxuICAjYXhpb3NJbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcclxuICAjZXZlbnRzOiBQYXJ0aWFsPFJlY29yZDxrZXlvZiBJRXZlbnRzLCAoKC4uLmFyZ3M6IGFueSkgPT4gdm9pZClbXT4+O1xyXG4gICN1cGRhdGVzSGFzaDogc3RyaW5nIHwgbnVsbCA9ICcnO1xyXG5cclxuICAjdG9rZW46IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9O1xyXG5cclxuICBwdWJsaWMgdWlkOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IHNvY2tldDogU29ja2V0PERlZmF1bHRFdmVudHNNYXAsIERlZmF1bHRFdmVudHNNYXA+IHwgbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB7XHJcbiAgICAgIGJhc2VVUkwsXHJcbiAgICAgIHRva2VuLFxyXG4gICAgICBwb2xsaW5nID0gbnVsbCxcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIgPSAoKSA9PiAnVXotTGF0aW4nLFxyXG4gICAgICBoZWFkZXJzID0ge30sXHJcbiAgICB9OiBDdXN0b21PcHRpb25zLFxyXG4gICAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbiAgKSB7XHJcbiAgICB0aGlzLnVpZCA9IHVpZDtcclxuICAgIHRoaXMuI3BvbGxpbmcgPSBwb2xsaW5nO1xyXG4gICAgdGhpcy4jZXZlbnRzID0ge307XHJcbiAgICB0aGlzLiNheGlvc0luc3RhbmNlID0gbmV3IEN1c3RvbUF4aW9zSW5zdGFuY2UoXHJcbiAgICAgIHsgYmFzZVVSTDogYmFzZVVSTCwgaGVhZGVyczogcmVxdWlyZWRIZWFkZXJzIH0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWZyZXNoVG9rZW5Vcmw6ICcvdjEvYXV0aC9yZWZyZXNoLXRva2VuJyxcclxuICAgICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgICAgfSxcclxuICAgICkuaW5zdGFuY2U7XHJcblxyXG4gICAgaWYgKHBvbGxpbmcgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zb2NrZXQgPSBpbyhiYXNlVVJMLCB7XHJcbiAgICAgICAgcGF0aDogJy9tZXNzZW5nZXInLFxyXG4gICAgICAgIGF1dGg6IHtcclxuICAgICAgICAgIC4uLnJlcXVpcmVkSGVhZGVycyxcclxuICAgICAgICAgIC4uLmhlYWRlcnMsXHJcbiAgICAgICAgICB0b2tlbjogdGhpcy4jdG9rZW4sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBleHRyYUhlYWRlcnM6IHsgLi4ucmVxdWlyZWRIZWFkZXJzLCAuLi5oZWFkZXJzIH0sXHJcbiAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0UG9sbGluZyA9IHRoaXMuaW5pdFBvbGxpbmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlYXJjaFVzZXIgPSB0aGlzLnNlYXJjaFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzID0gdGhpcy5nZXRDaGF0TWVzc2FnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdEluZm8gPSB0aGlzLmdldENoYXRJbmZvLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZWRpYSA9IHRoaXMuZ2V0Q2hhdE1lZGlhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRGaWxlcyA9IHRoaXMuZ2V0Q2hhdEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRBdWRpb3MgPSB0aGlzLmdldENoYXRBdWRpb3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy51cGRhdGVNZXNzYWdlcyA9IHRoaXMudXBkYXRlTWVzc2FnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdHMgPSB0aGlzLmdldENoYXRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQodG9rZW4pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRQb2xsaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcztcclxuICAgIGNvbnN0IHBvbGxpbmcgPSB0aGlzLiNwb2xsaW5nO1xyXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy4jZXZlbnRzO1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gaW50ZXJ2YWxDYWxsYmFjaygpIHtcclxuICAgICAgY29uc3QgeyB1cGRhdGVzLCBtZXRhIH0gPSBhd2FpdCBnZXRVcGRhdGVzKHsgbGltaXQ6IHBvbGxpbmcubGltaXQgfSk7XHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZSddKSB7XHJcbiAgICAgICAgdXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGUnXS5tYXAoKGNiKSA9PiBjYih1cGRhdGUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKGludGVydmFsQ2FsbGJhY2ssIHBvbGxpbmcuaW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW5pdChcclxuICAgIHRva2VuOlxyXG4gICAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICAgIHwgKCgpID0+IFByb21pc2U8eyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH0+KSxcclxuICApIHtcclxuICAgIGlmICh0eXBlb2YgdG9rZW4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSBhd2FpdCB0b2tlbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSB0b2tlbjtcclxuICAgIH1cclxuICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB0aGlzLiN0b2tlbik7XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcpIHtcclxuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zb2NrZXRcclxuICAgICAgLmNvbm5lY3QoKVxyXG4gICAgICAub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy4jZXZlbnRzLmNvbm5lY3QubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFNvY2tldCBzdWNjZXNzZnVsbHkgY29ubmVjdGVkLiBzb2NrZXQuaWQ6ICR7dGhpcy5zb2NrZXQuaWR9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignZGlzY29ubmVjdCcsIChyZWFzb24sIGRldGFpbHMpID0+IHtcclxuICAgICAgICB0aGlzLiNldmVudHMuZGlzY29ubmVjdC5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICByZWFzb24sXHJcbiAgICAgICAgICAgIGRldGFpbHMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgZGlzY29ubmVjdGVkOiBpZDogJHtcclxuICAgICAgICAgICAgICB0aGlzLnNvY2tldC5pZFxyXG4gICAgICAgICAgICB9LCByZWFzb246ICR7cmVhc29ufSwgZGV0YWlsczogJHtKU09OLnN0cmluZ2lmeShkZXRhaWxzKX1gLFxyXG4gICAgICAgICAgICBzb2NrZXQ6IHRoaXMuc29ja2V0LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdjb25uZWN0X2Vycm9yJywgKGVycikgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNvY2tldC5hY3RpdmUpIHtcclxuICAgICAgICAgIHRoaXMuI2V2ZW50cy5zb2NrZXRDb25uZWN0aW9uRXJyb3IubWFwKChjYikgPT5cclxuICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICd0ZW1wb3JhcnkgZmFpbHVyZSwgdGhlIHNvY2tldCB3aWxsIGF1dG9tYXRpY2FsbHkgdHJ5IHRvIHJlY29ubmVjdCcsXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLiNldmVudHMuc29ja2V0Q29ubmVjdGlvbkVycm9yLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBgXHJcbiAgICAgICAgICAgICAgICB0aGUgY29ubmVjdGlvbiB3YXMgZGVuaWVkIGJ5IHRoZSBzZXJ2ZXJcclxuICAgICAgICAgICAgICAgIGluIHRoYXQgY2FzZSwgc29ja2V0LmNvbm5lY3QoKSBtdXN0IGJlIG1hbnVhbGx5IGNhbGxlZCBpbiBvcmRlciB0byByZWNvbm5lY3QuXHJcbiAgICAgICAgICAgICAgICBFcnJvcjogJHtlcnIubWVzc2FnZX1cclxuICAgICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uPEV2IGV4dGVuZHMgc3RyaW5nID0ga2V5b2YgSUV2ZW50cz4oXHJcbiAgICBldmVudDogRXYsXHJcbiAgICBjYjogRXYgZXh0ZW5kcyBrZXlvZiBJRXZlbnRzID8gSUV2ZW50c1tFdl0gOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsXHJcbiAgKTogdGhpcztcclxuICBvbjxFdiBleHRlbmRzIHN0cmluZyA9IGtleW9mIElFdmVudHM+KGV2ZW50OiBFdiwgY2I6IChkYXRhOiBNZXNzZW5nZXIuSU9uVXBkYXRlKSA9PiB2b2lkKTogdGhpcyB7XHJcbiAgICBpZiAodGhpcy4jZXZlbnRzW2V2ZW50IGFzIGtleW9mIElFdmVudHNdKSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudCBhcyBrZXlvZiBJRXZlbnRzXS5wdXNoKGNiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudCBhcyBrZXlvZiBJRXZlbnRzXSA9IFtjYl07XHJcbiAgICB9XHJcbiAgICAvLyBsZXQgYTogUmVjb3JkPGtleW9mIElFdmVudHMsICguLi5hcmdzOiBhbnkpID0+IHZvaWQ+O1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0Lm9uKGV2ZW50LCBjYiBhcyBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VhcmNoIGlkIG9yIHVzZXJuYW1lXHJcbiAgICogQHJldHVybnMge1tdfVxyXG4gICAqL1xyXG4gIHB1YmxpYyBhc3luYyBzZWFyY2hVc2VyKHNlYXJjaDogc3RyaW5nKTogUHJvbWlzZTxBcGkuTXlBcGlSZXNwb25zZTxBcGlVc2VyTWFuYWdlbWVudC5JVXNlcj4+IHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxBcGkuTXlBcGlSZXNwb25zZTxBcGlVc2VyTWFuYWdlbWVudC5JVXNlcj4+KFxyXG4gICAgICBgL3YxL3VzZXJzP3NlYXJjaD0ke3NlYXJjaH1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5kYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlKFxyXG4gICAgbWVzc2FnZTogQXBpTWVzc2FnZU1hbmFnZW1lbnQuSVNlbmRNZXNzYWdlLFxyXG4gICk6IFByb21pc2U8QXBpLk15QXBpUmVzcG9uc2U8QXBpVXNlck1hbmFnZW1lbnQuSVVzZXI+PiB7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvY2hhdHMvJHttZXNzYWdlLnRvLmNoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5kYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9BcmVhKFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgIHJhZGl1czogbnVtYmVyO1xyXG4gICAgICByaWdodDogbnVtYmVyO1xyXG4gICAgICBsZWZ0OiBudW1iZXI7XHJcbiAgICAgIGNvb3JkaW5hdGVzOiBbbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgICBwb2x5Z29uOiB7XHJcbiAgICAgICAgdHlwZTogJ1BvbHlnb24nIHwgJ1BvaW50JyB8ICdQb2x5Z29uJyB8ICdNdWx0aVBvbHlnb24nIHwgJ0xpbmVTdHJpbmcnO1xyXG4gICAgICAgIGdlb21ldHJ5OiB7XHJcbiAgICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgICBjb29yZGluYXRlczogbnVtYmVyW107XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fTtcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBtZXNzYWdlOiBBcGlNZXNzYWdlTWFuYWdlbWVudC5JU2VuZE1lc3NhZ2UsXHJcbiAgKTogUHJvbWlzZTxBcGkuTXlBcGlSZXNwb25zZTxBcGlVc2VyTWFuYWdlbWVudC5JVXNlcj4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvdXNlcnMvbWVzc2FnZWAsIG1lc3NhZ2UpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZXNzYWdlcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSwgc2VhcmNoID0gJycgfTogeyBsaW1pdD86IG51bWJlcjsgcGFnZT86IG51bWJlcjsgc2VhcmNoPzogc3RyaW5nIH0gPSB7XHJcbiAgICAgIGxpbWl0OiAyMCxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgIH0sXHJcbiAgKTogUHJvbWlzZTxBcGkuTXlBcGlSZXNwb25zZTxBcGlNZXNzYWdlTWFuYWdlbWVudC5JTWVzc2FnZT4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQ8XHJcbiAgICAgIEFwaS5NeUFwaVJlc3BvbnNlPEFwaU1lc3NhZ2VNYW5hZ2VtZW50LklNZXNzYWdlPlxyXG4gICAgPihgL3YxL2NoYXRzLyR7Y2hhdElkfT9zZWFyY2g9JHtzZWFyY2h9JmxpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfWApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRJbmZvKGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx1bmtub3duPiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KGAvY2hhdHMvJHtjaGF0SWR9YCk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lZGlhKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duPiB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEF1ZGlvcyhcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldFVwZGF0ZXMoe1xyXG4gICAgbGltaXQgPSB0aGlzLiNwb2xsaW5nLmxpbWl0LFxyXG4gICAgcGFnZSA9IDEsXHJcbiAgICBhbGxvd2VkVXBkYXRlcyA9IFtdLFxyXG4gIH06IHtcclxuICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgcGFnZT86IG51bWJlcjtcclxuICAgIGFsbG93ZWRVcGRhdGVzPzogTWVzc2VuZ2VyLk1lc3NhZ2VUeXBlW107XHJcbiAgfSA9IHt9KTogUHJvbWlzZTx7IHVwZGF0ZXM6IE1lc3Nlbmdlci5JT25VcGRhdGVbXTsgbWV0YTogYW55IH0+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZVxyXG4gICAgICAuZ2V0KFxyXG4gICAgICAgIGAvdjEvdXNlcnMvdXBkYXRlcz9wYWdlPSR7cGFnZX0mbGltaXQ9JHtsaW1pdH0maGFzaD0ke1xyXG4gICAgICAgICAgdGhpcy4jdXBkYXRlc0hhc2hcclxuICAgICAgICAgIC8vIHRoaXMuI3VwZGF0ZXNIYXNoID8gdGhpcy4jdXBkYXRlc0hhc2ggOiAnJ1xyXG4gICAgICAgIH1gLFxyXG4gICAgICApXHJcbiAgICAgIC5jYXRjaCgoKSA9PiAoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgbWV0YToge1xyXG4gICAgICAgICAgICBoYXNoOiBudWxsLFxyXG4gICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgbGltaXQ6IDEwMCxcclxuICAgICAgICAgICAgdG90YWxDb3VudDogMCxcclxuICAgICAgICAgICAgdG90YWxQYWdlczogMCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSkpO1xyXG5cclxuICAgIGlmIChkYXRhLm1ldGEuaGFzaCkge1xyXG4gICAgICB0aGlzLiN1cGRhdGVzSGFzaCA9IGRhdGEubWV0YS5oYXNoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jdXBkYXRlc0hhc2ggPSAnJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyB1cGRhdGVzOiBkYXRhLmRhdGEsIG1ldGE6IGRhdGEubWV0YSB9O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzOiBbXSkge1xyXG4gICAgcmV0dXJuIFtdOyAvLyBraW0gcWFjaG9uIG8ncWlkaS4uLlxyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRzKFxyXG4gICAge1xyXG4gICAgICBsaW1pdCA9IDEwMCxcclxuICAgICAgcGFnZSA9IDEsXHJcbiAgICAgIHR5cGUgPSBudWxsLFxyXG4gICAgfToge1xyXG4gICAgICBsaW1pdD86IG51bWJlcjtcclxuICAgICAgcGFnZT86IG51bWJlcjtcclxuICAgICAgdHlwZT86IE1lc3Nlbmdlci5DaGF0VHlwZTtcclxuICAgIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSwgdHlwZTogbnVsbCB9LFxyXG4gICkge1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KFxyXG4gICAgICBgL3YxL2NoYXRzP2xpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfSR7dHlwZSA/IGAmdHlwZT0ke3R5cGV9YCA6ICcnfWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcGluZygpIHtcclxuICAgIGlmICh0aGlzLnNvY2tldCkge1xyXG4gICAgICB0aGlzLnNvY2tldC5zZW5kKCdoZWxsbycpO1xyXG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdwaW5nJywgbmV3IERhdGUoKS50b0lTT1N0cmluZygpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KCcvY2hlY2staGVhbHRoJykuY2F0Y2goKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmxldCBtZXNzZW5nZXI6IE1lc3NlbmdlcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzZW5nZXIoXHJcbiAgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9ucyxcclxuICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuKSB7XHJcbiAgaWYgKG1lc3Nlbmdlcikge1xyXG4gICAgcmV0dXJuIG1lc3NlbmdlcjtcclxuICB9XHJcblxyXG4gIG1lc3NlbmdlciA9IG5ldyBNZXNzZW5nZXIoY3VzdG9tT3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIG1lc3NlbmdlcjtcclxufVxyXG4iXX0=