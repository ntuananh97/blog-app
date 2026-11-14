"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IBlogFormValues } from "@/types/blogs.type";

interface BlogFormProps {
  initialValues?: IBlogFormValues;
  submitLabel: string;
  isPending: boolean;
  /** Error message coming from the server */
  error?: string | null;
  onSubmit: (values: IBlogFormValues) => void;
}

export function BlogForm({
  initialValues,
  submitLabel,
  isPending,
  error,
  onSubmit,
}: BlogFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setValidationError("Title and content are required.");
      return;
    }
    setValidationError(null);
    onSubmit({ title: trimmedTitle, content: trimmedContent });
  };

  const message = validationError ?? error;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="blog-title">Title</Label>
        <Input
          id="blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          placeholder="Blog title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="blog-content">Content</Label>
        <Textarea
          id="blog-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="Write your blog..."
          rows={14}
        />
      </div>
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
