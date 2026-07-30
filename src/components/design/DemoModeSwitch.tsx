"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

export function DemoModeSwitch() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  return (
    <div className={cn("mock-demo-switch", isDemoMode && "mock-demo-switch-on")}>
      <div>
        <p className="text-sm font-semibold text-[#5b21b6]">TGS デモモード</p>
        <p className="mt-0.5 text-xs text-[#7c3aed]">
          isDemoMode — 擬似 GPS で体験
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isDemoMode}
        aria-label="デモモード"
        className={cn("mock-toggle", isDemoMode && "mock-toggle-on")}
        onClick={() => setIsDemoMode((v) => !v)}
      >
        <span className="mock-toggle-knob" />
      </button>
    </div>
  );
}
