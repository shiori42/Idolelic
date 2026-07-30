import { cookies } from "next/headers";

import { HomeMapScreen } from "@/components/design/HomeMapScreen";
import { isServerAuthenticated } from "@/lib/auth/session";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { fetchFilteredOfficialSpots, parseSpotsFilters } from "@/lib/spots-filter";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AppHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseSpotsFilters(params);
  const { spots: officialSpots } = await fetchFilteredOfficialSpots(filters);
  const showRegisteredMessage = params.registered === "1";
  const cookieStore = await cookies();
  const isLoggedIn = await isServerAuthenticated(
    cookieStore.get(MOCK_AUTH_COOKIE)?.value,
  );

  return (
    <HomeMapScreen
      filters={filters}
      officialSpots={officialSpots}
      isLoggedIn={isLoggedIn}
      showRegisteredMessage={showRegisteredMessage}
      homePath="/home"
    />
  );
}
