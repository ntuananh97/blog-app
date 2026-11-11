import GoogleProvider from "@/components/provider/googleAuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GoogleProvider>{children}</GoogleProvider>;
}
