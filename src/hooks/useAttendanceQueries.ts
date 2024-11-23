import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

const queryKeys = {
  attendance: ['attendance'] as const,
};

const setupRealtimeSubscription = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[]
) => {
  const channel = supabase
    .channel(`public:attendance`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'attendance' },
      (payload) => {
        queryClient.invalidateQueries({ queryKey });
        
        const eventType = payload.eventType;
        switch (eventType) {
          case 'INSERT':
            toast.success("Nouvelle présence ajoutée");
            break;
          case 'UPDATE':
            toast.info("Présence mise à jour");
            break;
          case 'DELETE':
            toast.warning("Présence supprimée");
            break;
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        console.error("Error in attendance subscription");
        toast.error("Erreur de synchronisation des présences");
      }
    });

  return () => {
    channel.unsubscribe();
  };
};

export const useAttendance = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanup = setupRealtimeSubscription(queryClient, queryKeys.attendance);
    return () => {
      cleanup();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.attendance,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .order("date", { ascending: false });
        
        if (error) {
          console.error("Error fetching attendance:", error);
          toast.error("Erreur lors du chargement des présences");
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Error in attendance query:", error);
        toast.error("Erreur lors du chargement des présences");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};