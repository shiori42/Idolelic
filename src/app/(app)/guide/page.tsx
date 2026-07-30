import { DesignHeader } from "@/components/design/DesignHeader";
import { GuideScreen } from "@/components/design/GuideScreen";
import { MockPage } from "@/components/design/mock-ui";

export default function DesignGuidePage() {
  return (
    <>
      <DesignHeader title="ä½¿ã��E–¹" backHref="/profile" />
      <MockPage>
        <GuideScreen />
      </MockPage>
    </>
  );
}
