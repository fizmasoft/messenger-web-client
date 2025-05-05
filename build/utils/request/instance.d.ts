import type { LangType } from '../../types/system';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
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
    constructor(axiosConfig: AxiosRequestConfig, { tokenGetter, refreshTokenUrl, languageGetter, }: {
        refreshTokenUrl?: string;
        languageGetter: () => LangType;
        tokenGetter: {
            access: string;
            refresh: string;
        } | (() => Promise<{
            access: string;
            refresh: string;
        }>);
    });
}
