import { useState, useEffect } from "react";
import { Grid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Synod, SynodFormData } from "@/types/synod";
import { AccessCodeDialog } from "@/components/access/AccessCodeDialog";
import { useAccess } from "@/hooks/useAccess";
import { toast } from "sonner";
import { useSynodStore } from "@/stores/synodStore";
import { SynodCard } from "@/components/synods/SynodCard";
import { SynodDialogs } from "@/components/synods/SynodDialogs";
import { SynodsHeader } from "@/components/synods/SynodsHeader";
import { SynodsList } from "@/components/synods/SynodsList";

const Synods = () => {
  const { role } = useAccess();
  const { synods, fetchSynods, addSynod, updateSynod, deleteSynod } = useSynodStore();
  const [isLoading, setIsLoading] = useState(true);
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
    const loadData = async () => {
      try {
        await fetchSynods();
      } catch (error) {
        console.error('Error fetching synods:', error);
        toast.error("Erreur lors du chargement des synodes");
      } finally {
        setIsLoading(false);
      }
    };

    if (role === 'public') {
      setShowAccessDialog(true);
    } else {
      loadData();
    }
  }, [role, fetchSynods]);

  const handleSave = async () => {
    try {
      if (selectedSynod) {
        await updateSynod(selectedSynod.id, formData);
      } else {
        await addSynod(formData);
      }
      setShowDialog(false);
      setSelectedSynod(null);
      setFormData({
        name: "",
        description: "",
        color: "#10B981",
      });
    } catch (error) {
      console.error('Error saving synod:', error);
      toast.error("Erreur lors de la sauvegarde du synode");
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedSynod) {
        await deleteSynod(selectedSynod.id);
        setShowDeleteDialog(false);
        setSelectedSynod(null);
      }
    } catch (error) {
      console.error('Error deleting synod:', error);
      toast.error("Erreur lors de la suppression du synode");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <SynodsHeader 
        role={role}
        setShowDialog={setShowDialog}
      />

      <SynodsList 
        synods={synods}
        onEdit={(synod) => {
          setSelectedSynod(synod);
          setFormData({
            name: synod.name,
            description: synod.description || "",
            color: synod.color,
          });
          setShowDialog(true);
        }}
        onDelete={(synod) => {
          setSelectedSynod(synod);
          setShowDeleteDialog(true);
        }}
      />

      <SynodDialogs
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        selectedSynod={selectedSynod}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <AccessCodeDialog
        open={showAccessDialog}
        onClose={() => setShowAccessDialog(false)}
      />
    </div>
  );
};

export default Synods;