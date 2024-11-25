import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AttendanceChartProps {
  data: Array<{
    date: string;
    présents: number;
    absents: number;
  }>;
}

export const AttendanceChart = ({ data }: AttendanceChartProps) => (
  <Card className="bg-white/10 backdrop-blur-glass border border-white/20 p-6">
    <h2 className="text-xl font-semibold text-white mb-6">Présences de la semaine</h2>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
          <YAxis stroke="rgba(255,255,255,0.6)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Legend />
          <Bar dataKey="présents" fill="#4ade80" />
          <Bar dataKey="absents" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);