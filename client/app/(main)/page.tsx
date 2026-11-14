import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogList } from "@/app/(main)/blog/_components/BlogList";

export default function Home() {

  return <div className="flex min-h-screen flex-col bg-background">
    
 
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_65%)]"
          />
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5 text-violet-500" />
              Kiến thức mới mỗi tuần 1
            </span>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Chia sẻ về{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                lập trình web
              </span>{" "}
              hiện đại
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
              Bài viết thực chiến về Next.js, React, TypeScript và thiết kế giao diện — ngắn gọn, dễ áp dụng.
            </p>
          </div>
        </section>
 
        <BlogList />
 
        {/* Newsletter */}
        <section className="mx-auto mb-20 w-full max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-6 py-12 text-center text-white md:px-16">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-2xl font-bold tracking-tight md:text-3xl">Nhận bài viết mới qua email</h2>
            <p className="relative mx-auto mt-2 max-w-md text-white/80">
              Không spam. Mỗi tuần một email tổng hợp những bài viết hay nhất.
            </p>
            <form className="relative mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="email@example.com"
                className="h-11 border-0 bg-white text-foreground placeholder:text-muted-foreground"
                aria-label="Email"
              />
              <Button type="submit" variant="secondary" className="h-11 px-6">
                Đăng ký
              </Button>
            </form>
          </div>
        </section>
      </main>
 
  
    </div>
}
