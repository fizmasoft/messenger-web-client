export type Environment = 'development' | 'development';

/**
 * Requested error type:
 * - axios: axios error: network error, request timeout, default cover-up error
 * - http: The request was successful, but the response http status code was not an error of 200.
 * - backend: The request is successful, the response http status code is 200, and the business error defined by the backend
 */
export type RequestErrorType = 'axios' | 'http' | 'backend';

/** Request error */
export interface IRequestError {
  /** Error type requesting service */
  type: RequestErrorType;
  /** error code */
  code: string | number;
  /** error message */
  message: string;

  errors: any[];
}
