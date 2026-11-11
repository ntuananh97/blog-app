import { IUser } from "./user.type";

export interface IBlog {
  id: string;
  title: string;
  content: string;
  author: IUser
  createdAt: string;
}

export interface IBlogResponse {
    blogs: IBlog[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface IBlogDetailResponse {
    blog: IBlog;
}