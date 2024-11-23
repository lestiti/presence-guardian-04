import { create } from 'zustand';
import { Synod } from '@/types/synod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SynodStore {
  synods: Synod[];
  setSynods: (synods: Synod[]) => void;
  fetchSynods: () => Promise<void>;
  addSynod: (synod: Omit<Synod, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
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
        console.error('Error fetching synods:', error);
        toast.error("Erreur lors du chargement des synodes");
        return;
      }

      set({ synods: data || [] });
      toast.success("Synodes synchronisés avec succès");
    } catch (error) {
      console.error('Error in fetchSynods:', error);
      toast.error("Erreur lors de la synchronisation des synodes");
    }
  },

  addSynod: async (synod) => {
    try {
      const { data, error } = await supabase
        .from('synods')
        .insert([synod])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        synods: [...state.synods, data]
      }));
      toast.success("Synode créé avec succès");
    } catch (error) {
      console.error('Error adding synod:', error);
      toast.error("Erreur lors de la création du synode");
    }
  },

  updateSynod: async (id, synod) => {
    try {
      const { error } = await supabase
        .from('synods')
        .update(synod)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        synods: state.synods.map((s) => 
          s.id === id ? { ...s, ...synod } : s
        )
      }));
      toast.success("Synode mis à jour avec succès");
    } catch (error) {
      console.error('Error updating synod:', error);
      toast.error("Erreur lors de la mise à jour du synode");
    }
  },

  deleteSynod: async (id) => {
    try {
      const { error } = await supabase
        .from('synods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        synods: state.synods.filter((s) => s.id !== id)
      }));
      toast.success("Synode supprimé avec succès");
    } catch (error) {
      console.error('Error deleting synod:', error);
      toast.error("Erreur lors de la suppression du synode");
    }
  },

  updateMemberCount: async (synodId, delta) => {
    const currentSynod = get().synods.find(s => s.id === synodId);
    if (!currentSynod) return;

    const newCount = (currentSynod.member_count || 0) + delta;
    
    try {
      const { error } = await supabase
        .from('synods')
        .update({ member_count: newCount })
        .eq('id', synodId);

      if (error) throw error;

      set((state) => ({
        synods: state.synods.map(s => 
          s.id === synodId ? { ...s, member_count: newCount } : s
        )
      }));
    } catch (error) {
      console.error('Error updating member count:', error);
      toast.error("Erreur lors de la mise à jour du nombre de membres");
    }
  },
}));