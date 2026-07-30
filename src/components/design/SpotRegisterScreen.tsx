"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { useMockAuth } from "@/components/design/MockAuthProvider";
import { MockPage } from "@/components/design/mock-ui";
import { MOCK_SPOT_CATEGORIES } from "@/data/mock-spots";
import { useUserSpots } from "@/features/user-spots";
import { geocodeAddressClient } from "@/lib/spots/community-spots-client";
import type { GeocodePreview } from "@/lib/spots/community-spots-client";
import {
  isValidGroupName,
  normalizeGroupName,
  validateGroupName,
} from "@/lib/spots/group-name";
import { ALL_PREFECTURES, regionFromPrefecture } from "@/lib/spots-helpers";

const CATEGORY_OPTIONS = MOCK_SPOT_CATEGORIES.filter((c) => c !== "すべて");

function canSubmitForm(fields: {
  name: string;
  group: string;
  address: string;
  description: string;
  geocode: GeocodePreview | null;
}) {
  return (
    fields.name.trim() !== "" &&
    isValidGroupName(fields.group) &&
    fields.address.trim() !== "" &&
    fields.description.trim() !== "" &&
    fields.geocode !== null
  );
}

export function SpotRegisterScreen() {
  const pathname = usePathname();
  const design = pathname.startsWith("/design");
  const { user } = useMockAuth();
  const { registerSpot } = useUserSpots();
  const homePath = design ? "/design/home" : "/home";
  const boardNewPath = design ? "/design/board/new" : "/board/new";

  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [groupError, setGroupError] = useState("");
  const [prefecture, setPrefecture] = useState("東京都");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [era, setEra] = useState("");
  const [mvUrl, setMvUrl] = useState("");
  const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [geocode, setGeocode] = useState<GeocodePreview | null>(null);
  const [geocodeError, setGeocodeError] = useState("");
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formComplete = canSubmitForm({
    name,
    group,
    address,
    description,
    geocode,
  });

  function resetGeocode() {
    setGeocode(null);
    setGeocodeError("");
  }

  function handleGroupChange(value: string) {
    setGroup(value);
    if (groupError) {
      setGroupError(validateGroupName(normalizeGroupName(value)) ?? "");
    }
  }

  function handleGroupBlur() {
    const normalized = normalizeGroupName(group);
    setGroup(normalized);
    setGroupError(validateGroupName(normalized) ?? "");
  }

  async function resolveAddressLocation() {
    setGeocodeLoading(true);
    setGeocodeError("");
    setGeocode(null);

    try {
      const result = await geocodeAddressClient(address, prefecture);
      setGeocode(result);
    } catch (error) {
      setGeocodeError(
        error instanceof Error
          ? error.message
          : "住所から位置を取得できませんでした",
      );
    } finally {
      setGeocodeLoading(false);
    }
  }

  async function handleSubmit() {
    const normalizedGroup = normalizeGroupName(group);
    const nextGroupError = validateGroupName(normalizedGroup);
    setGroup(normalizedGroup);
    setGroupError(nextGroupError ?? "");

    if (nextGroupError || !canSubmitForm({
      name,
      group: normalizedGroup,
      address,
      description,
      geocode,
    }) || submitLoading) {
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    try {
      const region = regionFromPrefecture(prefecture) ?? "関東";
      const fullDescription = era.trim()
        ? `${description.trim()}\n年代: ${era.trim()}`
        : description.trim();

      await registerSpot({
        name: name.trim(),
        workTitle: normalizedGroup,
        group: normalizedGroup,
        category,
        prefecture,
        region,
        address: address.trim(),
        description: fullDescription,
        submittedBy: user?.displayName,
        mvUrl: mvUrl.trim() || undefined,
      });

      window.location.href = `${homePath}?registered=1`;
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "聖地の登録に失敗しました",
      );
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <DesignHeader title="聖地を登録" backHref={homePath} />
      <MockPage className="mock-register-page">
        <p className="text-sm text-[var(--mock-muted)]">
          確定した聖地を地図に残します。住所がわからない場合は掲示板をご利用ください。
        </p>

        <div className="mock-form">
          <label className="mock-form-field">
            <span className="mock-form-label">グループ名 *</span>
            <input
              className="mock-form-input"
              value={group}
              onChange={(e) => handleGroupChange(e.target.value)}
              onBlur={handleGroupBlur}
              placeholder="例: 欅坂46"
              required
              aria-invalid={Boolean(groupError)}
              aria-describedby={
                groupError ? "group-name-error" : "group-name-hint"
              }
            />
            {groupError ? (
              <p
                id="group-name-error"
                className="text-xs font-medium text-[var(--mock-danger)]"
              >
                {groupError}
              </p>
            ) : (
              <p
                id="group-name-hint"
                className="text-xs text-[var(--mock-muted)]"
              >
                英数字は半角、かな・漢字は全角で入力してください
              </p>
            )}
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">聖地名 *</span>
            <input
              className="mock-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 渋谷ストリーム"
              required
            />
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">都道府県 *</span>
            <select
              className="mock-form-input"
              value={prefecture}
              onChange={(e) => {
                setPrefecture(e.target.value);
                resetGeocode();
              }}
              required
            >
              {ALL_PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">住所 *</span>
            <input
              className="mock-form-input"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                resetGeocode();
              }}
              placeholder="例: 渋谷区道玄坂2-1"
              required
            />
          </label>

          <div className="mock-form-field">
            <span className="mock-form-label">位置情報（住所から取得） *</span>
            <button
              type="button"
              className="mock-btn mock-btn-secondary"
              onClick={() => void resolveAddressLocation()}
              disabled={!address.trim() || geocodeLoading}
            >
              {geocodeLoading ? "取得中…" : "住所から緯度・経度を取得"}
            </button>
            {geocode ? (
              <div className="mock-geocode-preview">
                <p className="text-xs font-medium text-[var(--mock-brand)]">
                  緯度 {geocode.latitude.toFixed(5)} / 経度{" "}
                  {geocode.longitude.toFixed(5)}
                </p>
                <p className="mt-1 text-xs text-[var(--mock-muted)]">
                  {geocode.formattedAddress}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[var(--mock-muted)]">
                登録前に住所から位置を取得してください
              </p>
            )}
            {geocodeError ? (
              <p className="text-xs font-medium text-[var(--mock-danger)]">
                {geocodeError}
              </p>
            ) : null}
          </div>

          <label className="mock-form-field">
            <span className="mock-form-label">一言説明 *</span>
            <textarea
              className="mock-form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="どんな聖地か、当時のエピソードなど"
              rows={3}
              required
            />
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">年代（任意）</span>
            <input
              className="mock-form-input"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              placeholder="例: 2012年頃・解散直前"
            />
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">MVリンク（任意）</span>
            <input
              className="mock-form-input"
              type="url"
              value={mvUrl}
              onChange={(e) => setMvUrl(e.target.value)}
              placeholder="例: https://www.youtube.com/watch?v=..."
              inputMode="url"
            />
            <p className="text-xs text-[var(--mock-muted)]">
              watch の直リンク（https://www.youtube.com/watch?v=…）を入れると詳細画面に埋め込み再生できます。空欄のときは検索結果へのリンクになります。
            </p>
          </label>

          <label className="mock-form-field">
            <span className="mock-form-label">ジャンル（任意）</span>
            <select
              className="mock-form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Link
          href={boardNewPath}
          className="block rounded-xl border border-dashed border-[var(--mock-border)] px-4 py-3 text-center text-sm font-medium text-[var(--mock-brand)]"
        >
          住所がわからない場合は掲示板で相談する
        </Link>

        {submitError ? (
          <p className="text-sm font-medium text-[var(--mock-danger)]">
            {submitError}
          </p>
        ) : null}

        <button
          type="button"
          className="mock-btn mock-btn-primary"
          onClick={() => void handleSubmit()}
          disabled={!formComplete || submitLoading}
        >
          {submitLoading ? "登録中…" : "地図に登録する"}
        </button>

        <Link
          href={homePath}
          className="block text-center text-sm font-medium text-[var(--mock-brand)]"
        >
          キャンセル
        </Link>
      </MockPage>
    </>
  );
}
