import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import type FormData from 'form-data';
import type { IMessage, ISendMessage, ISendMessageToArea } from './types/api/message';
import type { MyApiResponse } from './types/api';
import type { FilterPolygonArea } from './types/api/area.filter';
import type { ChatType, IChat } from './types/api/chat';
import type { IOnUpdate, MessageType } from './types/api/message.types';
import type { IUser } from './types/api/user';
import type { CustomOptions, IEvents } from './types/types';
declare class Messenger {
    #private;
    user: {
        _id: string;
        image: string;
        firstName: string;
        lastName: string;
        middleName: string;
        email: string | null;
        username: string;
        phoneNumber: string;
        birthday: string | null;
        deviceUid: string | null;
    };
    uid: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    constructor({ baseURL, token, polling, socket, languageGetter, headers, }: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>);
    close(): void;
    private initPolling;
    init(): Promise<Socket<DefaultEventsMap, DefaultEventsMap> | this>;
    on<EventName extends keyof IEvents = 'update'>(event: EventName, cb: IEvents[EventName]): this;
    eventNames(): string[];
    removeAllListeners(event?: keyof IEvents): this;
    removeListener(event: keyof IEvents, callback: any): this;
    /**
     *
     * @param search id or username
     * @returns {[]}
     */
    searchUser({ limit, page, search }?: {
        limit?: number;
        page?: number;
        search?: string;
    }): Promise<MyApiResponse<IUser>>;
    sendMessage(chatId: string, message: ISendMessage | FormData): Promise<MyApiResponse<IUser>>;
    sendMessageToNewUser(message: ISendMessage): Promise<MyApiResponse<IUser>>;
    sendMessageToArea(filter: FilterPolygonArea, message: ISendMessageToArea): Promise<MyApiResponse<IUser>>;
    getChatMessages(chatId: string, query?: {
        limit?: number;
        page?: number;
        search?: string;
    } & Record<string, any>): Promise<MyApiResponse<IMessage>>;
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
    getUpdates({ limit, allowedUpdates, }?: {
        limit?: number;
        page?: number;
        allowedUpdates?: MessageType[];
    }): Promise<{
        updates: {
            updates: IOnUpdate[];
            users: {
                _id: string;
                isOnline: boolean;
            }[];
            messages: {
                _id: string;
                readAt: string;
            }[];
        };
        meta: any;
    }>;
    readMessage(chatId: string, message: {
        messageId: string;
        messageReadAt: string;
    }): Promise<any>;
    getChats(query?: {
        limit?: number;
        page?: number;
        search?: string;
        type?: ChatType;
    } & Record<string, any>): Promise<MyApiResponse<IChat>>;
    ping(): this;
}
export declare function getMessenger(customOptions: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>): Messenger;
export {};
