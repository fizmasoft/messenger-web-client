declare namespace ApiAuth {
  interface IToken {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  }

  interface IUserGetMe {
    _id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    username: string;
    phoneNumber: string;
    birthday: string;
  }

  interface IUserLogin extends IUserGetMe {
    token: IToken;
  }
}
