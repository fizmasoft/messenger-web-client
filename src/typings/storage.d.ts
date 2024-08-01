declare namespace StorageInterface {
  /** The type of data stored in localStorage */
  interface Session {
    /** theme color */
    themeColor: string;
    // /** Theme configuration */
    // themeSettings: Theme.Setting;
  }

  interface IUser {
    remote: Auth.UserGetMe | null;

    /** login status */
    logged: boolean;

    /** user's device */
    device: Common.Device;

    /** menu collapsed status */
    collapsed: boolean;
  }

  /** The type of data stored in localStorage */
  interface ILocal {
    uid: string;
    /** user token */
    token: {
      /** User access token */
      access: string;
      /** User refresh token */
      refresh: string;
    };
    /** User Info */
    userInfo: IUser;

    multiTabRoutes: any[];
    // multiTabRoutes: App.GlobalTabRoute[]
    // /** Multi-tab routing information */
    // multiTabRoutes: App.GlobalTabRoute[];
    // /** local language cache */
    // lang: I18nType.LangType;
  }
}
