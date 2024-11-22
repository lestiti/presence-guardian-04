import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

// Optimized query keys
const queryKeys = {
  synods: ['synods'] as const,
  users: ['users'] as const,
  attendance: ['attendance'] as const,
  scans: (attendanceId?: string) => ['scans', attendanceId] as const,
};

// Synods with realtime updates
export const useSynods = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('synods_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'synods' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.synods });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.synods,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("synods")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });
};

// Users with realtime updates
export const useUsers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: queryKeys.users });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          synods (
            name,
            color
          )
        `)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });
};

// Optimized mutations with proper error handling
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: { name: string; phone: string; role: string; synod_id: string }) => {
      const { data, error } = await supabase
        .from("users")
        .insert(user)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("Utilisateur créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'utilisateur");
      console.error("Error creating user:", error);
    },
  });
};

// Attendance
export const useAttendance = () => {
  return useQuery({
    queryKey: queryKeys.attendance,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Scans
export const useScans = (attendanceId?: string) => {
  return useQuery({
    queryKey: queryKeys.scans(attendanceId),
    queryFn: async () => {
      let query = supabase
        .from("scans")
        .select(`
          *,
          users (
            name,
            phone,
            role,
            synods (
              name,
              color
            )
          )
        `)
        .order("timestamp", { ascending: false });

      if (attendanceId) {
        query = query.eq("attendance_id", attendanceId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!attendanceId,
  });
};

export const useCreateScan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scan: { 
      user_id: string; 
      attendance_id: string; 
      scan_type: string; 
      direction: string 
    }) => {
      const { data, error } = await supabase
        .from("scans")
        .insert(scan)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scans() });
      toast.success("Scan enregistré avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'enregistrement du scan");
      console.error("Error creating scan:", error);
    },
  });
};
