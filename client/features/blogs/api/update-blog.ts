import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpRequest } from '@/lib/httpRequest';
import { IUpdateBlogBody, IUpdateBlogResponse } from '@/types/blogs.type';

export const updateBlog = (id: number, body: IUpdateBlogBody) => {
  return httpRequest.patch<IUpdateBlogResponse, IUpdateBlogBody>(
    `/blog/${id}`,
    body,
  );
};

export const useUpdateBlog = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: IUpdateBlogBody) => updateBlog(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};
