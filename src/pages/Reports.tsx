import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { Download, Filter, FileText } from "lucide-react";
import { toast } from "sonner";
import { RoleFilter } from "@/components/users/RoleFilter";
import { useTheme } from "@/hooks/useTheme";
import { usePDF } from "react-to-pdf";

const Reports = () => {
  const [selectedSynod, setSelectedSynod] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [startDate, setStartDate] = useState<Date>(new Date());

  const mockData = [
    { date: '01/03', présents: 65, absents: 35 },
    { date: '08/03', présents: 75, absents: 25 },
    { date: '15/03', présents: 80, absents: 20 },
    { date: '22/03', présents: 70, absents: 30 },
  ];

  const { theme } = useTheme();
  const { toPDF, targetRef } = usePDF({filename: 'rapport-presence.pdf'});

  const handleExportPDF = () => {
    toPDF();
    toast.success("Rapport exporté en PDF");
  };

  return (
    <div className="space-y-6" ref={targetRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Rapports de Présence
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="présents" fill="#4CAF50" />
              <Bar dataKey="absents" fill="#FF5252" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition par rôle</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'MPIOMANA', value: 30 },
                    { name: 'MPIANDRY', value: 25 },
                    { name: 'MPAMPIANATRA', value: 20 },
                    { name: 'IRAKA', value: 15 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Taux de présence moyen</p>
            <p className="text-2xl font-bold text-green-700">72.5%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total des présences</p>
            <p className="text-2xl font-bold text-blue-700">290</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Événements</p>
            <p className="text-2xl font-bold text-purple-700">4</p>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Reports;
