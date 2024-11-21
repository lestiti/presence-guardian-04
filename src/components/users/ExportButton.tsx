import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { UserData } from "@/types/user";
import { toast } from "sonner";

interface ExportButtonProps {
  users: UserData[];
}

export const ExportButton = ({ users }: ExportButtonProps) => {
  const handleExport = () => {
    try {
      const headers = ["Nom", "Téléphone", "Fonction", "Synode"];
      const csvContent = [
        headers.join(","),
        ...users.map(user => 
          [user.name, user.phone, user.role, user.synod].join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", "utilisateurs.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export CSV réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Exporter CSV
    </Button>
  );
};