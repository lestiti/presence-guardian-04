export type AccessRole = 'super_admin' | 'admin' | 'public';

export interface AccessCode {
  id: string;
  code: string;
  role: AccessRole;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}