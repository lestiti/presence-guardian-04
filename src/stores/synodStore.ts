import { create } from 'zustand';
import { Synod } from '@/types/synod';

interface SynodStore {
  synods: Synod[];
  setSynods: (synods: Synod[]) => void;
  updateMemberCount: (synodId: string, delta: number) => void;
}

export const useSynodStore = create<SynodStore>((set) => ({
  synods: [
    { id: "1", name: "Synode Antananarivo", description: "Région d'Antananarivo", color: "#10B981", memberCount: 0 },
    { id: "2", name: "Synode Antsirabe", description: "Région d'Antsirabe", color: "#6366F1", memberCount: 0 },
    { id: "3", name: "Synode Fianarantsoa", description: "Région de Fianarantsoa", color: "#EC4899", memberCount: 0 },
    { id: "4", name: "Synode Toamasina", description: "Région de Toamasina", color: "#F59E0B", memberCount: 0 },
  ],
  setSynods: (synods) => set({ synods }),
  updateMemberCount: (synodId, delta) => 
    set((state) => ({
      synods: state.synods.map(synod => 
        synod.id === synodId 
          ? { ...synod, memberCount: synod.memberCount + delta }
          : synod
      )
    })),
}));