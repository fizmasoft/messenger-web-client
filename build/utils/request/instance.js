var _CustomAxiosInstance_instances, _CustomAxiosInstance_isRefreshing, _CustomAxiosInstance_refreshTokenUrl, _CustomAxiosInstance_languageGetter, _CustomAxiosInstance_retryQueues, _CustomAxiosInstance_handleRefreshToken, _CustomAxiosInstance_refreshTokenAndReRequest, _CustomAxiosInstance_setInterceptor;
import { __awaiter, __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import axios from 'axios';
import { localStg } from '../';
import { RESPONSE_CODES } from '../../common/constant';
/**
 * Encapsulate axios request class
 * @author Umar<creativeboy1999@gmail.com>
 */
export class CustomAxiosInstance {
    /**
     *
     * @param axiosConfig - axios configuration
     */
    constructor(axiosConfig, { refreshTokenUrl, languageGetter, }) {
        _CustomAxiosInstance_instances.add(this);
        _CustomAxiosInstance_isRefreshing.set(this, void 0);
        _CustomAxiosInstance_refreshTokenUrl.set(this, void 0);
        _CustomAxiosInstance_languageGetter.set(this, void 0);
        _CustomAxiosInstance_retryQueues.set(this, void 0);
        __classPrivateFieldSet(this, _CustomAxiosInstance_languageGetter, languageGetter, "f");
        this.instance = axios.create(axiosConfig);
        __classPrivateFieldSet(this, _CustomAxiosInstance_isRefreshing, false, "f");
        __classPrivateFieldSet(this, _CustomAxiosInstance_retryQueues, [], "f");
        __classPrivateFieldSet(this, _CustomAxiosInstance_refreshTokenUrl, refreshTokenUrl, "f");
        __classPrivateFieldGet(this, _CustomAxiosInstance_instances, "m", _CustomAxiosInstance_setInterceptor).call(this);
    }
}
_CustomAxiosInstance_isRefreshing = new WeakMap(), _CustomAxiosInstance_refreshTokenUrl = new WeakMap(), _CustomAxiosInstance_languageGetter = new WeakMap(), _CustomAxiosInstance_retryQueues = new WeakMap(), _CustomAxiosInstance_instances = new WeakSet(), _CustomAxiosInstance_handleRefreshToken = function _CustomAxiosInstance_handleRefreshToken() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { data: { data }, } = yield axios
            .create(this.instance.defaults)
            .get(__classPrivateFieldGet(this, _CustomAxiosInstance_refreshTokenUrl, "f"), {
            headers: { Authorization: `Bearer ${((_a = localStg.get('messengerToken')) === null || _a === void 0 ? void 0 : _a.refresh) || ''}` },
        });
        if (data && data.token) {
            localStg.set('messengerToken', {
                access: data.token.accessToken,
                refresh: data.token.refreshToken,
            });
        }
        return data.token.accessToken;
    });
}, _CustomAxiosInstance_refreshTokenAndReRequest = function _CustomAxiosInstance_refreshTokenAndReRequest(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (__classPrivateFieldGet(this, _CustomAxiosInstance_isRefreshing, "f")) {
            return;
        }
        try {
            __classPrivateFieldSet(this, _CustomAxiosInstance_isRefreshing, true, "f");
            const accessToken = yield __classPrivateFieldGet(this, _CustomAxiosInstance_instances, "m", _CustomAxiosInstance_handleRefreshToken).call(this);
            if (accessToken) {
                response.config.headers.Authorization = `Bearer ${accessToken}`;
                __classPrivateFieldGet(this, _CustomAxiosInstance_retryQueues, "f").map((cb) => cb(response.config));
            }
            __classPrivateFieldSet(this, _CustomAxiosInstance_retryQueues, [], "f");
            __classPrivateFieldSet(this, _CustomAxiosInstance_isRefreshing, false, "f");
        }
        catch (error) {
            __classPrivateFieldSet(this, _CustomAxiosInstance_retryQueues, [], "f");
            __classPrivateFieldSet(this, _CustomAxiosInstance_isRefreshing, false, "f");
            throw error;
        }
    });
}, _CustomAxiosInstance_setInterceptor = function _CustomAxiosInstance_setInterceptor() {
    this.instance.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const handleConfig = Object.assign({}, config);
        handleConfig.headers['x-app-lang'] = (__classPrivateFieldGet(this, _CustomAxiosInstance_languageGetter, "f").call(this) || 'Uz-Latin'); // dynamically fetching language info
        if (handleConfig.headers) {
            // Set token
            handleConfig.headers.Authorization = `Bearer ${((_a = localStg.get('messengerToken')) === null || _a === void 0 ? void 0 : _a.access) || ''}`;
        }
        return handleConfig;
    }));
    this.instance.interceptors.response.use((response) => response, (axiosError) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if ((((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data['code']) &&
            RESPONSE_CODES.REFRESH_TOKEN_CODES.includes((_b = axiosError.response) === null || _b === void 0 ? void 0 : _b.data['code'])) ||
            RESPONSE_CODES.REFRESH_TOKEN_CODES.includes((_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.status)) {
            // original request
            const originRequest = new Promise((resolve) => {
                __classPrivateFieldGet(this, _CustomAxiosInstance_retryQueues, "f").push((refreshConfig) => {
                    resolve(this.instance.request(refreshConfig));
                });
            });
            yield __classPrivateFieldGet(this, _CustomAxiosInstance_instances, "m", _CustomAxiosInstance_refreshTokenAndReRequest).call(this, axiosError.response);
            return originRequest;
        }
        throw axiosError;
    }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQU12RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBUzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxlQUFlLEVBQ2YsY0FBYyxHQUlmOztRQWxCSCxvREFBdUI7UUFDdkIsdURBQXlCO1FBQ3pCLHNEQUFnQztRQUVoQyxtREFBb0M7UUFnQmxDLHVCQUFBLElBQUksdUNBQW1CLGNBQWMsTUFBQSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyx1QkFBQSxJQUFJLHFDQUFpQixLQUFLLE1BQUEsQ0FBQztRQUMzQix1QkFBQSxJQUFJLG9DQUFnQixFQUFFLE1BQUEsQ0FBQztRQUN2Qix1QkFBQSxJQUFJLHdDQUFvQixlQUFlLE1BQUEsQ0FBQztRQUN4Qyx1QkFBQSxJQUFJLDJFQUFnQixNQUFwQixJQUFJLENBQWtCLENBQUM7SUFDekIsQ0FBQztDQWdGRjs7OztRQTdFRyxNQUFNLEVBQ0osSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQ2YsR0FBRyxNQUFNLEtBQUs7YUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7YUFDOUIsR0FBRyxDQUF1Qix1QkFBQSxJQUFJLDRDQUFpQixFQUFFO1lBQ2hELE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUEsTUFBQSxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBD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dUJBQUEsSUFBSSx3Q0FBYSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWlDLEVBQUUsRUFBRTtvQkFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLHVCQUFBLElBQUkscUZBQTBCLE1BQTlCLElBQUksRUFBMkIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTFELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLFVBQVUsQ0FBQztJQUNuQixDQUFDLENBQUEsQ0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXhpb3NFcnJvciwgQXhpb3NJbnN0YW5jZSwgQXhpb3NSZXF1ZXN0Q29uZmlnLCBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBsb2NhbFN0ZyB9IGZyb20gJy4uLyc7XHJcbmltcG9ydCB7IFJFU1BPTlNFX0NPREVTIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50JztcclxuaW1wb3J0IHsgSVVzZXJMb2dpbiB9IGZyb20gJy4uLy4uL3R5cGVzL2FwaS9hdXRoJztcclxuaW1wb3J0IHsgTGFuZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zeXN0ZW0nO1xyXG5cclxudHlwZSBSZWZyZXNoUmVxdWVzdFF1ZXVlID0gKGNvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnKSA9PiB2b2lkO1xyXG5cclxuLyoqXHJcbiAqIEVuY2Fwc3VsYXRlIGF4aW9zIHJlcXVlc3QgY2xhc3NcclxuICogQGF1dGhvciBVbWFyPGNyZWF0aXZlYm95MTk5OUBnbWFpbC5jb20+XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ3VzdG9tQXhpb3NJbnN0YW5jZSB7XHJcbiAgcmVhZG9ubHkgaW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XHJcblxyXG4gICNpc1JlZnJlc2hpbmc6IGJvb2xlYW47XHJcbiAgI3JlZnJlc2hUb2tlblVybDogc3RyaW5nO1xyXG4gICNsYW5ndWFnZUdldHRlcjogKCkgPT4gTGFuZ1R5cGU7XHJcblxyXG4gICNyZXRyeVF1ZXVlczogUmVmcmVzaFJlcXVlc3RRdWV1ZVtdO1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBheGlvc0NvbmZpZyAtIGF4aW9zIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcsXHJcbiAgICB7XHJcbiAgICAgIHJlZnJlc2hUb2tlblVybCxcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXHJcbiAgICB9OiB7XHJcbiAgICAgIHJlZnJlc2hUb2tlblVybD86IHN0cmluZztcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXI6ICgpID0+IExhbmdUeXBlO1xyXG4gICAgfSxcclxuICApIHtcclxuICAgIHRoaXMuI2xhbmd1YWdlR2V0dGVyID0gbGFuZ3VhZ2VHZXR0ZXI7XHJcbiAgICB0aGlzLmluc3RhbmNlID0gYXhpb3MuY3JlYXRlKGF4aW9zQ29uZmlnKTtcclxuICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcclxuICAgIHRoaXMuI3JlZnJlc2hUb2tlblVybCA9IHJlZnJlc2hUb2tlblVybDtcclxuICAgIHRoaXMuI3NldEludGVyY2VwdG9yKCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyAjaGFuZGxlUmVmcmVzaFRva2VuKCkge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRhOiB7IGRhdGEgfSxcclxuICAgIH0gPSBhd2FpdCBheGlvc1xyXG4gICAgICAuY3JlYXRlKHRoaXMuaW5zdGFuY2UuZGVmYXVsdHMpXHJcbiAgICAgIC5nZXQ8eyBkYXRhOiBJVXNlckxvZ2luIH0+KHRoaXMuI3JlZnJlc2hUb2tlblVybCwge1xyXG4gICAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2xvY2FsU3RnLmdldCgnbWVzc2VuZ2VyVG9rZW4nKT8ucmVmcmVzaCB8fCAnJ31gIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgaWYgKGRhdGEgJiYgZGF0YS50b2tlbikge1xyXG4gICAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywge1xyXG4gICAgICAgIGFjY2VzczogZGF0YS50b2tlbi5hY2Nlc3NUb2tlbixcclxuICAgICAgICByZWZyZXNoOiBkYXRhLnRva2VuLnJlZnJlc2hUb2tlbixcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGEudG9rZW4uYWNjZXNzVG9rZW47XHJcbiAgfVxyXG5cclxuICBhc3luYyAjcmVmcmVzaFRva2VuQW5kUmVSZXF1ZXN0KHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4pIHtcclxuICAgIGlmICh0aGlzLiNpc1JlZnJlc2hpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IHRydWU7XHJcbiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy4jaGFuZGxlUmVmcmVzaFRva2VuKCk7XHJcbiAgICAgIGlmIChhY2Nlc3NUb2tlbikge1xyXG4gICAgICAgIHJlc3BvbnNlLmNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7YWNjZXNzVG9rZW59YDtcclxuICAgICAgICB0aGlzLiNyZXRyeVF1ZXVlcy5tYXAoKGNiKSA9PiBjYihyZXNwb25zZS5jb25maWcpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiNyZXRyeVF1ZXVlcyA9IFtdO1xyXG4gICAgICB0aGlzLiNpc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuI3JldHJ5UXVldWVzID0gW107XHJcbiAgICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBTZXQgcmVxdWVzdCBpbnRlcmNlcHRvciAqL1xyXG4gICNzZXRJbnRlcmNlcHRvcigpIHtcclxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGFzeW5jIChjb25maWcpID0+IHtcclxuICAgICAgY29uc3QgaGFuZGxlQ29uZmlnID0geyAuLi5jb25maWcgfTtcclxuICAgICAgaGFuZGxlQ29uZmlnLmhlYWRlcnNbJ3gtYXBwLWxhbmcnXSA9ICh0aGlzLiNsYW5ndWFnZUdldHRlcigpIHx8ICdVei1MYXRpbicpIGFzIExhbmdUeXBlOyAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXHJcblxyXG4gICAgICBpZiAoaGFuZGxlQ29uZmlnLmhlYWRlcnMpIHtcclxuICAgICAgICAvLyBTZXQgdG9rZW5cclxuICAgICAgICBoYW5kbGVDb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke1xyXG4gICAgICAgICAgbG9jYWxTdGcuZ2V0KCdtZXNzZW5nZXJUb2tlbicpPy5hY2Nlc3MgfHwgJydcclxuICAgICAgICB9YDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGhhbmRsZUNvbmZpZztcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcclxuICAgICAgKHJlc3BvbnNlKSA9PiByZXNwb25zZSxcclxuICAgICAgYXN5bmMgKGF4aW9zRXJyb3I6IEF4aW9zRXJyb3IpID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAoYXhpb3NFcnJvci5yZXNwb25zZT8uZGF0YVsnY29kZSddICYmXHJcbiAgICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uZGF0YVsnY29kZSddKSkgfHxcclxuICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uc3RhdHVzKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgLy8gb3JpZ2luYWwgcmVxdWVzdFxyXG4gICAgICAgICAgY29uc3Qgb3JpZ2luUmVxdWVzdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuI3JldHJ5UXVldWVzLnB1c2goKHJlZnJlc2hDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5pbnN0YW5jZS5yZXF1ZXN0KHJlZnJlc2hDb25maWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBhd2FpdCB0aGlzLiNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QoYXhpb3NFcnJvci5yZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG9yaWdpblJlcXVlc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGF4aW9zRXJyb3I7XHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=