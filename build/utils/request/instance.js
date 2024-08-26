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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQU12RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBUzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxlQUFlLEVBQ2YsY0FBYyxHQUlmOztRQWxCSCxvREFBdUI7UUFDdkIsdURBQXlCO1FBQ3pCLHNEQUFnQztRQUVoQyxtREFBb0M7UUFnQmxDLHVCQUFBLElBQUksdUNBQW1CLGNBQWMsTUFBQSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyx1QkFBQSxJQUFJLHFDQUFpQixLQUFLLE1BQUEsQ0FBQztRQUMzQix1QkFBQSxJQUFJLG9DQUFnQixFQUFFLE1BQUEsQ0FBQztRQUN2Qix1QkFBQSxJQUFJLHdDQUFvQixlQUFlLE1BQUEsQ0FBQztRQUN4Qyx1QkFBQSxJQUFJLDJFQUFnQixNQUFwQixJQUFJLENBQWtCLENBQUM7SUFDekIsQ0FBQztDQXNFRjs7O1FBbkVHLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUs7YUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2FBQzlCLEdBQUcsQ0FBYSx1QkFBQSxJQUFJLDRDQUFpQixDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzdCLE1BQU0s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Q0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXhpb3NFcnJvciwgQXhpb3NJbnN0YW5jZSwgQXhpb3NSZXF1ZXN0Q29uZmlnLCBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgeyBsb2NhbFN0ZyB9IGZyb20gJy4uLyc7XHJcbmltcG9ydCB7IFJFU1BPTlNFX0NPREVTIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50JztcclxuaW1wb3J0IHsgSVVzZXJMb2dpbiB9IGZyb20gJy4uLy4uL3R5cGVzL2FwaS9hdXRoJztcclxuaW1wb3J0IHsgTGFuZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zeXN0ZW0nO1xyXG5cclxudHlwZSBSZWZyZXNoUmVxdWVzdFF1ZXVlID0gKGNvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnKSA9PiB2b2lkO1xyXG5cclxuLyoqXHJcbiAqIEVuY2Fwc3VsYXRlIGF4aW9zIHJlcXVlc3QgY2xhc3NcclxuICogQGF1dGhvciBVbWFyPGNyZWF0aXZlYm95MTk5OUBnbWFpbC5jb20+XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ3VzdG9tQXhpb3NJbnN0YW5jZSB7XHJcbiAgcmVhZG9ubHkgaW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XHJcblxyXG4gICNpc1JlZnJlc2hpbmc6IGJvb2xlYW47XHJcbiAgI3JlZnJlc2hUb2tlblVybDogc3RyaW5nO1xyXG4gICNsYW5ndWFnZUdldHRlcjogKCkgPT4gTGFuZ1R5cGU7XHJcblxyXG4gICNyZXRyeVF1ZXVlczogUmVmcmVzaFJlcXVlc3RRdWV1ZVtdO1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBheGlvc0NvbmZpZyAtIGF4aW9zIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcsXHJcbiAgICB7XHJcbiAgICAgIHJlZnJlc2hUb2tlblVybCxcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXHJcbiAgICB9OiB7XHJcbiAgICAgIHJlZnJlc2hUb2tlblVybD86IHN0cmluZztcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXI6ICgpID0+IExhbmdUeXBlO1xyXG4gICAgfSxcclxuICApIHtcclxuICAgIHRoaXMuI2xhbmd1YWdlR2V0dGVyID0gbGFuZ3VhZ2VHZXR0ZXI7XHJcbiAgICB0aGlzLmluc3RhbmNlID0gYXhpb3MuY3JlYXRlKGF4aW9zQ29uZmlnKTtcclxuICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcclxuICAgIHRoaXMuI3JlZnJlc2hUb2tlblVybCA9IHJlZnJlc2hUb2tlblVybDtcclxuICAgIHRoaXMuI3NldEludGVyY2VwdG9yKCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyAjaGFuZGxlUmVmcmVzaFRva2VuKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBheGlvc1xyXG4gICAgICAuY3JlYXRlKHRoaXMuaW5zdGFuY2UuZGVmYXVsdHMpXHJcbiAgICAgIC5nZXQ8SVVzZXJMb2dpbj4odGhpcy4jcmVmcmVzaFRva2VuVXJsKTtcclxuICAgIGlmIChkYXRhICYmIGRhdGEudG9rZW4pIHtcclxuICAgICAgbG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJUb2tlbicsIHtcclxuICAgICAgICBhY2Nlc3M6IGRhdGEudG9rZW4uYWNjZXNzVG9rZW4sXHJcbiAgICAgICAgcmVmcmVzaDogZGF0YS50b2tlbi5yZWZyZXNoVG9rZW4sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhLnRva2VuLmFjY2Vzc1Rva2VuO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgI3JlZnJlc2hUb2tlbkFuZFJlUmVxdWVzdChyZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+KSB7XHJcbiAgICBpZiAodGhpcy4jaXNSZWZyZXNoaW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiNpc1JlZnJlc2hpbmcgPSB0cnVlO1xyXG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLiNoYW5kbGVSZWZyZXNoVG9rZW4oKTtcclxuICAgIGlmIChhY2Nlc3NUb2tlbikge1xyXG4gICAgICByZXNwb25zZS5jb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke2FjY2Vzc1Rva2VufWA7XHJcbiAgICAgIHRoaXMuI3JldHJ5UXVldWVzLm1hcCgoY2IpID0+IGNiKHJlc3BvbnNlLmNvbmZpZykpO1xyXG4gICAgfVxyXG4gICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcclxuICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNldCByZXF1ZXN0IGludGVyY2VwdG9yICovXHJcbiAgI3NldEludGVyY2VwdG9yKCkge1xyXG4gICAgdGhpcy5pbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoYXN5bmMgKGNvbmZpZykgPT4ge1xyXG4gICAgICBjb25zdCBoYW5kbGVDb25maWcgPSB7IC4uLmNvbmZpZyB9O1xyXG4gICAgICBoYW5kbGVDb25maWcuaGVhZGVyc1sneC1hcHAtbGFuZyddID0gKHRoaXMuI2xhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgTGFuZ1R5cGU7IC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuXHJcbiAgICAgIGlmIChoYW5kbGVDb25maWcuaGVhZGVycykge1xyXG4gICAgICAgIC8vIFNldCB0b2tlblxyXG4gICAgICAgIGhhbmRsZUNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7XHJcbiAgICAgICAgICBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlclRva2VuJyk/LmFjY2VzcyB8fCAnJ1xyXG4gICAgICAgIH1gO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaGFuZGxlQ29uZmlnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKFxyXG4gICAgICAocmVzcG9uc2UpID0+IHJlc3BvbnNlLFxyXG4gICAgICBhc3luYyAoYXhpb3NFcnJvcjogQXhpb3NFcnJvcikgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChheGlvc0Vycm9yLnJlc3BvbnNlPy5kYXRhWydjb2RlJ10gJiZcclxuICAgICAgICAgICAgUkVTUE9OU0VfQ09ERVMuUkVGUkVTSF9UT0tFTl9DT0RFUy5pbmNsdWRlcyhheGlvc0Vycm9yLnJlc3BvbnNlPy5kYXRhWydjb2RlJ10pKSB8fFxyXG4gICAgICAgICAgUkVTUE9OU0VfQ09ERVMuUkVGUkVTSF9UT0tFTl9DT0RFUy5pbmNsdWRlcyhheGlvc0Vycm9yLnJlc3BvbnNlPy5zdGF0dXMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAvLyBvcmlnaW5hbCByZXF1ZXN0XHJcbiAgICAgICAgICBjb25zdCBvcmlnaW5SZXF1ZXN0ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4jcmV0cnlRdWV1ZXMucHVzaCgocmVmcmVzaENvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmluc3RhbmNlLnJlcXVlc3QocmVmcmVzaENvbmZpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGF3YWl0IHRoaXMuI3JlZnJlc2hUb2tlbkFuZFJlUmVxdWVzdChheGlvc0Vycm9yLnJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gb3JpZ2luUmVxdWVzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgYXhpb3NFcnJvcjtcclxuICAgICAgfSxcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==