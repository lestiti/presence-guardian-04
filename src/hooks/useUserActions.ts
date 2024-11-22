import { UserData } from "@/types/user";
import { useCreateUser } from "./useUserMutations";
import { toast } from "sonner";

export const useUserActions = () => {
  const createUser = useCreateUser();

  const handleImportUsers = async (users: UserData[]) => {
    try {
      await Promise.all(users.map(user => createUser.mutateAsync(user)));
      toast.success(`${users.length} utilisateurs importés avec succès`);
    } catch (error) {
      console.error("Error importing users:", error);
      toast.error("Erreur lors de l'importation des utilisateurs");
    }
  };

  return {
    handleImportUsers,
  };
};