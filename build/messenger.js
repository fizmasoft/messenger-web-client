var _Messenger_pollingInterval, _Messenger_polling, _Messenger_axiosInstance, _Messenger_events, _Messenger_updatesHash, _Messenger_token;
import { __awaiter, __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { green, red } from 'ansis';
import { io } from 'socket.io-client';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from './common/config';
import { DeviceTypesEnum } from './types';
import { localStg, CustomAxiosInstance } from './utils';
const localUid = localStg.get('uid');
const uid = localUid ? localUid : uuidV1();
localStg.set('uid', uid);
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
            localStg.set('token', __classPrivateFieldGet(this, _Messenger_token, "f"));
            if (__classPrivateFieldGet(this, _Messenger_polling, "f")) {
                this.initPolling();
                return this;
            }
            return this.socket
                .connect()
                .on('connect', () => {
                console.log(green(`Socket successfully connected. socket.id: ${this.socket.id}`));
            })
                .on('disconnect', (reason, details) => {
                console.log(red(`Socket disconnected: id: ${this.socket.id}, reason: ${reason}, details: ${JSON.stringify(details)}`));
            })
                .on('connect_error', (err) => {
                if (this.socket.active) {
                    console.log(red('temporary failure, the socket will automatically try to reconnect'));
                }
                else {
                    // the connection was denied by the server
                    // in that case, `socket.connect()` must be manually called in order to reconnect
                    console.log(red(`
                the connection was denied by the server
                in that case, socket.connect() must be manually called in order to reconnect.
                Error: ${err.message}
              `));
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
            const data = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/users?search=${search}`);
            return data.data;
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").post(`v1/chats/${message.to.chatId}/messages`, message);
            return data.data;
        });
    }
    getChatMessages(chatId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1, search = '' }) {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/chats/${chatId}?search=${search}&limit=${limit}&page=${page}`);
            return data;
        });
    }
    getChatInfo(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/chats/${chatId}`);
            return data;
        });
    }
    getChatMedia(chatId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 }) {
            return {};
        });
    }
    getChatFiles(chatId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 }) {
            return [];
        });
    }
    getChatAudios(chatId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (chatId, { limit = 20, page = 1 }) {
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
    getChats(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 100, page = 1, type = 'private', }) {
            const data = yield __classPrivateFieldGet(this, _Messenger_axiosInstance, "f").get(`/chats?limit=${limit}&page=${page}${type ? `&type=${type}` : ''}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBR25DLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sU0FBUyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDM0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFekIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBRXpCLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLGVBQWUsRUFBRSxlQUFlLENBQUMsR0FBRztJQUNwQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsU0FBUztRQUM3QixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDbEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQ1osQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsTUFBTSxPQUFPLENBQUMsSUFBSSxjQUFjLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDdEUsQ0FBQyxDQUFDLFNBQVMsRUFBRSx5Q0FBeUM7SUFD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SSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQzthQUFNLENBQUM7WUFDTix1QkFBQSxJQUFJLGdDQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25ELENBQUM7SUFDSCxDQUFDO0NBQ0Y7O0FBRUQsSUFBSSxTQUFvQixDQUFDO0FBRXpCLE1BQU0sVUFBVSxZQUFZLENBQzFCLGFBQTRCLEVBQzVCLFVBQW1ELEVBQUU7SUFFckQsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNkLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEZWZhdWx0RXZlbnRzTWFwIH0gZnJvbSAnQHNvY2tldC5pby9jb21wb25lbnQtZW1pdHRlcic7XHJcbmltcG9ydCB7IGdyZWVuLCByZWQgfSBmcm9tICdhbnNpcyc7XHJcbmltcG9ydCB7IEF4aW9zSW5zdGFuY2UgfSBmcm9tICdheGlvcyc7XHJcbmltcG9ydCB0eXBlIHsgTWFuYWdlck9wdGlvbnMsIFNvY2tldCwgU29ja2V0T3B0aW9ucyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyBpbyB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xyXG5pbXBvcnQgeyB2MSBhcyB1dWlkVjEgfSBmcm9tICd1dWlkJztcclxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi9jb21tb24vY29uZmlnJztcclxuaW1wb3J0IHsgQ3VzdG9tT3B0aW9ucywgRGV2aWNlVHlwZXNFbnVtLCBJRXZlbnRzLCBJUG9sbGluZ09wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgbG9jYWxTdGcsIEN1c3RvbUF4aW9zSW5zdGFuY2UgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmNvbnN0IGxvY2FsVWlkID0gbG9jYWxTdGcuZ2V0KCd1aWQnKTtcclxuY29uc3QgdWlkID0gbG9jYWxVaWQgPyBsb2NhbFVpZCA6IHV1aWRWMSgpO1xyXG5sb2NhbFN0Zy5zZXQoJ3VpZCcsIHVpZCk7XHJcblxyXG5sZXQgYXBwVmVyc2lvbiA9ICcwLjAuMCc7XHJcblxyXG5jb25zdCByZXF1aXJlZEhlYWRlcnMgPSB7XHJcbiAgJ3gtZGV2aWNlLXR5cGUnOiBEZXZpY2VUeXBlc0VudW0uV0VCLFxyXG4gICd4LWRldmljZS1tb2RlbCc6IEVOVi5pc0Jyb3dzZXJcclxuICAgID8gYCR7bmF2aWdhdG9yLnVzZXJBZ2VudH0gfCAke25hdmlnYXRvci5wbGF0Zm9ybX1gXHJcbiAgICA6IEVOVi5pc05vZGVcclxuICAgID8gYCR7cHJvY2Vzcy5wbGF0Zm9ybX0gfCAke3Byb2Nlc3MuYXJjaH0gfCBOb2RlanM6ICR7cHJvY2Vzcy52ZXJzaW9ufWBcclxuICAgIDogJ1Vua25vd24nLCAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBkZXZpY2UgbW9kZWwgaW5mb1xyXG4gIC8vICd4LWFwcC1sYW5nJzogKGxhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgSTE4blR5cGUuTGFuZ1R5cGUsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuICAneC1hcHAtdmVyc2lvbic6IGFwcFZlcnNpb24sXHJcbiAgJ3gtYXBwLXVpZCc6IHVpZCxcclxufTtcclxuXHJcbmNsYXNzIE1lc3NlbmdlciB7XHJcbiAgI3BvbGxpbmdJbnRlcnZhbDogTm9kZUpTLlRpbWVyO1xyXG4gICNwb2xsaW5nOiBJUG9sbGluZ09wdGlvbnM7XHJcbiAgI2F4aW9zSW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XHJcbiAgI2V2ZW50czogUGFydGlhbDxSZWNvcmQ8a2V5b2YgSUV2ZW50cywgKCguLi5hcmdzOiBhbnkpID0+IHZvaWQpW10+PjtcclxuICAjdXBkYXRlc0hhc2g6IHN0cmluZyB8IG51bGwgPSAnJztcclxuXHJcbiAgI3Rva2VuOiB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfTtcclxuXHJcbiAgcHVibGljIHVpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyByZWFkb25seSBzb2NrZXQ6IFNvY2tldDxEZWZhdWx0RXZlbnRzTWFwLCBEZWZhdWx0RXZlbnRzTWFwPiB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAge1xyXG4gICAgICBiYXNlVVJMLFxyXG4gICAgICB0b2tlbixcclxuICAgICAgcG9sbGluZyA9IG51bGwsXHJcbiAgICAgIGxhbmd1YWdlR2V0dGVyID0gKCkgPT4gJ1V6LUxhdGluJyxcclxuICAgICAgaGVhZGVycyA9IHt9LFxyXG4gICAgfTogQ3VzdG9tT3B0aW9ucyxcclxuICAgIG9wdGlvbnM6IFBhcnRpYWw8TWFuYWdlck9wdGlvbnMgJiBTb2NrZXRPcHRpb25zPiA9IHt9LFxyXG4gICkge1xyXG4gICAgdGhpcy51aWQgPSB1aWQ7XHJcbiAgICB0aGlzLiNwb2xsaW5nID0gcG9sbGluZztcclxuICAgIHRoaXMuI2V2ZW50cyA9IHt9O1xyXG4gICAgdGhpcy4jYXhpb3NJbnN0YW5jZSA9IG5ldyBDdXN0b21BeGlvc0luc3RhbmNlKFxyXG4gICAgICB7IGJhc2VVUkw6IGJhc2VVUkwsIGhlYWRlcnM6IHJlcXVpcmVkSGVhZGVycyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgcmVmcmVzaFRva2VuVXJsOiAnL3YxL2F1dGgvcmVmcmVzaC10b2tlbicsXHJcbiAgICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXHJcbiAgICAgIH0sXHJcbiAgICApLmluc3RhbmNlO1xyXG5cclxuICAgIGlmIChwb2xsaW5nID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc29ja2V0ID0gaW8oYmFzZVVSTCwge1xyXG4gICAgICAgIHBhdGg6ICcvbWVzc2VuZ2VyJyxcclxuICAgICAgICBhdXRoOiB7XHJcbiAgICAgICAgICAuLi5yZXF1aXJlZEhlYWRlcnMsXHJcbiAgICAgICAgICAuLi5oZWFkZXJzLFxyXG4gICAgICAgICAgdG9rZW46IHRoaXMuI3Rva2VuLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXh0cmFIZWFkZXJzOiB7IC4uLnJlcXVpcmVkSGVhZGVycywgLi4uaGVhZGVycyB9LFxyXG4gICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdFBvbGxpbmcgPSB0aGlzLmluaXRQb2xsaW5nLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWFyY2hVc2VyID0gdGhpcy5zZWFyY2hVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZXNzYWdlcyA9IHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRJbmZvID0gdGhpcy5nZXRDaGF0SW5mby5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0TWVkaWEgPSB0aGlzLmdldENoYXRNZWRpYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0RmlsZXMgPSB0aGlzLmdldENoYXRGaWxlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0QXVkaW9zID0gdGhpcy5nZXRDaGF0QXVkaW9zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudXBkYXRlTWVzc2FnZXMgPSB0aGlzLnVwZGF0ZU1lc3NhZ2VzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRzID0gdGhpcy5nZXRDaGF0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0KHRva2VuKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbG9zZSgpIHtcclxuICAgIGlmICh0aGlzLnNvY2tldCkge1xyXG4gICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNwb2xsaW5nSW50ZXJ2YWwpO1xyXG4gICAgdGhpcy4jcG9sbGluZ0ludGVydmFsID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0UG9sbGluZygpIHtcclxuICAgIGlmICh0aGlzLiNwb2xsaW5nSW50ZXJ2YWwpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLiNwb2xsaW5nSW50ZXJ2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXM7XHJcbiAgICBjb25zdCBwb2xsaW5nID0gdGhpcy4jcG9sbGluZztcclxuICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMuI2V2ZW50cztcclxuICAgIGFzeW5jIGZ1bmN0aW9uIGludGVydmFsQ2FsbGJhY2soKSB7XHJcbiAgICAgIGNvbnN0IHsgdXBkYXRlcywgbWV0YSB9ID0gYXdhaXQgZ2V0VXBkYXRlcyh7IGxpbWl0OiBwb2xsaW5nLmxpbWl0IH0pO1xyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGUnXSkge1xyXG4gICAgICAgIHVwZGF0ZXMubWFwKCh1cGRhdGUpID0+IHtcclxuICAgICAgICAgIGV2ZW50c1sndXBkYXRlJ10ubWFwKChjYikgPT4gY2IodXBkYXRlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChpbnRlcnZhbENhbGxiYWNrLCBwb2xsaW5nLmludGVydmFsKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXQoXHJcbiAgICB0b2tlbjpcclxuICAgICAgfCB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfVxyXG4gICAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9PiksXHJcbiAgKSB7XHJcbiAgICBpZiAodHlwZW9mIHRva2VuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gYXdhaXQgdG9rZW4oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gdG9rZW47XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0Zy5zZXQoJ3Rva2VuJywgdGhpcy4jdG9rZW4pO1xyXG5cclxuICAgIGlmICh0aGlzLiNwb2xsaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5pdFBvbGxpbmcoKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XHJcbiAgICAgIC5jb25uZWN0KClcclxuICAgICAgLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGdyZWVuKGBTb2NrZXQgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZC4gc29ja2V0LmlkOiAke3RoaXMuc29ja2V0LmlkfWApKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdkaXNjb25uZWN0JywgKHJlYXNvbiwgZGV0YWlscykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgcmVkKFxyXG4gICAgICAgICAgICBgU29ja2V0IGRpc2Nvbm5lY3RlZDogaWQ6ICR7XHJcbiAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuaWRcclxuICAgICAgICAgICAgfSwgcmVhc29uOiAke3JlYXNvbn0sIGRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoZGV0YWlscyl9YCxcclxuICAgICAgICAgICksXHJcbiAgICAgICAgKTtcclxuICAgICAgfSlcclxuICAgICAgLm9uKCdjb25uZWN0X2Vycm9yJywgKGVycikgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnNvY2tldC5hY3RpdmUpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlZCgndGVtcG9yYXJ5IGZhaWx1cmUsIHRoZSBzb2NrZXQgd2lsbCBhdXRvbWF0aWNhbGx5IHRyeSB0byByZWNvbm5lY3QnKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxyXG4gICAgICAgICAgLy8gaW4gdGhhdCBjYXNlLCBgc29ja2V0LmNvbm5lY3QoKWAgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgaW4gb3JkZXIgdG8gcmVjb25uZWN0XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICAgICAgcmVkKFxyXG4gICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIHRoZSBjb25uZWN0aW9uIHdhcyBkZW5pZWQgYnkgdGhlIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgaW4gdGhhdCBjYXNlLCBzb2NrZXQuY29ubmVjdCgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIGluIG9yZGVyIHRvIHJlY29ubmVjdC5cclxuICAgICAgICAgICAgICAgIEVycm9yOiAke2Vyci5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb248RXYgZXh0ZW5kcyBzdHJpbmcgPSBrZXlvZiBJRXZlbnRzPihcclxuICAgIGV2ZW50OiBFdixcclxuICAgIGNiOiBFdiBleHRlbmRzIGtleW9mIElFdmVudHMgPyBJRXZlbnRzW0V2XSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCxcclxuICApOiB0aGlzO1xyXG4gIG9uPEV2IGV4dGVuZHMgc3RyaW5nID0ga2V5b2YgSUV2ZW50cz4oZXZlbnQ6IEV2LCBjYjogKGRhdGE6IE1lc3Nlbmdlci5JT25VcGRhdGUpID0+IHZvaWQpOiB0aGlzIHtcclxuICAgIGlmICh0aGlzLiNldmVudHNbZXZlbnQgYXMga2V5b2YgSUV2ZW50c10pIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50IGFzIGtleW9mIElFdmVudHNdLnB1c2goY2IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50IGFzIGtleW9mIElFdmVudHNdID0gW2NiXTtcclxuICAgIH1cclxuICAgIC8vIGxldCBhOiBSZWNvcmQ8a2V5b2YgSUV2ZW50cywgKC4uLmFyZ3M6IGFueSkgPT4gdm9pZD47XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQub24oZXZlbnQsIGNiIGFzIGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBzZWFyY2ggaWQgb3IgdXNlcm5hbWVcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgcHVibGljIGFzeW5jIHNlYXJjaFVzZXIoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPEFwaS5NeUFwaVJlc3BvbnNlPEFwaVVzZXJNYW5hZ2VtZW50LklVc2VyPj4ge1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PEFwaS5NeUFwaVJlc3BvbnNlPEFwaVVzZXJNYW5hZ2VtZW50LklVc2VyPj4oXHJcbiAgICAgIGAvdXNlcnM/c2VhcmNoPSR7c2VhcmNofWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhLmRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgc2VuZE1lc3NhZ2UoXHJcbiAgICBtZXNzYWdlOiBBcGlNZXNzYWdlTWFuYWdlbWVudC5JU2VuZE1lc3NhZ2UsXHJcbiAgKTogUHJvbWlzZTxBcGkuTXlBcGlSZXNwb25zZTxBcGlVc2VyTWFuYWdlbWVudC5JVXNlcj4+IHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLnBvc3QoYHYxL2NoYXRzLyR7bWVzc2FnZS50by5jaGF0SWR9L21lc3NhZ2VzYCwgbWVzc2FnZSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGEuZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0TWVzc2FnZXMoXHJcbiAgICBjaGF0SWQ6IHN0cmluZyxcclxuICAgIHsgbGltaXQgPSAyMCwgcGFnZSA9IDEsIHNlYXJjaCA9ICcnIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXI7IHNlYXJjaD86IHN0cmluZyB9LFxyXG4gICk6IFByb21pc2U8QXBpLk15QXBpUmVzcG9uc2U8QXBpTWVzc2FnZU1hbmFnZW1lbnQuSU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PFxyXG4gICAgICBBcGkuTXlBcGlSZXNwb25zZTxBcGlNZXNzYWdlTWFuYWdlbWVudC5JTWVzc2FnZT5cclxuICAgID4oYC9jaGF0cy8ke2NoYXRJZH0/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0SW5mbyhjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChgL2NoYXRzLyR7Y2hhdElkfWApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZWRpYShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duPiB7XHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSxcclxuICApOiBQcm9taXNlPHVua25vd24+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0QXVkaW9zKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSxcclxuICApOiBQcm9taXNlPHVua25vd24+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRVcGRhdGVzKHtcclxuICAgIGxpbWl0ID0gdGhpcy4jcG9sbGluZy5saW1pdCxcclxuICAgIHBhZ2UgPSAxLFxyXG4gICAgYWxsb3dlZFVwZGF0ZXMgPSBbXSxcclxuICB9OiB7XHJcbiAgICBsaW1pdD86IG51bWJlcjtcclxuICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICBhbGxvd2VkVXBkYXRlcz86IE1lc3Nlbmdlci5NZXNzYWdlVHlwZVtdO1xyXG4gIH0gPSB7fSk6IFByb21pc2U8eyB1cGRhdGVzOiBNZXNzZW5nZXIuSU9uVXBkYXRlW107IG1ldGE6IGFueSB9PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2VcclxuICAgICAgLmdldChcclxuICAgICAgICBgL3YxL3VzZXJzL3VwZGF0ZXM/cGFnZT0ke3BhZ2V9JmxpbWl0PSR7bGltaXR9Jmhhc2g9JHtcclxuICAgICAgICAgIHRoaXMuI3VwZGF0ZXNIYXNoXHJcbiAgICAgICAgICAvLyB0aGlzLiN1cGRhdGVzSGFzaCA/IHRoaXMuI3VwZGF0ZXNIYXNoIDogJydcclxuICAgICAgICB9YCxcclxuICAgICAgKVxyXG4gICAgICAuY2F0Y2goKCkgPT4gKHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgIG1ldGE6IHtcclxuICAgICAgICAgICAgaGFzaDogbnVsbCxcclxuICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgICAgICAgIGxpbWl0OiAxMDAsXHJcbiAgICAgICAgICAgIHRvdGFsQ291bnQ6IDAsXHJcbiAgICAgICAgICAgIHRvdGFsUGFnZXM6IDAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pKTtcclxuXHJcbiAgICBpZiAoZGF0YS5tZXRhLmhhc2gpIHtcclxuICAgICAgdGhpcy4jdXBkYXRlc0hhc2ggPSBkYXRhLm1ldGEuaGFzaDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI3VwZGF0ZXNIYXNoID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgdXBkYXRlczogZGF0YS5kYXRhLCBtZXRhOiBkYXRhLm1ldGEgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1cGRhdGVNZXNzYWdlcyhtZXNzYWdlczogW10pIHtcclxuICAgIHJldHVybiBbXTsgLy8ga2ltIHFhY2hvbiBvJ3FpZGkuLi5cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0cyh7XHJcbiAgICBsaW1pdCA9IDEwMCxcclxuICAgIHBhZ2UgPSAxLFxyXG4gICAgdHlwZSA9ICdwcml2YXRlJyxcclxuICB9OiB7XHJcbiAgICBsaW1pdD86IG51bWJlcjtcclxuICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICB0eXBlPzogTWVzc2VuZ2VyLkNoYXRUeXBlO1xyXG4gIH0pIHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChcclxuICAgICAgYC9jaGF0cz9saW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX0ke3R5cGUgPyBgJnR5cGU9JHt0eXBlfWAgOiAnJ31gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5kYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBpbmcoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuc2VuZCgnaGVsbG8nKTtcclxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGluZycsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNheGlvc0luc3RhbmNlLmdldCgnL2NoZWNrLWhlYWx0aCcpLmNhdGNoKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgbWVzc2VuZ2VyOiBNZXNzZW5nZXI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWVzc2VuZ2VyKFxyXG4gIGN1c3RvbU9wdGlvbnM6IEN1c3RvbU9wdGlvbnMsXHJcbiAgb3B0aW9uczogUGFydGlhbDxNYW5hZ2VyT3B0aW9ucyAmIFNvY2tldE9wdGlvbnM+ID0ge30sXHJcbikge1xyXG4gIGlmIChtZXNzZW5nZXIpIHtcclxuICAgIHJldHVybiBtZXNzZW5nZXI7XHJcbiAgfVxyXG5cclxuICBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKGN1c3RvbU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gIHJldHVybiBtZXNzZW5nZXI7XHJcbn1cclxuIl19