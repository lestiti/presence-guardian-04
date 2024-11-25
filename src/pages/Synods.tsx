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
  const { synods, isLoading, error, fetchSynods, addSynod, updateSynod, deleteSynod } = useSynodStore();
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
      if (role === 'public' || !accessCode) {
        setShowAccessDialog(true);
        return;
      }

      await fetchSynods();
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-red-500">Une erreur est survenue lors du chargement des synodes</p>
        <button 
          onClick={() => fetchSynods()}
          className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
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