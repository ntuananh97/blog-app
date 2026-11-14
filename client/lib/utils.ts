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

// Chỉ cho phép redirect tới đường dẫn nội bộ (chống open redirect)
export const getSafeRedirect = (raw: string | null | undefined): string => {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/";
  }
  return raw;
};

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

// Ví dụ: "5 phút trước", "hôm qua"
export const formatRelativeTime = (iso: string): string => {
  const diffSeconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return "vừa xong";
};

