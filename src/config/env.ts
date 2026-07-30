import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_DEMO_MODE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export type ClientEnv = z.infer<typeof envSchema>;

export function getClientEnv(): ClientEnv {
  return envSchema.parse({
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  });
}
