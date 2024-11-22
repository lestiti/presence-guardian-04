import { useState, useMemo } from "react";
import { UserData } from "@/types/user";
import { toast } from "sonner";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserDialogs } from "@/components/users/UserDialogs";
import { useSynodStore } from "@/stores/synodStore";

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const { synods } = useSynodStore();
  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "John Doe", role: "MPIOMANA", synod_id: "1", phone: "+261340000001" },
    { id: "2", name: "Jane Smith", role: "MPIANDRY", synod_id: "2", phone: "+261340000002" },
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
    synod_id: "",
    phone: "",
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.synod_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSynod = synodFilter === "all" || user.synod_id === synodFilter;
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
    setFormData({ name: "", role: "MPIOMANA", synod_id: "", phone: "" });
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast("L'utilisateur a été supprimé avec succès");
    }
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleImportUsers = (importedUsers: UserData[]) => {
    const newUsers = importedUsers.map(user => ({
      ...user,
      id: (users.length + Math.random()).toString(),
    }));
    setUsers([...users, ...newUsers]);
    toast.success(`${newUsers.length} utilisateurs importés avec succès`);
  };

  const getSynodName = (synodId: string) => {
    const synod = synods.find(s => s.id === synodId);
    return synod ? synod.name : synodId;
  };

  return (
    <div className="space-y-6">
      <UsersHeader
        users={users}
        onImport={handleImportUsers}
        onNewUser={() => {
          setSelectedUser(null);
          setFormData({ name: "", role: "MPIOMANA", synod_id: "", phone: "" });
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

      <UserDialogs
        selectedUser={selectedUser}
        showUserDialog={showUserDialog}
        showDeleteDialog={showDeleteDialog}
        showCodesDialog={showCodesDialog}
        formData={formData}
        setFormData={setFormData}
        onSaveUser={handleSaveUser}
        onConfirmDelete={handleConfirmDelete}
        setShowUserDialog={setShowUserDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setShowCodesDialog={setShowCodesDialog}
      />
    </div>
  );
};

export default Users;