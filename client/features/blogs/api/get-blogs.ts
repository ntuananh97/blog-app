import { useQuery, queryOptions } from '@tanstack/react-query';
import { httpRequest } from '@/lib/httpRequest';
import { IBlog, IBlogDetailResponse, IBlogResponse } from '@/types/blogs.type';

export const getBlogs = () => {
  return httpRequest.get<IBlogResponse>(`/blog/public`);
};


export const getBlogsQueryOptions = () => {
  return queryOptions({
    queryKey: ['blogs'],
    queryFn: () => getBlogs(),
  });
};



export const useBlogs = () => {
  return useQuery({
    ...getBlogsQueryOptions(),
  });
};

export const getBlogById = (id: number) => {
  return httpRequest.get<IBlogDetailResponse>(`/blog/${id}`);
};

export const getBlogDetailQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['blogs', id],
    queryFn: () => getBlogById(id),
  });
};

export const useDetailBlog = (id: number) => {
  return useQuery({
    ...getBlogDetailQueryOptions(id),
    enabled: !!id, 
  });
};
