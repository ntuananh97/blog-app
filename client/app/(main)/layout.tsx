import { MainFooter } from "./_components/MainFooter";
import { MainHeader } from "./_components/MainHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
