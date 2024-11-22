import { UserData } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ImportPreviewProps {
  users: Partial<UserData>[];
  onImport: () => void;
  hasErrors: boolean;
}

export const ImportPreview = ({ users, onImport, hasErrors }: ImportPreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anarana</TableHead>
              <TableHead>Finday</TableHead>
              <TableHead>Asa</TableHead>
              <TableHead>Synode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.synod_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={onImport} disabled={hasErrors}>
          Importer {users.length} utilisateur{users.length > 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
};