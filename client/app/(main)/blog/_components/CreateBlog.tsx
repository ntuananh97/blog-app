"use client";

import { useRouter } from "next/navigation";

import { useCreateBlog } from "@/features/blogs/api/create-blog";
import { BlogForm } from "./BlogForm";

export function CreateBlog() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateBlog();

  return (
    <BlogForm
      submitLabel="Create blog"
      isPending={isPending}
      error={error?.message}
      onSubmit={(values) =>
        mutate(values, { onSuccess: () => router.push("/blog/me") })
      }
    />
  );
}
