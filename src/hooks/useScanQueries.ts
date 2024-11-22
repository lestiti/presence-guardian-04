import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const queryKeys = {
  scans: (attendanceId?: string) => ['scans', attendanceId] as const,
};

const setupRealtimeSubscription = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[]
) => {
  const channel = supabase
    .channel(`public:scans`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'scans' },
      () => {
        queryClient.invalidateQueries({ queryKey });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
};

export const useScans = (attendanceId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!attendanceId) return;
    return setupRealtimeSubscription(queryClient, queryKeys.scans(attendanceId));
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