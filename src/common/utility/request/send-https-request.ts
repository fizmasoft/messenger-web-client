import https, { RequestOptions } from 'https';
import http from 'http';
import FormData from 'form-data';

type BaseRequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization';

type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream';

export type RawRequestHeaders = Partial<
  {
    [Key in BaseRequestHeadersList]: any;
  } & {
    'Content-Type': ContentType;
  } & Record<string, any>
>;
type HTTP_METHOD = 'POST' | 'GET';

export interface MyHttpRequestOptions {
  url: string;
  method: HTTP_METHOD;
  body?: string | FormData;
  headers?: RawRequestHeaders;
}

const bodyIsRequired: Record<HTTP_METHOD, boolean> = {
  GET: false,
  POST: true,
};

export async function request(opts: MyHttpRequestOptions): Promise<unknown> {
  if (bodyIsRequired[opts.method]) opts.body = opts.body || '{}';

  const reqOptions: RequestOptions = {
    method: opts.method,
    headers:
      opts.body instanceof FormData
        ? opts.body.getHeaders()
        : opts.headers
        ? opts.headers
        : {
            'Content-Type': 'application/json',
          },
  };

  const func = opts.url.includes('https://', 0) ? https.request : http.request;
  return await new Promise((resolve, reject) => {
    const req = func(opts.url, reqOptions, (res) => {
      let data = '';
      res
        .on('data', (chunk) => {
          data = data + chunk.toString();
        })
        .on('end', () => {
          resolve(JSON.parse(data));
        })
        .on('error', (err) => {
          console.log(err, 'error while res');
          reject(err);
        });
    });

    if (opts.body instanceof FormData) {
      opts.body.pipe(req);
    } else {
      req.write(opts.body);
    }

    req
      .on('error', (err) => {
        console.log(err, 'error while req');
        reject(err);
      })
      .end();
  });
}
