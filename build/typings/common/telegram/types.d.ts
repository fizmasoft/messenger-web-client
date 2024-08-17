import { TelegramParseModeEnum } from "./telegram-bot";
export declare namespace Telegram {
    interface SendMediaDto {
        readonly media: string[];
        readonly msg: string;
        readonly chat_id?: number;
        readonly parse_mode?: TelegramParseModeEnum;
    }
    interface SendMessageTo {
        readonly msg: string;
        readonly chat_id?: number;
        readonly parse_mode?: TelegramParseModeEnum;
    }
    interface Response {
        readonly success: boolean;
        readonly message: string;
    }
}
