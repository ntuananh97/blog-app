"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_BASE_URL } from "@/lib/constants"
import { useRouter } from 'next/navigation';
import { getSafeRedirect, saveRefreshTokenToCookie, saveTokenToCookie, saveUserInfoToCookies } from "@/lib/utils"
import GoogleLoginButton from "./googleLoginButtion"

export default function LoginPage() {
  const [email, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError("Vui lòng nhập Email và mật khẩu.")
      return
    }

    setLoading(true)
    console.log('API_BASE_URL', API_BASE_URL);
    
    try {
      // TODO: thay bằng API thật của bạn (hoặc signIn() của NextAuth)
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.message ?? "Đăng nhập thất bại.")
        return
      }

      const data = await res.json();
      const token = data.accessToken;
      saveTokenToCookie(token);
      const refreshToken = data.refreshToken;
      saveRefreshTokenToCookie(refreshToken);
      const userInfo = data.user;
      saveUserInfoToCookies(userInfo);

      // Refresh server components to reflect the new session state
      router.refresh();

      // Quay lại trang trước đó (vd: /blog/1#comments), mặc định là trang chủ
      router.push(getSafeRedirect(new URLSearchParams(window.location.search).get('redirect')))

    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} noValidate>
          <CardHeader>
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập Email và mật khẩu để tiếp tục.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                placeholder="email"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </CardFooter>
        </form>
        <GoogleLoginButton onLoading={(val) => {
          setLoading(val)
        }} />
      </Card>
    </main>
  )
}