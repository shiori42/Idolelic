import { DesignHeader } from "@/components/design/DesignHeader";
import { ProfileScreen } from "@/components/design/ProfileScreen";
import { MockPage } from "@/components/design/mock-ui";

export default function DesignProfilePage() {
  return (
    <>
      <DesignHeader title="マイページ" />
      <MockPage>
        <ProfileScreen />
      </MockPage>
    </>
  );
}
