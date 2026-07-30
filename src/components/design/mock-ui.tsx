import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export function MockPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={cn("mock-page space-y-4", className)}>{children}</main>;
}

export function MockCard({
  children,
  className,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={cn("mock-card", pad && "mock-card-pad", className)}>
      {children}
    </div>
  );
}

export function MockButton({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = cn(
    "mock-btn",
    variant === "primary" && "mock-btn-primary",
    variant === "secondary" && "mock-btn-secondary",
    variant === "danger" && "mock-btn-danger",
    disabled && "opacity-60",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function MockChip({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span className={cn("mock-chip", active && "mock-chip-active")}>
      {children}
    </span>
  );
}

export function MockList({
  children,
}: {
  children: ReactNode;
}) {
  return <ul className="mock-list">{children}</ul>;
}

export function MockListLink({
  href,
  title,
  subtitle,
  badge,
}: {
  href: string;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <li>
      <Link href={href} className="mock-list-item flex items-center gap-3">
        {badge ? <span className="mock-badge">{badge}</span> : null}
        <div className="min-w-0 flex-1">
          <p className="mock-list-title">{title}</p>
          {subtitle ? <p className="mock-list-sub">{subtitle}</p> : null}
        </div>
        <span className="text-sm text-zinc-300">›</span>
      </Link>
    </li>
  );
}
