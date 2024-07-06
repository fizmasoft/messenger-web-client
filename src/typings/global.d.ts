import { ValidationError } from 'class-validator';

export {};

declare global {

  interface MetaData {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCount: number;
  }

  interface SuccessResponse<T = unknown> {
    data: { message: string } | T | T[];
    meta: MetaData;
  }

  interface PagingFailResponse {
    errors: ValidationError[];
    message: string;
    meta: { code: number; statusCode: number };
  }

  // type ResponsePaging<T = any> = PagingSuccessResponse<T> | PagingFailResponse;
  type ResponsePaging<T = unknown> = PagingSuccessResponse<Partial<T>>;

  type Environment = 'development' | 'development';

  type ContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data';

  interface IFormattedDate {
    original: string;
    iso: string;
    time: string;
    date: string;
    formatted: string;
  }
}
