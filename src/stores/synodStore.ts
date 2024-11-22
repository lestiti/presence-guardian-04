import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Synod } from '@/types/synod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SynodStore {
  synods: Synod[];
  setSynods: (synods: Synod[]) => void;
  fetchSynods: () => Promise<void>;
  updateMemberCount: (synodId: string, delta: number) => void;
}

export const useSynodStore = create<SynodStore>()(
  persist(
    (set) => ({
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

          // Only update if we have data
          if (data && data.length > 0) {
            set({ synods: data });
            toast.success("Synodes synchronisés avec succès");
          }
        } catch (error) {
          console.error('Error in fetchSynods:', error);
          toast.error("Erreur lors de la synchronisation des synodes");
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
    }),
    {
      name: 'synod-storage',
      skipHydration: false,
      partialize: (state) => ({
        synods: state.synods,
      }),
    }
  )
);