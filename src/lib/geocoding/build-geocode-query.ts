/** 都道府県と住所を結合してジオコーディング用クエリを作る */
export function buildGeocodeQuery(address: string, prefecture: string): string {
  const trimmedAddress = address.trim();
  const trimmedPrefecture = prefecture.trim();

  if (!trimmedAddress) return trimmedPrefecture;
  if (trimmedAddress.includes(trimmedPrefecture)) return trimmedAddress;

  return `${trimmedPrefecture}${trimmedAddress}`;
}
