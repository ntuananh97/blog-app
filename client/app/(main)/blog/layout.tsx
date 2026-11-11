import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PenLine className="size-4" />
            </span>
            DevBlog
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link
              href="#bai-viet"
              className="transition-colors hover:text-foreground"
            >
              Bài viết
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground"
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              Liên hệ
            </Link>
          </nav>
          <Button size="sm" className="rounded-full">
            Đăng ký
          </Button>
        </div>
      </header>
      {children}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DevBlog. Xây dựng với Next.js, Tailwind CSS
        và shadcn/ui.
      </footer>
    </>
  );
}
