
'use client';
import Link from "next/link";
import { ArrowLeft, Bookmark, CalendarDays, Share2, Sparkles, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/blog-data";
import { useDetailBlog } from "@/features/blogs/api/get-blogs";
import CommentSection from "@/features/comments/components/CommentSection";


export default  function BlogDetail({ id }: { id: string }) {


  const {data, isPending} = useDetailBlog(id ? Number(id) : 0);



  if (isPending) return <div>Loading...</div>;

  if (!data?.blog) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const currentPost = data.blog;




  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại trang chủ
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
        <article className="space-y-6">
          <section className={`overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 text-white shadow-2xl shadow-violet-500/10 sm:p-8 lg:p-10`}>
            <div className="flex flex-wrap items-center gap-3">
              {/* <Badge className="rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15">
                {currentPost.category}
              </Badge> */}
              <span className="inline-flex items-center gap-1 text-xs text-violet-100">
                <Sparkles className="size-3.5" />
                Bài viết nổi bật
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {currentPost.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-violet-100">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-white/15 font-semibold text-white">
                  {currentPost.author.id}
                </div>
                <span>{currentPost.author.email}</span>
              </div>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDate(currentPost.createdAt)}
              </span>
              {/* <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" />
                {currentPost.readTime} phút đọc
              </span> */}
            </div>
          </section>

          <section className="rounded-[28px] border bg-card p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserRound className="size-4" />
                Được viết bởi {currentPost.author.email}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full" aria-label="Lưu bài viết">
                  <Bookmark className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" aria-label="Chia sẻ bài viết">
                  <Share2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-6 text-[15px] leading-8 text-foreground/90 sm:text-base">
              <p className="text-lg text-muted-foreground">
                {currentPost.content}
              </p>

              {/* {articleSections.map((section) => (
                <div key={section.heading} className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ))} */}

              {/* <div className="rounded-2xl border bg-muted/40 p-4">
                <p className="font-medium text-foreground">Gợi ý thực tế:</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                  <li>Hạn chế đưa logic phụ thuộc vào browser quá sớm.</li>
                  <li>Đặt tên component và data flow rõ ràng để dễ bảo trì.</li>
                  <li>Luôn đo lường hiệu năng trước khi thêm nhiều dependency mới.</li>
                </ul>
              </div>

              <div className="space-y-4 pt-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Kết luận</h2>
                <p>
                  Khi triển khai một dự án lớn, cách tổ chức workflow giữa server và client không chỉ ảnh hưởng đến hiệu suất mà còn ảnh hưởng đến khả năng mở rộng, bảo trì và trải nghiệm người dùng cuối cùng.
                </p>
                <p>
                  Bắt đầu từ những nguyên tắc đơn giản, tập trung vào trải nghiệm thực tế và tối ưu từng điểm nghẽn có ý nghĩa sẽ mang lại hiệu quả bền vững hơn rất nhiều so với các quyết định tối ưu hóa theo kiểu “mạnh tay”.
                </p>
              </div> */}
            </div>
          </section>

          <CommentSection blogId={Number(id)} />
        </article>

        {/* <aside className="space-y-6">
          <Card className="p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-violet-500/10 font-semibold text-violet-600">
                {currentPost.author.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{currentPost.author.name}</p>
                <p className="text-sm text-muted-foreground">Frontend Engineer</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Tập trung vào UX, hiệu năng và các giải pháp lập trình web hiện đại, với mục tiêu giúp product dễ sử dụng và dễ mở rộng.
            </p>
          </Card>

          <div className="rounded-[28px] border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Bài viết khác</h3>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {categories.length - 1}+ chủ đề
              </span>
            </div>

            <div className="space-y-3">
              {relatedPosts.map((post) => {
                const targetId = posts.findIndex((item) => item.title === post.title) + 1;

                return (
                  <Link
                    key={post.title}
                    href={`/blog/${targetId}`}
                    className="group block rounded-2xl border bg-background/70 p-3 transition-colors hover:border-violet-200 hover:bg-violet-50/50"
                  >
                    <div className={`mb-3 h-24 rounded-xl bg-gradient-to-br ${post.gradient}`} />
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {post.category}
                    </p>
                    <h4 className="mt-2 line-clamp-2 text-base font-semibold leading-snug group-hover:text-violet-600">
                      {post.title}
                    </h4>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author.name}</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside> */}
      </div>
    </main>
  );
}