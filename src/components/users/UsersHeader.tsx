import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportUsers } from "./ImportUsers";
import { BulkActions } from "./BulkActions";
import { UserData } from "@/types/user";

interface UsersHeaderProps {
  users: UserData[];
  onImport: (users: UserData[]) => void;
  onNewUser: () => void;
  existingSynods: string[];
}

export const UsersHeader = ({ users, onImport, onNewUser, existingSynods }: UsersHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-white/20 animate-fade-in">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Gestion des Utilisateurs
      </h1>
      <div className="flex flex-wrap gap-2">
        <ImportUsers onImport={onImport} existingSynods={existingSynods} />
        <BulkActions users={users} />
        <Button onClick={onNewUser} className="bg-primary hover:bg-primary-dark transition-all duration-300">
          <User className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>
    </div>
  );
};