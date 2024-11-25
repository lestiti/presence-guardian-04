import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  Cell 
} from 'recharts';
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { RoleFilter } from "@/components/users/RoleFilter";
import { useTheme } from "@/hooks/useTheme";
import { usePDF } from "react-to-pdf";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useScans } from "@/hooks/useScanQueries";
import { useRealtimeScans } from "@/hooks/useRealtimeScans";

const Reports = () => {
  const [selectedSynod, setSelectedSynod] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [startDate, setStartDate] = useState<Date>(new Date());

  const { theme } = useTheme();
  const { toPDF, targetRef } = usePDF({ filename: 'rapport-presence.pdf' });

  // Enable real-time updates
  useRealtimeScans();

  // Fetch scans data with real-time updates
  const { data: scansData, isLoading: isLoadingScans } = useScans();

  // Process scans data for charts
  const processedData = scansData?.reduce((acc: any[], scan: any) => {
    const date = new Date(scan.timestamp).toLocaleDateString();
    const existingDate = acc.find(item => item.date === date);

    if (existingDate) {
      if (scan.direction === 'IN') existingDate.présents++;
      else existingDate.absents++;
    } else {
      acc.push({
        date,
        présents: scan.direction === 'IN' ? 1 : 0,
        absents: scan.direction === 'OUT' ? 1 : 0
      });
    }

    return acc;
  }, []) || [];

  // Fetch role distribution data
  const { data: roleData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles', selectedSynod],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq(selectedSynod !== 'all' ? 'synod_id' : '', selectedSynod);

        if (error) throw error;

        const roleCount = data.reduce((acc: Record<string, number>, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        const ROLE_COLORS = {
          MPIOMANA: '#4CAF50',
          MPIANDRY: '#2196F3',
          MPAMPIANATRA: '#9C27B0',
          IRAKA: '#FF9800'
        };

        return Object.entries(roleCount).map(([role, count]) => ({
          name: role,
          value: count,
          color: ROLE_COLORS[role as keyof typeof ROLE_COLORS] || '#757575'
        }));
      } catch (error) {
        console.error('Error fetching role data:', error);
        toast.error("Erreur lors du chargement des données des rôles");
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleExportPDF = () => {
    try {
      toPDF();
      toast.success("Rapport exporté en PDF");
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error("Erreur lors de l'exportation en PDF");
    }
  };

  const handleExportCSV = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," + 
        processedData?.map(row => `${row.date},${row.présents},${row.absents}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "rapport-presence.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Rapport exporté en CSV");
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error("Erreur lors de l'exportation en CSV");
    }
  };

  return (
    <div className="space-y-6" ref={targetRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Rapports de Présence
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportCSV} 
            className="flex items-center gap-2"
            disabled={isLoadingScans}
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
          <Button 
            onClick={handleExportPDF} 
            className="flex items-center gap-2"
            disabled={isLoadingScans}
          >
            <FileText className="w-4 h-4" />
            Exporter PDF
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Synode</label>
            <Select value={selectedSynod} onValueChange={setSelectedSynod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un synode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les synodes</SelectItem>
                <SelectItem value="1">Synode 1</SelectItem>
                <SelectItem value="2">Synode 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Fonction</label>
            <RoleFilter value={selectedRole} onChange={setSelectedRole} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Période</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Date de début</label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              className="rounded-md border"
            />
          </div>
        </div>

        <div className="h-[400px] mt-6">
          {isLoadingScans ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : processedData && processedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Bar dataKey="présents" fill="#4CAF50" />
                <Bar dataKey="absents" fill="#FF5252" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Aucune donnée disponible pour la période sélectionnée
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition par rôle</h2>
          <div className="h-[300px]">
            {isLoadingRoles ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : roleData && roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">Taux de présence moyen</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {processedData && processedData.length > 0
                  ? `${Math.round(
                      (processedData.reduce((sum, day) => sum + day.présents, 0) /
                        (processedData.reduce((sum, day) => sum + day.présents + day.absents, 0) || 1)) *
                        100
                    )}%`
                  : '0%'}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">Total des présences</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {processedData?.reduce((sum, day) => sum + day.présents, 0) || 0}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">Événements</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {processedData?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;