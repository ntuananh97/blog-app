"use client";

import { useRouter } from "next/navigation";

import { useDetailBlog } from "@/features/blogs/api/get-blogs";
import { useUpdateBlog } from "@/features/blogs/api/update-blog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BlogForm } from "./BlogForm";

export function UpdateBlog({ id }: { id: number }) {
  const router = useRouter();
  const { user, isReady } = useCurrentUser();
  const { data, isLoading, error: loadError } = useDetailBlog(id);
  const { mutate, isPending, error } = useUpdateBlog(id);

  if (isLoading || !isReady) return <p>Loading...</p>;
  if (loadError || !data?.blog) {
    return (
      <p role="alert" className="text-destructive">
        {loadError?.message ?? "Blog not found."}
      </p>
    );
  }
  if (user && data.blog.author.id !== user.id) {
    return (
      <p role="alert" className="text-destructive">
        You are not allowed to edit this blog.
      </p>
    );
  }

  return (
    <BlogForm
      initialValues={{ title: data.blog.title, content: data.blog.content }}
      submitLabel="Save changes"
      isPending={isPending}
      error={error?.message}
      onSubmit={(values) =>
        mutate(values, { onSuccess: () => router.push("/blog/me") })
      }
    />
  );
}
