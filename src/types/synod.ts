export interface Synod {
  id: string;
  name: string;
  description?: string;
  color: string;
  memberCount: number;
}

export type SynodFormData = Omit<Synod, 'id' | 'memberCount'>;