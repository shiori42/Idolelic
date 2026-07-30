"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MockButton, MockCard } from "@/components/design/mock-ui";
import type { CommunitySpot } from "@/types/spot";

type AdminSpotsScreenProps = {
  initialSpots: CommunitySpot[];
  persisted: boolean;
};

type EditDraft = {
  id: string;
  name: string;
  workTitle: string;
  group: string;
  category: string;
  prefecture: string;
  region: string;
  address: string;
  description: string;
  mvUrl: string;
  source: "official" | "community";
  submittedBy: string;
};

function toDraft(spot: CommunitySpot): EditDraft {
  return {
    id: spot.id,
    name: spot.name,
    workTitle: spot.workTitle,
    group: spot.group,
    category: spot.category,
    prefecture: spot.prefecture,
    region: spot.region,
    address: spot.address,
    description: spot.description,
    mvUrl: spot.mvUrl ?? "",
    source: spot.source,
    submittedBy: spot.submittedBy ?? "",
  };
}

export function AdminSpotsScreen({
  initialSpots,
  persisted,
}: AdminSpotsScreenProps) {
  const router = useRouter();
  const [spots, setSpots] = useState(initialSpots);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return spots;
    return spots.filter((spot) => {
      const hay = [
        spot.name,
        spot.group,
        spot.workTitle,
        spot.prefecture,
        spot.id,
        spot.source,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [spots, query]);

  async function handleSave() {
    if (!editing) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/spots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          name: editing.name,
          workTitle: editing.workTitle,
          group: editing.group,
          category: editing.category,
          prefecture: editing.prefecture,
          region: editing.region,
          address: editing.address,
          description: editing.description,
          mvUrl: editing.mvUrl.trim() || null,
          source: editing.source,
          submittedBy: editing.submittedBy.trim() || null,
        }),
      });
      const data = (await response.json()) as {
        spot?: CommunitySpot;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "更新に失敗しました");
      }
      if (data.spot) {
        setSpots((prev) =>
          prev.map((s) => (s.id === editing.id ? data.spot! : s)),
        );
      }
      setEditing(null);
      setMessage("更新しました");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(spot: CommunitySpot) {
    if (
      !window.confirm(
        `「${spot.name}」を削除しますか？\nこの操作は取り消せません。`,
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/spots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: spot.id }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "削除に失敗しました");
      }
      setSpots((prev) => prev.filter((s) => s.id !== spot.id));
      if (editing?.id === spot.id) setEditing(null);
      setMessage("削除しました");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <MockCard pad className="space-y-2">
        <p className="text-sm font-semibold">オーナー管理</p>
        <p className="text-xs text-[var(--mock-muted)]">
          DB 上の聖地（公式・みんなの登録）を編集・削除できます。
          {!persisted
            ? " ※ Supabase 未設定のため一覧は空です。"
            : ` 現在 ${spots.length} 件。`}
        </p>
        <input
          className="mock-form-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前・グループ・ID で検索"
        />
      </MockCard>

      {message ? (
        <p className="mock-banner-community-success text-sm">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {editing ? (
        <MockCard pad className="space-y-3">
          <p className="mock-section-label !mb-0">編集中 · {editing.id}</p>
          {(
            [
              ["name", "聖地名"],
              ["workTitle", "作品名"],
              ["group", "グループ"],
              ["category", "カテゴリ"],
              ["prefecture", "都道府県"],
              ["region", "地方"],
              ["address", "住所"],
              ["mvUrl", "MV URL"],
              ["submittedBy", "登録者"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="mock-form-field">
              <span className="mock-form-label">{label}</span>
              <input
                className="mock-form-input"
                value={editing[key]}
                onChange={(e) =>
                  setEditing({ ...editing, [key]: e.target.value })
                }
              />
            </label>
          ))}
          <label className="mock-form-field">
            <span className="mock-form-label">説明</span>
            <textarea
              className="mock-form-textarea"
              rows={3}
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
          </label>
          <label className="mock-form-field">
            <span className="mock-form-label">source</span>
            <select
              className="mock-form-input"
              value={editing.source}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  source: e.target.value as EditDraft["source"],
                })
              }
            >
              <option value="official">official</option>
              <option value="community">community</option>
            </select>
          </label>
          <div className="flex gap-2">
            <MockButton
              className="flex-1"
              disabled={busy}
              onClick={() => void handleSave()}
            >
              {busy ? "保存中…" : "保存"}
            </MockButton>
            <MockButton
              variant="secondary"
              className="flex-1"
              disabled={busy}
              onClick={() => setEditing(null)}
            >
              キャンセル
            </MockButton>
          </div>
        </MockCard>
      ) : null}

      <ul className="space-y-3">
        {filtered.map((spot) => (
          <li key={spot.id}>
            <MockCard pad className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{spot.name}</p>
                  <p className="text-xs text-[var(--mock-muted)]">
                    {spot.group} · {spot.workTitle} · {spot.source}
                  </p>
                  <p className="mt-1 break-all text-[0.625rem] text-[var(--mock-muted)]">
                    id: {spot.id}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="mock-btn mock-btn-secondary flex-1 !py-2 text-xs"
                  disabled={busy}
                  onClick={() => {
                    setEditing(toDraft(spot));
                    setMessage(null);
                    setError(null);
                  }}
                >
                  編集
                </button>
                <button
                  type="button"
                  className="mock-btn flex-1 !border-rose-300 !bg-rose-50 !py-2 text-xs !text-rose-800"
                  disabled={busy}
                  onClick={() => void handleDelete(spot)}
                >
                  削除
                </button>
              </div>
            </MockCard>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--mock-muted)]">
          該当する聖地がありません
        </p>
      ) : null}
    </div>
  );
}
