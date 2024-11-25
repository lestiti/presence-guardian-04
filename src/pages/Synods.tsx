import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AccessCodeDialog } from "@/components/access/AccessCodeDialog";
import { useAccess } from "@/hooks/useAccess";
import { toast } from "sonner";
import { useSynodStore } from "@/stores/synodStore";
import { SynodDialogs } from "@/components/synods/SynodDialogs";
import { SynodsHeader } from "@/components/synods/SynodsHeader";
import { SynodsList } from "@/components/synods/SynodsList";
import { Synod } from "@/types/synod";

const Synods = () => {
  const { role, accessCode } = useAccess();
  const { synods, fetchSynods, addSynod, updateSynod, deleteSynod } = useSynodStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [selectedSynod, setSelectedSynod] = useState<Synod | null>(null);
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    color: "#10B981",
    description: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (role === 'public' || !accessCode) {
          setShowAccessDialog(true);
          setIsLoading(false);
          return;
        }

        await fetchSynods();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading synods:', error);
        toast.error("Erreur lors du chargement des synodes");
        setIsLoading(false);
      }
    };

    loadData();
  }, [role, accessCode, fetchSynods]);

  const handleSave = async (formData: { name: string; description?: string; color: string }) => {
    try {
      if (role !== 'super_admin') {
        toast.error("Vous devez être super admin pour effectuer cette action");
        return;
      }

      if (selectedSynod) {
        await updateSynod(selectedSynod.id, formData);
      } else {
        await addSynod(formData);
      }
      setShowDialog(false);
      setSelectedSynod(null);
      setInitialFormData({
        name: "",
        color: "#10B981",
        description: ""
      });
    } catch (error) {
      console.error('Error saving synod:', error);
      toast.error("Une erreur est survenue lors de la sauvegarde");
    }
  };

  const handleDelete = async () => {
    try {
      if (role !== 'super_admin') {
        toast.error("Vous devez être super admin pour effectuer cette action");
        return;
      }

      if (selectedSynod) {
        await deleteSynod(selectedSynod.id);
        setShowDeleteDialog(false);
        setSelectedSynod(null);
      }
    } catch (error) {
      console.error('Error deleting synod:', error);
      toast.error("Une erreur est survenue lors de la suppression");
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
          setInitialFormData({
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
        initialFormData={initialFormData}
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