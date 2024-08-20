import { DefaultEventsMap } from '@socket.io/component-emitter';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { CustomOptions, IEvents } from './types';
declare class Messenger {
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
    }>)): Promise<Socket<DefaultEventsMap, DefaultEventsMap> | this>;
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
    getChatMessages(chatId: string, { limit, page, search }?: {
        limit?: number;
        page?: number;
        search?: string;
    }): Promise<Api.MyApiResponse<ApiMessageManagement.IMessage>>;
    getChatInfo(chatId: string): Promise<unknown>;
    getChatMedia(chatId: string, { limit, page }?: {
        limit?: number;
        page?: number;
    }): Promise<unknown>;
    getChatFiles(chatId: string, { limit, page }?: {
        limit?: number;
        page?: number;
    }): Promise<unknown>;
    getChatAudios(chatId: string, { limit, page }?: {
        limit?: number;
        page?: number;
    }): Promise<unknown>;
    getUpdates({ limit, page, allowedUpdates, }?: {
        limit?: number;
        page?: number;
        allowedUpdates?: Messenger.MessageType[];
    }): Promise<{
        updates: Messenger.IOnUpdate[];
        meta: any;
    }>;
    updateMessages(messages: []): any[];
    getChats({ limit, page, type, }?: {
        limit?: number;
        page?: number;
        type?: Messenger.ChatType;
    }): Promise<any>;
    ping(): void;
}
export declare function getMessenger(customOptions: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>): Messenger;
export {};
