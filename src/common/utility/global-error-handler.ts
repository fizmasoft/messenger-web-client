import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../errors/common.error';
import { telegramBot } from '../telegram/telegram-bot';
import { StatusCodes } from './status-codes';
import { ValidationError } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function globalErrorHandler(err, request: Request, response: Response, next: NextFunction) {
  telegramBot.sendMessage(
    `
      error while request to server. Unhandled exception
      \nip: ${request.ip}
      \nrequest url: ${request.url}
      \nrequest originalUrl: ${request.originalUrl}
      \nrequest baseUrl: ${request.baseUrl}
      \nrequest method: ${request.method}
      \nrequest path: ${request.path}
      \nuserId: ${request.user?.id}
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      request headers: <pre><code class="language-json">${JSON.stringify(
        request.headers,
        null,
        2,
      )}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      request body: <pre><code class="language-json">${JSON.stringify(
        request.body,
        null,
        2,
      )}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      exception message: <pre><code class="language-json">${err.message}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      exception name: <pre><code class="language-json">${err.name}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      exception: <pre><code class="language-json">${JSON.stringify(err, null, 2)}</code></pre>
    `,
  );

  console.error(
    '================================ GLOBAL ERROR HANDLER =================================\n',
    err,
  );

  if (err instanceof BaseException) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      ...err,
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      message: request.t(err.message.text as any, { replace: err.message.text }),
    });
  }

  const json = BaseException.UnknownError(null);
  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    ...json,
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    message: request.t(json.message.text as any, { replace: json.message.text }),
  });
}
