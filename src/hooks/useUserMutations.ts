import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserData } from "@/types/user";

const queryKeys = {
  users: ['users'] as const,
};

type RequiredUserData = {
  name: string;
  phone: string;
  role: string;
  synod_id?: string;
  created_at?: string;
  updated_at?: string;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: Partial<UserData>) => {
      if (!user.name || !user.phone || !user.role) {
        throw new Error("Missing required fields");
      }

      const userData: RequiredUserData = {
        name: user.name,
        phone: user.phone,
        role: user.role,
        synod_id: user.synod_id,
      };

      const { data, error } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...user }: Partial<UserData> & { id: string }) => {
      if (!user.name || !user.phone || !user.role) {
        throw new Error("Missing required fields");
      }

      const userData: RequiredUserData = {
        name: user.name,
        phone: user.phone,
        role: user.role,
        synod_id: user.synod_id,
      };

      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
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
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};