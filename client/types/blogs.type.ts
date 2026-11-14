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

export interface IBlogFormValues {
    title: string;
    content: string;
}

export type ICreateBlogBody = IBlogFormValues;
export type IUpdateBlogBody = Partial<IBlogFormValues>;

export interface ICreateBlogResponse {
    blog: IBlog;
}

export interface IUpdateBlogResponse {
    data: IBlog;
}