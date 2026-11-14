"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { USER_INFO_KEY } from "@/lib/constants";
import { logout as clearAuth } from "@/lib/utils";
import { IUser } from "@/types/user.type";

// Cookies have no change event, so we notify subscribers manually on logout.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

// Client: raw cookie string (or null). Server: undefined => not ready yet.
const getSnapshot = () => Cookies.get(USER_INFO_KEY) ?? null;
const getServerSnapshot = () => undefined;

export function useCurrentUser() {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const user = useMemo<IUser | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IUser;
    } catch {
      return null;
    }
  }, [raw]);

  const logout = useCallback(() => {
    clearAuth();
    notify();
    router.push("/login");
  }, [router]);

  return { user, isReady: raw !== undefined, logout };
}
