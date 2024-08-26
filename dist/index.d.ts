import FormData from 'form-data';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { DisconnectDescription } from 'socket.io-client/build/esm/socket';
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

type SuccessResponseData<T> = {
    message: string;
} | T | T[];
type FailResponseData = string[];
interface IMetaData {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCount: number;
}
interface ISuccessResponse<T> {
    data: SuccessResponseData<T>;
    meta: IMetaData;
    code: number;
    message: string;
    success: true;
    time: string;
    requestId: string;
}
interface IFailResponse {
    message: string;
    data: FailResponseData;
    meta: IMetaData;
    code: number;
    success: false;
    time: string;
    requestId: string;
}
type MyApiResponse<T = unknown> = ISuccessResponse<T> | IFailResponse;

interface IPolygonPoint {
    polygon: {
        geometry: {
            type: 'Point';
            coordinates: [number, number];
        };
        properties: any;
        type: 'Feature';
    };
    radius: number;
}
interface IPolygon {
    polygon: {
        geometry: {
            type: 'Polygon';
            coordinates: [number, number][];
        };
        properties: any;
        type: 'Feature';
    };
}
interface IPolygonLine {
    polygon: {
        geometry: {
            coordinates: [number, number][];
            type: 'LineString';
        };
        properties: any;
        type: 'Feature';
    };
    left: 50;
    right: 50;
}
type FilterPolygonArea = IPolygonPoint | IPolygon | IPolygonLine;

type ChatType = 'private' | 'group' | 'channel' | 'bot';
interface IChat {
    _id: string;
    title: string;
    photo: string;
    lastMessage: string;
    lastMessageCreatedAt: string;
    lastMessageIsRead: boolean;
    senderIsMe: boolean;
    isOnline: boolean;
    unreadMessageCount: number;
}

type MessageType = 'text' | 'wanted' | 'audio' | 'photo' | 'gif' | 'video' | 'mediaGroup' | 'documentGroup' | 'document' | 'location' | 'liveLocation';
interface IOnUpdate {
    _id: string;
    from: {
        firstName: string;
        lastName: string;
        username: string | null;
        fullName: string;
    };
    message: IMessage;
}
declare enum ChatACtion {
    TYPING = "typing",
    SENDING_FILE = "sending_file",
    SENDING_PHOTO = "sending_photo",
    SENDING_VIDEO = "sending_video"
}
interface IChatAction {
    chatId: string;
    action: ChatACtion;
}

interface IMessageTo {
    chatId: string;
    chatType: 'group' | 'private';
}
interface IChatMessageWanted {
    type: 'user' | 'car';
    title: string;
    sender: {
        firstName: string;
        lastName: string;
        middleName: string;
        fullName: string;
    };
    user?: {
        firstName: string;
        lastName: string;
        middleName: string;
        fullName: string;
        birthDate: string;
        image: string;
        passport: string;
        pAddress: string;
    };
    car?: {
        carImage: string;
        carNumber: string;
    };
    initiator: string;
    address: string;
    objectName: string;
    wantedDate: string;
    statya: string;
    rozType: string;
    mera: string;
    location: [number, number];
    images: string[];
    text: string;
    region: string;
}
interface ISendMessage {
    messageType: MessageType;
    to: IMessageTo;
    text?: string;
    wanted?: IChatMessageWanted;
}
interface ISendMessageToArea {
    messageType: MessageType;
    text?: string;
    wanted?: IChatMessageWanted;
}
interface IMessage {
    messageType: MessageType;
    from: IMessageTo;
    to: IMessageTo;
    text?: string;
    wanted?: IChatMessageWanted;
}

interface IUser {
    _id: string;
    fullName: string;
    surname: string;
    birthday: string;
    image: null;
    status: string;
}

type LangType = 'Uz-Latin' | 'Uz-Cyrl' | 'ru';

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
    languageGetter?: () => LangType;
    headers?: Record<string, string>;
};
interface IEvents {
    update: (data: IOnUpdate) => void;
    chatAction: (action: IChatAction) => void;
    connect: (args: {
        message: string;
        socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    }) => void;
    disconnect: (args: {
        reason: Socket.DisconnectReason;
        details: DisconnectDescription;
        message: string;
        socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    }) => void;
    socketConnectionError: (args: {
        message: string;
        error: Error;
    }) => void;
}

declare class Messenger {
    #private;
    uid: string;
    readonly socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    constructor({ baseURL, token, polling, languageGetter, headers, }: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>);
    close(): void;
    private initPolling;
    init(): Promise<Socket<DefaultEventsMap, DefaultEventsMap> | this>;
    on<Ev extends string = keyof IEvents>(event: Ev, cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void): this;
    /**
     *
     * @param search id or username
     * @returns {[]}
     */
    searchUser(search: string): Promise<MyApiResponse<IUser>>;
    sendMessage(message: ISendMessage): Promise<MyApiResponse<IUser>>;
    sendMessageToArea(filter: FilterPolygonArea, message: ISendMessageToArea): Promise<MyApiResponse<IUser>>;
    getChatMessages(chatId: string, { limit, page, search }?: {
        limit?: number;
        page?: number;
        search?: string;
    }): Promise<MyApiResponse<IMessage>>;
    getChatInfo(chatId: string): Promise<unknown>;
    getChatMedia(chatId: string, { limit, page }?: {
        limit?: number;
        page?: number;
    }): Promise<unknown[]>;
    getChatFiles(chatId: string, { limit, page }?: {
        limit?: number;
        page?: number;
    }): Promise<unknown[]>;
    getChatAudios(chatId: string, { limit, page }?: {
        limit?: number;
        page?: number;
    }): Promise<unknown[]>;
    getUpdates({ limit, page, allowedUpdates, }?: {
        limit?: number;
        page?: number;
        allowedUpdates?: MessageType[];
    }): Promise<{
        updates: IOnUpdate[];
        meta: any;
    }>;
    readMessage(chatId: string, message: {
        messageId: string;
        messageReadAt: string;
    }): Promise<any>;
    getChats({ limit, page, type, }?: {
        limit?: number;
        page?: number;
        type?: ChatType;
    }): Promise<MyApiResponse<IChat>>;
    ping(): this;
}
declare function getMessenger(customOptions: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>): Messenger;

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
        languageGetter: () => LangType;
    });
}

/** The type of data stored in localStorage */
interface ILocalStorage {
    /** device unique id */
    messengerDeviceUid: string;
    /** user token */
    messengerToken: {
        /** User access token */
        access: string;
        /** User refresh token */
        refresh: string;
    };
}

declare const localStg: {
    set: <K extends keyof ILocalStorage>(key: K, value: ILocalStorage[K], expire?: number | null) => void;
    get: <K extends keyof ILocalStorage>(key: K) => ILocalStorage[K];
    remove: (key: keyof ILocalStorage) => void;
    clear: () => void;
};

declare const sessionStg: {
    set: <K extends "sessionStorage">(key: K, value: WindowSessionStorage[K]) => void;
    get: <K extends "sessionStorage">(key: K) => WindowSessionStorage[K];
    remove: (key: "sessionStorage") => void;
    clear: () => void;
};

export { CustomAxiosInstance, ENV, type MyHttpRequestOptions, RESPONSE_CODES, type RawRequestHeaders, decrypt, encrypt, getDateDDMMYYYY, getDateDayDiff, getDateMMDDYYYY, getDateYYYYMMDD, getMessenger, localStg, numberFormat, numberToText, numberWithZero, regexps, request, sessionStg };
