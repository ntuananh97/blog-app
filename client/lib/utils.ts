export { cn } from "cn";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY } from "./constants";
import { IUser } from "@/types/user.type";

export const saveTokenToCookie = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1, // 7 ngày
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  
};

export const saveRefreshTokenToCookie = (token: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 1, // 7 ngày
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export const saveUserInfoToCookies = (userInfo: IUser) => {
  const jsonUser = JSON.stringify(userInfo);
  Cookies.set(USER_INFO_KEY, jsonUser, {
    path: '/',
    sameSite: "lax",

});
};

export const logout = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_INFO_KEY);
}

