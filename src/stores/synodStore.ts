import { create } from 'zustand';
import { Synod } from '@/types/synod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SynodStore {
  synods: Synod[];
  setSynods: (synods: Synod[]) => void;
  fetchSynods: () => Promise<void>;
  addSynod: (synod: Omit<Synod, 'id' | 'created_at' | 'updated_at' | 'member_count'>) => Promise<void>;
  updateSynod: (id: string, synod: Partial<Synod>) => Promise<void>;
  deleteSynod: (id: string) => Promise<void>;
  updateMemberCount: (synodId: string, delta: number) => Promise<void>;
}

export const useSynodStore = create<SynodStore>((set, get) => ({
  synods: [],
  
  setSynods: (synods) => set({ synods }),
  
  fetchSynods: async () => {
    try {
      const { data, error } = await supabase
        .from('synods')
        .select('*')
        .order('name');
      
      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
        } else {
          toast.error("Erreur lors du chargement des synodes");
        }
        throw error;
      }

      set({ synods: data || [] });
    } catch (error) {
      console.error('Error in fetchSynods:', error);
      throw error;
    }
  },

  addSynod: async (synod) => {
    try {
      const { data, error } = await supabase
        .from('synods')
        .insert([synod])
        .select()
        .single();
      
      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires. Assurez-vous d'être super_admin.");
          return;
        }
        toast.error("Erreur lors de la création du synode");
        throw error;
      }

      if (!data) {
        toast.error("Erreur: Aucune donnée retournée après la création");
        throw new Error("No data returned from insert");
      }

      set((state) => ({
        synods: [...state.synods, data]
      }));

      toast.success("Synode créé avec succès");
    } catch (error) {
      console.error('Error in addSynod:', error);
      throw error;
    }
  },

  updateSynod: async (id, synod) => {
    try {
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
        } else {
          toast.error("Erreur lors de la modification du synode");
        }
        throw error;
      }

      set((state) => ({
        synods: state.synods.map((s) => 
          s.id === id ? { ...s, ...synod, updated_at: new Date().toISOString() } : s
        )
      }));

      toast.success("Synode modifié avec succès");
    } catch (error) {
      console.error('Error in updateSynod:', error);
      throw error;
    }
  },

  deleteSynod: async (id) => {
    try {
      const { error } = await supabase
        .from('synods')
        .delete()
        .eq('id', id);
      
      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
        } else {
          toast.error("Erreur lors de la suppression du synode");
        }
        throw error;
      }

      set((state) => ({
        synods: state.synods.filter((s) => s.id !== id)
      }));

      toast.success("Synode supprimé avec succès");
    } catch (error) {
      console.error('Error in deleteSynod:', error);
      throw error;
    }
  },

  updateMemberCount: async (synodId, delta) => {
    const currentSynod = get().synods.find(s => s.id === synodId);
    if (!currentSynod) return;

    try {
      const newCount = Math.max((currentSynod.member_count || 0) + delta, 0);
      
      const { error } = await supabase
        .from('synods')
        .update({ member_count: newCount })
        .eq('id', synodId);

      if (error) {
        if (error.code === '42501') {
          toast.error("Vous n'avez pas les permissions nécessaires");
        } else {
          toast.error("Erreur lors de la mise à jour du nombre de membres");
        }
        throw error;
      }

      set((state) => ({
        synods: state.synods.map(s => 
          s.id === synodId ? { ...s, member_count: newCount } : s
        )
      }));
    } catch (error) {
      console.error('Error in updateMemberCount:', error);
      throw error;
    }
  },
}));