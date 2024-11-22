import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/users/StatsCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { synods } = useSynodStore();
  const { data: users = [], isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { theme } = useTheme();
  
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

  // Setup real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          const eventType = payload.eventType;
          const newRecord = payload.new as UserData;
          const oldRecord = payload.old as UserData;

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
  }, []);

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

  // Statistics calculations
  const stats = {
    total: users.length,
    bySynod: synods.map(synod => ({
      name: synod.name,
      count: users.filter(u => u.synod_id === synod.id).length,
      color: synod.color
    })),
    byRole: {
      MPIOMANA: users.filter(u => u.role === "MPIOMANA").length,
      MPIANDRY: users.filter(u => u.role === "MPIANDRY").length,
      MPAMPIANATRA: users.filter(u => u.role === "MPAMPIANATRA").length,
      IRAKA: users.filter(u => u.role === "IRAKA").length
    }
  };

  const handleExportData = () => {
    const csvData = users.map(user => ({
      Nom: user.name,
      Téléphone: user.phone,
      Fonction: user.role,
      Synode: getSynodName(user.synod_id)
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'utilisateurs.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      } else {
        await createUser.mutateAsync(formData as UserData);
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
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const getSynodName = (synodId: string) => {
    const synod = synods.find(s => s.id === synodId);
    return synod ? synod.name : synodId;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Utilisateurs"
          value={stats.total}
          className="bg-primary/10"
        />
        {Object.entries(stats.byRole).map(([role, count]) => (
          <StatsCard
            key={role}
            title={role}
            value={count}
            className="bg-secondary/10"
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        <UsersHeader
          users={users}
          onImport={handleImportUsers}
          onNewUser={handleNewUser}
          existingSynods={synods.map(s => s.id)}
        />
        <Button
          variant="outline"
          onClick={handleExportData}
          className="ml-2"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

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
