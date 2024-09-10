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
_Messenger_pollingInterval = new WeakMap(), _Messenger_polling = new WeakMap(), _Messenger_axiosInstance = new WeakMap(), _Messenger_events = new WeakMap(), _Messenger_updatesHash = new WeakMap(), _Messenger_baseURL = new WeakMap(), _Messenger_token = new WeakMap(), _Messenger_tokenGetter = new WeakMap();
let messenger;
export function getMessenger(customOptions, options = {}) {
    if (messenger) {
        return messenger;
    }
    messenger = new Messenger(customOptions, options);
    return messenger;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXhDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixNQUFNLGVBQWUsR0FBRztJQUN0QixlQUFlLEVBQUUsZUFBZSxDQUFDLEdBQUc7SUFDcEMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFNBQVM7UUFDN0IsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsTUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQ2xELENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtZQUNaLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLE1BQU0sT0FBTyxDQUFDLElBQUksY0FBYyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3RFLENBQUMsQ0FBQyxTQUFTLEVBQUUseUNBQXlDO0lBQ3hELDZHQUE2RztJQUM3RyxlQUFlLEVBQUUsVUFBVTtJQUMzQixXQUFXLEVBQUUs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QztDQUNGOztBQUVELElBQUksU0FBb0IsQ0FBQztBQUV6QixNQUFNLFVBQVUsWUFBWSxDQUMxQixhQUE0QixFQUM1QixVQUFtRCxFQUFFO0lBRXJELElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVmYXVsdEV2ZW50c01hcCB9IGZyb20gJ0Bzb2NrZXQuaW8vY29tcG9uZW50LWVtaXR0ZXInO1xyXG5pbXBvcnQgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgdHlwZSB7IE1hbmFnZXJPcHRpb25zLCBTb2NrZXQsIFNvY2tldE9wdGlvbnMgfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgaW8gfSBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcclxuaW1wb3J0IHsgdjEgYXMgdXVpZFYxIH0gZnJvbSAndXVpZCc7XHJcbmltcG9ydCB7IEVOViB9IGZyb20gJy4vY29tbW9uL2NvbmZpZyc7XHJcbmltcG9ydCB7IE15QXBpUmVzcG9uc2UgfSBmcm9tICcuL3R5cGVzL2FwaSc7XHJcbmltcG9ydCB7IEZpbHRlclBvbHlnb25BcmVhIH0gZnJvbSAnLi90eXBlcy9hcGkvYXJlYS5maWx0ZXInO1xyXG5pbXBvcnQgeyBDaGF0VHlwZSwgSUNoYXQgfSBmcm9tICcuL3R5cGVzL2FwaS9jaGF0JztcclxuaW1wb3J0IHsgSU1lc3NhZ2UsIElTZW5kTWVzc2FnZSwgSVNlbmRNZXNzYWdlVG9BcmVhIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZSc7XHJcbmltcG9ydCB7IElPblVwZGF0ZSwgTWVzc2FnZVR5cGUgfSBmcm9tICcuL3R5cGVzL2FwaS9tZXNzYWdlLnR5cGVzJztcclxuaW1wb3J0IHsgSVVzZXIgfSBmcm9tICcuL3R5cGVzL2FwaS91c2VyJztcclxuaW1wb3J0IHsgQ3VzdG9tT3B0aW9ucywgRGV2aWNlVHlwZXNFbnVtLCBJRXZlbnRzLCBJUG9sbGluZ09wdGlvbnMgfSBmcm9tICcuL3R5cGVzL3R5cGVzJztcclxuaW1wb3J0IHsgQ3VzdG9tQXhpb3NJbnN0YW5jZSwgbG9jYWxTdGcgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmNvbnN0IGxvY2FsVWlkID0gbG9jYWxTdGcuZ2V0KCdtZXNzZW5nZXJEZXZpY2VVaWQnKTtcclxuY29uc3QgdWlkID0gbG9jYWxVaWQgPyBsb2NhbFVpZCA6IHV1aWRWMSgpO1xyXG5sb2NhbFN0Zy5zZXQoJ21lc3NlbmdlckRldmljZVVpZCcsIHVpZCk7XHJcblxyXG5sZXQgYXBwVmVyc2lvbiA9ICcwLjAuMCc7XHJcblxyXG5jb25zdCByZXF1aXJlZEhlYWRlcnMgPSB7XHJcbiAgJ3gtZGV2aWNlLXR5cGUnOiBEZXZpY2VUeXBlc0VudW0uV0VCLFxyXG4gICd4LWRldmljZS1tb2RlbCc6IEVOVi5pc0Jyb3dzZXJcclxuICAgID8gYCR7bmF2aWdhdG9yLnVzZXJBZ2VudH0gfCAke25hdmlnYXRvci5wbGF0Zm9ybX1gXHJcbiAgICA6IEVOVi5pc05vZGVcclxuICAgID8gYCR7cHJvY2Vzcy5wbGF0Zm9ybX0gfCAke3Byb2Nlc3MuYXJjaH0gfCBOb2RlanM6ICR7cHJvY2Vzcy52ZXJzaW9ufWBcclxuICAgIDogJ1Vua25vd24nLCAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBkZXZpY2UgbW9kZWwgaW5mb1xyXG4gIC8vICd4LWFwcC1sYW5nJzogKGxhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgSTE4blR5cGUuTGFuZ1R5cGUsIC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuICAneC1hcHAtdmVyc2lvbic6IGFwcFZlcnNpb24sXHJcbiAgJ3gtYXBwLXVpZCc6IHVpZCxcclxufTtcclxuXHJcbmNsYXNzIE1lc3NlbmdlcjxFdiBleHRlbmRzIHN0cmluZyA9IGtleW9mIElFdmVudHM+IHtcclxuICAjcG9sbGluZ0ludGVydmFsOiBOb2RlSlMuVGltZXI7XHJcbiAgcmVhZG9ubHkgI3BvbGxpbmc6IElQb2xsaW5nT3B0aW9ucztcclxuICByZWFkb25seSAjYXhpb3NJbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcclxuICAjZXZlbnRzOiBQYXJ0aWFsPFJlY29yZDxFdiwgKCguLi5hcmdzOiBhbnkpID0+IHZvaWQpW10+PjtcclxuICAjdXBkYXRlc0hhc2g6IHN0cmluZyA9ICcnO1xyXG4gIHJlYWRvbmx5ICNiYXNlVVJMOiBzdHJpbmc7XHJcbiAgI3Rva2VuOiB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfTtcclxuICByZWFkb25seSAjdG9rZW5HZXR0ZXI6XHJcbiAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XHJcblxyXG4gIHB1YmxpYyB1aWQ6IHN0cmluZztcclxuICBwdWJsaWMgc29ja2V0OiBTb2NrZXQ8RGVmYXVsdEV2ZW50c01hcCwgRGVmYXVsdEV2ZW50c01hcD4gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHtcclxuICAgICAgYmFzZVVSTCxcclxuICAgICAgdG9rZW4sXHJcbiAgICAgIHBvbGxpbmcgPSBudWxsLFxyXG4gICAgICBsYW5ndWFnZUdldHRlciA9ICgpID0+ICdVei1MYXRpbicsXHJcbiAgICAgIGhlYWRlcnMgPSB7fSxcclxuICAgIH06IEN1c3RvbU9wdGlvbnMsXHJcbiAgICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuICApIHtcclxuICAgIHRoaXMudWlkID0gdWlkO1xyXG4gICAgdGhpcy4jcG9sbGluZyA9IHBvbGxpbmc7XHJcbiAgICB0aGlzLiNiYXNlVVJMID0gYmFzZVVSTDtcclxuICAgIHRoaXMuI2V2ZW50cyA9IHt9O1xyXG4gICAgdGhpcy4jdG9rZW4gPSB7IGFjY2VzczogJycsIHJlZnJlc2g6ICcnIH07XHJcbiAgICB0aGlzLiN0b2tlbkdldHRlciA9IHRva2VuO1xyXG4gICAgdGhpcy4jYXhpb3NJbnN0YW5jZSA9IG5ldyBDdXN0b21BeGlvc0luc3RhbmNlKFxyXG4gICAgICB7IGJhc2VVUkw6IGJhc2VVUkwsIGhlYWRlcnM6IHJlcXVpcmVkSGVhZGVycyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgcmVmcmVzaFRva2VuVXJsOiAnL3YxL2F1dGgvcmVmcmVzaC10b2tlbicsXHJcbiAgICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXHJcbiAgICAgIH0sXHJcbiAgICApLmluc3RhbmNlO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdFBvbGxpbmcgPSB0aGlzLmluaXRQb2xsaW5nLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWFyY2hVc2VyID0gdGhpcy5zZWFyY2hVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZXNzYWdlcyA9IHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRJbmZvID0gdGhpcy5nZXRDaGF0SW5mby5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0TWVkaWEgPSB0aGlzLmdldENoYXRNZWRpYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0RmlsZXMgPSB0aGlzLmdldENoYXRGaWxlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRDaGF0QXVkaW9zID0gdGhpcy5nZXRDaGF0QXVkaW9zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFVwZGF0ZXMgPSB0aGlzLmdldFVwZGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZE1lc3NhZ2UgPSB0aGlzLnJlYWRNZXNzYWdlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRzID0gdGhpcy5nZXRDaGF0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZW5kTWVzc2FnZVRvQXJlYSA9IHRoaXMuc2VuZE1lc3NhZ2VUb0FyZWEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XHJcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRQb2xsaW5nKCkge1xyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuI3BvbGxpbmdJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcztcclxuICAgIGNvbnN0IHBvbGxpbmcgPSB0aGlzLiNwb2xsaW5nO1xyXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy4jZXZlbnRzO1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gaW50ZXJ2YWxDYWxsYmFjaygpIHtcclxuICAgICAgY29uc3QgeyB1cGRhdGVzLCBtZXRhIH0gPSBhd2FpdCBnZXRVcGRhdGVzKHsgbGltaXQ6IHBvbGxpbmcubGltaXQgfSk7XHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZSddICYmIHVwZGF0ZXMudXBkYXRlcykge1xyXG4gICAgICAgIHVwZGF0ZXMudXBkYXRlcy5tYXAoKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGUnXS5tYXAoKGNiKSA9PiBjYih1cGRhdGUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlVXNlciddICYmIHVwZGF0ZXMudXNlcnMpIHtcclxuICAgICAgICB1cGRhdGVzLnVzZXJzLm1hcCgodXNlcikgPT4ge1xyXG4gICAgICAgICAgZXZlbnRzWyd1cGRhdGVVc2VyJ10ubWFwKChjYikgPT4gY2IodXNlcikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVNZXNzYWdlJ10gJiYgdXBkYXRlcy5tZXNzYWdlcykge1xyXG4gICAgICAgIHVwZGF0ZXMubWVzc2FnZXMubWFwKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXS5tYXAoKGNiKSA9PiBjYihtZXNzYWdlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNwb2xsaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChpbnRlcnZhbENhbGxiYWNrLCBwb2xsaW5nLmludGVydmFsKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXQoKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuI3Rva2VuR2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gYXdhaXQgdGhpcy4jdG9rZW5HZXR0ZXIoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI3Rva2VuID0gdGhpcy4jdG9rZW5HZXR0ZXI7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywgdGhpcy4jdG9rZW4pO1xyXG5cclxuICAgIGlmICh0aGlzLiNwb2xsaW5nID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc29ja2V0ID0gaW8odGhpcy4jYmFzZVVSTCwge1xyXG4gICAgICAgIHBhdGg6ICcvbWVzc2VuZ2VyJyxcclxuICAgICAgICBhdXRvQ29ubmVjdDogZmFsc2UsXHJcbiAgICAgICAgYXV0aDogKGNiKSA9PlxyXG4gICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAuLi5yZXF1aXJlZEhlYWRlcnMsXHJcbiAgICAgICAgICAgIHRva2VuOiB0aGlzLiN0b2tlbi5hY2Nlc3MsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBleHRyYUhlYWRlcnM6IHsgLi4ucmVxdWlyZWRIZWFkZXJzLCB0b2tlbjogdGhpcy4jdG9rZW4uYWNjZXNzIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLiNwb2xsaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5pdFBvbGxpbmcoKTtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydjb25uZWN0J10pKSB7XHJcbiAgICAgICAgdGhpcy4jZXZlbnRzWydjb25uZWN0J10ubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgbWVzc2FnZTogYFBvbGxpbmcgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZGAsXHJcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNvY2tldFxyXG4gICAgICAuY29ubmVjdCgpXHJcbiAgICAgIC5vbignY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydjb25uZWN0J10pKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuI2V2ZW50c1snY29ubmVjdCddLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZC4gc29ja2V0LmlkOiAke3RoaXMuc29ja2V0LmlkfWAsXHJcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgICAub24oJ2Rpc2Nvbm5lY3QnLCAocmVhc29uLCBkZXRhaWxzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuI2V2ZW50c1snZGlzY29ubmVjdCddKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4jZXZlbnRzWydkaXNjb25uZWN0J10ubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgcmVhc29uLFxyXG4gICAgICAgICAgICBkZXRhaWxzLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBgU29ja2V0IGRpc2Nvbm5lY3RlZDogaWQ6ICR7XHJcbiAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuaWRcclxuICAgICAgICAgICAgfSwgcmVhc29uOiAke3JlYXNvbn0sIGRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoZGV0YWlscyl9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignY29ubmVjdF9lcnJvcicsIChlcnIpID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAhdGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXSB8fFxyXG4gICAgICAgICAgIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzWydzb2NrZXRDb25uZWN0aW9uRXJyb3InXSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNvY2tldC5hY3RpdmUpIHtcclxuICAgICAgICAgIHRoaXMuI2V2ZW50c1snc29ja2V0Q29ubmVjdGlvbkVycm9yJ10ubWFwKChjYikgPT5cclxuICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICd0ZW1wb3JhcnkgZmFpbHVyZSwgdGhlIHNvY2tldCB3aWxsIGF1dG9tYXRpY2FsbHkgdHJ5IHRvIHJlY29ubmVjdCcsXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGVycixcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLiNldmVudHNbJ3NvY2tldENvbm5lY3Rpb25FcnJvciddLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBgXHJcbiAgICAgICAgICAgICAgICB0aGUgY29ubmVjdGlvbiB3YXMgZGVuaWVkIGJ5IHRoZSBzZXJ2ZXJcclxuICAgICAgICAgICAgICAgIGluIHRoYXQgY2FzZSwgc29ja2V0LmNvbm5lY3QoKSBtdXN0IGJlIG1hbnVhbGx5IGNhbGxlZCBpbiBvcmRlciB0byByZWNvbm5lY3QuXHJcbiAgICAgICAgICAgICAgICBFcnJvcjogJHtlcnIubWVzc2FnZX1cclxuICAgICAgICAgICAgICBgLFxyXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbigndXBkYXRlJywgKHVwZGF0ZSkgPT4ge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLiNldmVudHNbJ3VwZGF0ZSddKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiNldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHB1YmxpYyBvbihldmVudDogRXYsIGNiOiBFdiBleHRlbmRzIGtleW9mIElFdmVudHMgPyBJRXZlbnRzW0V2XSA6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCk6IHRoaXM7XHJcbiAgb24oZXZlbnQ6IEV2LCBjYjogRXYgZXh0ZW5kcyBrZXlvZiBJRXZlbnRzID8gSUV2ZW50c1tFdl0gOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpOiB0aGlzIHtcclxuICAgIGlmICh0aGlzLiNldmVudHNbZXZlbnRdKSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0ucHVzaChjYik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gW2NiXTtcclxuICAgIH1cclxuICAgIC8vIGxldCBhOiBSZWNvcmQ8a2V5b2YgSUV2ZW50cywgKC4uLmFyZ3M6IGFueSkgPT4gdm9pZD47XHJcbiAgICAvLyBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgIC8vICAgdGhpcy5zb2NrZXQub24oZXZlbnQsIGNiIGFzIGFueSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZXZlbnROYW1lcygpOiBzdHJpbmdbXSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy4jZXZlbnRzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQ/OiBFdik6IHRoaXMge1xyXG4gICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbXTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI2V2ZW50cyA9IHt9O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXIoZXZlbnQ6IEV2LCBjYWxsYmFjazogYW55KTogdGhpcyB7XHJcbiAgICBpZiAoIXRoaXMuI2V2ZW50c1tldmVudF0gfHwgIUFycmF5LmlzQXJyYXkodGhpcy4jZXZlbnRzW2V2ZW50XSkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI2V2ZW50c1tldmVudF0uZmlsdGVyKChjYikgPT4gY2IubmFtZSAhPT0gY2FsbGJhY2submFtZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHNlYXJjaCBpZCBvciB1c2VybmFtZVxyXG4gICAqIEByZXR1cm5zIHtbXX1cclxuICAgKi9cclxuICBwdWJsaWMgYXN5bmMgc2VhcmNoVXNlcihzZWFyY2g6IHN0cmluZyk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5nZXQ8TXlBcGlSZXNwb25zZTxJVXNlcj4+KFxyXG4gICAgICBgL3YxL3VzZXJzP3NlYXJjaD0ke3NlYXJjaH1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChcclxuICAgICAgYC92MS9jaGF0cy8ke21lc3NhZ2UudG8uY2hhdElkfS9tZXNzYWdlc2AsXHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9OZXdVc2VyKG1lc3NhZ2U6IElTZW5kTWVzc2FnZSk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvdXNlcnMvbWVzc2FnZWAsIG1lc3NhZ2UpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9BcmVhKFxyXG4gICAgZmlsdGVyOiBGaWx0ZXJQb2x5Z29uQXJlYSxcclxuICAgIG1lc3NhZ2U6IElTZW5kTWVzc2FnZVRvQXJlYSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2UtYnktYXJlYWAsIHtcclxuICAgICAgbWVzc2FnZSxcclxuICAgICAgZmlsdGVyLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lc3NhZ2VzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxLCBzZWFyY2ggPSAnJyB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyOyBzZWFyY2g/OiBzdHJpbmcgfSA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PihcclxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0SW5mbyhjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChgL3YxL2NoYXRzLyR7Y2hhdElkfWApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZWRpYShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0QXVkaW9zKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRVcGRhdGVzKHtcclxuICAgIGxpbWl0ID0gdGhpcy4jcG9sbGluZy5saW1pdCxcclxuICAgIHBhZ2UgPSAxLFxyXG4gICAgYWxsb3dlZFVwZGF0ZXMgPSBbXSxcclxuICB9OiB7XHJcbiAgICBsaW1pdD86IG51bWJlcjtcclxuICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICBhbGxvd2VkVXBkYXRlcz86IE1lc3NhZ2VUeXBlW107XHJcbiAgfSA9IHt9KTogUHJvbWlzZTx7XHJcbiAgICB1cGRhdGVzOiB7XHJcbiAgICAgIHVwZGF0ZXM6IElPblVwZGF0ZVtdO1xyXG4gICAgICB1c2Vyczoge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIGlzT25saW5lOiBib29sZWFuO1xyXG4gICAgICB9W107XHJcbiAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgcmVhZEF0OiBzdHJpbmc7XHJcbiAgICAgIH1bXTtcclxuICAgIH07XHJcbiAgICBtZXRhOiBhbnk7XHJcbiAgfT4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlXHJcbiAgICAgIC5nZXQoYC92MS91c2Vycy91cGRhdGVzP3BhZ2U9JHtwYWdlfSZsaW1pdD0ke2xpbWl0fSZoYXNoPSR7dGhpcy4jdXBkYXRlc0hhc2h9YClcclxuICAgICAgLmNhdGNoKCgpID0+ICh7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICBtZXRhOiB7XHJcbiAgICAgICAgICAgIGhhc2g6IG51bGwsXHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICAgICAgICBsaW1pdDogMTAwLFxyXG4gICAgICAgICAgICB0b3RhbENvdW50OiAwLFxyXG4gICAgICAgICAgICB0b3RhbFBhZ2VzOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSk7XHJcblxyXG4gICAgdGhpcy4jdXBkYXRlc0hhc2ggPSBkYXRhLm1ldGEuaGFzaCA/IGRhdGEubWV0YS5oYXNoIDogJyc7XHJcblxyXG4gICAgcmV0dXJuIHsgdXBkYXRlczogZGF0YS5kYXRhLCBtZXRhOiBkYXRhLm1ldGEgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyByZWFkTWVzc2FnZShjaGF0SWQ6IHN0cmluZywgbWVzc2FnZTogeyBtZXNzYWdlSWQ6IHN0cmluZzsgbWVzc2FnZVJlYWRBdDogc3RyaW5nIH0pIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wYXRjaChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdHMoXHJcbiAgICB7XHJcbiAgICAgIGxpbWl0ID0gMTAwLFxyXG4gICAgICBwYWdlID0gMSxcclxuICAgICAgdHlwZSA9IG51bGwsXHJcbiAgICB9OiB7XHJcbiAgICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgICBwYWdlPzogbnVtYmVyO1xyXG4gICAgICB0eXBlPzogQ2hhdFR5cGU7XHJcbiAgICB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEsIHR5cGU6IG51bGwgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SUNoYXQ+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KFxyXG4gICAgICBgL3YxL2NoYXRzP2xpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfSR7dHlwZSA/IGAmdHlwZT0ke3R5cGV9YCA6ICcnfWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBpbmcoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGluZycsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNheGlvc0luc3RhbmNlLmdldCgnL2NoZWNrLWhlYWx0aCcpLmNhdGNoKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbmxldCBtZXNzZW5nZXI6IE1lc3NlbmdlcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzZW5nZXIoXHJcbiAgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9ucyxcclxuICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuKSB7XHJcbiAgaWYgKG1lc3Nlbmdlcikge1xyXG4gICAgcmV0dXJuIG1lc3NlbmdlcjtcclxuICB9XHJcblxyXG4gIG1lc3NlbmdlciA9IG5ldyBNZXNzZW5nZXIoY3VzdG9tT3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIG1lc3NlbmdlcjtcclxufVxyXG4iXX0=