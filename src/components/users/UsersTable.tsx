import { QrCode, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserData } from "@/types/user";
import { UsersPagination } from "./UsersPagination";

interface UsersTableProps {
  users: UserData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onGenerateCodes: (user: UserData) => void;
  onEditUser: (user: UserData) => void;
  onDeleteUser: (user: UserData) => void;
  getSynodName: (synodId: string) => string;
}

export const UsersTable = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onGenerateCodes,
  onEditUser,
  onDeleteUser,
  getSynodName,
}: UsersTableProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-soft border border-white/20 animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold">Nom</TableHead>
              <TableHead className="font-semibold">Téléphone</TableHead>
              <TableHead className="font-semibold">Fonction</TableHead>
              <TableHead className="font-semibold">Synode</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{getSynodName(user.synod_id)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onGenerateCodes(user)}
                      className="hover:bg-primary/10 transition-colors duration-200"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onEditUser(user)}
                      className="hover:bg-primary/10 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onDeleteUser(user)}
                      className="hover:bg-primary/10 transition-colors duration-200"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t border-gray-100">
        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
