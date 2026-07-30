"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { MockSpot } from "@/data/mock-spots";
import {
  fetchCommunitySpotsClient,
  registerCommunitySpotClient,
} from "@/lib/spots/community-spots-client";
import type { CreateCommunitySpotInput } from "@/types/spot";

const STORAGE_KEY = "osimap-user-spots";

type UserSpotsContextValue = {
  communitySpots: MockSpot[];
  communityCount: number;
  registerSpot: (input: CreateCommunitySpotInput) => Promise<MockSpot>;
  isReady: boolean;
  isDbPersisted: boolean;
};

const UserSpotsContext = createContext<UserSpotsContextValue | null>(null);

function readLocalSpots(): MockSpot[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MockSpot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalSpots(spots: MockSpot[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch {
    // ignore
  }
}

export function UserSpotsProvider({ children }: { children: ReactNode }) {
  const [communitySpots, setCommunitySpots] = useState<MockSpot[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDbPersisted, setIsDbPersisted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { spots, persisted } = await fetchCommunitySpotsClient();
        if (cancelled) return;

        if (persisted && spots.length > 0) {
          setCommunitySpots(spots);
          setIsDbPersisted(true);
        } else if (persisted) {
          setCommunitySpots([]);
          setIsDbPersisted(true);
        } else {
          setCommunitySpots(readLocalSpots());
          setIsDbPersisted(false);
        }
      } catch {
        if (!cancelled) {
          setCommunitySpots(readLocalSpots());
          setIsDbPersisted(false);
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const registerSpot = useCallback(
    async (input: CreateCommunitySpotInput) => {
      const result = await registerCommunitySpotClient(input);
      const spot = result.spot;

      setCommunitySpots((prev) => {
        const next = [spot, ...prev.filter((item) => item.id !== spot.id)];
        if (!result.persisted) {
          writeLocalSpots(next);
        }
        return next;
      });
      setIsDbPersisted(result.persisted);

      return spot;
    },
    [],
  );

  const value = useMemo(
    () => ({
      communitySpots,
      communityCount: communitySpots.length,
      registerSpot,
      isReady,
      isDbPersisted,
    }),
    [communitySpots, registerSpot, isReady, isDbPersisted],
  );

  return (
    <UserSpotsContext.Provider value={value}>
      {children}
    </UserSpotsContext.Provider>
  );
}

export function useUserSpots() {
  const ctx = useContext(UserSpotsContext);
  if (!ctx) {
    throw new Error("useUserSpots must be used within UserSpotsProvider");
  }
  return ctx;
}
