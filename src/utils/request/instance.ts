import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { localStg } from '../';
import { RESPONSE_CODES } from '../../common/constant';

type RefreshRequestQueue = (config: AxiosRequestConfig) => void;

/**
 * Encapsulate axios request class
 * @author Umar<creativeboy1999@gmail.com>
 */
export class CustomAxiosInstance {
  readonly instance: AxiosInstance;

  #isRefreshing: boolean;
  #refreshTokenUrl: string;
  #languageGetter: () => I18nType.LangType;

  #retryQueues: RefreshRequestQueue[];

  /**
   *
   * @param axiosConfig - axios configuration
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    {
      refreshTokenUrl,
      languageGetter,
    }: {
      refreshTokenUrl?: string;
      languageGetter: () => I18nType.LangType;
    },
  ) {
    this.#languageGetter = languageGetter;
    this.instance = axios.create(axiosConfig);
    this.#isRefreshing = false;
    this.#retryQueues = [];
    this.#refreshTokenUrl = refreshTokenUrl;
    this.#setInterceptor();
  }

  async #handleRefreshToken() {
    const { data } = await axios
      .create(this.instance.defaults)
      .get<ApiAuth.IUserLogin>(this.#refreshTokenUrl);
    if (data && data.token) {
      localStg.set('token', { access: data.token.accessToken, refresh: data.token.refreshToken });
    }

    return data.token.accessToken;
  }

  async #refreshTokenAndReRequest(response: AxiosResponse<any>) {
    if (this.#isRefreshing) {
      return;
    }

    this.#isRefreshing = true;
    const accessToken = await this.#handleRefreshToken();
    if (accessToken) {
      response.config.headers.Authorization = `Bearer ${accessToken}`;
      this.#retryQueues.map((cb) => cb(response.config));
    }
    this.#retryQueues = [];
    this.#isRefreshing = false;
  }

  /** Set request interceptor */
  #setInterceptor() {
    this.instance.interceptors.request.use(async (config) => {
      const handleConfig = { ...config };
      handleConfig.headers['x-app-lang'] = (this.#languageGetter() ||
        'Uz-Latin') as I18nType.LangType; // dynamically fetching language info

      if (handleConfig.headers) {
        // Set token
        handleConfig.headers.Authorization = `Bearer ${localStg.get('token')?.access || ''}`;
      }

      return handleConfig;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (axiosError: AxiosError) => {
        if (
          (axiosError.response?.data['code'] &&
            RESPONSE_CODES.REFRESH_TOKEN_CODES.includes(axiosError.response?.data['code'])) ||
          RESPONSE_CODES.REFRESH_TOKEN_CODES.includes(axiosError.response?.status)
        ) {
          // original request
          const originRequest = new Promise((resolve) => {
            this.#retryQueues.push((refreshConfig: AxiosRequestConfig) => {
              resolve(this.instance.request(refreshConfig));
            });
          });

          await this.#refreshTokenAndReRequest(axiosError.response);

          return originRequest;
        }
        throw axiosError;
      },
    );
  }
}
