"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import type { AuthUser } from "@/lib/auth/user";
import { mapSupabaseUser } from "@/lib/auth/user";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { tryCreateSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  isReady: boolean;
  authMode: "supabase" | "mock";
  login: () => void;
  loginWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error?: string }>;
  signUp: (input: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function writeMockClientCookie(value: boolean) {
  if (typeof document === "undefined") return;
  if (value) {
    document.cookie = `${MOCK_AUTH_COOKIE}=1;path=/;max-age=2592000;samesite=lax`;
  } else {
    document.cookie = `${MOCK_AUTH_COOKIE}=;path=/;max-age=0;samesite=lax`;
  }
}

function readMockClientCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${MOCK_AUTH_COOKIE}=1`));
}

export function MockAuthProvider({
  children,
  initialLoggedIn,
  initialUser = null,
}: {
  children: ReactNode;
  initialLoggedIn: boolean;
  initialUser?: AuthUser | null;
}) {
  const supabaseEnabled = isSupabaseAuthConfigured();
  const [user, setUser] = useState<AuthUser | null>(
    supabaseEnabled ? initialUser : null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [isReady, setIsReady] = useState(!supabaseEnabled);

  useEffect(() => {
    if (!supabaseEnabled) {
      return;
    }

    const supabase = tryCreateSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        setIsLoggedIn(true);
      } else if (readMockClientCookie()) {
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        setIsLoggedIn(true);
      } else if (readMockClientCookie()) {
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabaseEnabled]);

  const login = useCallback(() => {
    writeMockClientCookie(true);
    setIsLoggedIn(true);
  }, []);

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        user?: AuthUser;
        error?: string;
      };

      if (!response.ok || !data.user) {
        return { error: data.error ?? "ログインに失敗しました" };
      }

      setUser(data.user);
      setIsLoggedIn(true);
      return {};
    },
    [],
  );

  const signUp = useCallback(
    async (input: { email: string; password: string; displayName: string }) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as {
        user?: AuthUser;
        needsEmailConfirmation?: boolean;
        error?: string;
      };

      if (!response.ok) {
        return { error: data.error ?? "登録に失敗しました" };
      }

      if (data.needsEmailConfirmation) {
        return { needsEmailConfirmation: true };
      }

      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }

      return {};
    },
    [],
  );

  const logout = useCallback(async () => {
    if (supabaseEnabled) {
      await fetch("/api/auth/logout", { method: "POST" });
      const supabase = tryCreateSupabaseBrowserClient();
      await supabase?.auth.signOut();
    }
    writeMockClientCookie(false);
    setUser(null);
    setIsLoggedIn(false);
  }, [supabaseEnabled]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      isReady,
      authMode: supabaseEnabled ? ("supabase" as const) : ("mock" as const),
      login,
      loginWithPassword,
      signUp,
      logout,
    }),
    [
      isLoggedIn,
      user,
      isReady,
      supabaseEnabled,
      login,
      loginWithPassword,
      signUp,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useMockAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return ctx;
}

export const useAuth = useMockAuth;
