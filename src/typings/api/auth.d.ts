declare namespace ApiAuth {
  interface IToken {
    tokenType: 'bearer';
    accessToken: string;
    accessExpiresAt: number;
    refreshToken: string;
    refreshExpiresAt: number;
  }

  interface IUserGetMeUser {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    birthday: string;
    phone: string;
    image: string | null;
    status: 'active';
    createdAt: string;
    createdAtDate: string;
    createdAtTime: string;
  }

  interface IUserGetMe {
    user: IUserGetMeUser;
  }

  interface IRefreshToken {
    token: {
      accessToken: string;
      tokenType: string;
      expiresIn: number;
    };
  }
}
