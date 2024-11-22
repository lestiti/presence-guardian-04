import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

export const StatsCard = ({ title, value, className }: StatsCardProps) => {
  return (
    <Card className={cn("p-6 transition-all hover:scale-105", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Card>
  );
};