import { CreateBlog } from "../_components/CreateBlog";

export default function CreateBlogPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Create new blog</h1>
      <CreateBlog />
    </main>
  );
}
