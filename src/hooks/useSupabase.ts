import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { UserData, isValidUserRole } from "@/types/user";
import { toast } from "sonner";

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
      () => {
        queryClient.invalidateQueries({ queryKey });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
};

// Users with optimized realtime updates and error handling
export const useUsers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return setupRealtimeSubscription('users', queryClient, queryKeys.users);
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      try {
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
        
        if (error) {
          console.error("Error fetching users:", error);
          toast.error("Erreur lors du chargement des utilisateurs");
          throw error;
        }
        
        if (!data) {
          return [];
        }

        // Validate and transform the data
        const validatedData = data.map(user => {
          if (!isValidUserRole(user.role)) {
            console.error(`Invalid role found: ${user.role}`);
            throw new Error(`Invalid role: ${user.role}`);
          }
          return user as UserData;
        });
        
        return validatedData;
      } catch (error) {
        console.error("Error in useUsers query:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

// Re-export other hooks from their respective files
export * from './useUserMutations';
export * from './useAttendanceQueries';
export * from './useScanQueries';