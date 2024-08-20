import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket } from 'socket.io-client';
import { DisconnectDescription } from 'socket.io-client/build/esm/socket';
export declare enum DeviceTypesEnum {
    WEB = "web",
    APP = "app",
    DESKTOP = "desktop"
}
export interface IPollingOptions {
    limit: number;
    interval: number;
}
export type CustomOptions = {
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
export interface IEvents {
    update: (data: Messenger.IOnUpdate) => void;
    chatAction: (action: Messenger.IChatAction) => void;
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
