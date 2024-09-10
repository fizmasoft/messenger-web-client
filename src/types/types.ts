import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket } from 'socket.io-client';
import { DisconnectDescription } from 'socket.io-client/build/esm/socket';
import { IChatAction, IOnUpdate } from './api/message.types';
import { LangType } from './system';

export enum DeviceTypesEnum {
  WEB = 'web',
  APP = 'app',
  DESKTOP = 'desktop',
}

export interface IPollingOptions {
  limit: number;
  interval: number; // in milliseconds
}

export type CustomOptions = {
  baseURL: string;
  apiKey: string;
  apiHash: string;
  polling?: IPollingOptions;
  token: { access: string; refresh: string } | (() => Promise<{ access: string; refresh: string }>);
  languageGetter?: () => LangType;
  headers?: Record<string, string>;
};

export interface IEvents {
  reconnect_attempt(args: any[]): void;
  reconnect(args: any[]): void;
  connect: (args: { message: string; socket: Socket<DefaultEventsMap, DefaultEventsMap> }) => void;
  disconnect(args: {
    reason: Socket.DisconnectReason;
    details: DisconnectDescription;
    message: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  }): void;
  pong(): void;
  update: (data: IOnUpdate) => void;
  updateUser: (user: { _id: string; isOnline: boolean }) => void;
  updateMessage: (message: { _id: string; readAt: string }) => void;
  chatAction: (action: IChatAction) => void;
  socketConnectionError: (args: { message: string; error: Error }) => void;
}
