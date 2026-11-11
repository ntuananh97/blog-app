export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readTime: number; // phút
  author: { name: string; initials: string };
  gradient: string; // Tailwind gradient classes dùng làm ảnh bìa
};

export const posts: Post[] = [
  {
    slug: "nextjs-server-components-thuc-chien",
    title: "Server Components trong Next.js: Cách tư duy mới cho ứng dụng React",
    excerpt:
      "Hiểu rõ ranh giới giữa Server và Client Component, khi nào nên dùng cái nào và cách tránh những sai lầm phổ biến khi tối ưu hiệu năng.",
    category: "Next.js",
    date: "2026-11-02",
    readTime: 8,
    author: { name: "Minh Anh", initials: "MA" },
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
  {
    slug: "tailwind-v4-co-gi-moi",
    title: "Tailwind CSS v4: Cấu hình CSS-first và những thay đổi đáng giá",
    excerpt:
      "Tìm hiểu cách cấu hình mới bằng CSS, engine nhanh hơn và cách nâng cấp dự án hiện tại một cách an toàn.",
    category: "CSS",
    date: "2026-10-28",
    readTime: 6,
    author: { name: "Quốc Bảo", initials: "QB" },
    gradient: "from-sky-500 via-cyan-500 to-teal-400",
  },
  {
    slug: "shadcn-ui-design-system",
    title: "Xây dựng Design System riêng với shadcn/ui",
    excerpt:
      "Tuỳ biến theme, token màu và component để có một hệ thống thiết kế nhất quán mà vẫn toàn quyền kiểm soát mã nguồn.",
    category: "UI/UX",
    date: "2026-10-21",
    readTime: 10,
    author: { name: "Thu Hà", initials: "TH" },
    gradient: "from-rose-500 via-pink-500 to-orange-400",
  },
  {
    slug: "typescript-patterns-nang-cao",
    title: "5 pattern TypeScript giúp code an toàn và dễ bảo trì hơn",
    excerpt:
      "Từ discriminated union đến branded types — những kỹ thuật thực tế giúp bắt lỗi ngay từ lúc biên dịch.",
    category: "TypeScript",
    date: "2026-10-15",
    readTime: 7,
    author: { name: "Đức Huy", initials: "ĐH" },
    gradient: "from-blue-600 via-indigo-500 to-violet-500",
  },
  {
    slug: "toi-uu-core-web-vitals",
    title: "Tối ưu Core Web Vitals: LCP, INP và CLS trong thực tế",
    excerpt:
      "Checklist đo lường và cải thiện các chỉ số quan trọng để website tải nhanh và phản hồi mượt mà hơn.",
    category: "Hiệu năng",
    date: "2026-10-09",
    readTime: 9,
    author: { name: "Minh Anh", initials: "MA" },
    gradient: "from-emerald-500 via-green-500 to-lime-400",
  },
  {
    slug: "server-actions-form-hien-dai",
    title: "Server Actions và form hiện đại: Bỏ API route không cần thiết",
    excerpt:
      "Xử lý form, validation với Zod và optimistic update chỉ với Server Actions và useActionState.",
    category: "Next.js",
    date: "2026-10-01",
    readTime: 5,
    author: { name: "Quốc Bảo", initials: "QB" },
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    slug: "dark-mode-dung-cach",
    title: "Dark mode đúng cách: Tránh nhấp nháy và giữ trải nghiệm nhất quán",
    excerpt:
      "Dùng next-themes, CSS variables và prefers-color-scheme để triển khai chế độ tối mượt mà, không bị flash.",
    category: "UI/UX",
    date: "2026-09-24",
    readTime: 4,
    author: { name: "Thu Hà", initials: "TH" },
    gradient: "from-slate-700 via-slate-600 to-zinc-500",
  },
];

export const categories = ["Tất cả", ...Array.from(new Set(posts.map((p) => p.category)))];

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}