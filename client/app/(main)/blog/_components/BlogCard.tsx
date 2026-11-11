import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate, type Post } from "@/lib/blog-data";
import { IBlog } from "@/types/blogs.type";

export function BlogCard({ post }: { post: IBlog }) {
  return (
    <Link href={`/blog/${post.id}`} className="group block h-full focus-visible:outline-none">
      <Card className="h-full gap-0 overflow-hidden py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring">
        {/* Ảnh bìa */}
        <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          {/* <Badge className="absolute left-4 top-4 border-0 bg-white/90 text-foreground backdrop-blur hover:bg-white/90">
            {post.category}
          </Badge> */}
          <div className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">Short Description</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7">
              <AvatarFallback className="text-[10px] font-medium">{post.author.id}</AvatarFallback>
            </Avatar>
            <div className="text-xs leading-tight">
              <p className="font-medium">{post.author.email}</p>
              <p className="text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {/* <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {post.readTime} phút đọc
          </span> */}
        </CardFooter>
      </Card>
    </Link>
  );
}