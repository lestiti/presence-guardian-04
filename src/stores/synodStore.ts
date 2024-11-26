import { create } from 'zustand';
import { Synod } from '@/types/synod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAccess } from '@/hooks/useAccess';

interface SynodStore {
  synods: Synod[];
  isLoading: boolean;
  error: string | null;
  setSynods: (synods: Synod[]) => void;
  fetchSynods: () => Promise<void>;
  addSynod: (synod: Omit<Synod, 'id' | 'created_at' | 'updated_at' | 'member_count'>) => Promise<void>;
  updateSynod: (id: string, synod: Partial<Synod>) => Promise<void>;
  deleteSynod: (id: string) => Promise<void>;
  updateMemberCount: (synodId: string, delta: number) => Promise<void>;
}

export const useSynodStore = create<SynodStore>((set, get) => ({
  synods: [],
  isLoading: false,
  error: null,
  
  setSynods: (synods) => set({ synods }),
  
  fetchSynods: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('synods')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching synods:', error);
        set({ error: error.message });
        toast.error("Erreur lors du chargement des synodes");
        return;
      }

      set({ synods: data || [], isLoading: false });
    } catch (error) {
      console.error('Error in fetchSynods:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      toast.error("Erreur lors du chargement des synodes");
    }
  },

  addSynod: async (synod) => {
    try {
      set({ isLoading: true, error: null });
      
      const { accessCode } = useAccess.getState();
      
      if (!accessCode) {
        throw new Error("Code d'accès requis pour cette opération");
      }

      const { data, error } = await supabase
        .from('synods')
        .insert([{ ...synod, created_at: new Date().toISOString() }])
        .select()
        .single();
      
      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
          set({ error: error.message, isLoading: false });
          return;
        }
        throw error;
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après la création");
      }

      set((state) => ({
        synods: [...state.synods, data],
        isLoading: false
      }));

      toast.success("Synode créé avec succès");
    } catch (error) {
      console.error('Error in addSynod:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      toast.error("Erreur lors de la création du synode");
    }
  },

  updateSynod: async (id, synod) => {
    try {
      set({ isLoading: true, error: null });
      
      const { accessCode } = useAccess.getState();
      
      if (!accessCode) {
        throw new Error("Code d'accès requis pour cette opération");
      }

      const { error } = await supabase
        .from('synods')
        .update({
          ...synod,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
          set({ error: error.message, isLoading: false });
          return;
        }
        throw error;
      }

      set((state) => ({
        synods: state.synods.map((s) => 
          s.id === id ? { ...s, ...synod, updated_at: new Date().toISOString() } : s
        ),
        isLoading: false
      }));

      toast.success("Synode modifié avec succès");
    } catch (error) {
      console.error('Error in updateSynod:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      toast.error("Erreur lors de la modification du synode");
    }
  },

  deleteSynod: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { accessCode } = useAccess.getState();
      
      if (!accessCode) {
        throw new Error("Code d'accès requis pour cette opération");
      }

      // Check if there are any users associated with this synod
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('synod_id', id);

      if (usersError) {
        throw usersError;
      }

      if (users && users.length > 0) {
        toast.error("Impossible de supprimer ce synode car il contient encore des membres");
        set({ isLoading: false });
        return;
      }

      const { error } = await supabase
        .from('synods')
        .delete()
        .eq('id', id);
      
      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
          set({ error: error.message, isLoading: false });
          return;
        }
        throw error;
      }

      set((state) => ({
        synods: state.synods.filter((s) => s.id !== id),
        isLoading: false
      }));

      toast.success("Synode supprimé avec succès");
    } catch (error) {
      console.error('Error in deleteSynod:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      toast.error("Erreur lors de la suppression du synode");
    }
  },

  updateMemberCount: async (synodId, delta) => {
    const currentSynod = get().synods.find(s => s.id === synodId);
    if (!currentSynod) return;

    try {
      set({ isLoading: true, error: null });
      
      const newCount = Math.max((currentSynod.member_count || 0) + delta, 0);
      
      const { error } = await supabase
        .from('synods')
        .update({ member_count: newCount })
        .eq('id', synodId);

      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
          set({ error: error.message, isLoading: false });
          return;
        }
        throw error;
      }

      set((state) => ({
        synods: state.synods.map(s => 
          s.id === synodId ? { ...s, member_count: newCount } : s
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error in updateMemberCount:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      toast.error("Erreur lors de la mise à jour du nombre de membres");
    }
  },
}));