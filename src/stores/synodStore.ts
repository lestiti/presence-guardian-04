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
      const { data: session } = await supabase.auth.getSession();
      
      const { data, error } = await supabase
        .from('synods')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching synods:', error);
        toast.error("Erreur lors du chargement des synodes");
        throw error;
      }

      set({ synods: data || [] });
    } catch (error) {
      console.error('Error in fetchSynods:', error);
      toast.error("Erreur lors du chargement des synodes");
      throw error;
    }
  },

  addSynod: async (synod) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from('synods')
        .insert([synod])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding synod:', error);
        toast.error("Erreur lors de la création du synode");
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from insert");
      }

      set((state) => ({
        synods: [...state.synods, data]
      }));

      toast.success("Synode créé avec succès");
    } catch (error) {
      console.error('Error in addSynod:', error);
      toast.error("Erreur lors de la création du synode");
      throw error;
    }
  },

  updateSynod: async (id, synod) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        throw new Error("Authentication required");
      }

      const { error } = await supabase
        .from('synods')
        .update({
          ...synod,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating synod:', error);
        toast.error("Erreur lors de la modification du synode");
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
      toast.error("Erreur lors de la modification du synode");
      throw error;
    }
  },

  deleteSynod: async (id) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        throw new Error("Authentication required");
      }

      const { error } = await supabase
        .from('synods')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting synod:', error);
        toast.error("Erreur lors de la suppression du synode");
        throw error;
      }

      set((state) => ({
        synods: state.synods.filter((s) => s.id !== id)
      }));

      toast.success("Synode supprimé avec succès");
    } catch (error) {
      console.error('Error in deleteSynod:', error);
      toast.error("Erreur lors de la suppression du synode");
      throw error;
    }
  },

  updateMemberCount: async (synodId, delta) => {
    const currentSynod = get().synods.find(s => s.id === synodId);
    if (!currentSynod) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        throw new Error("Authentication required");
      }

      const newCount = Math.max((currentSynod.member_count || 0) + delta, 0);
      
      const { error } = await supabase
        .from('synods')
        .update({ member_count: newCount })
        .eq('id', synodId);

      if (error) {
        console.error('Error updating member count:', error);
        toast.error("Erreur lors de la mise à jour du nombre de membres");
        throw error;
      }

      set((state) => ({
        synods: state.synods.map(s => 
          s.id === synodId ? { ...s, member_count: newCount } : s
        )
      }));
    } catch (error) {
      console.error('Error in updateMemberCount:', error);
      toast.error("Erreur lors de la mise à jour du nombre de membres");
      throw error;
    }
  },
}));