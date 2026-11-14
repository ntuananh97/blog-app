import Link from "next/link";

import { UserMenu } from "@/components/user-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold hover:underline">
          Home
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
