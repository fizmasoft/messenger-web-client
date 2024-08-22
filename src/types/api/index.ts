export type SuccessResponseData<T> = { message: string } | T | T[];
export type FailResponseData = string[];

export interface IMetaData {
  limit: number;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface ISuccessResponse<T> {
  data: SuccessResponseData<T>;
  meta: IMetaData;
  code: number;
  message: string;
  success: true;
  time: string;
  requestId: string;
}

export interface IFailResponse {
  message: string;
  data: FailResponseData;
  meta: IMetaData;
  code: number;
  success: false;
  time: string;
  requestId: string;
}

export type MyApiResponse<T = unknown> = ISuccessResponse<T> | IFailResponse;
