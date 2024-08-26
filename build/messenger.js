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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2VuZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21lc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFPdEMsT0FBTyxFQUFpQixlQUFlLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFeEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3BELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQyxRQUFRLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXhDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUV6QixNQUFNLGVBQWUsR0FBRztJQUN0QixlQUFlLEVBQUUsZUFBZSxDQUFDLEdBQUc7SUFDcEMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFNBQVM7UUFDN0IsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLFNBQVMsTUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQ2xELENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtZQUNaLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLE1BQU0sT0FBTyxDQUFDLElBQUksY0FBYyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQ3RFLENBQUMsQ0FBQyxTQUFTLEVBQUUseUNBQXlDO0lBQ3hELDZHQUE2RztJQUM3RyxlQUFlLEVBQUUsVUFBVTtJQUMzQixXQUFXLEVBQUUs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QUFJLGdDQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25ELENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjs7QUFFRCxJQUFJLFNBQW9CLENBQUM7QUFFekIsTUFBTSxVQUFVLFlBQVksQ0FDMUIsYUFBNEIsRUFDNUIsVUFBbUQsRUFBRTtJQUVyRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlZmF1bHRFdmVudHNNYXAgfSBmcm9tICdAc29ja2V0LmlvL2NvbXBvbmVudC1lbWl0dGVyJztcclxuaW1wb3J0IHsgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHR5cGUgeyBNYW5hZ2VyT3B0aW9ucywgU29ja2V0LCBTb2NrZXRPcHRpb25zIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IGlvIH0gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XHJcbmltcG9ydCB7IHYxIGFzIHV1aWRWMSB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuL2NvbW1vbi9jb25maWcnO1xyXG5pbXBvcnQgeyBNeUFwaVJlc3BvbnNlIH0gZnJvbSAnLi90eXBlcy9hcGknO1xyXG5pbXBvcnQgeyBGaWx0ZXJQb2x5Z29uQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL2FyZWEuZmlsdGVyJztcclxuaW1wb3J0IHsgQ2hhdFR5cGUsIElDaGF0IH0gZnJvbSAnLi90eXBlcy9hcGkvY2hhdCc7XHJcbmltcG9ydCB7IElNZXNzYWdlLCBJU2VuZE1lc3NhZ2UsIElTZW5kTWVzc2FnZVRvQXJlYSB9IGZyb20gJy4vdHlwZXMvYXBpL21lc3NhZ2UnO1xyXG5pbXBvcnQgeyBJT25VcGRhdGUsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi90eXBlcy9hcGkvbWVzc2FnZS50eXBlcyc7XHJcbmltcG9ydCB7IElVc2VyIH0gZnJvbSAnLi90eXBlcy9hcGkvdXNlcic7XHJcbmltcG9ydCB7IEN1c3RvbU9wdGlvbnMsIERldmljZVR5cGVzRW51bSwgSUV2ZW50cywgSVBvbGxpbmdPcHRpb25zIH0gZnJvbSAnLi90eXBlcy90eXBlcyc7XHJcbmltcG9ydCB7IEN1c3RvbUF4aW9zSW5zdGFuY2UsIGxvY2FsU3RnIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5jb25zdCBsb2NhbFVpZCA9IGxvY2FsU3RnLmdldCgnbWVzc2VuZ2VyRGV2aWNlVWlkJyk7XHJcbmNvbnN0IHVpZCA9IGxvY2FsVWlkID8gbG9jYWxVaWQgOiB1dWlkVjEoKTtcclxubG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJEZXZpY2VVaWQnLCB1aWQpO1xyXG5cclxubGV0IGFwcFZlcnNpb24gPSAnMC4wLjAnO1xyXG5cclxuY29uc3QgcmVxdWlyZWRIZWFkZXJzID0ge1xyXG4gICd4LWRldmljZS10eXBlJzogRGV2aWNlVHlwZXNFbnVtLldFQixcclxuICAneC1kZXZpY2UtbW9kZWwnOiBFTlYuaXNCcm93c2VyXHJcbiAgICA/IGAke25hdmlnYXRvci51c2VyQWdlbnR9IHwgJHtuYXZpZ2F0b3IucGxhdGZvcm19YFxyXG4gICAgOiBFTlYuaXNOb2RlXHJcbiAgICA/IGAke3Byb2Nlc3MucGxhdGZvcm19IHwgJHtwcm9jZXNzLmFyY2h9IHwgTm9kZWpzOiAke3Byb2Nlc3MudmVyc2lvbn1gXHJcbiAgICA6ICdVbmtub3duJywgLy8gZHluYW1pY2FsbHkgZmV0Y2hpbmcgZGV2aWNlIG1vZGVsIGluZm9cclxuICAvLyAneC1hcHAtbGFuZyc6IChsYW5ndWFnZUdldHRlcigpIHx8ICdVei1MYXRpbicpIGFzIEkxOG5UeXBlLkxhbmdUeXBlLCAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXHJcbiAgJ3gtYXBwLXZlcnNpb24nOiBhcHBWZXJzaW9uLFxyXG4gICd4LWFwcC11aWQnOiB1aWQsXHJcbn07XHJcblxyXG5jbGFzcyBNZXNzZW5nZXIge1xyXG4gICNwb2xsaW5nSW50ZXJ2YWw6IE5vZGVKUy5UaW1lcjtcclxuICAjcG9sbGluZzogSVBvbGxpbmdPcHRpb25zO1xyXG4gICNheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xyXG4gICNldmVudHM6IFBhcnRpYWw8UmVjb3JkPGtleW9mIElFdmVudHMsICgoLi4uYXJnczogYW55KSA9PiB2b2lkKVtdPj47XHJcbiAgI3VwZGF0ZXNIYXNoOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgI3Rva2VuOiB7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfTtcclxuICAjdG9rZW5HZXR0ZXI6XHJcbiAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XHJcblxyXG4gIHB1YmxpYyB1aWQ6IHN0cmluZztcclxuICBwdWJsaWMgcmVhZG9ubHkgc29ja2V0OiBTb2NrZXQ8RGVmYXVsdEV2ZW50c01hcCwgRGVmYXVsdEV2ZW50c01hcD4gfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHtcclxuICAgICAgYmFzZVVSTCxcclxuICAgICAgdG9rZW4sXHJcbiAgICAgIHBvbGxpbmcgPSBudWxsLFxyXG4gICAgICBsYW5ndWFnZUdldHRlciA9ICgpID0+ICdVei1MYXRpbicsXHJcbiAgICAgIGhlYWRlcnMgPSB7fSxcclxuICAgIH06IEN1c3RvbU9wdGlvbnMsXHJcbiAgICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuICApIHtcclxuICAgIHRoaXMudWlkID0gdWlkO1xyXG4gICAgdGhpcy4jcG9sbGluZyA9IHBvbGxpbmc7XHJcbiAgICB0aGlzLiNldmVudHMgPSB7fTtcclxuICAgIHRoaXMuI3Rva2VuR2V0dGVyID0gdG9rZW47XHJcbiAgICB0aGlzLiNheGlvc0luc3RhbmNlID0gbmV3IEN1c3RvbUF4aW9zSW5zdGFuY2UoXHJcbiAgICAgIHsgYmFzZVVSTDogYmFzZVVSTCwgaGVhZGVyczogcmVxdWlyZWRIZWFkZXJzIH0sXHJcbiAgICAgIHtcclxuICAgICAgICByZWZyZXNoVG9rZW5Vcmw6ICcvdjEvYXV0aC9yZWZyZXNoLXRva2VuJyxcclxuICAgICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgICAgfSxcclxuICAgICkuaW5zdGFuY2U7XHJcblxyXG4gICAgaWYgKHBvbGxpbmcgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zb2NrZXQgPSBpbyhiYXNlVVJMLCB7XHJcbiAgICAgICAgcGF0aDogJy9tZXNzZW5nZXInLFxyXG4gICAgICAgIGF1dGg6IHtcclxuICAgICAgICAgIC4uLnJlcXVpcmVkSGVhZGVycyxcclxuICAgICAgICAgIC4uLmhlYWRlcnMsXHJcbiAgICAgICAgICB0b2tlbjogdGhpcy4jdG9rZW4sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBleHRyYUhlYWRlcnM6IHsgLi4ucmVxdWlyZWRIZWFkZXJzLCAuLi5oZWFkZXJzIH0sXHJcbiAgICAgICAgLi4ub3B0aW9ucyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0UG9sbGluZyA9IHRoaXMuaW5pdFBvbGxpbmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMub24gPSB0aGlzLm9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlYXJjaFVzZXIgPSB0aGlzLnNlYXJjaFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdE1lc3NhZ2VzID0gdGhpcy5nZXRDaGF0TWVzc2FnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdEluZm8gPSB0aGlzLmdldENoYXRJbmZvLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRNZWRpYSA9IHRoaXMuZ2V0Q2hhdE1lZGlhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRGaWxlcyA9IHRoaXMuZ2V0Q2hhdEZpbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldENoYXRBdWRpb3MgPSB0aGlzLmdldENoYXRBdWRpb3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0VXBkYXRlcyA9IHRoaXMuZ2V0VXBkYXRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkTWVzc2FnZSA9IHRoaXMucmVhZE1lc3NhZ2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Q2hhdHMgPSB0aGlzLmdldENoYXRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlbmRNZXNzYWdlVG9BcmVhID0gdGhpcy5zZW5kTWVzc2FnZVRvQXJlYS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdFBvbGxpbmcoKSB7XHJcbiAgICBpZiAodGhpcy4jcG9sbGluZ0ludGVydmFsKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy4jcG9sbGluZ0ludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnZXRVcGRhdGVzID0gdGhpcy5nZXRVcGRhdGVzO1xyXG4gICAgY29uc3QgcG9sbGluZyA9IHRoaXMuI3BvbGxpbmc7XHJcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLiNldmVudHM7XHJcbiAgICBhc3luYyBmdW5jdGlvbiBpbnRlcnZhbENhbGxiYWNrKCkge1xyXG4gICAgICBjb25zdCB7IHVwZGF0ZXMsIG1ldGEgfSA9IGF3YWl0IGdldFVwZGF0ZXMoeyBsaW1pdDogcG9sbGluZy5saW1pdCB9KTtcclxuICAgICAgaWYgKGV2ZW50c1sndXBkYXRlJ10gJiYgdXBkYXRlcy51cGRhdGVzKSB7XHJcbiAgICAgICAgdXBkYXRlcy51cGRhdGVzLm1hcCgodXBkYXRlKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZSddLm1hcCgoY2IpID0+IGNiKHVwZGF0ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXZlbnRzWyd1cGRhdGVVc2VyJ10gJiYgdXBkYXRlcy51c2Vycykge1xyXG4gICAgICAgIHVwZGF0ZXMudXNlcnMubWFwKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICBldmVudHNbJ3VwZGF0ZVVzZXInXS5tYXAoKGNiKSA9PiBjYih1c2VyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChldmVudHNbJ3VwZGF0ZU1lc3NhZ2UnXSAmJiB1cGRhdGVzLm1lc3NhZ2VzKSB7XHJcbiAgICAgICAgdXBkYXRlcy5tZXNzYWdlcy5tYXAoKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICAgIGV2ZW50c1sndXBkYXRlTWVzc2FnZSddLm1hcCgoY2IpID0+IGNiKG1lc3NhZ2UpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI3BvbGxpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKGludGVydmFsQ2FsbGJhY2ssIHBvbGxpbmcuaW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaW5pdCgpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy4jdG9rZW5HZXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSBhd2FpdCB0aGlzLiN0b2tlbkdldHRlcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jdG9rZW4gPSB0aGlzLiN0b2tlbkdldHRlcjtcclxuICAgIH1cclxuICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB0aGlzLiN0b2tlbik7XHJcblxyXG4gICAgaWYgKHRoaXMuI3BvbGxpbmcpIHtcclxuICAgICAgdGhpcy5pbml0UG9sbGluZygpO1xyXG4gICAgICB0aGlzLiNldmVudHMuY29ubmVjdC5tYXAoKGNiKSA9PlxyXG4gICAgICAgIGNiKHtcclxuICAgICAgICAgIG1lc3NhZ2U6IGBQb2xsaW5nIHN1Y2Nlc3NmdWxseSBjb25uZWN0ZWRgLFxyXG4gICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICB9KSxcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc29ja2V0XHJcbiAgICAgIC5jb25uZWN0KClcclxuICAgICAgLm9uKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuI2V2ZW50cy5jb25uZWN0Lm1hcCgoY2IpID0+XHJcbiAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBTb2NrZXQgc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZC4gc29ja2V0LmlkOiAke3RoaXMuc29ja2V0LmlkfWAsXHJcbiAgICAgICAgICAgIHNvY2tldDogdGhpcy5zb2NrZXQsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICApO1xyXG4gICAgICB9KVxyXG4gICAgICAub24oJ2Rpc2Nvbm5lY3QnLCAocmVhc29uLCBkZXRhaWxzKSA9PiB7XHJcbiAgICAgICAgdGhpcy4jZXZlbnRzLmRpc2Nvbm5lY3QubWFwKChjYikgPT5cclxuICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgcmVhc29uLFxyXG4gICAgICAgICAgICBkZXRhaWxzLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBgU29ja2V0IGRpc2Nvbm5lY3RlZDogaWQ6ICR7XHJcbiAgICAgICAgICAgICAgdGhpcy5zb2NrZXQuaWRcclxuICAgICAgICAgICAgfSwgcmVhc29uOiAke3JlYXNvbn0sIGRldGFpbHM6ICR7SlNPTi5zdHJpbmdpZnkoZGV0YWlscyl9YCxcclxuICAgICAgICAgICAgc29ja2V0OiB0aGlzLnNvY2tldCxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5vbignY29ubmVjdF9lcnJvcicsIChlcnIpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5zb2NrZXQuYWN0aXZlKSB7XHJcbiAgICAgICAgICB0aGlzLiNldmVudHMuc29ja2V0Q29ubmVjdGlvbkVycm9yLm1hcCgoY2IpID0+XHJcbiAgICAgICAgICAgIGNiKHtcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAndGVtcG9yYXJ5IGZhaWx1cmUsIHRoZSBzb2NrZXQgd2lsbCBhdXRvbWF0aWNhbGx5IHRyeSB0byByZWNvbm5lY3QnLFxyXG4gICAgICAgICAgICAgIGVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy4jZXZlbnRzLnNvY2tldENvbm5lY3Rpb25FcnJvci5tYXAoKGNiKSA9PlxyXG4gICAgICAgICAgICBjYih7XHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogYFxyXG4gICAgICAgICAgICAgICAgdGhlIGNvbm5lY3Rpb24gd2FzIGRlbmllZCBieSB0aGUgc2VydmVyXHJcbiAgICAgICAgICAgICAgICBpbiB0aGF0IGNhc2UsIHNvY2tldC5jb25uZWN0KCkgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgaW4gb3JkZXIgdG8gcmVjb25uZWN0LlxyXG4gICAgICAgICAgICAgICAgRXJyb3I6ICR7ZXJyLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgICBlcnJvcjogZXJyLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbjxFdiBleHRlbmRzIHN0cmluZyA9IGtleW9mIElFdmVudHM+KFxyXG4gICAgZXZlbnQ6IEV2LFxyXG4gICAgY2I6IEV2IGV4dGVuZHMga2V5b2YgSUV2ZW50cyA/IElFdmVudHNbRXZdIDogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLFxyXG4gICk6IHRoaXM7XHJcbiAgb248RXYgZXh0ZW5kcyBrZXlvZiBJRXZlbnRzID0ga2V5b2YgSUV2ZW50cz4oZXZlbnQ6IEV2LCBjYjogKGRhdGE6IElPblVwZGF0ZSkgPT4gdm9pZCk6IHRoaXMge1xyXG4gICAgaWYgKHRoaXMuI2V2ZW50c1tldmVudF0pIHtcclxuICAgICAgdGhpcy4jZXZlbnRzW2V2ZW50XS5wdXNoKGNiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuI2V2ZW50c1tldmVudF0gPSBbY2JdO1xyXG4gICAgfVxyXG4gICAgLy8gbGV0IGE6IFJlY29yZDxrZXlvZiBJRXZlbnRzLCAoLi4uYXJnczogYW55KSA9PiB2b2lkPjtcclxuICAgIGlmICh0aGlzLnNvY2tldCkge1xyXG4gICAgICB0aGlzLnNvY2tldC5vbihldmVudCwgY2IgYXMgYW55KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHNlYXJjaCBpZCBvciB1c2VybmFtZVxyXG4gICAqIEByZXR1cm5zIHtbXX1cclxuICAgKi9cclxuICBwdWJsaWMgYXN5bmMgc2VhcmNoVXNlcihzZWFyY2g6IHN0cmluZyk6IFByb21pc2U8TXlBcGlSZXNwb25zZTxJVXNlcj4+IHtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldDxNeUFwaVJlc3BvbnNlPElVc2VyPj4oYC92MS91c2Vycz9zZWFyY2g9JHtzZWFyY2h9YCk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGEuZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBzZW5kTWVzc2FnZShtZXNzYWdlOiBJU2VuZE1lc3NhZ2UpOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wb3N0KGAvdjEvY2hhdHMvJHttZXNzYWdlLnRvLmNoYXRJZH0vbWVzc2FnZXNgLCBtZXNzYWdlKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5kYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIHNlbmRNZXNzYWdlVG9BcmVhKFxyXG4gICAgZmlsdGVyOiBGaWx0ZXJQb2x5Z29uQXJlYSxcclxuICAgIG1lc3NhZ2U6IElTZW5kTWVzc2FnZVRvQXJlYSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SVVzZXI+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UucG9zdChgL3YxL3VzZXJzL21lc3NhZ2UtYnktYXJlYWAsIHtcclxuICAgICAgbWVzc2FnZSxcclxuICAgICAgZmlsdGVyLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdE1lc3NhZ2VzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxLCBzZWFyY2ggPSAnJyB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyOyBzZWFyY2g/OiBzdHJpbmcgfSA9IHtcclxuICAgICAgbGltaXQ6IDIwLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0PE15QXBpUmVzcG9uc2U8SU1lc3NhZ2U+PihcclxuICAgICAgYC92MS9jaGF0cy8ke2NoYXRJZH0vbWVzc2FnZXM/c2VhcmNoPSR7c2VhcmNofSZsaW1pdD0ke2xpbWl0fSZwYWdlPSR7cGFnZX1gLFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0SW5mbyhjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dW5rbm93bj4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlLmdldChgL3YxL2NoYXRzLyR7Y2hhdElkfWApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFzeW5jIGdldENoYXRNZWRpYShcclxuICAgIGNoYXRJZDogc3RyaW5nLFxyXG4gICAgeyBsaW1pdCA9IDIwLCBwYWdlID0gMSB9OiB7IGxpbWl0PzogbnVtYmVyOyBwYWdlPzogbnVtYmVyIH0gPSB7IGxpbWl0OiAyMCwgcGFnZTogMSB9LFxyXG4gICk6IFByb21pc2U8dW5rbm93bltdPiB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdEZpbGVzKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRDaGF0QXVkaW9zKFxyXG4gICAgY2hhdElkOiBzdHJpbmcsXHJcbiAgICB7IGxpbWl0ID0gMjAsIHBhZ2UgPSAxIH06IHsgbGltaXQ/OiBudW1iZXI7IHBhZ2U/OiBudW1iZXIgfSA9IHsgbGltaXQ6IDIwLCBwYWdlOiAxIH0sXHJcbiAgKTogUHJvbWlzZTx1bmtub3duW10+IHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyBnZXRVcGRhdGVzKHtcclxuICAgIGxpbWl0ID0gdGhpcy4jcG9sbGluZy5saW1pdCxcclxuICAgIHBhZ2UgPSAxLFxyXG4gICAgYWxsb3dlZFVwZGF0ZXMgPSBbXSxcclxuICB9OiB7XHJcbiAgICBsaW1pdD86IG51bWJlcjtcclxuICAgIHBhZ2U/OiBudW1iZXI7XHJcbiAgICBhbGxvd2VkVXBkYXRlcz86IE1lc3NhZ2VUeXBlW107XHJcbiAgfSA9IHt9KTogUHJvbWlzZTx7XHJcbiAgICB1cGRhdGVzOiB7XHJcbiAgICAgIHVwZGF0ZXM6IElPblVwZGF0ZVtdO1xyXG4gICAgICB1c2Vyczoge1xyXG4gICAgICAgIF9pZDogc3RyaW5nO1xyXG4gICAgICAgIGlzT25saW5lOiBib29sZWFuO1xyXG4gICAgICB9W107XHJcbiAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgX2lkOiBzdHJpbmc7XHJcbiAgICAgICAgcmVhZEF0OiBzdHJpbmc7XHJcbiAgICAgIH1bXTtcclxuICAgIH07XHJcbiAgICBtZXRhOiBhbnk7XHJcbiAgfT4ge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLiNheGlvc0luc3RhbmNlXHJcbiAgICAgIC5nZXQoYC92MS91c2Vycy91cGRhdGVzP3BhZ2U9JHtwYWdlfSZsaW1pdD0ke2xpbWl0fSZoYXNoPSR7dGhpcy4jdXBkYXRlc0hhc2h9YClcclxuICAgICAgLmNhdGNoKCgpID0+ICh7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICBtZXRhOiB7XHJcbiAgICAgICAgICAgIGhhc2g6IG51bGwsXHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICAgICAgICBsaW1pdDogMTAwLFxyXG4gICAgICAgICAgICB0b3RhbENvdW50OiAwLFxyXG4gICAgICAgICAgICB0b3RhbFBhZ2VzOiAwLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSk7XHJcblxyXG4gICAgdGhpcy4jdXBkYXRlc0hhc2ggPSBkYXRhLm1ldGEuaGFzaCA/IGRhdGEubWV0YS5oYXNoIDogJyc7XHJcblxyXG4gICAgcmV0dXJuIHsgdXBkYXRlczogZGF0YS5kYXRhLCBtZXRhOiBkYXRhLm1ldGEgfTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhc3luYyByZWFkTWVzc2FnZShjaGF0SWQ6IHN0cmluZywgbWVzc2FnZTogeyBtZXNzYWdlSWQ6IHN0cmluZzsgbWVzc2FnZVJlYWRBdDogc3RyaW5nIH0pIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy4jYXhpb3NJbnN0YW5jZS5wYXRjaChgL3YxL2NoYXRzLyR7Y2hhdElkfS9tZXNzYWdlc2AsIG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhdHMoXHJcbiAgICB7XHJcbiAgICAgIGxpbWl0ID0gMTAwLFxyXG4gICAgICBwYWdlID0gMSxcclxuICAgICAgdHlwZSA9IG51bGwsXHJcbiAgICB9OiB7XHJcbiAgICAgIGxpbWl0PzogbnVtYmVyO1xyXG4gICAgICBwYWdlPzogbnVtYmVyO1xyXG4gICAgICB0eXBlPzogQ2hhdFR5cGU7XHJcbiAgICB9ID0geyBsaW1pdDogMjAsIHBhZ2U6IDEsIHR5cGU6IG51bGwgfSxcclxuICApOiBQcm9taXNlPE15QXBpUmVzcG9uc2U8SUNoYXQ+PiB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuI2F4aW9zSW5zdGFuY2UuZ2V0KFxyXG4gICAgICBgL3YxL2NoYXRzP2xpbWl0PSR7bGltaXR9JnBhZ2U9JHtwYWdlfSR7dHlwZSA/IGAmdHlwZT0ke3R5cGV9YCA6ICcnfWAsXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHBpbmcoKSB7XHJcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcclxuICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGluZycsIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLiNheGlvc0luc3RhbmNlLmdldCgnL2NoZWNrLWhlYWx0aCcpLmNhdGNoKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn1cclxuXHJcbmxldCBtZXNzZW5nZXI6IE1lc3NlbmdlcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzZW5nZXIoXHJcbiAgY3VzdG9tT3B0aW9uczogQ3VzdG9tT3B0aW9ucyxcclxuICBvcHRpb25zOiBQYXJ0aWFsPE1hbmFnZXJPcHRpb25zICYgU29ja2V0T3B0aW9ucz4gPSB7fSxcclxuKSB7XHJcbiAgaWYgKG1lc3Nlbmdlcikge1xyXG4gICAgcmV0dXJuIG1lc3NlbmdlcjtcclxuICB9XHJcblxyXG4gIG1lc3NlbmdlciA9IG5ldyBNZXNzZW5nZXIoY3VzdG9tT3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIG1lc3NlbmdlcjtcclxufVxyXG4iXX0=