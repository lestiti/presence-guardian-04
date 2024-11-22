export type UserRole = "MPIOMANA" | "MPIANDRY" | "MPAMPIANATRA" | "IRAKA";

export interface UserData {
  id: string;
  name: string;
  role: UserRole;
  synod_id: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
  synods?: {
    name: string;
    color: string;
  };
}

export const isValidUserRole = (role: string): role is UserRole => {
  return ["MPIOMANA", "MPIANDRY", "MPAMPIANATRA", "IRAKA"].includes(role);
};