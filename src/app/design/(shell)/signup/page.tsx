import { RegisterScreen } from "@/components/design/RegisterScreen";
import { sanitizeAuthNextPath } from "@/lib/auth/paths";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DesignSignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = sanitizeAuthNextPath(nextParam) ?? undefined;

  return <RegisterScreen nextPath={nextPath} />;
}
