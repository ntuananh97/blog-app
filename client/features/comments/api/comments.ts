import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { httpRequest } from '@/lib/httpRequest';
import { API_BASE_URL_V2 } from '@/lib/constants';
import {
  ICommentListResponse,
  ICommentRepliesResponse,
  ICreateCommentBody,
  ICreateCommentResponse,
} from '@/types/comment.type';

const COMMENT_PAGE_SIZE = 10;

// Danh sách comment gốc: cursor pagination (v2)
export const getBlogComments = (blogId: number, cursor?: number) => {
  const params = new URLSearchParams({ limit: String(COMMENT_PAGE_SIZE) });
  if (cursor) params.set('cursor', String(cursor));
  return httpRequest.get<ICommentListResponse>(
    `/blog/${blogId}/comment?${params.toString()}`,
    { baseUrl: API_BASE_URL_V2 },
  );
};

export const blogCommentsKey = (blogId: number) =>
  ['blogs', blogId, 'comments'] as const;

export const getBlogCommentsQueryOptions = (blogId: number) =>
  infiniteQueryOptions({
    queryKey: blogCommentsKey(blogId),
    queryFn: ({ pageParam }) => getBlogComments(blogId, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });

export const useBlogComments = (blogId: number) =>
  useInfiniteQuery({ ...getBlogCommentsQueryOptions(blogId), enabled: !!blogId });

// Replies của một comment gốc (v1, không phân trang)
export const getCommentReplies = (commentId: number) =>
  httpRequest.get<ICommentRepliesResponse>(`/comment/${commentId}/replies`);

export const commentRepliesKey = (commentId: number) =>
  ['comments', commentId, 'replies'] as const;

export const getCommentRepliesQueryOptions = (commentId: number) =>
  queryOptions({
    queryKey: commentRepliesKey(commentId),
    queryFn: () => getCommentReplies(commentId),
  });

export const useCommentReplies = (commentId: number, enabled: boolean) =>
  useQuery({ ...getCommentRepliesQueryOptions(commentId), enabled });

// Tạo comment mới hoặc trả lời (truyền parentId)
export const createComment = (blogId: number, body: ICreateCommentBody) =>
  httpRequest.post<ICreateCommentResponse, ICreateCommentBody>(
    `/blog/${blogId}/comment`,
    body,
  );

export const useCreateComment = (blogId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ICreateCommentBody) => createComment(blogId, body),
    onSuccess: ({ data }) => {
      // Backend gom reply-của-reply về comment gốc, nên dùng parentId trả về
      if (data.parentId) {
        queryClient.invalidateQueries({ queryKey: commentRepliesKey(data.parentId) });
      }
      // Cập nhật danh sách (comment mới hoặc _count.replies)
      queryClient.invalidateQueries({ queryKey: blogCommentsKey(blogId) });
    },
  });
};
