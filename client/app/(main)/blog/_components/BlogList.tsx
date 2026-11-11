"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { BlogCard } from "./BlogCard";
import { FeaturedPost } from "./FeaturedPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, posts } from "@/lib/blog-data";
import { useBlogs } from "@/features/blogs/api/get-blogs";

export function BlogList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchCategory = category === "Tất cả" || p.category === category;
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  const isFiltering = query.trim() !== "" || category !== "Tất cả";

  const {data} = useBlogs();
  const blogs = data?.blogs || []

  const featured = blogs?.[0] ;
  const rest = featured ? blogs.slice(1) : [];


  return (
    <section id="bai-viet" className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      {/* Thanh tìm kiếm + lọc danh mục */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="rounded-full pl-9"
            aria-label="Tìm kiếm bài viết"
          />
        </div>
      </div>

      {featured && (
        <div className="mb-10">
          <FeaturedPost post={featured} />
        </div>
      )}

      {rest.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        !featured && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <p className="font-medium">Không tìm thấy bài viết phù hợp</p>
            <p className="text-sm text-muted-foreground">Hãy thử từ khoá khác hoặc chọn danh mục khác.</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("Tất cả");
              }}
            >
              Xoá bộ lọc
            </Button>
          </div>
        )
      )}
    </section>
  );
}