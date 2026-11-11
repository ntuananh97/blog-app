export interface IUser {
    id: number;
    email: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser
}