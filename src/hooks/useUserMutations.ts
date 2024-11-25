import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserData, UserRole, CreateUserData } from "@/types/user";

const queryKeys = {
  users: ['users'] as const,
};

const validateUserData = (user: Partial<CreateUserData>): user is CreateUserData => {
  const errors: string[] = [];

  if (!user.name?.trim()) {
    errors.push("Le nom est requis");
  }
  if (!user.phone?.trim()) {
    errors.push("Le numéro de téléphone est requis");
  }
  if (!user.role || !["MPIOMANA", "MPIANDRY", "MPAMPIANATRA", "IRAKA"].includes(user.role)) {
    errors.push("La fonction est requise");
  }
  if (!user.synod_id) {
    errors.push("Le synode est requis");
  }

  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return false;
  }

  return true;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: Partial<CreateUserData>) => {
      if (!validateUserData(userData)) {
        throw new Error("Données utilisateur invalides");
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          name: userData.name.trim(),
          phone: userData.phone.trim(),
          role: userData.role,
          synod_id: userData.synod_id,
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating user:", error);
        if (error.code === '23505') {
          throw new Error("Un utilisateur avec ce numéro de téléphone existe déjà");
        }
        throw new Error("Erreur lors de la création de l'utilisateur");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("Utilisateur créé avec succès");
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...userData }: Partial<UserData> & { id: string }) => {
      if (!validateUserData(userData)) {
        throw new Error("Données utilisateur invalides");
      }

      const { data, error } = await supabase
        .from("users")
        .update({
          name: userData.name.trim(),
          phone: userData.phone.trim(),
          role: userData.role,
          synod_id: userData.synod_id,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user:", error);
        if (error.code === '23505') {
          throw new Error("Un utilisateur avec ce numéro de téléphone existe déjà");
        }
        throw new Error("Erreur lors de la modification de l'utilisateur");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("Utilisateur modifié avec succès");
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting user:", error);
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("Utilisateur supprimé avec succès");
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
};