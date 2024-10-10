var _CustomAxiosInstance_instances, _CustomAxiosInstance_tokenGetter, _CustomAxiosInstance_isRefreshing, _CustomAxiosInstance_refreshTokenUrl, _CustomAxiosInstance_languageGetter, _CustomAxiosInstance_retryQueues, _CustomAxiosInstance_handleRefreshToken, _CustomAxiosInstance_refreshTokenAndReRequest, _CustomAxiosInstance_setInterceptor;
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
    constructor(axiosConfig, { tokenGetter, refreshTokenUrl, languageGetter, }) {
        _CustomAxiosInstance_instances.add(this);
        _CustomAxiosInstance_tokenGetter.set(this, void 0);
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
_CustomAxiosInstance_tokenGetter = new WeakMap(), _CustomAxiosInstance_isRefreshing = new WeakMap(), _CustomAxiosInstance_refreshTokenUrl = new WeakMap(), _CustomAxiosInstance_languageGetter = new WeakMap(), _CustomAxiosInstance_retryQueues = new WeakMap(), _CustomAxiosInstance_instances = new WeakSet(), _CustomAxiosInstance_handleRefreshToken = function _CustomAxiosInstance_handleRefreshToken() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!((_a = localStg.get('messengerToken')) === null || _a === void 0 ? void 0 : _a.refresh)) {
            let token;
            if (typeof __classPrivateFieldGet(this, _CustomAxiosInstance_tokenGetter, "f") === 'function') {
                token = yield __classPrivateFieldGet(this, _CustomAxiosInstance_tokenGetter, "f").call(this);
            }
            else {
                token = __classPrivateFieldGet(this, _CustomAxiosInstance_tokenGetter, "f");
            }
            localStg.set('messengerToken', token);
        }
        const { data: { data }, } = yield axios
            .create(this.instance.defaults)
            .get(__classPrivateFieldGet(this, _CustomAxiosInstance_refreshTokenUrl, "f"), {
            headers: { Authorization: `Bearer ${((_b = localStg.get('messengerToken')) === null || _b === void 0 ? void 0 : _b.refresh) || ''}` },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQU12RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBVzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxXQUFXLEVBQ1gsZUFBZSxFQUNmLGNBQWMsR0FPZjs7UUF6Qk0sbURBRWdEO1FBQ3pELG9EQUF1QjtRQUN2Qix1REFBeUI7UUFDekIsc0RBQWdDO1FBRWhDLG1EQUFvQztRQW9CbEMsdUJBQUEsSUFBSSx1Q0FBbUIsY0FBYyxNQUFBLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLHVCQUFBLElBQUkscUNBQWlCLEtBQUssTUFBQSxDQUFDO1FBQzNCLHVCQUFBLElBQUksb0NBQWdCLEVBQUUsTUFBQSxDQUFDO1FBQ3ZCLHVCQUFBLElBQUksd0NBQW9CLGVBQWUsTUFBQSxDQUFDO1FBQ3hDLHVCQUFBLElBQUksMkVBQWdCLE1BQXBCLElBQUksQ0FBa0IsQ0FBQztJQUN6QixDQUFDO0NBOEZGOzs7O1FBM0ZHLElBQUksQ0FBQyxDQUFBLE1BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywwQ0FBRSxPQUFPLENBQUEsRUFBRSxDQUFDO1lBQzdDLElBQUksS0FHSCxDQUFDO1lBRUYsSUFBSSxPQUFPLHVCQUFBLElBQUksd0NBQWEsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDNUMsS0FBSyxHQUFHLE1BQU0sdUJBQUEsSUFBSSx3Q0FBYSxNQUFqQixJ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QUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFDdEIsQ0FBTyxVQUFzQixFQUFFLEVBQUU7O1FBQy9CLElBQ0UsQ0FBQyxDQUFBLE1BQUEsVUFBVSxDQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNoQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLE1BQUEsVUFBVSxDQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakYsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFBLFVBQVUsQ0FBQyxRQUFRLDBDQUFFLE1BQU0sQ0FBQyxFQUN4RSxDQUFDO1lBQ0QsbUJBQW1CO1lBQ25CLE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQzVDLHVCQUFBLElBQUksd0NBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFpQyxFQUFFLEVBQUU7b0JBQzNELE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSx1QkFBQSxJQUFJLHFGQUEwQixNQUE5QixJQUFJLEVBQTJCLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUxRCxPQUFPLGFBQWEsQ0FBQztRQUN2QixDQUFDO1FBQ0QsTUFBTSxVQUFVLENBQUM7SUFDbkIsQ0FBQyxDQUFBLENBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEF4aW9zRXJyb3IsIEF4aW9zSW5zdGFuY2UsIEF4aW9zUmVxdWVzdENvbmZpZywgQXhpb3NSZXNwb25zZSB9IGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IHsgbG9jYWxTdGcgfSBmcm9tICcuLi8nO1xyXG5pbXBvcnQgeyBSRVNQT05TRV9DT0RFUyB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudCc7XHJcbmltcG9ydCB7IElVc2VyTG9naW4gfSBmcm9tICcuLi8uLi90eXBlcy9hcGkvYXV0aCc7XHJcbmltcG9ydCB7IExhbmdUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvc3lzdGVtJztcclxuXHJcbnR5cGUgUmVmcmVzaFJlcXVlc3RRdWV1ZSA9IChjb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykgPT4gdm9pZDtcclxuXHJcbi8qKlxyXG4gKiBFbmNhcHN1bGF0ZSBheGlvcyByZXF1ZXN0IGNsYXNzXHJcbiAqIEBhdXRob3IgVW1hcjxjcmVhdGl2ZWJveTE5OTlAZ21haWwuY29tPlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN1c3RvbUF4aW9zSW5zdGFuY2Uge1xyXG4gIHJlYWRvbmx5IGluc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xyXG4gIHJlYWRvbmx5ICN0b2tlbkdldHRlcjpcclxuICAgIHwgeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH1cclxuICAgIHwgKCgpID0+IFByb21pc2U8eyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH0+KTtcclxuICAjaXNSZWZyZXNoaW5nOiBib29sZWFuO1xyXG4gICNyZWZyZXNoVG9rZW5Vcmw6IHN0cmluZztcclxuICAjbGFuZ3VhZ2VHZXR0ZXI6ICgpID0+IExhbmdUeXBlO1xyXG5cclxuICAjcmV0cnlRdWV1ZXM6IFJlZnJlc2hSZXF1ZXN0UXVldWVbXTtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXhpb3NDb25maWcgLSBheGlvcyBjb25maWd1cmF0aW9uXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBheGlvc0NvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnLFxyXG4gICAge1xyXG4gICAgICB0b2tlbkdldHRlcixcclxuICAgICAgcmVmcmVzaFRva2VuVXJsLFxyXG4gICAgICBsYW5ndWFnZUdldHRlcixcclxuICAgIH06IHtcclxuICAgICAgcmVmcmVzaFRva2VuVXJsPzogc3RyaW5nO1xyXG4gICAgICBsYW5ndWFnZUdldHRlcjogKCkgPT4gTGFuZ1R5cGU7XHJcbiAgICAgIHRva2VuR2V0dGVyOlxyXG4gICAgICAgIHwgeyBhY2Nlc3M6IHN0cmluZzsgcmVmcmVzaDogc3RyaW5nIH1cclxuICAgICAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XHJcbiAgICB9LFxyXG4gICkge1xyXG4gICAgdGhpcy4jbGFuZ3VhZ2VHZXR0ZXIgPSBsYW5ndWFnZUdldHRlcjtcclxuICAgIHRoaXMuaW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoYXhpb3NDb25maWcpO1xyXG4gICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLiNyZXRyeVF1ZXVlcyA9IFtdO1xyXG4gICAgdGhpcy4jcmVmcmVzaFRva2VuVXJsID0gcmVmcmVzaFRva2VuVXJsO1xyXG4gICAgdGhpcy4jc2V0SW50ZXJjZXB0b3IoKTtcclxuICB9XHJcblxyXG4gIGFzeW5jICNoYW5kbGVSZWZyZXNoVG9rZW4oKSB7XHJcbiAgICBpZiAoIWxvY2FsU3RnLmdldCgnbWVzc2VuZ2VyVG9rZW4nKT8ucmVmcmVzaCkge1xyXG4gICAgICBsZXQgdG9rZW46IHtcclxuICAgICAgICBhY2Nlc3M6IHN0cmluZztcclxuICAgICAgICByZWZyZXNoOiBzdHJpbmc7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuI3Rva2VuR2V0dGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdG9rZW4gPSBhd2FpdCB0aGlzLiN0b2tlbkdldHRlcigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRva2VuID0gdGhpcy4jdG9rZW5HZXR0ZXI7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdGcuc2V0KCdtZXNzZW5nZXJUb2tlbicsIHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGRhdGE6IHsgZGF0YSB9LFxyXG4gICAgfSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgIC5jcmVhdGUodGhpcy5pbnN0YW5jZS5kZWZhdWx0cylcclxuICAgICAgLmdldDx7IGRhdGE6IElVc2VyTG9naW4gfT4odGhpcy4jcmVmcmVzaFRva2VuVXJsLCB7XHJcbiAgICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7bG9jYWxTdGcuZ2V0KCdtZXNzZW5nZXJUb2tlbicpPy5yZWZyZXNoIHx8ICcnfWAgfSxcclxuICAgICAgfSk7XHJcbiAgICBpZiAoZGF0YSAmJiBkYXRhLnRva2VuKSB7XHJcbiAgICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB7XHJcbiAgICAgICAgYWNjZXNzOiBkYXRhLnRva2VuLmFjY2Vzc1Rva2VuLFxyXG4gICAgICAgIHJlZnJlc2g6IGRhdGEudG9rZW4ucmVmcmVzaFRva2VuLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YS50b2tlbi5hY2Nlc3NUb2tlbjtcclxuICB9XHJcblxyXG4gIGFzeW5jICNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QocmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55Pikge1xyXG4gICAgaWYgKHRoaXMuI2lzUmVmcmVzaGluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gdHJ1ZTtcclxuICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLiNoYW5kbGVSZWZyZXNoVG9rZW4oKTtcclxuICAgICAgaWYgKGFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgICAgcmVzcG9uc2UuY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHthY2Nlc3NUb2tlbn1gO1xyXG4gICAgICAgIHRoaXMuI3JldHJ5UXVldWVzLm1hcCgoY2IpID0+IGNiKHJlc3BvbnNlLmNvbmZpZykpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuI3JldHJ5UXVldWVzID0gW107XHJcbiAgICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcclxuICAgICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIFNldCByZXF1ZXN0IGludGVyY2VwdG9yICovXHJcbiAgI3NldEludGVyY2VwdG9yKCkge1xyXG4gICAgdGhpcy5pbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoYXN5bmMgKGNvbmZpZykgPT4ge1xyXG4gICAgICBjb25zdCBoYW5kbGVDb25maWcgPSB7IC4uLmNvbmZpZyB9O1xyXG4gICAgICBoYW5kbGVDb25maWcuaGVhZGVyc1sneC1hcHAtbGFuZyddID0gKHRoaXMuI2xhbmd1YWdlR2V0dGVyKCkgfHwgJ1V6LUxhdGluJykgYXMgTGFuZ1R5cGU7IC8vIGR5bmFtaWNhbGx5IGZldGNoaW5nIGxhbmd1YWdlIGluZm9cclxuXHJcbiAgICAgIGlmIChoYW5kbGVDb25maWcuaGVhZGVycykge1xyXG4gICAgICAgIC8vIFNldCB0b2tlblxyXG4gICAgICAgIGhhbmRsZUNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7XHJcbiAgICAgICAgICBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlclRva2VuJyk/LmFjY2VzcyB8fCAnJ1xyXG4gICAgICAgIH1gO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gaGFuZGxlQ29uZmlnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZS5pbnRlcmNlcHRvcnMucmVzcG9uc2UudXNlKFxyXG4gICAgICAocmVzcG9uc2UpID0+IHJlc3BvbnNlLFxyXG4gICAgICBhc3luYyAoYXhpb3NFcnJvcjogQXhpb3NFcnJvcikgPT4ge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIChheGlvc0Vycm9yLnJlc3BvbnNlPy5kYXRhWydjb2RlJ10gJiZcclxuICAgICAgICAgICAgUkVTUE9OU0VfQ09ERVMuUkVGUkVTSF9UT0tFTl9DT0RFUy5pbmNsdWRlcyhheGlvc0Vycm9yLnJlc3BvbnNlPy5kYXRhWydjb2RlJ10pKSB8fFxyXG4gICAgICAgICAgUkVTUE9OU0VfQ09ERVMuUkVGUkVTSF9UT0tFTl9DT0RFUy5pbmNsdWRlcyhheGlvc0Vycm9yLnJlc3BvbnNlPy5zdGF0dXMpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAvLyBvcmlnaW5hbCByZXF1ZXN0XHJcbiAgICAgICAgICBjb25zdCBvcmlnaW5SZXF1ZXN0ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy4jcmV0cnlRdWV1ZXMucHVzaCgocmVmcmVzaENvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmluc3RhbmNlLnJlcXVlc3QocmVmcmVzaENvbmZpZykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGF3YWl0IHRoaXMuI3JlZnJlc2hUb2tlbkFuZFJlUmVxdWVzdChheGlvc0Vycm9yLnJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gb3JpZ2luUmVxdWVzdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgYXhpb3NFcnJvcjtcclxuICAgICAgfSxcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==