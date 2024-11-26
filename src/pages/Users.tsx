import { useState } from "react";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserDialogs } from "@/components/users/UserDialogs";
import { UserStats } from "@/components/users/UserStats";
import { AdvancedSearch } from "@/components/users/AdvancedSearch";
import { useOptimizedUsers } from "@/hooks/useOptimizedQueries";
import { useSynodStore } from "@/stores/synodStore";
import { useUserActions } from "@/hooks/useUserActions";
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useUserMutations";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { synods } = useSynodStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    filters: {
      role: "all",
      synodId: "all",
    },
    sortBy: {
      column: "created_at",
      direction: "desc" as const,
    },
  });

  const { data, isLoading, error } = useOptimizedUsers({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    searchTerm: searchParams.searchTerm,
    filters: searchParams.filters,
    sortBy: searchParams.sortBy,
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { handleImportUsers } = useUserActions();

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCodesDialog, setShowCodesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});

  const handleNewUser = () => {
    setSelectedUser(null);
    setFormData({});
    setShowUserDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowUserDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleGenerateCodes = (user) => {
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
        await createUser.mutateAsync(formData);
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

  const handleAdvancedSearch = (params) => {
    setSearchParams((prev) => ({
      ...prev,
      searchTerm: params.searchTerm,
      filters: {
        ...prev.filters,
        role: params.role || "all",
        synodId: params.synodId || "all",
        dateRange: params.dateRange,
      },
    }));
    setCurrentPage(1);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Error message="Erreur lors du chargement des utilisateurs" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <UserStats users={data?.users || []} synods={synods} />

      <div className="flex justify-between items-center">
        <UsersHeader
          users={data?.users || []}
          onImport={handleImportUsers}
          onNewUser={handleNewUser}
          existingSynods={synods.map(s => s.id)}
        />
        <AdvancedSearch onSearch={handleAdvancedSearch} />
      </div>

      <UsersFilters
        searchTerm={searchParams.searchTerm}
        onSearchChange={(value) =>
          setSearchParams((prev) => ({ ...prev, searchTerm: value }))
        }
        roleFilter={searchParams.filters.role}
        onRoleFilterChange={(value) =>
          setSearchParams((prev) => ({
            ...prev,
            filters: { ...prev.filters, role: value },
          }))
        }
        synodFilter={searchParams.filters.synodId}
        onSynodFilterChange={(value) =>
          setSearchParams((prev) => ({
            ...prev,
            filters: { ...prev.filters, synodId: value },
          }))
        }
      />

      <UsersTable
        users={data?.users || []}
        currentPage={currentPage}
        totalPages={Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
        onGenerateCodes={handleGenerateCodes}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        getSynodName={(synodId) => {
          const synod = synods.find((s) => s.id === synodId);
          return synod ? synod.name : "Synode inconnu";
        }}
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
