import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

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
      () => {
        queryClient.invalidateQueries({ queryKey });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
};

export const useAttendance = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return setupRealtimeSubscription(queryClient, queryKeys.attendance);
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