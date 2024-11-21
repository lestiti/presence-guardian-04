import { ExportButton } from "./ExportButton";
import { BulkCodeDownloader } from "./BulkCodeDownloader";
import { UserData } from "@/types/user";

interface BulkActionsProps {
  users: UserData[];
}

export const BulkActions = ({ users }: BulkActionsProps) => {
  return (
    <div className="flex gap-2">
      <ExportButton users={users} />
      <BulkCodeDownloader users={users} />
    </div>
  );
};