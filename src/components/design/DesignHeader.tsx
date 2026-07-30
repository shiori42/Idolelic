import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DesignHeaderProps = {
  title: string;
  backHref?: string;
  right?: ReactNode;
  className?: string;
};

export function DesignHeader({
  title,
  backHref,
  right,
  className,
}: DesignHeaderProps) {
  return (
    <header className={cn("mock-header", className)}>
      {backHref ? (
        <Link href={backHref} className="mock-header-back" aria-label="戻る">
          ‹
        </Link>
      ) : (
        <div className="w-9 shrink-0" />
      )}
      <h1 className="mock-header-title">{title}</h1>
      <div className="flex w-9 shrink-0 items-center justify-end text-sm">
        {right}
      </div>
    </header>
  );
}
