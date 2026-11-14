import { UpdateBlog } from "../../_components/UpdateBlog";

export default async function UpdateBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Update blog</h1>
      <UpdateBlog id={Number(id)} />
    </main>
  );
}
