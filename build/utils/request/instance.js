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
        const { data } = yield axios
            .create(this.instance.defaults)
            .get(__classPrivateFieldGet(this, _CustomAxiosInstance_refreshTokenUrl, "f"));
        if (data && data.token) {
            localStg.set('token', { access: data.token.accessToken, refresh: data.token.refreshToken });
        }
        return data.token.accessToken;
    });
}, _CustomAxiosInstance_refreshTokenAndReRequest = function _CustomAxiosInstance_refreshTokenAndReRequest(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (__classPrivateFieldGet(this, _CustomAxiosInstance_isRefreshing, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _CustomAxiosInstance_isRefreshing, true, "f");
        const accessToken = yield __classPrivateFieldGet(this, _CustomAxiosInstance_instances, "m", _CustomAxiosInstance_handleRefreshToken).call(this);
        if (accessToken) {
            response.config.headers.Authorization = `Bearer ${accessToken}`;
            __classPrivateFieldGet(this, _CustomAxiosInstance_retryQueues, "f").map((cb) => cb(response.config));
        }
        __classPrivateFieldSet(this, _CustomAxiosInstance_retryQueues, [], "f");
        __classPrivateFieldSet(this, _CustomAxiosInstance_isRefreshing, false, "f");
    });
}, _CustomAxiosInstance_setInterceptor = function _CustomAxiosInstance_setInterceptor() {
    this.instance.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const handleConfig = Object.assign({}, config);
        handleConfig.headers['x-app-lang'] = (__classPrivateFieldGet(this, _CustomAxiosInstance_languageGetter, "f").call(this) ||
            'Uz-Latin'); // dynamically fetching language info
        if (handleConfig.headers) {
            // Set token
            handleConfig.headers.Authorization = `Bearer ${((_a = localStg.get('token')) === null || _a === void 0 ? void 0 : _a.access) || ''}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUl2RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBUzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxlQUFlLEVBQ2YsY0FBYyxHQUlmOztRQWxCSCxvREFBdUI7UUFDdkIsdURBQXlCO1FBQ3pCLHNEQUF5QztRQUV6QyxtREFBb0M7UUFnQmxDLHVCQUFBLElBQUksdUNBQW1CLGNBQWMsTUFBQSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyx1QkFBQSxJQUFJLHFDQUFpQixLQUFLLE1BQUEsQ0FBQztRQUMzQix1QkFBQSxJQUFJLG9DQUFnQixFQUFFLE1BQUEsQ0FBQztRQUN2Qix1QkFBQSxJQUFJLHdDQUFvQixlQUFlLE1BQUEsQ0FBQztRQUN4Qyx1QkFBQSxJQUFJLDJFQUFnQixNQUFwQixJQUFJLENBQWtCLENBQUM7SUFDekIsQ0FBQztDQWtFRjs7O1FBL0RHLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUs7YUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2FBQzlCLEdBQUcsQ0FBcUIsdUJBQUEsSUFBSSw0Q0FBaUIsQ0FBQyxDQUFDO1FBQ2xELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN2QixRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFB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QUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXhpb3NFcnJvciwgQXhpb3NJbnN0YW5jZSwgQXhpb3NSZXF1ZXN0Q29uZmlnLCBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBsb2NhbFN0ZyB9IGZyb20gJy4uLyc7XHJcbmltcG9ydCB7IFJFU1BPTlNFX0NPREVTIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50JztcclxuXHJcbnR5cGUgUmVmcmVzaFJlcXVlc3RRdWV1ZSA9IChjb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykgPT4gdm9pZDtcclxuXHJcbi8qKlxyXG4gKiBFbmNhcHN1bGF0ZSBheGlvcyByZXF1ZXN0IGNsYXNzXHJcbiAqIEBhdXRob3IgVW1hcjxjcmVhdGl2ZWJveTE5OTlAZ21haWwuY29tPlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN1c3RvbUF4aW9zSW5zdGFuY2Uge1xyXG4gIHJlYWRvbmx5IGluc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xyXG5cclxuICAjaXNSZWZyZXNoaW5nOiBib29sZWFuO1xyXG4gICNyZWZyZXNoVG9rZW5Vcmw6IHN0cmluZztcclxuICAjbGFuZ3VhZ2VHZXR0ZXI6ICgpID0+IEkxOG5UeXBlLkxhbmdUeXBlO1xyXG5cclxuICAjcmV0cnlRdWV1ZXM6IFJlZnJlc2hSZXF1ZXN0UXVldWVbXTtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXhpb3NDb25maWcgLSBheGlvcyBjb25maWd1cmF0aW9uXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBheGlvc0NvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnLFxyXG4gICAge1xyXG4gICAgICByZWZyZXNoVG9rZW5VcmwsXHJcbiAgICAgIGxhbmd1YWdlR2V0dGVyLFxyXG4gICAgfToge1xyXG4gICAgICByZWZyZXNoVG9rZW5Vcmw/OiBzdHJpbmc7XHJcbiAgICAgIGxhbmd1YWdlR2V0dGVyOiAoKSA9PiBJMThuVHlwZS5MYW5nVHlwZTtcclxuICAgIH0sXHJcbiAgKSB7XHJcbiAgICB0aGlzLiNsYW5ndWFnZUdldHRlciA9IGxhbmd1YWdlR2V0dGVyO1xyXG4gICAgdGhpcy5pbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZShheGlvc0NvbmZpZyk7XHJcbiAgICB0aGlzLiNpc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuI3JldHJ5UXVldWVzID0gW107XHJcbiAgICB0aGlzLiNyZWZyZXNoVG9rZW5VcmwgPSByZWZyZXNoVG9rZW5Vcmw7XHJcbiAgICB0aGlzLiNzZXRJbnRlcmNlcHRvcigpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgI2hhbmRsZVJlZnJlc2hUb2tlbigpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgYXhpb3NcclxuICAgICAgLmNyZWF0ZSh0aGlzLmluc3RhbmNlLmRlZmF1bHRzKVxyXG4gICAgICAuZ2V0PEFwaUF1dGguSVVzZXJMb2dpbj4odGhpcy4jcmVmcmVzaFRva2VuVXJsKTtcclxuICAgIGlmIChkYXRhICYmIGRhdGEudG9rZW4pIHtcclxuICAgICAgbG9jYWxTdGcuc2V0KCd0b2tlbicsIHsgYWNjZXNzOiBkYXRhLnRva2VuLmFjY2Vzc1Rva2VuLCByZWZyZXNoOiBkYXRhLnRva2VuLnJlZnJlc2hUb2tlbiB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YS50b2tlbi5hY2Nlc3NUb2tlbjtcclxuICB9XHJcblxyXG4gIGFzeW5jICNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QocmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55Pikge1xyXG4gICAgaWYgKHRoaXMuI2lzUmVmcmVzaGluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gdHJ1ZTtcclxuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy4jaGFuZGxlUmVmcmVzaFRva2VuKCk7XHJcbiAgICBpZiAoYWNjZXNzVG9rZW4pIHtcclxuICAgICAgcmVzcG9uc2UuY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHthY2Nlc3NUb2tlbn1gO1xyXG4gICAgICB0aGlzLiNyZXRyeVF1ZXVlcy5tYXAoKGNiKSA9PiBjYihyZXNwb25zZS5jb25maWcpKTtcclxuICAgIH1cclxuICAgIHRoaXMuI3JldHJ5UXVldWVzID0gW107XHJcbiAgICB0aGlzLiNpc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKiBTZXQgcmVxdWVzdCBpbnRlcmNlcHRvciAqL1xyXG4gICNzZXRJbnRlcmNlcHRvcigpIHtcclxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGFzeW5jIChjb25maWcpID0+IHtcclxuICAgICAgY29uc3QgaGFuZGxlQ29uZmlnID0geyAuLi5jb25maWcgfTtcclxuICAgICAgaGFuZGxlQ29uZmlnLmhlYWRlcnNbJ3gtYXBwLWxhbmcnXSA9ICh0aGlzLiNsYW5ndWFnZUdldHRlcigpIHx8XHJcbiAgICAgICAgJ1V6LUxhdGluJykgYXMgSTE4blR5cGUuTGFuZ1R5cGU7IC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuXHJcbiAgICAgIGlmIChoYW5kbGVDb25maWcuaGVhZGVycykge1xyXG4gICAgICAgIC8vIFNldCB0b2tlblxyXG4gICAgICAgIGhhbmRsZUNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7bG9jYWxTdGcuZ2V0KCd0b2tlbicpPy5hY2Nlc3MgfHwgJyd9YDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGhhbmRsZUNvbmZpZztcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcclxuICAgICAgKHJlc3BvbnNlKSA9PiByZXNwb25zZSxcclxuICAgICAgYXN5bmMgKGF4aW9zRXJyb3I6IEF4aW9zRXJyb3IpID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAoYXhpb3NFcnJvci5yZXNwb25zZT8uZGF0YVsnY29kZSddICYmXHJcbiAgICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uZGF0YVsnY29kZSddKSkgfHxcclxuICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uc3RhdHVzKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgLy8gb3JpZ2luYWwgcmVxdWVzdFxyXG4gICAgICAgICAgY29uc3Qgb3JpZ2luUmVxdWVzdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuI3JldHJ5UXVldWVzLnB1c2goKHJlZnJlc2hDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5pbnN0YW5jZS5yZXF1ZXN0KHJlZnJlc2hDb25maWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBhd2FpdCB0aGlzLiNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QoYXhpb3NFcnJvci5yZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG9yaWdpblJlcXVlc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGF4aW9zRXJyb3I7XHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=