import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpRequest } from '@/lib/httpRequest';
import { ICreateBlogBody, ICreateBlogResponse } from '@/types/blogs.type';

export const createBlog = (body: ICreateBlogBody) => {
  return httpRequest.post<ICreateBlogResponse, ICreateBlogBody>('/blog', body);
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};
