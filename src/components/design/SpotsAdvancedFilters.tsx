import type { ReactNode } from "react";

import {
  MOCK_REGIONS,
  MOCK_SPOT_CATEGORIES,
  type MockRegion,
} from "@/data/mock-spots";
import {
  buildSpotsSearchUrl,
  type SpotsFilterState,
} from "@/lib/spots-filter";
import { cn } from "@/lib/utils/cn";

const REGION_NAMES = Object.keys(MOCK_REGIONS) as MockRegion[];

type SpotsAdvancedFiltersProps = {
  filters: SpotsFilterState;
  /** 登録済み聖地から集めたグループ名（動的） */
  groups?: string[];
  className?: string;
  homePath?: string;
};

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <a href={href} className={cn("mock-chip", active && "mock-chip-active")}>
      {children}
    </a>
  );
}

export function SpotsAdvancedFilters({
  filters,
  groups = [],
  className,
  homePath = "/home",
}: SpotsAdvancedFiltersProps) {
  const prefectures = filters.region ? MOCK_REGIONS[filters.region] : [];

  return (
    <div className={cn("mock-home-advanced-filters", className)}>
      <section className="mock-filter-group">
        <p className="mock-section-label">グループ</p>
        <div className="mock-chip-row">
          <FilterChip
            href={buildSpotsSearchUrl(filters, { group: "すべて" }, homePath)}
            active={filters.group === "すべて"}
          >
            すべて
          </FilterChip>
          {groups.map((g) => (
            <FilterChip
              key={g}
              href={buildSpotsSearchUrl(filters, { group: g }, homePath)}
              active={filters.group === g}
            >
              {g}
            </FilterChip>
          ))}
        </div>
        {groups.length === 0 ? (
          <p className="mt-2 text-xs text-[var(--mock-muted)]">
            聖地が登録されると、ここにグループが自動で並びます
          </p>
        ) : null}
      </section>

      <section className="mock-filter-group">
        <p className="mock-section-label">カテゴリ</p>
        <div className="mock-chip-row">
          {MOCK_SPOT_CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              href={buildSpotsSearchUrl(filters, { category: c }, homePath)}
              active={filters.category === c}
            >
              {c}
            </FilterChip>
          ))}
        </div>
      </section>

      <section className="mock-filter-group">
        <p className="mock-section-label">地方</p>
        <div className="mock-chip-row">
          {REGION_NAMES.map((r) => (
            <FilterChip
              key={r}
              href={buildSpotsSearchUrl(filters, { region: r }, homePath)}
              active={filters.region === r}
            >
              {r}
            </FilterChip>
          ))}
        </div>
      </section>

      {filters.region ? (
        <section className="mock-filter-group">
          <p className="mock-section-label">都道府県（{filters.region}）</p>
          <div className="mock-chip-row">
            <FilterChip
              href={buildSpotsSearchUrl(
                filters,
                { prefecture: "すべて" },
                homePath,
              )}
              active={filters.prefecture === "すべて"}
            >
              すべて
            </FilterChip>
            {prefectures.map((p) => (
              <FilterChip
                key={p}
                href={buildSpotsSearchUrl(filters, { prefecture: p }, homePath)}
                active={filters.prefecture === p}
              >
                {p}
              </FilterChip>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
