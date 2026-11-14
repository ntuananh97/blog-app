"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface UserMenuProps {
  /** Rendered when nobody is logged in. Defaults to a "Login" link. */
  guestFallback?: React.ReactNode;
}

export function UserMenu({ guestFallback }: UserMenuProps) {
  const { user, isReady, logout } = useCurrentUser();

  if (!isReady) return null;

  if (!user?.id) {
    return (
      guestFallback ?? (
        <Link href="/login" className="text-sm font-semibold hover:underline">
          Login
        </Link>
      )
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="ghost">
            <span className="font-medium">{user.email}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.email} />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
