import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { UserData, isValidUserRole } from "@/types/user";

// Optimized query keys
const queryKeys = {
  synods: ['synods'] as const,
  users: ['users'] as const,
  attendance: ['attendance'] as const,
  scans: (attendanceId?: string) => ['scans', attendanceId] as const,
};

// Enhanced realtime subscription setup
const setupRealtimeSubscription = (
  table: string,
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[]
) => {
  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table },
      (payload) => {
        queryClient.invalidateQueries({ queryKey });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
};

// Synods with optimized realtime updates
export const useSynods = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return setupRealtimeSubscription('synods', queryClient, queryKeys.synods);
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Users with optimized realtime updates
export const useUsers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return setupRealtimeSubscription('users', queryClient, queryKeys.users);
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
      
      // Validate and transform the data to ensure it matches UserData type
      const validatedData = data.map(user => {
        if (!isValidUserRole(user.role)) {
          console.error(`Invalid role found: ${user.role}`);
          throw new Error(`Invalid role: ${user.role}`);
        }
        return user as UserData;
      });
      
      return validatedData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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

// Attendance with realtime updates
export const useAttendance = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return setupRealtimeSubscription('attendance', queryClient, queryKeys.attendance);
  }, [queryClient]);

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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Scans with realtime updates
export const useScans = (attendanceId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!attendanceId) return;
    return setupRealtimeSubscription('scans', queryClient, queryKeys.scans(attendanceId));
  }, [queryClient, attendanceId]);

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
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scans(data.attendance_id) });
      toast.success("Scan enregistré avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'enregistrement du scan");
      console.error("Error creating scan:", error);
    },
  });
};
