import { z } from "zod";

const serverEnvSchema = z.object({
  GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export type ServerEnv = {
  googleMapsApiKey: string | null;
  supabaseUrl: string | null;
  supabaseServiceRoleKey: string | null;
  isSupabaseConfigured: boolean;
  isGeocodingConfigured: boolean;
};

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse({
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  const values = parsed.success ? parsed.data : {};

  const googleMapsApiKey = values.GOOGLE_MAPS_API_KEY ?? null;
  const supabaseUrl = values.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const supabaseServiceRoleKey = values.SUPABASE_SERVICE_ROLE_KEY ?? null;

  cached = {
    googleMapsApiKey,
    supabaseUrl,
    supabaseServiceRoleKey,
    isSupabaseConfigured: Boolean(supabaseUrl && supabaseServiceRoleKey),
    isGeocodingConfigured: Boolean(googleMapsApiKey),
  };

  return cached;
}
