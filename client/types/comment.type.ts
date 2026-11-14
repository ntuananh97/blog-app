export interface ICommentAuthor {
  id: number;
  email: string;
}

export interface IComment {
  id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  blogId: number;
  authorId: number;
  author: ICommentAuthor;
  // Chỉ có ở comment gốc trong danh sách
  _count?: { replies: number };
}

export interface ICommentListResponse {
  data: IComment[];
  pagination: {
    hasNextPage: boolean;
    limit: number;
    nextCursor: number | null;
  };
}

export interface ICommentRepliesResponse {
  data: IComment[];
}

export interface ICreateCommentBody {
  message: string;
  parentId?: number;
}

export interface ICreateCommentResponse {
  data: IComment;
}
