import { useState, useEffect } from "react";
import { Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Synod, SynodFormData } from "@/types/synod";
import { AccessCodeDialog } from "@/components/access/AccessCodeDialog";
import { useAccess } from "@/hooks/useAccess";
import { toast } from "sonner";
import { useSynodStore } from "@/stores/synodStore";
import { SynodCard } from "@/components/synods/SynodCard";
import { SynodDialogs } from "@/components/synods/SynodDialogs";

const Synods = () => {
  const { role } = useAccess();
  const { synods, fetchSynods, addSynod, updateSynod, deleteSynod } = useSynodStore();
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [selectedSynod, setSelectedSynod] = useState<Synod | null>(null);
  const [formData, setFormData] = useState<SynodFormData>({
    name: "",
    description: "",
    color: "#10B981",
  });

  useEffect(() => {
    if (role === 'public') {
      setShowAccessDialog(true);
    }
    fetchSynods();
  }, [role, fetchSynods]);

  const handleNewSynod = () => {
    if (role !== 'super_admin') {
      toast.error("Accès non autorisé");
      return;
    }
    setSelectedSynod(null);
    setFormData({
      name: "",
      description: "",
      color: "#10B981",
    });
    setShowDialog(true);
  };

  const handleEditSynod = (synod: Synod) => {
    if (role !== 'super_admin') {
      toast.error("Accès non autorisé");
      return;
    }
    setSelectedSynod(synod);
    setFormData({
      name: synod.name,
      description: synod.description || "",
      color: synod.color,
    });
    setShowDialog(true);
  };

  const handleDeleteSynod = (synod: Synod) => {
    if (role !== 'super_admin') {
      toast.error("Accès non autorisé");
      return;
    }
    setSelectedSynod(synod);
    setShowDeleteDialog(true);
  };

  const handleSaveSynod = async () => {
    if (role !== 'super_admin') {
      toast.error("Accès non autorisé");
      return;
    }
    try {
      if (selectedSynod) {
        await updateSynod(selectedSynod.id, formData);
      } else {
        await addSynod(formData);
      }
      setShowDialog(false);
      setSelectedSynod(null);
      setFormData({ name: "", description: "", color: "#10B981" });
    } catch (error) {
      console.error('Error saving synod:', error);
      toast.error("Erreur lors de la sauvegarde du synode");
    }
  };

  const handleConfirmDelete = async () => {
    if (role !== 'super_admin' || !selectedSynod) {
      toast.error("Accès non autorisé");
      return;
    }
    try {
      await deleteSynod(selectedSynod.id);
      setShowDeleteDialog(false);
      setSelectedSynod(null);
    } catch (error) {
      console.error('Error deleting synod:', error);
      toast.error("Erreur lors de la suppression du synode");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Gestion des Synodes</h1>
        <Button 
          className="bg-primary hover:bg-primary/90 transition-colors" 
          onClick={handleNewSynod}
        >
          <Grid className="w-4 h-4 mr-2" />
          Nouveau Synode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {synods.map((synod) => (
          <SynodCard
            key={synod.id}
            synod={synod}
            onEdit={handleEditSynod}
            onDelete={handleDeleteSynod}
          />
        ))}
      </div>

      <SynodDialogs
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        selectedSynod={selectedSynod}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveSynod}
        onDelete={handleConfirmDelete}
      />

      <AccessCodeDialog
        open={showAccessDialog}
        onClose={() => setShowAccessDialog(false)}
      />
    </div>
  );
};

export default Synods;