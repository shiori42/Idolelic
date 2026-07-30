import { z } from "zod";

import type { MockSpot, SpotSource } from "@/data/mock-spots";
import { normalizeGroupName, validateGroupName } from "@/lib/spots/group-name";
import { resolveMvUrl } from "@/lib/spots/mv-url";

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  provider: "google" | "nominatim";
};

export type CommunitySpot = MockSpot & {
  latitude: number;
  longitude: number;
  createdAt?: string;
};

export const geocodeRequestSchema = z.object({
  address: z.string().trim().min(1, "住所を入力してください"),
  prefecture: z.string().trim().min(1, "都道府県を選択してください"),
});

const groupNameSchema = z
  .string()
  .transform((value) => normalizeGroupName(value))
  .superRefine((value, ctx) => {
    const error = validateGroupName(value);
    if (error) {
      ctx.addIssue({ code: "custom", message: error });
    }
  });

export const createCommunitySpotSchema = z.object({
  name: z.string().trim().min(1, "聖地名を入力してください"),
  workTitle: z.string().trim().min(1, "作品名を入力してください"),
  group: groupNameSchema,
  category: z.string().trim().min(1),
  prefecture: z.string().trim().min(1),
  region: z.string().trim().min(1),
  address: z.string().trim().min(1, "住所を入力してください"),
  description: z.string().trim().min(1, "説明を入力してください"),
  submittedBy: z.string().trim().optional(),
  mvUrl: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().url("正しいURLを入力してください").optional(),
  ),
});

export type CreateCommunitySpotInput = z.infer<typeof createCommunitySpotSchema>;

export const updateCommunitySpotSchema = z.object({
  id: z.string().trim().min(1, "id が必要です"),
  name: z.string().trim().min(1).optional(),
  workTitle: z.string().trim().min(1).optional(),
  group: groupNameSchema.optional(),
  category: z.string().trim().min(1).optional(),
  prefecture: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  submittedBy: z.string().trim().optional().nullable(),
  mvUrl: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.union([z.string().trim().url("正しいURLを入力してください"), z.null()]).optional(),
  ),
  source: z.enum(["official", "community"]).optional(),
});

export type UpdateCommunitySpotInput = z.infer<typeof updateCommunitySpotSchema>;

export const deleteCommunitySpotSchema = z.object({
  id: z.string().trim().min(1, "id が必要です"),
});

export type DbCommunitySpotRow = {
  id: string;
  legacy_id: string | null;
  name: string;
  work_title: string;
  group_name: string;
  category: string;
  prefecture: string;
  region: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  source: SpotSource;
  submitted_by: string | null;
  mv_url: string | null;
  created_at: string;
};

export function rowToCommunitySpot(row: DbCommunitySpotRow): CommunitySpot {
  return {
    id: row.legacy_id ?? row.id,
    name: row.name,
    workTitle: row.work_title,
    group: row.group_name,
    category: row.category,
    prefecture: row.prefecture,
    region: row.region,
    address: row.address,
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    source: row.source,
    submittedBy: row.submitted_by ?? undefined,
    mvUrl: resolveMvUrl({
      group: row.group_name,
      workTitle: row.work_title,
      mvUrl: row.mv_url,
    }),
    createdAt: row.created_at,
  };
}
