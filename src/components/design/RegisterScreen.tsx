"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { useMockAuth } from "@/components/design/MockAuthProvider";
import { MockButton, MockPage } from "@/components/design/mock-ui";
import { authHref, isDesignPath, sanitizeAuthNextPath } from "@/lib/auth/paths";
import { isSupabaseAuthConfigured } from "@/lib/auth/config";

type RegisterScreenProps = {
  nextPath?: string;
};

export function RegisterScreen({ nextPath }: RegisterScreenProps) {
  const pathname = usePathname();
  const router = useRouter();
  const design = isDesignPath(pathname);
  const { signUp } = useMockAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const homePath = design ? "/design/home" : "/home";
  const loginPath = authHref("/login", nextPath, design);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const result = await signUp({ email, password, displayName });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setInfo(
        "確認メールを送信しました。メール内のリンクを開いて登録を完了してください。",
      );
      return;
    }

    router.push(sanitizeAuthNextPath(nextPath) ?? homePath);
    router.refresh();
  }

  if (!isSupabaseAuthConfigured()) {
    return (
      <>
        <DesignHeader title="新規登録" backHref={loginPath} />
        <MockPage className="mock-login-page pt-6">
          <p className="text-center text-sm text-[var(--mock-muted)]">
            Supabase Auth が未設定のため、新規登録は利用できません。
            <br />
            .env.local に ANON KEY を設定してください。
          </p>
          <MockButton href={loginPath} className="mt-4">
            ログインへ戻る
          </MockButton>
        </MockPage>
      </>
    );
  }

  return (
    <>
      <DesignHeader title="新規登録" backHref={loginPath} />
      <MockPage className="mock-login-page pt-6">
        <div className="text-center">
          <p className="text-2xl font-bold tracking-tight">Idolelic</p>
          <p className="mt-2 text-sm text-[var(--mock-muted)]">
            アカウントを作成して聖地を残そう
          </p>
        </div>

        <form className="mock-auth-form space-y-3 pt-2" onSubmit={handleSubmit}>
          <label className="mock-field">
            <span className="mock-form-label">表示名</span>
            <input
              type="text"
              name="displayName"
              className="mock-form-input"
              autoComplete="nickname"
              placeholder="例: 昭和アイドル遺産"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              maxLength={40}
            />
          </label>
          <label className="mock-field">
            <span className="mock-form-label">メールアドレス</span>
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
            <span className="mock-form-label">パスワード（8文字以上）</span>
            <input
              type="password"
              name="password"
              className="mock-form-input"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          {error ? <p className="mock-form-error">{error}</p> : null}
          {info ? <p className="mock-form-info">{info}</p> : null}
          <MockButton type="submit" disabled={loading}>
            {loading ? "登録中…" : "アカウントを作成"}
          </MockButton>
        </form>

        <p className="text-center text-sm text-[var(--mock-muted)]">
          すでにアカウントをお持ちの方は{" "}
          <Link href={loginPath} className="font-medium text-[var(--mock-brand)]">
            ログイン
          </Link>
        </p>
      </MockPage>
    </>
  );
}
