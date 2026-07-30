import { SpotDetailScreen } from "@/components/design/SpotDetailScreen";
import { fetchOfficialSpots } from "@/lib/spots/fetch-official-spots";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AppSpotDetailPage({ params }: Props) {
  const { id } = await params;
  const { spots: officialSpots } = await fetchOfficialSpots();
  return <SpotDetailScreen spotId={id} officialSpots={officialSpots} />;
}
