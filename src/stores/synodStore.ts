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
  setupRealtimeSubscription: () => () => void;
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
      
      if (error) throw error;

      set({ synods: data || [] });
    } catch (error) {
      console.error('Error fetching synods:', error);
      throw error;
    }
  },

  addSynod: async (synod) => {
    try {
      if (!synod.name?.trim()) {
        throw new Error("Le nom du synode est requis");
      }

      const { data, error } = await supabase
        .from('synods')
        .insert([{
          name: synod.name.trim(),
          description: synod.description?.trim() || null,
          color: synod.color || '#10B981',
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("Aucune donnée retournée après l'insertion");

      set((state) => ({
        synods: [...state.synods, data]
      }));
    } catch (error) {
      console.error('Error adding synod:', error);
      throw error;
    }
  },

  updateSynod: async (id, synod) => {
    try {
      if (synod.name && !synod.name.trim()) {
        throw new Error("Le nom du synode est requis");
      }

      const { error } = await supabase
        .from('synods')
        .update({
          name: synod.name?.trim(),
          description: synod.description?.trim() || null,
          color: synod.color,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        synods: state.synods.map((s) => 
          s.id === id ? { ...s, ...synod, updated_at: new Date().toISOString() } : s
        )
      }));
    } catch (error) {
      console.error('Error updating synod:', error);
      throw error;
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
    } catch (error) {
      console.error('Error deleting synod:', error);
      throw error;
    }
  },

  updateMemberCount: async (synodId, delta) => {
    const currentSynod = get().synods.find(s => s.id === synodId);
    if (!currentSynod) return;

    const newCount = Math.max((currentSynod.member_count || 0) + delta, 0);
    
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
      throw error;
    }
  },

  setupRealtimeSubscription: () => {
    const channel = supabase
      .channel('synods_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'synods' 
        }, 
        () => {
          get().fetchSynods();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
}));