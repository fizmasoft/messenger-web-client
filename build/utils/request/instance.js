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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUl2RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBVzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxXQUFXLEVBQ1gsZUFBZSxFQUNmLGNBQWMsR0FPZjs7UUF6Qk0sbURBRWdEO1FBQ3pELG9EQUF1QjtRQUN2Qix1REFBeUI7UUFDekIsc0RBQWdDO1FBRWhDLG1EQUFvQztRQW9CbEMsdUJBQUEsSUFBSSx1Q0FBbUIsY0FBYyxNQUFBLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLHVCQUFBLElBQUkscUNBQWlCLEtBQUssTUFBQSxDQUFDO1FBQzNCLHVCQUFBLElBQUksb0NBQWdCLEVBQUUsTUFBQSxDQUFDO1FBQ3ZCLHVCQUFBLElBQUksd0NBQW9CLGVBQWUsTUFBQSxDQUFDO1FBQ3hDLHVCQUFBLElBQUksMkVBQWdCLE1BQXBCLElBQUksQ0FBa0IsQ0FBQztJQUN6QixDQUFDO0NBOEZGOzs7O1FBM0ZHLElBQUksQ0FBQyxDQUFBLE1BQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywwQ0FBRSxPQUFPLENBQUEsRUFBRSxDQUFDO1lBQzdDLElBQUksS0FHSCxDQUFDO1lBRUYsSUFBSSxPQUFPLHVCQUFBLElBQUksd0NBQWEsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDNUMsS0FBSyxHQUFHLE1BQU0sdUJBQUEsSUFBSSx3Q0FBYSxNQUFqQixJ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QUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFDdEIsQ0FBTyxVQUFzQixFQUFFLEVBQUU7O1FBQy9CLElBQ0UsQ0FBQyxDQUFBLE1BQUEsVUFBVSxDQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNoQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLE1BQUEsVUFBVSxDQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakYsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFBLFVBQVUsQ0FBQyxRQUFRLDBDQUFFLE1BQU0sQ0FBQyxFQUN4RSxDQUFDO1lBQ0QsbUJBQW1CO1lBQ25CLE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQzVDLHVCQUFBLElBQUksd0NBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFpQyxFQUFFLEVBQUU7b0JBQzNELE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSx1QkFBQSxJQUFJLHFGQUEwQixNQUE5QixJQUFJLEVBQTJCLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUxRCxPQUFPLGFBQWEsQ0FBQztRQUN2QixDQUFDO1FBQ0QsTUFBTSxVQUFVLENBQUM7SUFDbkIsQ0FBQyxDQUFBLENBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IElVc2VyTG9naW4gfSBmcm9tICcuLi8uLi90eXBlcy9hcGkvYXV0aCc7XHJcbmltcG9ydCB0eXBlIHsgTGFuZ1R5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zeXN0ZW0nO1xyXG5cclxuaW1wb3J0IHR5cGUgeyBBeGlvc0Vycm9yLCBBeGlvc0luc3RhbmNlLCBBeGlvc1JlcXVlc3RDb25maWcsIEF4aW9zUmVzcG9uc2UgfSBmcm9tICdheGlvcyc7XHJcblxyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5cclxuaW1wb3J0IHsgbG9jYWxTdGcgfSBmcm9tICcuLi8nO1xyXG5pbXBvcnQgeyBSRVNQT05TRV9DT0RFUyB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudCc7XHJcblxyXG50eXBlIFJlZnJlc2hSZXF1ZXN0UXVldWUgPSAoY29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcpID0+IHZvaWQ7XHJcblxyXG4vKipcclxuICogRW5jYXBzdWxhdGUgYXhpb3MgcmVxdWVzdCBjbGFzc1xyXG4gKiBAYXV0aG9yIFVtYXI8Y3JlYXRpdmVib3kxOTk5QGdtYWlsLmNvbT5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDdXN0b21BeGlvc0luc3RhbmNlIHtcclxuICByZWFkb25seSBpbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcclxuICByZWFkb25seSAjdG9rZW5HZXR0ZXI6XHJcbiAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICB8ICgoKSA9PiBQcm9taXNlPHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9Pik7XHJcbiAgI2lzUmVmcmVzaGluZzogYm9vbGVhbjtcclxuICAjcmVmcmVzaFRva2VuVXJsOiBzdHJpbmc7XHJcbiAgI2xhbmd1YWdlR2V0dGVyOiAoKSA9PiBMYW5nVHlwZTtcclxuXHJcbiAgI3JldHJ5UXVldWVzOiBSZWZyZXNoUmVxdWVzdFF1ZXVlW107XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGF4aW9zQ29uZmlnIC0gYXhpb3MgY29uZmlndXJhdGlvblxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgYXhpb3NDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZyxcclxuICAgIHtcclxuICAgICAgdG9rZW5HZXR0ZXIsXHJcbiAgICAgIHJlZnJlc2hUb2tlblVybCxcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXHJcbiAgICB9OiB7XHJcbiAgICAgIHJlZnJlc2hUb2tlblVybD86IHN0cmluZztcclxuICAgICAgbGFuZ3VhZ2VHZXR0ZXI6ICgpID0+IExhbmdUeXBlO1xyXG4gICAgICB0b2tlbkdldHRlcjpcclxuICAgICAgICB8IHsgYWNjZXNzOiBzdHJpbmc7IHJlZnJlc2g6IHN0cmluZyB9XHJcbiAgICAgICAgfCAoKCkgPT4gUHJvbWlzZTx7IGFjY2Vzczogc3RyaW5nOyByZWZyZXNoOiBzdHJpbmcgfT4pO1xyXG4gICAgfSxcclxuICApIHtcclxuICAgIHRoaXMuI2xhbmd1YWdlR2V0dGVyID0gbGFuZ3VhZ2VHZXR0ZXI7XHJcbiAgICB0aGlzLmluc3RhbmNlID0gYXhpb3MuY3JlYXRlKGF4aW9zQ29uZmlnKTtcclxuICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcclxuICAgIHRoaXMuI3JlZnJlc2hUb2tlblVybCA9IHJlZnJlc2hUb2tlblVybDtcclxuICAgIHRoaXMuI3NldEludGVyY2VwdG9yKCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyAjaGFuZGxlUmVmcmVzaFRva2VuKCkge1xyXG4gICAgaWYgKCFsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlclRva2VuJyk/LnJlZnJlc2gpIHtcclxuICAgICAgbGV0IHRva2VuOiB7XHJcbiAgICAgICAgYWNjZXNzOiBzdHJpbmc7XHJcbiAgICAgICAgcmVmcmVzaDogc3RyaW5nO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLiN0b2tlbkdldHRlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRva2VuID0gYXdhaXQgdGhpcy4jdG9rZW5HZXR0ZXIoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0b2tlbiA9IHRoaXMuI3Rva2VuR2V0dGVyO1xyXG4gICAgICB9XHJcbiAgICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB0b2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRhOiB7IGRhdGEgfSxcclxuICAgIH0gPSBhd2FpdCBheGlvc1xyXG4gICAgICAuY3JlYXRlKHRoaXMuaW5zdGFuY2UuZGVmYXVsdHMpXHJcbiAgICAgIC5nZXQ8eyBkYXRhOiBJVXNlckxvZ2luIH0+KHRoaXMuI3JlZnJlc2hUb2tlblVybCwge1xyXG4gICAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2xvY2FsU3RnLmdldCgnbWVzc2VuZ2VyVG9rZW4nKT8ucmVmcmVzaCB8fCAnJ31gIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgaWYgKGRhdGEgJiYgZGF0YS50b2tlbikge1xyXG4gICAgICBsb2NhbFN0Zy5zZXQoJ21lc3NlbmdlclRva2VuJywge1xyXG4gICAgICAgIGFjY2VzczogZGF0YS50b2tlbi5hY2Nlc3NUb2tlbixcclxuICAgICAgICByZWZyZXNoOiBkYXRhLnRva2VuLnJlZnJlc2hUb2tlbixcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGEudG9rZW4uYWNjZXNzVG9rZW47XHJcbiAgfVxyXG5cclxuICBhc3luYyAjcmVmcmVzaFRva2VuQW5kUmVSZXF1ZXN0KHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4pIHtcclxuICAgIGlmICh0aGlzLiNpc1JlZnJlc2hpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IHRydWU7XHJcbiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy4jaGFuZGxlUmVmcmVzaFRva2VuKCk7XHJcbiAgICAgIGlmIChhY2Nlc3NUb2tlbikge1xyXG4gICAgICAgIHJlc3BvbnNlLmNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7YWNjZXNzVG9rZW59YDtcclxuICAgICAgICB0aGlzLiNyZXRyeVF1ZXVlcy5tYXAoKGNiKSA9PiBjYihyZXNwb25zZS5jb25maWcpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiNyZXRyeVF1ZXVlcyA9IFtdO1xyXG4gICAgICB0aGlzLiNpc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuI3JldHJ5UXVldWVzID0gW107XHJcbiAgICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBTZXQgcmVxdWVzdCBpbnRlcmNlcHRvciAqL1xyXG4gICNzZXRJbnRlcmNlcHRvcigpIHtcclxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKGFzeW5jIChjb25maWcpID0+IHtcclxuICAgICAgY29uc3QgaGFuZGxlQ29uZmlnID0geyAuLi5jb25maWcgfTtcclxuICAgICAgaGFuZGxlQ29uZmlnLmhlYWRlcnNbJ3gtYXBwLWxhbmcnXSA9ICh0aGlzLiNsYW5ndWFnZUdldHRlcigpIHx8ICdVei1MYXRpbicpIGFzIExhbmdUeXBlOyAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXHJcblxyXG4gICAgICBpZiAoaGFuZGxlQ29uZmlnLmhlYWRlcnMpIHtcclxuICAgICAgICAvLyBTZXQgdG9rZW5cclxuICAgICAgICBoYW5kbGVDb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke1xyXG4gICAgICAgICAgbG9jYWxTdGcuZ2V0KCdtZXNzZW5nZXJUb2tlbicpPy5hY2Nlc3MgfHwgJydcclxuICAgICAgICB9YDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGhhbmRsZUNvbmZpZztcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcclxuICAgICAgKHJlc3BvbnNlKSA9PiByZXNwb25zZSxcclxuICAgICAgYXN5bmMgKGF4aW9zRXJyb3I6IEF4aW9zRXJyb3IpID0+IHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAoYXhpb3NFcnJvci5yZXNwb25zZT8uZGF0YVsnY29kZSddICYmXHJcbiAgICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uZGF0YVsnY29kZSddKSkgfHxcclxuICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uc3RhdHVzKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgLy8gb3JpZ2luYWwgcmVxdWVzdFxyXG4gICAgICAgICAgY29uc3Qgb3JpZ2luUmVxdWVzdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuI3JldHJ5UXVldWVzLnB1c2goKHJlZnJlc2hDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodGhpcy5pbnN0YW5jZS5yZXF1ZXN0KHJlZnJlc2hDb25maWcpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBhd2FpdCB0aGlzLiNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QoYXhpb3NFcnJvci5yZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG9yaWdpblJlcXVlc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGF4aW9zRXJyb3I7XHJcbiAgICAgIH0sXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=