import { DefaultEventsMap } from '@socket.io/component-emitter';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { MyApiResponse } from './types/api';
import { FilterPolygonArea } from './types/api/area.filter';
import { ChatType, IChat } from './types/api/chat';
import { IMessage, ISendMessage, ISendMessageToArea } from './types/api/message';
import { IOnUpdate, MessageType } from './types/api/message.types';
import { IUser } from './types/api/user';
import { CustomOptions, IEvents } from './types/types';
declare class Messenger<Ev extends string = keyof IEvents> {
    #private;
    uid: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    constructor({ baseURL, token, polling, languageGetter, headers, }: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>);
    close(): void;
    private initPolling;
    init(): Promise<Socket<DefaultEventsMap, DefaultEventsMap> | this>;
    on(event: Ev, cb: Ev extends keyof IEvents ? IEvents[Ev] : (...args: any[]) => void): this;
    eventNames(): string[];
    removeAllListeners(event?: Ev): this;
    removeListener(event: Ev, callback: any): this;
    /**
     *
     * @param search id or username
     * @returns {[]}
     */
    searchUser(search: string): Promise<MyApiResponse<IUser>>;
    sendMessage(message: ISendMessage): Promise<MyApiResponse<IUser>>;
    sendMessageToNewUser(message: ISendMessage): Promise<MyApiResponse<IUser>>;
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
    getChats({ limit, page, type, }?: {
        limit?: number;
        page?: number;
        type?: ChatType;
    }): Promise<MyApiResponse<IChat>>;
    ping(): this;
}
export declare function getMessenger(customOptions: CustomOptions, options?: Partial<ManagerOptions & SocketOptions>): Messenger<keyof IEvents>;
export {};
