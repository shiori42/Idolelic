"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { useMockAuth } from "@/components/design/MockAuthProvider";
import { MockButton, MockPage } from "@/components/design/mock-ui";
import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { authHref, isDesignPath, sanitizeAuthNextPath } from "@/lib/auth/paths";

type LoginScreenProps = {
  nextPath?: string;
  errorMessage?: string;
};

export function LoginScreen({ nextPath, errorMessage }: LoginScreenProps) {
  const pathname = usePathname();
  const router = useRouter();
  const design = isDesignPath(pathname);
  const { authMode, login, loginWithPassword } = useMockAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage ?? "");
  const [loading, setLoading] = useState(false);

  const returningToSpotRegister = nextPath?.endsWith("/spots/new") ?? false;
  const homePath = design ? "/design/home" : "/home";
  const profilePath = design ? "/design/profile" : "/profile";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginWithPassword(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(sanitizeAuthNextPath(nextPath) ?? homePath);
    router.refresh();
  }

  function handleMockLogin() {
    login();
    window.location.href = sanitizeAuthNextPath(nextPath) ?? homePath;
  }

  return (
    <>
      <DesignHeader title={"\u30ed\u30b0\u30a4\u30f3"} backHref={profilePath} />
      <MockPage className="mock-login-page pt-6">
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight">Idolelic</p>
          <p className="mt-2 text-sm text-[var(--mock-muted)]">
            {"\u8056\u5730\u306e\u8a18\u9332\u3068\u601d\u3044\u51fa\u3092\u30af\u30e9\u30a6\u30c9\u306b\u6b8b\u3059"}
          </p>
          {returningToSpotRegister ? (
            <p className="mt-2 text-sm font-medium text-[var(--mock-brand)]">
              {"\u8056\u5730\u3092\u767b\u9332\u3059\u308b\u306b\u306f\u30ed\u30b0\u30a4\u30f3\u304c\u5fc5\u8981\u3067\u3059"}
            </p>
          ) : null}
        </div>

        {isSupabaseAuthConfigured() ? (
          <form className="mock-auth-form space-y-3 pt-2" onSubmit={handleSubmit}>
            <label className="mock-field">
              <span className="mock-form-label">
                {"\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9"}
              </span>
              <input
                type="email"
                name="email"
                className="mock-form-input"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="mock-field">
              <span className="mock-form-label">
                {"\u30d1\u30b9\u30ef\u30fc\u30c9"}
              </span>
              <input
                type="password"
                name="password"
                className="mock-form-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? <p className="mock-form-error">{error}</p> : null}
            <MockButton type="submit" disabled={loading}>
              {loading ? "\u30ed\u30b0\u30a4\u30f3\u4e2d\u2026" : "\u30ed\u30b0\u30a4\u30f3"}
            </MockButton>
          </form>
        ) : (
          <div className="mock-login-actions space-y-2 pt-2">
            <MockButton type="button" onClick={handleMockLogin}>
              {"\u30c7\u30e2\u7528\u30ed\u30b0\u30a4\u30f3\uff08\u958b\u767a\uff09"}
            </MockButton>
          </div>
        )}

        <p className="text-center text-sm text-[var(--mock-muted)]">
          {"\u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u304a\u6301\u3061\u3067\u306a\u3044\u65b9\u306f "}
          <Link
            href={authHref("/signup", nextPath, design)}
            className="font-medium text-[var(--mock-brand)]"
          >
            {"\u65b0\u898f\u767b\u9332"}
          </Link>
        </p>

        {authMode === "mock" ? (
          <p className="text-center text-xs text-[var(--mock-muted)]">
            {
              "Supabase \u672a\u8a2d\u5b9a\u306e\u305f\u3081\u30c7\u30e2\u30ed\u30b0\u30a4\u30f3\u306e\u307f\u5229\u7528\u3067\u304d\u307e\u3059"
            }
          </p>
        ) : null}

        <Link
          href={profilePath}
          className="block text-center text-sm font-medium text-[var(--mock-brand)]"
        >
          {"\u30b2\u30b9\u30c8\u306e\u307e\u307e\u7d9a\u3051\u308b"}
        </Link>
      </MockPage>
    </>
  );
}
