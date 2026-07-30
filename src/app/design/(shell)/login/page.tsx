import { LoginScreen } from "@/components/design/LoginScreen";
import { sanitizeAuthNextPath } from "@/lib/auth/paths";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DesignLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const nextPath = sanitizeAuthNextPath(nextParam) ?? undefined;

  return (
    <LoginScreen
      nextPath={nextPath}
      errorMessage={errorParam ?? undefined}
    />
  );
}
