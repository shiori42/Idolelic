import { TitleTourScreen } from "@/components/design/TitleTourScreen";
import { fetchOfficialSpots } from "@/lib/spots/fetch-official-spots";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DesignTitleTourPage({ params }: Props) {
  const { id } = await params;
  const { spots: officialSpots } = await fetchOfficialSpots();
  return <TitleTourScreen tourId={id} officialSpots={officialSpots} />;
}
