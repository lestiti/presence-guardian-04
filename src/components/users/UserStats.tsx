import { StatsCard } from "./StatsCard";
import { UserData } from "@/types/user";
import { Synod } from "@/types/synod";

interface UserStatsProps {
  users: UserData[];
  synods: Synod[];
}

export const UserStats = ({ users, synods }: UserStatsProps) => {
  const stats = {
    total: users.length,
    byRole: {
      MPIOMANA: users.filter(u => u.role === "MPIOMANA").length,
      MPIANDRY: users.filter(u => u.role === "MPIANDRY").length,
      MPAMPIANATRA: users.filter(u => u.role === "MPAMPIANATRA").length,
      IRAKA: users.filter(u => u.role === "IRAKA").length
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Utilisateurs"
        value={stats.total}
        className="bg-primary/10"
      />
      {Object.entries(stats.byRole).map(([role, count]) => (
        <StatsCard
          key={role}
          title={role}
          value={count}
          className="bg-secondary/10"
        />
      ))}
    </div>
  );
};