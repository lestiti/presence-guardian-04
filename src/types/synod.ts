export interface Synod {
  id: string;
  name: string;
  description?: string;
  color: string;
  memberCount?: number;
  created_at?: string;
  updated_at?: string;
}

export type SynodFormData = Omit<Synod, 'id' | 'memberCount' | 'created_at' | 'updated_at'>;