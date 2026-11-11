import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, type Post } from "@/lib/blog-data";
import { IBlog } from "@/types/blogs.type";

export function FeaturedPost({ post }: { post: IBlog }) {
  return (
    <article className="group grid overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl md:grid-cols-2">
      <div className={`relative min-h-64 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.4),transparent_55%)]" />
        <div className="absolute -bottom-16 -right-16 size-64 rounded-full bg-white/20 blur-3xl" />
        <Badge className="absolute left-5 top-5 border-0 bg-white/90 text-foreground backdrop-blur hover:bg-white/90">
          Nổi bật
        </Badge>
      </div>

      <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
        {/* <Badge variant="secondary" className="w-fit">
          {post.category}
        </Badge> */}
        <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">{post.title}</h2>
        <p className="leading-relaxed text-muted-foreground">Hiểu rõ ranh giới giữa Server và Client Component, khi nào nên dùng cái nào và cách tránh những sai lầm phổ biến khi tối ưu hiệu năng.</p>

        <div className="flex items-center gap-3 text-sm">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs font-medium">{post.author.id}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="font-medium">{post.author.email}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)} ·{" "}
              {/* <Clock className="mb-0.5 inline size-3" /> {post.readTime} phút đọc */}
            </p>
          </div>
        </div>

        <Link href={`/blog/${post.id}`}>
            Đọc bài viết
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
      </div>
    </article>
  );
}