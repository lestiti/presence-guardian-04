import { useState } from "react";
import { User, QrCode, Barcode, Trash, Edit } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserData {
  id: string;
  name: string;
  role: "MPIOMANA" | "MPIANDRY" | "MPAMPIANATRA" | "IRAKA";
  synod: string;
}

const Users = () => {
  const { toast } = useToast();
  const [users] = useState<UserData[]>([
    { id: "1", name: "John Doe", role: "MPIOMANA", synod: "Synod A" },
    { id: "2", name: "Jane Smith", role: "MPIANDRY", synod: "Synod B" },
  ]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showCodesDialog, setShowCodesDialog] = useState(false);

  const handleGenerateCodes = (user: UserData) => {
    setSelectedUser(user);
    setShowCodesDialog(true);
    toast({
      title: "Codes générés",
      description: "Les codes QR et barres ont été générés",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Gestion des Utilisateurs</h1>
        <Button className="bg-primary hover:bg-primary-dark">
          <User className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Fonction</TableHead>
              <TableHead>Synode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.synod}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleGenerateCodes(user)}
                      className="hover:bg-primary/10"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-primary/10">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-primary/10">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showCodesDialog} onOpenChange={setShowCodesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Codes pour {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">QR Code</h3>
              <div className="flex justify-center p-4 bg-white rounded-lg">
                {selectedUser && (
                  <QRCode
                    value={`user-${selectedUser.id}`}
                    size={128}
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Code-barres</h3>
              <div className="flex justify-center p-4 bg-white rounded-lg">
                {selectedUser && (
                  <ReactBarcode 
                    value={`user-${selectedUser.id}`}
                    height={50}
                    displayValue={false}
                  />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;