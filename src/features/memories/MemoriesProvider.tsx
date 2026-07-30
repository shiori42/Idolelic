"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { MOCK_MEMORIES, type MockMemory } from "@/data/mock-memories";

const STORAGE_KEY = "osimap-memories";
const MEMORIES_EVENT = "osimap-memories-change";

type MemoriesContextValue = {
  getMemoriesForSpot: (spotId: string) => MockMemory[];
  addMemory: (
    spotId: string,
    input: { body: string; visitedEra?: string; author: string },
  ) => void;
};

const MemoriesContext = createContext<MemoriesContextValue | null>(null);

let memoriesSnapshot: MockMemory[] = [...MOCK_MEMORIES];
let hydrated = false;

function readStoredMemories(): MockMemory[] {
  if (typeof window === "undefined") return [...MOCK_MEMORIES];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...MOCK_MEMORIES];
    const parsed = JSON.parse(raw) as MockMemory[];
    return Array.isArray(parsed) ? parsed : [...MOCK_MEMORIES];
  } catch {
    return [...MOCK_MEMORIES];
  }
}

function hydrateMemoriesSnapshot() {
  if (typeof window === "undefined" || hydrated) return;
  memoriesSnapshot = readStoredMemories();
  hydrated = true;
}

function persistMemories(memories: MockMemory[]) {
  memoriesSnapshot = memories;
  hydrated = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(MEMORIES_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(MEMORIES_EVENT, onStoreChange);
  return () => window.removeEventListener(MEMORIES_EVENT, onStoreChange);
}

function getSnapshot() {
  hydrateMemoriesSnapshot();
  return memoriesSnapshot;
}

function getServerSnapshot() {
  return MOCK_MEMORIES;
}

export function MemoriesProvider({ children }: { children: ReactNode }) {
  const memories = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getMemoriesForSpot = useCallback(
    (spotId: string) =>
      memories
        .filter((memory) => memory.spotId === spotId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [memories],
  );

  const addMemory = useCallback(
    (
      spotId: string,
      input: { body: string; visitedEra?: string; author: string },
    ) => {
      const next: MockMemory = {
        id: `memory-${Date.now()}`,
        spotId,
        author: input.author,
        body: input.body.trim(),
        visitedEra: input.visitedEra?.trim() || undefined,
        createdAt: new Date().toLocaleDateString("ja-JP"),
      };
      persistMemories([next, ...readStoredMemories()]);
    },
    [],
  );

  const value = useMemo(
    () => ({ getMemoriesForSpot, addMemory }),
    [getMemoriesForSpot, addMemory],
  );

  return (
    <MemoriesContext.Provider value={value}>{children}</MemoriesContext.Provider>
  );
}

export function useMemories() {
  const ctx = useContext(MemoriesContext);
  if (!ctx) {
    throw new Error("useMemories must be used within MemoriesProvider");
  }
  return ctx;
}
