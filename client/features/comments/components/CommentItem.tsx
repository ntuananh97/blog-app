'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommentReplies } from '@/features/comments/api/comments';
import { formatRelativeTime } from '@/lib/utils';
import { IComment } from '@/types/comment.type';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: IComment;
  blogId: number;
  requireAuth: () => boolean;
  // Reply hiển thị phẳng 1 cấp, không có nút xem replies
  isReply?: boolean;
}

const getDisplayName = (email: string) => email.split('@')[0] || email;

export default function CommentItem({
  comment,
  blogId,
  requireAuth,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const replyCount = comment._count?.replies ?? 0;
  const name = getDisplayName(comment.author.email);

  const {
    data: repliesData,
    isPending: repliesPending,
    isError: repliesError,
    refetch: refetchReplies,
  } = useCommentReplies(comment.id, !isReply && showReplies);

  // Backend trả mới → cũ, đảo lại để đọc theo thứ tự hội thoại
  const replies = useMemo(
    () => (repliesData ? [...repliesData.data].reverse() : []),
    [repliesData],
  );

  const handleReplyClick = () => {
    if (!requireAuth()) return;
    setShowReplyForm((open) => !open);
  };

  return (
    <div className="flex gap-3">
      <Avatar size={isReply ? 'sm' : 'default'}>
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="rounded-2xl bg-muted/50 px-4 py-3">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold">{name}</span>
            <time
              dateTime={comment.createdAt}
              className="text-xs text-muted-foreground"
            >
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm leading-6 break-words whitespace-pre-wrap">
            {comment.message}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleReplyClick}>
            <MessageCircle />
            Trả lời
          </Button>
          {!isReply && replyCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies((open) => !open)}
            >
              {showReplies ? <ChevronUp /> : <ChevronDown />}
              {showReplies ? 'Ẩn phản hồi' : `Xem ${replyCount} phản hồi`}
            </Button>
          )}
        </div>

        {showReplyForm && (
          <CommentForm
            blogId={blogId}
            parentId={comment.id}
            defaultValue={isReply ? `@${name} ` : ''}
            placeholder={`Trả lời ${name}...`}
            submitLabel="Trả lời"
            autoFocus
            requireAuth={requireAuth}
            onCancel={() => setShowReplyForm(false)}
            onSubmitted={() => {
              setShowReplyForm(false);
              setShowReplies(true);
            }}
          />
        )}

        {!isReply && showReplies && (
          <div className="space-y-4 pt-1">
            {repliesPending && (
              <div className="flex gap-3">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-14 flex-1 rounded-2xl" />
              </div>
            )}
            {repliesError && (
              <p className="text-sm text-destructive">
                Không tải được phản hồi.{' '}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={() => refetchReplies()}
                >
                  Thử lại
                </button>
              </p>
            )}
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                blogId={blogId}
                requireAuth={requireAuth}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
