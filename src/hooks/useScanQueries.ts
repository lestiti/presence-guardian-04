import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

const queryKeys = {
  scans: (attendanceId?: string) => ['scans', attendanceId] as const,
};

const setupRealtimeSubscription = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[],
  attendanceId?: string
) => {
  const channel = supabase
    .channel(`public:scans:${attendanceId || 'all'}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'scans',
        filter: attendanceId ? `attendance_id=eq.${attendanceId}` : undefined
      },
      (payload) => {
        queryClient.invalidateQueries({ queryKey });
        
        const eventType = payload.eventType;
        switch (eventType) {
          case 'INSERT':
            toast.success("Nouveau scan enregistré");
            break;
          case 'UPDATE':
            toast.info("Scan mis à jour");
            break;
          case 'DELETE':
            toast.warning("Scan supprimé");
            break;
        }
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
    
    const cleanup = setupRealtimeSubscription(
      queryClient, 
      queryKeys.scans(attendanceId),
      attendanceId
    );
    
    return () => {
      cleanup();
    };
  }, [queryClient, attendanceId]);

  return useQuery({
    queryKey: queryKeys.scans(attendanceId),
    queryFn: async () => {
      try {
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
        
        if (error) {
          console.error("Error fetching scans:", error);
          toast.error("Erreur lors du chargement des scans");
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Error in scans query:", error);
        toast.error("Erreur lors du chargement des scans");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!attendanceId,
  });
};