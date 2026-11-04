import { TitleListScreen } from "@/components/design/TitleListScreen";
import { fetchOfficialSpots } from "@/lib/spots/fetch-official-spots";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function DesignTitlesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const { spots: officialSpots } = await fetchOfficialSpots();
  return (
    <TitleListScreen officialSpots={officialSpots} initialQuery={q ?? ""} />
  );
}
