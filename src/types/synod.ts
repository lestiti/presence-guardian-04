export interface Synod {
  id: string;
  name: string;
  description?: string;
  color: string;
  member_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type SynodFormData = Omit<Synod, 'id' | 'member_count' | 'created_at' | 'updated_at'>;