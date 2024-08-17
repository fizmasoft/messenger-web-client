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
  languageGetter?: () => I18nType.LangType;
  headers?: Record<string, string>;
};

export interface IEvents {
  update: (data: Messenger.IOnUpdate) => void;
  chatAction: (action: Messenger.IChatAction) => void;
  connect: () => void;
}
