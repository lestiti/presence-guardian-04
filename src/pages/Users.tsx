import { useState } from "react";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersTable } from "@/components/users/UsersTable";
import { UserData } from "@/types/user";
import { useSynodStore } from "@/stores/synodStore";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { synods } = useSynodStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [synodFilter, setSynodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSynod = synodFilter === "all" || user.synod_id === synodFilter;
    return matchesSearch && matchesRole && matchesSynod;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleGenerateCodes = (user: UserData) => {
    toast.success("Codes générés avec succès");
  };

  const handleEditUser = (user: UserData) => {
    toast.success("Modifications enregistrées");
  };

  const handleDeleteUser = (user: UserData) => {
    toast.success("Utilisateur supprimé");
  };

  const handleImportUsers = (importedUsers: UserData[]) => {
    setUsers(prev => [...prev, ...importedUsers]);
    toast.success(`${importedUsers.length} utilisateurs importés`);
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
        onNewUser={() => toast.success("Nouvel utilisateur")}
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
    </div>
  );
};

export default Users;