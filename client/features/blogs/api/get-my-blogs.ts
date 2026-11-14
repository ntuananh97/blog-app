import { queryOptions, useQuery } from '@tanstack/react-query';
import { httpRequest } from '@/lib/httpRequest';
import { IBlogResponse } from '@/types/blogs.type';

export const getMyBlogs = (page: number, limit: number) => {
  return httpRequest.get<IBlogResponse>(`/blog/me?page=${page}&limit=${limit}`);
};

export const getMyBlogsQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: ['blogs', 'me', page, limit],
    queryFn: () => getMyBlogs(page, limit),
  });
};

export const useMyBlogs = (page: number, limit = 10) => {
  return useQuery(getMyBlogsQueryOptions(page, limit));
};
