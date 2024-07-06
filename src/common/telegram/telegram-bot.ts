import fs from 'fs';
import FormData from 'form-data';
import { ENV } from '../config';
import { Telegram } from './types';
import { request } from '../utility/request';
import { getDateDDMMYYYY } from '../utility/date-formatter';

enum TelegramBotApiMethods {
  GET_UPDATES = 'getUpdates',
  SEND_MESSAGE = 'sendMessage',
  SEND_MEDIA_GROUP = 'sendMediaGroup',
  SEND_PHOTO = 'sendPhoto',
  SEND_DOCUMENT = 'sendDocument',
}

export enum TelegramParseModeEnum {
  HTML = 'HTML',
}

class TelegramBot {
  readonly #baseUrl: string;

  constructor(token: string) {
    this.#baseUrl = `https://api.telegram.org/bot${token}/`;
  }

  private async send(method: TelegramBotApiMethods, body: string | FormData) {
    try {
      return await request({
        method: 'POST',
        url: `${this.#baseUrl}${method}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } catch (err) {
      console.log(err, 'error while telegram.send');
    }
  }

  public async sendMessage(msg: string, chat_id = ENV.BOT.CHAT_ID) {
    try {
      await request({
        method: 'POST',
        url: `${this.#baseUrl}${TelegramBotApiMethods.SEND_MESSAGE}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chat_id,
          text: msg,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.log(err, 'error while telegram.sendMessage');
    }
  }

  public async sendError(err: Error | unknown) {
    try {
      await request({
        method: 'POST',
        url: `${this.#baseUrl}${TelegramBotApiMethods.SEND_MESSAGE}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: ENV.BOT.CHAT_ID,
          text: err instanceof Error ? err.message : err,
        }),
      });
    } catch (err) {
      console.log(err, 'error while telegram.sendError');
    }
  }

  public async sendMedia({
    media,
    msg,
    chat_id = ENV.BOT.CHAT_ID,
    parse_mode = TelegramParseModeEnum.HTML,
  }: Telegram.SendMediaDto): Promise<Telegram.Response> {
    if (media.length < 1) {
      return { success: false, message: 'Photos at least one photo' };
    }
    try {
      if (media.length === 1) {
        await this.send(
          TelegramBotApiMethods.SEND_PHOTO,
          JSON.stringify({
            chat_id: chat_id,
            photo: media[0],
            caption: msg,
            parse_mode: 'HTML',
          }),
        );

        return { success: true, message: 'OK' };
      }

      const body = new Array(media.length);
      for (let i = 0; i < media.length; i++) {
        body[i] = {
          type: 'photo',
          media: media[i],
        };
      }

      body[body.length - 1].caption = msg;
      body[body.length - 1].parse_mode = parse_mode;

      await this.send(
        TelegramBotApiMethods.SEND_MEDIA_GROUP,
        JSON.stringify({
          chat_id: chat_id,
          media: body,
        }),
      );

      return { success: true, message: 'OK' };
    } catch (error) {
      return {
        success: false,
        message: JSON.stringify(error.response.data),
      };
    }
  }

  public async sendDocument(
    path: string,
    opts = { chatId: ENV.BOT.CHAT_ID.toString(), caption: '#canceled_contract_list' },
  ) {
    const formData = new FormData();

    formData.append('chat_id', opts.chatId);
    formData.append('document', fs.createReadStream(path), {
      filename: getDateDDMMYYYY(new Date()),
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    formData.append('caption', opts.caption);

    await this.send(TelegramBotApiMethods.SEND_DOCUMENT, formData);

    return fs.unlink(path, (err) => {
      if (err)
        this.sendMessage(`Excel file o'chirishda xatolik bor !!!\n\nXatolik habari ${err.message}`);
      console.log("Fayl o'chirildi");
    });
  }
}

export const telegramBot = new TelegramBot(ENV.BOT.TOKEN);
