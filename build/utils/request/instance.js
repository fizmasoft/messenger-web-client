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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcmVxdWVzdC9pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQU12RDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBUzlCOzs7T0FHRztJQUNILFlBQ0UsV0FBK0IsRUFDL0IsRUFDRSxlQUFlLEVBQ2YsY0FBYyxHQUlmOztRQWxCSCxvREFBdUI7UUFDdkIsdURBQXlCO1FBQ3pCLHNEQUFnQztRQUVoQyxtREFBb0M7UUFnQmxDLHVCQUFBLElBQUksdUNBQW1CLGNBQWMsTUFBQSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyx1QkFBQSxJQUFJLHFDQUFpQixLQUFLLE1BQUEsQ0FBQztRQUMzQix1QkFBQSxJQUFJLG9DQUFnQixFQUFFLE1BQUEsQ0FBQztRQUN2Qix1QkFBQSxJQUFJLHdDQUFvQixlQUFlLE1BQUEsQ0FBQztRQUN4Qyx1QkFBQSxJQUFJLDJFQUFnQixNQUFwQixJQUFJLENBQWtCLENBQUM7SUFDekIsQ0FBQztDQWdGRjs7OztRQTdFRyxNQUFNLEVBQ0osSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQ2YsR0FBRyxNQUFNLEtBQUs7YUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7YUFDOUIsR0FBRyxDQUF1Qix1QkFBQSxJQUFJLDRDQUFpQixFQUFFO1lBQ2hELE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUEsTUFBQSxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBD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dUJBQUEsSUFBSSx3Q0FBYSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWlDLEVBQUUsRUFBRTtvQkFDM0QsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLHVCQUFBLElBQUkscUZBQTBCLE1BQTlCLElBQUksRUFBMkIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTFELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLFVBQVUsQ0FBQztJQUNuQixDQUFDLENBQUEsQ0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXhpb3NFcnJvciwgQXhpb3NJbnN0YW5jZSwgQXhpb3NSZXF1ZXN0Q29uZmlnLCBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IGxvY2FsU3RnIH0gZnJvbSAnLi4vJztcbmltcG9ydCB7IFJFU1BPTlNFX0NPREVTIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50JztcbmltcG9ydCB7IElVc2VyTG9naW4gfSBmcm9tICcuLi8uLi90eXBlcy9hcGkvYXV0aCc7XG5pbXBvcnQgeyBMYW5nVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL3N5c3RlbSc7XG5cbnR5cGUgUmVmcmVzaFJlcXVlc3RRdWV1ZSA9IChjb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykgPT4gdm9pZDtcblxuLyoqXG4gKiBFbmNhcHN1bGF0ZSBheGlvcyByZXF1ZXN0IGNsYXNzXG4gKiBAYXV0aG9yIFVtYXI8Y3JlYXRpdmVib3kxOTk5QGdtYWlsLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEN1c3RvbUF4aW9zSW5zdGFuY2Uge1xuICByZWFkb25seSBpbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcblxuICAjaXNSZWZyZXNoaW5nOiBib29sZWFuO1xuICAjcmVmcmVzaFRva2VuVXJsOiBzdHJpbmc7XG4gICNsYW5ndWFnZUdldHRlcjogKCkgPT4gTGFuZ1R5cGU7XG5cbiAgI3JldHJ5UXVldWVzOiBSZWZyZXNoUmVxdWVzdFF1ZXVlW107XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBheGlvc0NvbmZpZyAtIGF4aW9zIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcsXG4gICAge1xuICAgICAgcmVmcmVzaFRva2VuVXJsLFxuICAgICAgbGFuZ3VhZ2VHZXR0ZXIsXG4gICAgfToge1xuICAgICAgcmVmcmVzaFRva2VuVXJsPzogc3RyaW5nO1xuICAgICAgbGFuZ3VhZ2VHZXR0ZXI6ICgpID0+IExhbmdUeXBlO1xuICAgIH0sXG4gICkge1xuICAgIHRoaXMuI2xhbmd1YWdlR2V0dGVyID0gbGFuZ3VhZ2VHZXR0ZXI7XG4gICAgdGhpcy5pbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZShheGlvc0NvbmZpZyk7XG4gICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcbiAgICB0aGlzLiNyZWZyZXNoVG9rZW5VcmwgPSByZWZyZXNoVG9rZW5Vcmw7XG4gICAgdGhpcy4jc2V0SW50ZXJjZXB0b3IoKTtcbiAgfVxuXG4gIGFzeW5jICNoYW5kbGVSZWZyZXNoVG9rZW4oKSB7XG4gICAgY29uc3Qge1xuICAgICAgZGF0YTogeyBkYXRhIH0sXG4gICAgfSA9IGF3YWl0IGF4aW9zXG4gICAgICAuY3JlYXRlKHRoaXMuaW5zdGFuY2UuZGVmYXVsdHMpXG4gICAgICAuZ2V0PHsgZGF0YTogSVVzZXJMb2dpbiB9Pih0aGlzLiNyZWZyZXNoVG9rZW5VcmwsIHtcbiAgICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7bG9jYWxTdGcuZ2V0KCdtZXNzZW5nZXJUb2tlbicpPy5yZWZyZXNoIHx8ICcnfWAgfSxcbiAgICAgIH0pO1xuICAgIGlmIChkYXRhICYmIGRhdGEudG9rZW4pIHtcbiAgICAgIGxvY2FsU3RnLnNldCgnbWVzc2VuZ2VyVG9rZW4nLCB7XG4gICAgICAgIGFjY2VzczogZGF0YS50b2tlbi5hY2Nlc3NUb2tlbixcbiAgICAgICAgcmVmcmVzaDogZGF0YS50b2tlbi5yZWZyZXNoVG9rZW4sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YS50b2tlbi5hY2Nlc3NUb2tlbjtcbiAgfVxuXG4gIGFzeW5jICNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QocmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55Pikge1xuICAgIGlmICh0aGlzLiNpc1JlZnJlc2hpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy4jaXNSZWZyZXNoaW5nID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy4jaGFuZGxlUmVmcmVzaFRva2VuKCk7XG4gICAgICBpZiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVzcG9uc2UuY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHthY2Nlc3NUb2tlbn1gO1xuICAgICAgICB0aGlzLiNyZXRyeVF1ZXVlcy5tYXAoKGNiKSA9PiBjYihyZXNwb25zZS5jb25maWcpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuI3JldHJ5UXVldWVzID0gW107XG4gICAgICB0aGlzLiNpc1JlZnJlc2hpbmcgPSBmYWxzZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy4jcmV0cnlRdWV1ZXMgPSBbXTtcbiAgICAgIHRoaXMuI2lzUmVmcmVzaGluZyA9IGZhbHNlO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldCByZXF1ZXN0IGludGVyY2VwdG9yICovXG4gICNzZXRJbnRlcmNlcHRvcigpIHtcbiAgICB0aGlzLmluc3RhbmNlLmludGVyY2VwdG9ycy5yZXF1ZXN0LnVzZShhc3luYyAoY29uZmlnKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVDb25maWcgPSB7IC4uLmNvbmZpZyB9O1xuICAgICAgaGFuZGxlQ29uZmlnLmhlYWRlcnNbJ3gtYXBwLWxhbmcnXSA9ICh0aGlzLiNsYW5ndWFnZUdldHRlcigpIHx8ICdVei1MYXRpbicpIGFzIExhbmdUeXBlOyAvLyBkeW5hbWljYWxseSBmZXRjaGluZyBsYW5ndWFnZSBpbmZvXG5cbiAgICAgIGlmIChoYW5kbGVDb25maWcuaGVhZGVycykge1xuICAgICAgICAvLyBTZXQgdG9rZW5cbiAgICAgICAgaGFuZGxlQ29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHtcbiAgICAgICAgICBsb2NhbFN0Zy5nZXQoJ21lc3NlbmdlclRva2VuJyk/LmFjY2VzcyB8fCAnJ1xuICAgICAgICB9YDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhhbmRsZUNvbmZpZztcbiAgICB9KTtcblxuICAgIHRoaXMuaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLnVzZShcbiAgICAgIChyZXNwb25zZSkgPT4gcmVzcG9uc2UsXG4gICAgICBhc3luYyAoYXhpb3NFcnJvcjogQXhpb3NFcnJvcikgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKGF4aW9zRXJyb3IucmVzcG9uc2U/LmRhdGFbJ2NvZGUnXSAmJlxuICAgICAgICAgICAgUkVTUE9OU0VfQ09ERVMuUkVGUkVTSF9UT0tFTl9DT0RFUy5pbmNsdWRlcyhheGlvc0Vycm9yLnJlc3BvbnNlPy5kYXRhWydjb2RlJ10pKSB8fFxuICAgICAgICAgIFJFU1BPTlNFX0NPREVTLlJFRlJFU0hfVE9LRU5fQ09ERVMuaW5jbHVkZXMoYXhpb3NFcnJvci5yZXNwb25zZT8uc3RhdHVzKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBvcmlnaW5hbCByZXF1ZXN0XG4gICAgICAgICAgY29uc3Qgb3JpZ2luUmVxdWVzdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiNyZXRyeVF1ZXVlcy5wdXNoKChyZWZyZXNoQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmluc3RhbmNlLnJlcXVlc3QocmVmcmVzaENvbmZpZykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhd2FpdCB0aGlzLiNyZWZyZXNoVG9rZW5BbmRSZVJlcXVlc3QoYXhpb3NFcnJvci5yZXNwb25zZSk7XG5cbiAgICAgICAgICByZXR1cm4gb3JpZ2luUmVxdWVzdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBheGlvc0Vycm9yO1xuICAgICAgfSxcbiAgICApO1xuICB9XG59XG4iXX0=