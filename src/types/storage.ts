/** The type of data stored in localStorage */
export interface ISessionStorage {}

/** The type of data stored in localStorage */
export interface ILocalStorage {
  /** device unique id */
  messengerDeviceUid: string;
  /** user token */
  messengerToken: {
    /** User access token */
    access: string;
    /** User refresh token */
    refresh: string;
  };
}
