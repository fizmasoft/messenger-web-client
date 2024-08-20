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
            localStg.set('messengerToken', { access: data.token.accessToken, refresh: data.token.refreshToken });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUl2RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBUzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxlQUFlLEVBQ2YsY0FBYyxHQUlmOztRQWxCSCxvREFBdUI7UUFDdkIsdURBQXlCO1FBQ3pCLHNEQUF5QztRQUV6QyxtREFBb0M7UUFnQmxDLHVCQUFBLElBQUksdUNBQW1CLGNBQWMsTUFBQSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyx1QkFBQSxJQUFJLHFDQUFpQixLQUFLLE1BQUEsQ0FBQztRQUMzQix1QkFBQSxJQUFJLG9DQUFnQixFQUFFLE1BQUEsQ0FBQztRQUN2Qix1QkFBQSxJQUFJLHdDQUFvQixlQUFlLE1BQUEsQ0FBQztRQUN4Qyx1QkFBQSxJQUFJLDJFQUFnQixNQUFwQixJQUFJLENBQWtCLENBQUM7SUFDekIsQ0FBQztDQWtFRjs7O1FBL0RHLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUs7YUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2FBQzlCLEdBQUcsQ0FBcUIsdUJBQUEsSUFBSSw0Q0FBaUIsQ0FBQyxDQUFDO1FBQ2xELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN2QixRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsTUFBTSxF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Q0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEF4aW9zRXJyb3IsIEF4aW9zSW5zdGFuY2UsIEF4aW9zUmVxdWVzdENvbmZpZywgQXhpb3NSZXNwb25zZSB9IGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgbG9jYWxTdGcgfSBmcm9tICcuLi8nO1xyXG5pbXBvcnQgeyBSRVNQT05TRV9DT0RFUyB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudCc7XHJcblxyXG50eXBlIFJlZnJlc2hSZXF1ZXN0UXVldWUgPSAoY29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcpID0+IHZvaWQ7XHJcblxyXG4vKipcclxuICogRW5jYXBzdWxhdGUgYXhpb3MgcmVxdWVzdCBjbGFzc1xyXG4gKiBAYXV0aG9yIFVtYXI8Y3JlYXRpdmVib3kxOTk5QGdtYWlsLmNvbT5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDdXN0b21BeGlvc0luc3RhbmNlIHtcclxuICByZWFkb25seSBpbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcclxuXHJcbiAgI2lzUmVmcmVzaGluZzogYm9vbGVhbjtcclxuICAjcmVmcmVzaFRva2VuVXJsOiBzdHJpbmc7XHJcbiAgI2xhbmd1YWdlR2V0dGVyOiAoKSA9PiBJMThuVHlwZS5MYW5nVHlwZTtcclxuXHJcbiAgI3JldHJ5UXVldWVzOiBSZWZyZXNoUmVxdWVzdFF1ZXVlW107XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGF4aW9zQ29uZmlnIC0gYXhpb3MgY29uZmlndXJhdGlvblxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgYXhpb3NDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZyxcclxuICAgIHtcclxuICAgICAgcmVmcmVzaFRva2VuVXJsLFxyXG4gICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgIH06IHtcclxuICAgICAgcmVmcmVzaFRva2VuVXJsPzogc3RyaW5nO1xyXG4gICAgICBsYW5ndWFnZUdldHRlcjogKCkgPT4gSTE4blR5cGUuTGFuZ1R5cGU7XHJcbiAgICB9LFxyXG4gICkge1xyXG4gICAgdGhpcy4jbGFuZ3VhZ2VHZXR0ZXIgPSBsYW5ndWFnZUdldHRlcjtcclxuICAgIHRoaXMuaW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoYXhpb3NDb25maWcpO1xyXG4gICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLiNyZXRyeVF1ZXVlcyA9IFtdO1xyXG4gICAgdGhpcy4jcmVmcmVzaFRva2VuVXJsID0gcmVmcmVzaFRva2VuVXJsO1xyXG4gICAgdGhpcy4jc2V0SW50ZXJjZXB0b3IoKTtcclxuICB9XHJcblxyXG4gIGFzeW5jICNoYW5kbGVSZWZyZXNoVG9rZW4oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgIC5jcmVhdGUodGhpcy5pbnN0YW5jZS5kZWZhdWx0cylcclxuICAgICAgLmdldDxBcGlBdXRoLklVc2VyTG9naW4+KHRoaXMuI3JlZnJlc2hUb2tlblVybCk7XHJcbiAgICBpZiAoZGF0YSAmJiBkYXRhLnRva2VuKSB7XHJcbiAgICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB7IGFjY2VzczogZGF0YS50b2tlbi5hY2Nlc3NUb2tlbiwgcmVmcmVzaDogZGF0YS50b2tlbi5yZWZyZXNoVG9rZW4gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGEudG9rZW4uYWNjZXNzVG9rZW47XHJcbiAgfVxyXG5cclxuICBhc3luYyAjcmVmcmVzaFRva2VuQW5kUmVSZXF1ZXN0KHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4pIHtcclxuICAgIGlmICh0aGlzLiNpc1JlZnJlc2hpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IHRydWU7XHJcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuI2hhbmRsZVJlZnJlc2hUb2tlbigpO1xyXG4gICAgaWYgKGFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgIHJlc3BvbnNlLmNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7YWNjZXNzVG9rZW59YDtcclxuICAgICAgdGhpcy4jcmV0cnlRdWV1ZXMubWFwKChjYikgPT4gY2IocmVzcG9uc2UuY29uZmlnKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLiNyZXRyeVF1ZXVlcyA9IFtdO1xyXG4gICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKiogU2V0IHJlcXVlc3QgaW50ZXJjZXB0b3IgKi9cclxuICAjc2V0SW50ZXJjZXB0b3IoKSB7XHJcbiAgICB0aGlzLmluc3RhbmNlLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZShhc3luYyAoY29uZmlnKSA9PiB7XHJcbiAgICAgIGNvbnN0IGhhbmRsZUNvbmZpZyA9IHsgLi4uY29uZmlnIH07XHJcbiAgICAgIGhhbmRsZUNvbmZpZy5oZWFkZXJzWyd4LWFwcC1sYW5nJ10gPSAodGhpcy4jbGFuZ3VhZ2VHZXR0ZXIoKSB8fFxyXG4gICAgICAgICdVei1MYXRpbicpIGFzIEkxOG5UeXBlLkxhbmdUeXBlOyAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXHJcblxyXG4gICAgICBpZiAoaGFuZGxlQ29uZmlnLmhlYWRlcnMpIHtcclxuICAgICAgICAvLyBTZXQgdG9rZW5cclxuICAgICAgICBoYW5kbGVDb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke2xvY2FsU3RnLmdldCgnbWVzc2VuZ2VyVG9rZW4nKT8uYWNjZXNzIHx8ICcnfWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBoYW5kbGVDb25maWc7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmluc3RhbmNlLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UoXHJcbiAgICAgIChyZXNwb25zZSkgPT4gcmVzcG9uc2UsXHJcbiAgICAgIGFzeW5jIChheGlvc0Vycm9yOiBBeGlvc0Vycm9yKSA9PiB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgKGF4aW9zRXJyb3IucmVzcG9uc2U/LmRhdGFbJ2NvZGUnXSAmJlxyXG4gICAgICAgICAgICBSRVNQT05TRV9DT0RFUy5SRUZSRVNIX1RPS0VOX0NPREVTLmluY2x1ZGVzKGF4aW9zRXJyb3IucmVzcG9uc2U/LmRhdGFbJ2NvZGUnXSkpIHx8XHJcbiAgICAgICAgICBSRVNQT05TRV9DT0RFUy5SRUZSRVNIX1RPS0VOX0NPREVTLmluY2x1ZGVzKGF4aW9zRXJyb3IucmVzcG9uc2U/LnN0YXR1cylcclxuICAgICAgICApIHtcclxuICAgICAgICAgIC8vIG9yaWdpbmFsIHJlcXVlc3RcclxuICAgICAgICAgIGNvbnN0IG9yaWdpblJlcXVlc3QgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiNyZXRyeVF1ZXVlcy5wdXNoKChyZWZyZXNoQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcpID0+IHtcclxuICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuaW5zdGFuY2UucmVxdWVzdChyZWZyZXNoQ29uZmlnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgYXdhaXQgdGhpcy4jcmVmcmVzaFRva2VuQW5kUmVSZXF1ZXN0KGF4aW9zRXJyb3IucmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgIHJldHVybiBvcmlnaW5SZXF1ZXN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBheGlvc0Vycm9yO1xyXG4gICAgICB9LFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19