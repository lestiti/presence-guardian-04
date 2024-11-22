export interface UserData {
  id: string;
  name: string;
  role: "MPIOMANA" | "MPIANDRY" | "MPAMPIANATRA" | "IRAKA";
  synod_id: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
  synods?: {
    name: string;
    color: string;
  };
}