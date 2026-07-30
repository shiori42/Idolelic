type GoogleMapsDestination = {
  latitude?: number;
  longitude?: number;
  address: string;
};

export type GoogleMapsTravelMode = "walking" | "transit";

export function buildGoogleMapsDirectionsUrl({
  latitude,
  longitude,
  address,
}: GoogleMapsDestination, travelMode: GoogleMapsTravelMode = "walking") {
  const destination =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
      ? `${latitude},${longitude}`
      : address;

  const params = new URLSearchParams({
    api: "1",
    destination,
    travelmode: travelMode,
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
