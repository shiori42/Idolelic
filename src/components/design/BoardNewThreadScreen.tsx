"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { useMockAuth } from "@/components/design/MockAuthProvider";
import { MockPage } from "@/components/design/mock-ui";
import { useBoard } from "@/features/board";
import { withAppPrefix } from "@/lib/auth/paths";
import { normalizeGroupName, validateGroupName } from "@/lib/spots/group-name";

export function BoardNewThreadScreen() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useMockAuth();
  const { addThread } = useBoard();
  const boardPath = withAppPrefix(pathname, "/board");
  const authorName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    (isLoggedIn ? "ゲスト" : "ログイン後に投稿できます");

  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [era, setEra] = useState("");
  const [hint, setHint] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const normalizedGroup = normalizeGroupName(group);
  const groupError = group.trim() ? validateGroupName(normalizedGroup) : null;

  const canSubmit =
    title.trim() !== "" &&
    normalizedGroup !== "" &&
    !groupError &&
    hint.trim() !== "" &&
    body.trim() !== "" &&
    !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    if (!isLoggedIn) {
      setError("ログインしてから投稿してください");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const thread = await addThread({
        title,
        group: normalizedGroup,
        era: era.trim() || undefined,
        hint,
        body,
        author: authorName,
      });
      setSubmittedId(thread.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "投稿に失敗しました",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <>
        <DesignHeader title="相談を投稿" backHref={boardPath} />
        <MockPage className="mock-register-page">
          <div className="mock-banner-community-success">
            相談を投稿しました。みんなのコメントを待ちましょう。
          </div>
          <Link
            href={`${boardPath}/${submittedId}`}
            className="mock-btn mock-btn-primary text-center"
          >
            投稿を見る
          </Link>
          <Link
            href={boardPath}
            className="mock-btn mock-btn-secondary text-center"
          >
            掲示板に戻る
          </Link>
        </MockPage>
      </>
    );
  }

  return (
    <>
      <DesignHeader title="相談を投稿" backHref={boardPath} />
      <MockPage className="mock-register-page">
        <p className="text-sm text-[var(--mock-muted)]">
          住所や施設名がわからない聖地は、ここで相談してください。
        </p>

        <div className="mock-form">
          <label className="mock-form-field">
            <span className="mock-form-label">タイトル *</span>
            <input
              className="mock-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: あのMVの階段はどこ？"
            />
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">グループ *</span>
            <input
              className="mock-form-input"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="例: 欅坂46"
              onBlur={() => setGroup(normalizedGroup)}
            />
            {groupError ? (
              <p className="text-xs text-rose-700">{groupError}</p>
            ) : (
              <p className="text-xs text-[var(--mock-muted)]">
                自分でグループ名を入力してください（英数字は半角）
              </p>
            )}
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">年代（任意）</span>
            <input
              className="mock-form-input"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              placeholder="例: 2012年頃"
            />
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">わかっていること *</span>
            <input
              className="mock-form-input"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="例: 渋谷周辺・夕方のロケ"
            />
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">相談内容 *</span>
            <textarea
              className="mock-form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="どんな場所か、覚えていることを書いてください"
              rows={4}
            />
          </label>
        </div>

        {error ? (
          <p className="text-sm text-rose-700">{error}</p>
        ) : null}

        <button
          type="button"
          className="mock-btn mock-btn-primary"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit}
        >
          {submitting ? "投稿中…" : "掲示板に投稿する"}
        </button>

        <p className="text-center text-xs text-[var(--mock-muted)]">
          投稿者: {authorName}
        </p>
      </MockPage>
    </>
  );
}
