import { BoardThreadScreen } from "@/components/design/BoardThreadScreen";
import { isOwnerUser } from "@/lib/auth/owner";
import { getServerAuthUser } from "@/lib/auth/session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DesignBoardThreadPage({ params }: Props) {
  const { id } = await params;
  const user = await getServerAuthUser();
  const isOwner = isOwnerUser(user);

  return <BoardThreadScreen threadId={id} isOwner={isOwner} />;
}
