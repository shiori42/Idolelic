import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DesignSpotsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      query.set(key, value[0]);
    }
  }

  const qs = query.toString();
  redirect(qs ? `/home?${qs}` : "/home");
}
