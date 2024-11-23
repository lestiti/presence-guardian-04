import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { UserData, isValidUserRole } from "@/types/user";
import { toast } from "sonner";

const queryKeys = {
  synods: ['synods'] as const,
  users: ['users'] as const,
  attendance: ['attendance'] as const,
  scans: (attendanceId?: string) => ['scans', attendanceId] as const,
  accessCodes: ['accessCodes'] as const,
};

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
        
        // Show toast notifications for changes
        const eventType = payload.eventType;
        switch (eventType) {
          case 'INSERT':
            toast.success(`Nouveau ${table} ajouté`);
            break;
          case 'UPDATE':
            toast.info(`${table} mis à jour`);
            break;
          case 'DELETE':
            toast.warning(`${table} supprimé`);
            break;
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Realtime subscription active for ${table}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error in realtime subscription for ${table}`);
        toast.error(`Erreur de connexion pour ${table}`);
      }
    });

  return () => {
    console.log(`Cleaning up realtime subscription for ${table}`);
    channel.unsubscribe();
  };
};

export const useUsers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanup = setupRealtimeSubscription('users', queryClient, queryKeys.users);
    return () => {
      cleanup();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*, synods(name, color)")
          .order("name");

        if (error) {
          console.error("Error fetching users:", error);
          toast.error("Erreur lors du chargement des utilisateurs");
          throw error;
        }

        if (!data) {
          return [];
        }

        return data
          .filter(user => user !== null)
          .map(user => {
            if (!isValidUserRole(user.role)) {
              console.warn(`Invalid role found for user: ${user.id}`);
              return null;
            }
            return user as UserData;
          })
          .filter(Boolean) as UserData[];

      } catch (error) {
        console.error("Error in useUsers query:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export * from './useUserMutations';
export * from './useAttendanceQueries';
export * from './useScanQueries';