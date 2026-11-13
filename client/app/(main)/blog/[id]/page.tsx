
import BlogDetail from "../_components/BlogDetail";


export default async  function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
        <BlogDetail id={id} />
      
    </>
  );
}