import { SiteHeader } from "./admin-header";

export default function Layout({ children }: {children: React.ReactNode}) {

  return (
    <div
    >
        <SiteHeader />
      {children}
    </div>
  );
}
