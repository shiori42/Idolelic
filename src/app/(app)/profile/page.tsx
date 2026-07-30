import { DesignHeader } from "@/components/design/DesignHeader";
import { ProfileScreen } from "@/components/design/ProfileScreen";
import { MockPage } from "@/components/design/mock-ui";
import { isOwnerUser } from "@/lib/auth/owner";
import { getServerAuthUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await getServerAuthUser();
  const isOwner = isOwnerUser(user);

  return (
    <>
      <DesignHeader title="マイページ" />
      <MockPage>
        <ProfileScreen isOwner={isOwner} />
      </MockPage>
    </>
  );
}
