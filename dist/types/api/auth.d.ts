export interface IToken {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
}
export interface IUserGetMe {
    _id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    username: string;
    phoneNumber: string;
    birthday: string;
}
export interface IUserLogin extends IUserGetMe {
    token: IToken;
}
