import { useState, useMemo } from "react";
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
import { UserForm } from "@/components/users/UserForm";
import { UserData } from "@/types/user";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "@/utils/codeGenerators";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { CodeDownloader } from "@/components/users/CodeDownloader";
import { useSynodStore } from "@/stores/synodStore";

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const { synods } = useSynodStore();
  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "John Doe", role: "MPIOMANA", synod: "1", phone: "+261340000001" },
    { id: "2", name: "Jane Smith", role: "MPIANDRY", synod: "2", phone: "+261340000002" },
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

  const getSynodName = (synodId: string) => {
    const synod = synods.find(s => s.id === synodId);
    return synod ? synod.name : synodId;
  };

  const handleImportUsers = (importedUsers: UserData[]) => {
    const newUsers = importedUsers.map(user => ({
      ...user,
      id: (users.length + Math.random()).toString(),
    }));
    setUsers([...users, ...newUsers]);
    toast.success(`${newUsers.length} utilisateurs importés avec succès`);
  };

  return (
    <div className="space-y-6">
      <UsersHeader
        users={users}
        onImport={handleImportUsers}
        onNewUser={() => {
          setSelectedUser(null);
          setFormData({ name: "", role: "MPIOMANA", synod: "", phone: "" });
          setShowUserDialog(true);
        }}
        existingSynods={synods.map(s => s.id)}
      />

      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        synodFilter={synodFilter}
        onSynodFilterChange={setSynodFilter}
      />

      <UsersTable
        users={paginatedUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onGenerateCodes={handleGenerateCodes}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        getSynodName={getSynodName}
      />

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
