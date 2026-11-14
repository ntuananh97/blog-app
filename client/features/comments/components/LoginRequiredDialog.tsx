'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const COMMENT_SECTION_ID = 'comments';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginRequiredDialog({
  open,
  onOpenChange,
}: LoginRequiredDialogProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = () => {
    // Quay lại đúng bài viết và cuộn tới phần bình luận sau khi đăng nhập
    const redirect = encodeURIComponent(`${pathname}#${COMMENT_SECTION_ID}`);
    router.push(`/login?redirect=${redirect}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn cần đăng nhập</DialogTitle>
          <DialogDescription>
            Vui lòng đăng nhập để bình luận hoặc trả lời bình luận.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Để sau
          </Button>
          <Button onClick={handleLogin}>Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
