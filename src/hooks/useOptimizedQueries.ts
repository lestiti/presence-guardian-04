import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/user";

interface QueryParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  filters?: {
    role?: string;
    synodId?: string;
    dateRange?: { start: Date; end: Date };
    status?: string;
  };
  sortBy?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

export const useOptimizedUsers = ({ page, pageSize, searchTerm, filters, sortBy }: QueryParams) => {
  return useQuery({
    queryKey: ['users', page, pageSize, searchTerm, filters, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*, synods(name, color)', { count: 'exact' });

      // Search functionality
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      // Apply filters
      if (filters?.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }
      if (filters?.synodId && filters.synodId !== 'all') {
        query = query.eq('synod_id', filters.synodId);
      }

      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy.column, { ascending: sortBy.direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return {
        users: data as UserData[],
        totalCount: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};