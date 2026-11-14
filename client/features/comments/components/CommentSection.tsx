'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogComments } from '@/features/comments/api/comments';
import { useCurrentUser } from '@/hooks/use-current-user';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import LoginRequiredDialog, { COMMENT_SECTION_ID } from './LoginRequiredDialog';

export default function CommentSection({ blogId }: { blogId: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { user, isReady } = useCurrentUser();

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBlogComments(blogId);

  // Sau khi đăng nhập quay lại với #comments: cuộn tới phần bình luận
  // (section chỉ mount sau khi bài viết tải xong nên trình duyệt không tự cuộn)
  useEffect(() => {
    if (window.location.hash === `#${COMMENT_SECTION_ID}`) {
      sectionRef.current?.scrollIntoView();
    }
  }, []);

  // Trả về true nếu đã đăng nhập, ngược lại mở popup yêu cầu đăng nhập
  const requireAuth = useCallback(() => {
    if (!isReady) return false;
    if (!user) {
      setLoginDialogOpen(true);
      return false;
    }
    return true;
  }, [isReady, user]);

  const comments = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <section
      id={COMMENT_SECTION_ID}
      ref={sectionRef}
      className="scroll-mt-24 rounded-[28px] border bg-card p-5 shadow-sm sm:p-7"
    >
      <h2 className="mb-5 text-xl font-semibold tracking-tight">Bình luận</h2>

      <CommentForm blogId={blogId} requireAuth={requireAuth} />

      <div className="mt-8 space-y-6">
        {isPending && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-20 flex-1 rounded-2xl" />
              </div>
            ))}
          </>
        )}

        {isError && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Không tải được bình luận.</p>
            <Button variant="outline" className="mt-2" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        )}

        {!isPending && !isError && comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            blogId={blogId}
            requireAuth={requireAuth}
          />
        ))}

        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage && <Loader2 className="animate-spin" />}
              Xem thêm bình luận
            </Button>
          </div>
        )}
      </div>

      <LoginRequiredDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
    </section>
  );
}
