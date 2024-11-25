import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend: string;
}

export const StatCard = ({ icon: Icon, title, value, trend }: StatCardProps) => (
  <div className="bg-white/10 backdrop-blur-glass border border-white/20 rounded-lg p-6 shadow-glass animate-fade-in transition-all duration-300 hover:animate-zoom-hover">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h3 className="text-white/80 font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="mt-4 text-sm text-white/60">{trend}</p>
  </div>
);