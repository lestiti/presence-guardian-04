import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Synods
export const useSynods = () => {
  return useQuery({
    queryKey: ["synods"],
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

export const useCreateSynod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (synod: { name: string; description?: string; color: string }) => {
      const { data, error } = await supabase
        .from("synods")
        .insert(synod)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["synods"] });
      toast.success("Synode créé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du synode");
      console.error("Error creating synod:", error);
    },
  });
};

// Users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
    queryKey: ["attendance"],
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

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attendance: { title: string; date: string; type: string }) => {
      const { data, error } = await supabase
        .from("attendance")
        .insert(attendance)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Présence créée avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de la présence");
      console.error("Error creating attendance:", error);
    },
  });
};

// Scans
export const useScans = (attendanceId?: string) => {
  return useQuery({
    queryKey: ["scans", attendanceId],
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
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      toast.success("Scan enregistré avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'enregistrement du scan");
      console.error("Error creating scan:", error);
    },
  });
};