"use client";

import { useState } from "react";

import { MOCK_DASHBOARD, MOCK_OSHI_GROUPS } from "@/data/mock-spots";

export function OshiPicker() {
  const [oshi, setOshi] = useState(MOCK_DASHBOARD.oshiGroup);

  return (
    <div className="mock-oshi-picker">
      <div>
        <p className="text-xs font-semibold text-[var(--mock-muted)]">推しの設定</p>
        <p className="mt-0.5 text-sm font-medium">お気に入りグループ</p>
      </div>
      <select
        value={oshi}
        onChange={(e) => setOshi(e.target.value)}
        aria-label="推しグループ"
      >
        {MOCK_OSHI_GROUPS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
