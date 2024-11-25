import { useState, useEffect } from "react";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserDialogs } from "@/components/users/UserDialogs";
import { UserStats } from "@/components/users/UserStats";
import { UserData } from "@/types/user";
import { useSynodStore } from "@/stores/synodStore";
import { useUsers } from "@/hooks/useSupabase";
import { useUserActions } from "@/hooks/useUserActions";
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useUserMutations";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { synods } = useSynodStore();
  const { data: users = [], isLoading, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { handleImportUsers } = useUserActions();
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [roleFilter, setRoleFilter] = useState("all");
  const [synodFilter, setSynodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCodesDialog, setShowCodesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});

  useEffect(() => {
    const channel = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        async (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new as UserData;
          const oldRecord = payload.old as UserData;

          await refetch();

          switch (eventType) {
            case 'INSERT':
              toast.success(`Nouvel utilisateur ajouté: ${newRecord.name}`);
              break;
            case 'UPDATE':
              toast.info(`Utilisateur modifié: ${newRecord.name}`);
              break;
            case 'DELETE':
              toast.warning(`Utilisateur supprimé: ${oldRecord.name}`);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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
      if (!formData.name?.trim() || !formData.phone?.trim() || !formData.role || !formData.synod_id) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      if (selectedUser) {
        await updateUser.mutateAsync({
          id: selectedUser.id,
          ...formData
        });
      } else {
        await createUser.mutateAsync(formData as UserData);
      }
      setShowUserDialog(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser.mutateAsync(selectedUser.id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const getSynodName = (synodId: string) => {
    const synod = synods.find(s => s.id === synodId);
    return synod ? synod.name : "Synode inconnu";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <UserStats users={users} synods={synods} />

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