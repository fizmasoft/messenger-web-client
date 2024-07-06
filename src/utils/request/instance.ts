import axios from 'axios';
import type { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { localStg } from '../';

type RefreshRequestQueue = (config: AxiosRequestConfig) => void;

/**
 * Encapsulate axios request class
 * @author Umar<creativeboy1999@gmail.com>
 */
export default class CustomAxiosInstance {
  readonly instance: AxiosInstance;

  readonly #handleRefreshToken: () => Promise<string>;

  #isRefreshing: boolean;

  #retryQueues: RefreshRequestQueue[];

  /**
   *
   * @param axiosConfig - axios configuration
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    { handleRefreshToken }: { handleRefreshToken: () => Promise<string> },
  ) {
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
    this.#handleRefreshToken = handleRefreshToken;
    this.#isRefreshing = false;
    this.#retryQueues = [];
  }

  private async refreshTokenAndReRequest(response: AxiosResponse<any>) {
    if (this.#isRefreshing) {
      return;
    }

    this.#isRefreshing = true;
    const refreshConfig = await this.#handleRefreshToken();
    if (refreshConfig) {
      response.config.headers.Authorization = `Bearer ${localStg.get('token')?.access || ''}`;
      this.#retryQueues.map((cb) => cb(response.config));
    }
    this.#retryQueues = [];
    this.#isRefreshing = false;
  }

  /** Set request interceptor */
  private setInterceptor() {
    this.instance.interceptors.request.use(async (config) => {
      const handleConfig = { ...config };

      if (handleConfig.headers) {
        // Set token
        handleConfig.headers.Authorization = `Bearer ${localStg.get('token')?.access || ''}`;
      }

      return handleConfig;
    });

    // this.instance.interceptors.response.use(
    //   (response): any => {
    //     const { status } = response;

    //     if (!(status === 200 || status < 300 || status === 304)) {
    //       const error = handleResponseError(response);
    //       return handleServiceResult<AxiosResponse<Service.IFailedResult>>(error, null, null);
    //     }

    //     const backend = response.data;

    //     if (backend.success) {
    //       return handleServiceResult<AxiosResponse<Service.ISuccessResult>>(
    //         null,
    //         backend.data,
    //         backend.meta,
    //       );
    //     }

    //     const error = handleBackendError(backend);
    //     return handleServiceResult<AxiosResponse<Service.IFailedResult>>(error, null, null);
    //   }, // as (response: AxiosResponse<any>) => Promise<AxiosResponse<any>>,
    //   (axiosError: AxiosError) => {
    //     const error = handleAxiosError(axiosError);
    //     // // Token expires, refresh token
    //     // if (CONSTANTS.REFRESH_TOKEN_CODES.includes(axiosError.response?.status)) {
    //     //   // original request
    //     //   const originRequest = new Promise((resolve) => {
    //     //     this.#retryQueues.push((refreshConfig: AxiosRequestConfig) => {
    //     //       axiosError.response?.config.headers.Authorization = `Bearer ${refreshConfig.headers?.Authorization}`;
    //     //       resolve(this.instance.request(refreshConfig));
    //     //     });
    //     //   });

    //     //   await this.refreshTokenAndReRequest(response);

    //     //   return originRequest;
    //     // }

    //     return handleServiceResult(error, null, null);
    //   },
    // );
  }
}
