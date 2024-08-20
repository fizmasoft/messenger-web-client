import FormData from 'form-data';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { ManagerOptions, SocketOptions, Socket } from 'socket.io-client';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

declare const ENV: {
    isBrowser: boolean;
    isNode: boolean;
};

declare const RESPONSE_CODES: {
    REFRESH_TOKEN_CODES: number[];
};

declare const regexps: {
    DATE_FORMAT_YYYY_MM_DD: RegExp;
    UZ_PHONE_NUMBER: RegExp;
};

declare function getDateDayDiff(date1: Date, date2?: Date): number;

/**
 *
 * @param date
 * @param separator default '-'
 * @returns  date string e.g: YYYY-MM-DD
 */
declare function getDateYYYYMMDD(date: Date, separator?: string): string;
declare function getDateMMDDYYYY(date: Date | string, separator?: string): string;
declare function getDateDDMMYYYY(date: Date, separator?: string): string;

/**
 * Returns a string.
 * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
 */
declare function numberFormat(number: number, fractionDigits?: number, dsep?: string, tsep?: string): string;
declare function numberWithZero(num: number, zeroLen: number): string;

declare function numberToText(num: number | string, alphabet: 'lotin' | 'Cyrl'): any;

type BaseRequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization';
type ContentType = 'text/html' | 'text/plain' | 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded' | 'application/octet-stream';
type RawRequestHeaders = Partial<{
    [Key in BaseRequestHeadersList]: any;
} & {
    'Content-Type': ContentType;
} & Record<string, any>>;
type HTTP_METHOD = 'POST' | 'GET';
interface MyHttpRequestOptions {
    url: string;
    method: HTTP_METHOD;
    body?: string | FormData;
    headers?: RawRequestHeaders;
}
declare function request(opts: MyHttpRequestOptions): Promise<unknown>;

interface IPollingOptions {
    limit: number;
    interval: number;
}
type CustomOptions = {
    baseURL: string;
    apiKey: string;
    apiHash: string;
    polling?: IPollingOptions;
    token: {
        access: string;
        refresh: string;
    } | (() => Promise<{
        access: string;
        refresh: string;
    }>);
    languageGetter?: () => I18nType.LangType;
    headers?: Record<string, string>;
};
interface IEvents {
    update: (data: Messenger.IOnUpdate) => void;
    chatAction: (action: Messenger.IChatAction) => void;
    connect: () => void;
}

declare class Messenger$1 {
    #private;
    uid: string;
    readonly socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    constructor({ baseURL, token, polling, languageGetter, headers, }: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>);
    close(): void;
    private initPolling;
    init(token: {
        access: string;
        refresh: string;
    } | (() => Promise<{
        access: string;
        refresh: string;
    }>)): Promise<this | Socket<DefaultEventsMap, DefaultEventsMap>>;
    on<Ev extends string = keyof IEvents>(event: Ev, cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void): this;
    /**
     *
     * @param search id or username
     * @returns {[]}
     */
    searchUser(search: string): Promise<Api.MyApiResponse<ApiUserManagement.IUser>>;
    sendMessage(message: ApiMessageManagement.ISendMessage): Promise<Api.MyApiResponse<ApiUserManagement.IUser>>;
    sendMessageToArea(filter: {
        radius: number;
        right: number;
        left: number;
        coordinates: [number, number];
        polygon: {
            type: 'Polygon' | 'Point' | 'Polygon' | 'MultiPolygon' | 'LineString';
            geometry: {
                type: string;
                coordinates: number[];
            };
            properties: {};
        };
    }, message: ApiMessageManagement.ISendMessage): Promise<Api.MyApiResponse<ApiUserManagement.IUser>>;
    getChatMessages(chatId: string, { limit, page, search }: {
        limit?: number;
        page?: number;
        search?: string;
    }): Promise<Api.MyApiResponse<ApiMessageManagement.IMessage>>;
    getChatInfo(chatId: string): Promise<unknown>;
    getChatMedia(chatId: string, { limit, page }: {
        limit?: number;
        page?: number;
    }): Promise<unknown>;
    getChatFiles(chatId: string, { limit, page }: {
        limit?: number;
        page?: number;
    }): Promise<unknown>;
    getChatAudios(chatId: string, { limit, page }: {
        limit?: number;
        page?: number;
    }): Promise<unknown>;
    getUpdates({ limit, page, allowedUpdates, }?: {
        limit?: number;
        page?: number;
        allowedUpdates?: Messenger$1.MessageType[];
    }): Promise<{
        updates: Messenger$1.IOnUpdate[];
        meta: any;
    }>;
    updateMessages(messages: []): any[];
    getChats({ limit, page, type, }: {
        limit?: number;
        page?: number;
        type?: Messenger$1.ChatType;
    }): Promise<any>;
    ping(): void;
}
declare function getMessenger(customOptions: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>): Messenger$1;

/**
 * Encrypt data
 * @param data - data
 */
declare function encrypt<T = unknown>(data: T): string;
/**
 * Decrypt data
 * @param cipherText - cipher text
 */
declare function decrypt<T = unknown>(cipherText: string): T | null;

/**
 * Encapsulate axios request class
 * @author Umar<creativeboy1999@gmail.com>
 */
declare class CustomAxiosInstance {
    #private;
    readonly instance: AxiosInstance;
    /**
     *
     * @param axiosConfig - axios configuration
     */
    constructor(axiosConfig: AxiosRequestConfig, { refreshTokenUrl, languageGetter, }: {
        refreshTokenUrl?: string;
        languageGetter: () => I18nType.LangType;
    });
}

declare const localStg: {
    set: <K extends keyof StorageInterface.ILocal>(key: K, value: StorageInterface.ILocal[K], expire?: number | null) => void;
    get: <K extends keyof StorageInterface.ILocal>(key: K) => StorageInterface.ILocal[K];
    remove: (key: keyof StorageInterface.ILocal) => void;
    clear: () => void;
};

declare const sessionStg: {
    set: <K extends "themeColor">(key: K, value: StorageInterface.Session[K]) => void;
    get: <K extends "themeColor">(key: K) => StorageInterface.Session[K];
    remove: (key: "themeColor") => void;
    clear: () => void;
};

export { CustomAxiosInstance, ENV, type MyHttpRequestOptions, RESPONSE_CODES, type RawRequestHeaders, decrypt, encrypt, getDateDDMMYYYY, getDateDayDiff, getDateMMDDYYYY, getDateYYYYMMDD, getMessenger, localStg, numberFormat, numberToText, numberWithZero, regexps, request, sessionStg };
