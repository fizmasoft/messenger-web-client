import { TelegramParseModeEnum } from "./telegram-bot";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Telegram {
  export interface SendMediaDto {
    readonly media: string[];
    readonly msg: string;
    readonly chat_id?: number;
    readonly parse_mode?: TelegramParseModeEnum;
  }

  export interface SendMessageTo {
    readonly msg: string;
    readonly chat_id?: number;
    readonly parse_mode?: TelegramParseModeEnum;
  }

  export interface Response {
    readonly success: boolean;
    readonly message: string;
  }
}
