import { useState } from "react";
import { User, QrCode, Trash, Edit } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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

  const handleGenerateQR = (userId: string) => {
    toast({
      title: "QR Code généré",
      description: "Le QR Code a été généré et peut être téléchargé",
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
                    <Button variant="outline" size="icon" onClick={() => handleGenerateQR(user.id)}>
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;