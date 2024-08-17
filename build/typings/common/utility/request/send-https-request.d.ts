import FormData from 'form-data';
type BaseRequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization';
type ContentType = 'text/html' | 'text/plain' | 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded' | 'application/octet-stream';
export type RawRequestHeaders = Partial<{
    [Key in BaseRequestHeadersList]: any;
} & {
    'Content-Type': ContentType;
} & Record<string, any>>;
type HTTP_METHOD = 'POST' | 'GET';
export interface MyHttpRequestOptions {
    url: string;
    method: HTTP_METHOD;
    body?: string | FormData;
    headers?: RawRequestHeaders;
}
export declare function request(opts: MyHttpRequestOptions): Promise<unknown>;
export {};
