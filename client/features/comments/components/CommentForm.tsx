'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComment } from '@/features/comments/api/comments';

interface CommentFormProps {
  blogId: number;
  parentId?: number;
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  submitLabel?: string;
  // Trả về false nếu chưa đăng nhập (đồng thời mở popup yêu cầu đăng nhập)
  requireAuth: () => boolean;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export default function CommentForm({
  blogId,
  parentId,
  placeholder = 'Viết bình luận...',
  defaultValue = '',
  autoFocus,
  submitLabel = 'Gửi',
  requireAuth,
  onSubmitted,
  onCancel,
}: CommentFormProps) {
  const [message, setMessage] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateComment(blogId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!requireAuth()) return;

    const trimmed = message.trim();
    if (!trimmed) {
      setError('Vui lòng nhập nội dung bình luận.');
      return;
    }

    setError(null);
    mutate(
      { message: trimmed, ...(parentId ? { parentId } : {}) },
      {
        onSuccess: () => {
          setMessage('');
          onSubmitted?.();
        },
        onError: (err) => setError(err.message || 'Không thể gửi bình luận.'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={(e) => {
          // Chưa đăng nhập: không cho nhập, hiện popup
          if (!requireAuth()) e.currentTarget.blur();
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={isPending}
        aria-invalid={!!error}
        rows={parentId ? 2 : 3}
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? 'Đang gửi...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
