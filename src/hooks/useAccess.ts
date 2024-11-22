import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccessRole } from '@/types/access';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AccessState {
  role: AccessRole;
  setRole: (role: AccessRole) => void;
  checkAccessCode: (code: string) => Promise<boolean>;
  clearAccess: () => void;
}

export const useAccess = create<AccessState>()(
  persist(
    (set) => ({
      role: 'public',
      setRole: (role) => set({ role }),
      checkAccessCode: async (code) => {
        try {
          const { data, error } = await supabase
            .from('access_codes')
            .select('role')
            .eq('code', code)
            .eq('is_active', true)
            .single();

          if (error) throw error;

          if (data) {
            set({ role: data.role as AccessRole });
            toast.success('Code d\'accès validé');
            return true;
          }
          
          toast.error('Code d\'accès invalide');
          return false;
        } catch (error) {
          console.error('Error checking access code:', error);
          toast.error('Erreur lors de la vérification du code');
          return false;
        }
      },
      clearAccess: () => set({ role: 'public' }),
    }),
    {
      name: 'access-storage',
    }
  )
);