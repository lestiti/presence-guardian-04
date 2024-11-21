import { useState, useMemo } from "react";
import { User, QrCode, Trash, Edit } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SearchBar } from "@/components/users/SearchBar";
import { RoleFilter } from "@/components/users/RoleFilter";
import { SynodFilter } from "@/components/users/SynodFilter";
import { UsersPagination } from "@/components/users/UsersPagination";
import { UserForm } from "@/components/users/UserForm";
import { CodeDownloader } from "@/components/users/CodeDownloader";
import { ExportButton } from "@/components/users/ExportButton";
import { UserData } from "@/types/user";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "@/utils/codeGenerators";

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "John Doe", role: "MPIOMANA", synod: "Synod A", phone: "+261340000001" },
    { id: "2", name: "Jane Smith", role: "MPIANDRY", synod: "Synod B", phone: "+261340000002" },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showCodesDialog, setShowCodesDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [synodFilter, setSynodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: "",
    role: "MPIOMANA",
    synod: "",
    phone: "",
  });

  const uniqueSynods = useMemo(() => 
    Array.from(new Set(users.map(user => user.synod))),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.synod.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSynod = synodFilter === "all" || user.synod === synodFilter;
      return matchesSearch && matchesRole && matchesSynod;
    });
  }, [users, searchTerm, roleFilter, synodFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleGenerateCodes = (user: UserData) => {
    setSelectedUser(user);
    setShowCodesDialog(true);
    toast("Les codes QR et barres ont été générés");
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setFormData(user);
    setShowUserDialog(true);
  };

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...formData, id: selectedUser.id } as UserData : u));
      toast("Les modifications ont été enregistrées avec succès");
    } else {
      const newUser: UserData = {
        ...formData,
        id: (users.length + 1).toString(),
      } as UserData;
      setUsers([...users, newUser]);
      toast("Le nouvel utilisateur a été créé avec succès");
    }
    setShowUserDialog(false);
    setSelectedUser(null);
    setFormData({ name: "", role: "MPIOMANA", synod: "", phone: "" });
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast("L'utilisateur a été supprimé avec succès");
    }
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Gestion des Utilisateurs</h1>
        <div className="flex gap-2">
          <ExportButton users={users} />
          <Button 
            onClick={() => {
              setSelectedUser(null);
              setFormData({ name: "", role: "MPIOMANA", synod: "", phone: "" });
              setShowUserDialog(true);
            }}
          >
            <User className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 flex-wrap">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <RoleFilter value={roleFilter} onChange={setRoleFilter} />
        <SynodFilter 
          value={synodFilter} 
          synods={uniqueSynods}
          onChange={setSynodFilter}
        />
      </div>

      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Fonction</TableHead>
              <TableHead>Synode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEditUser(user)}
                      className="hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDeleteUser(user)}
                      className="hover:bg-primary/10"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal pour créer/éditer un utilisateur */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <UserForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveUser}
            onCancel={() => setShowUserDialog(false)}
            isEdit={!!selectedUser}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'utilisateur
              {selectedUser && ` "${selectedUser.name}"`} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog pour les codes QR et barres */}
      <Dialog open={showCodesDialog} onOpenChange={setShowCodesDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">QR Code pour {selectedUser?.name}</h3>
              <div className="flex justify-center p-4 bg-white rounded-lg">
                {selectedUser && (
                  <div id={`qr-${selectedUser.id}`}>
                    <QRCode
                      value={generateUniqueQRCode(selectedUser.id)}
                      size={128}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Code-barres</h3>
              <div className="flex justify-center p-4 bg-white rounded-lg">
                {selectedUser && (
                  <div id={`barcode-${selectedUser.id}`}>
                    <ReactBarcode 
                      value={generateUniqueBarcode(selectedUser.id)}
                      height={50}
                      displayValue={true}
                    />
                  </div>
                )}
              </div>
            </div>
            {selectedUser && (
              <CodeDownloader 
                userId={selectedUser.id} 
                userName={selectedUser.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
