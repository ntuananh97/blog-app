import { MyBlogs } from "../_components/MyBlogs";

export default function MyBlogsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My blogs</h1>
      <MyBlogs />
    </main>
  );
}
