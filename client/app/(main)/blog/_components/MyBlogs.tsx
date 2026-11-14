"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useMyBlogs } from "@/features/blogs/api/get-my-blogs";
import { formatDate } from "@/lib/blog-data";

export function MyBlogs() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useMyBlogs(page);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return (
      <p role="alert" className="text-destructive">
        {error.message}
      </p>
    );
  }

  const blogs = data?.blogs ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.limit))
    : 1;

  if (blogs.length === 0 && page === 1) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">You have no blogs yet.</p>
        <Button render={<Link href="/blog/create" />}>Create new blog</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y rounded-md border">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <Link
                href={`/blog/${blog.id}`}
                className="block truncate font-semibold hover:underline"
              >
                {blog.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDate(blog.createdAt)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/blog/update/${blog.id}`} />}
            >
              Edit
            </Button>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
