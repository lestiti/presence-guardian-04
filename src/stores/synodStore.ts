import { create } from 'zustand';
import { Synod } from '@/types/synod';
import { supabase } from '@/integrations/supabase/client';

interface SynodStore {
  synods: Synod[];
  setSynods: (synods: Synod[]) => void;
  fetchSynods: () => Promise<void>;
  updateMemberCount: (synodId: string, delta: number) => void;
}

export const useSynodStore = create<SynodStore>((set) => ({
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
    }
  },
  updateMemberCount: (synodId, delta) => 
    set((state) => ({
      synods: state.synods.map(synod => 
        synod.id === synodId 
          ? { ...synod, memberCount: (synod.memberCount || 0) + delta }
          : synod
      )
    })),
}));