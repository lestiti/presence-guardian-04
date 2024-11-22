import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserData, UserRole } from "@/types/user";

const queryKeys = {
  users: ['users'] as const,
};

type RequiredUserData = {
  name: string;
  phone: string;
  role: UserRole;
  synod_id?: string | null;
};

const validateUserData = (user: Partial<UserData>): user is RequiredUserData => {
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

  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return false;
  }

  return true;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: Partial<UserData>) => {
      if (!validateUserData(user)) {
        throw new Error("Données utilisateur invalides");
      }

      const userData = {
        name: user.name.trim(),
        phone: user.phone.trim(),
        role: user.role,
        synod_id: user.synod_id || null,
      };

      const { data, error } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating user:", error);
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
    mutationFn: async ({ id, ...user }: Partial<UserData> & { id: string }) => {
      if (!validateUserData(user)) {
        throw new Error("Données utilisateur invalides");
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error("ID invalide");
      }

      const userData = {
        name: user.name.trim(),
        phone: user.phone.trim(),
        role: user.role,
        synod_id: user.synod_id || null,
      };

      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user:", error);
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
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error("ID invalide");
      }

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