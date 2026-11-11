"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/utils";
import { IUser } from "@/types/user.type";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { USER_INFO_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SiteHeader() {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      const rawUser = Cookies.get(USER_INFO_KEY);
      const user = rawUser ? (JSON.parse(rawUser) ) : {} as IUser;

      setUser(user);
    };
    getUserInfo();
  }, []);

  const handleLogout = async () => {
    console.log("Logging out...");
    logout();
    router.push('/login')

  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold hover:underline">
          Home
        </Link>

        {user?.id ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="ghost">
                  <span className="font-medium">{user.email}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.email} />
                    <AvatarFallback>
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            {!user ? null : (
              <Link
                href="/login"
                className="text-sm font-semibold hover:underline"
              >
                Login
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
