import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LangType } from '../../types/system';
/**
 * Encapsulate axios request class
 * @author Umar<creativeboy1999@gmail.com>
 */
export declare class CustomAxiosInstance {
    #private;
    readonly instance: AxiosInstance;
    /**
     *
     * @param axiosConfig - axios configuration
     */
    constructor(axiosConfig: AxiosRequestConfig, { refreshTokenUrl, languageGetter, }: {
        refreshTokenUrl?: string;
        languageGetter: () => LangType;
    });
}
