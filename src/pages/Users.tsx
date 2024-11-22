import { useState } from "react";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserDialogs } from "@/components/users/UserDialogs";
import { UserData } from "@/types/user";
import { useSynodStore } from "@/stores/synodStore";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { synods } = useSynodStore();
  const { data: users = [], isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [roleFilter, setRoleFilter] = useState("all");
  const [synodFilter, setSynodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCodesDialog, setShowCodesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Error message="Erreur lors du chargement des utilisateurs" />;

  const filteredUsers = users.filter(user => {
    const matchesSearch = !debouncedSearch || 
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.phone.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSynod = synodFilter === "all" || user.synod_id === synodFilter;
    return matchesSearch && matchesRole && matchesSynod;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNewUser = () => {
    setSelectedUser(null);
    setFormData({});
    setShowUserDialog(true);
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

  const handleGenerateCodes = (user: UserData) => {
    setSelectedUser(user);
    setShowCodesDialog(true);
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        await updateUser.mutateAsync({
          id: selectedUser.id,
          ...formData
        });
        toast.success("Utilisateur modifié avec succès");
      } else {
        await createUser.mutateAsync(formData as UserData);
        toast.success("Utilisateur créé avec succès");
      }
      setShowUserDialog(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser.mutateAsync(selectedUser.id);
      toast.success("Utilisateur supprimé avec succès");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleImportUsers = async (importedUsers: UserData[]) => {
    try {
      await Promise.all(
        importedUsers.map(user => createUser.mutateAsync(user))
      );
      toast.success(`${importedUsers.length} utilisateurs importés avec succès`);
    } catch (error) {
      console.error("Error importing users:", error);
      toast.error("Erreur lors de l'importation");
    }
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
        onNewUser={handleNewUser}
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