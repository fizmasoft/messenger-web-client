type SuccessResponseData<T> = { message: string } | T | T[];
type FailResponseData = string[];

declare namespace Api {
  interface IMetaData {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalCount: number;
  }

  interface ISuccessResponse<T> {
    data: SuccessResponseData<T>;
    meta: IMetaData;
    code: number;
    message: string;
    success: true;
    time: string;
  }

  interface IFailResponse {
    message: string;
    data: FailResponseData;
    meta: IMetaData;
    code: number;
    success: false;
    time: string;
  }

  type MyApiResponse<T = unknown> = ISuccessResponse<Partial<T>> | IFailResponse;
}
