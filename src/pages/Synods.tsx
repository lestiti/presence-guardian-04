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
import { supabase } from "@/integrations/supabase/client";

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
    const loadSynods = async () => {
      try {
        await fetchSynods();
      } catch (error) {
        console.error('Error fetching synods:', error);
        toast.error("Erreur lors du chargement des synodes");
      } finally {
        setIsLoading(false);
      }
    };

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setShowAccessDialog(true);
      }
    };

    if (role === 'public') {
      checkSession();
    }
    loadSynods();
  }, [role, fetchSynods]);

  const handleNewSynod = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour créer un synode");
      setShowAccessDialog(true);
      return;
    }

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

  const handleEditSynod = async (synod: Synod) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour modifier un synode");
      setShowAccessDialog(true);
      return;
    }

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

  const handleDeleteSynod = async (synod: Synod) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour supprimer un synode");
      setShowAccessDialog(true);
      return;
    }

    if (role !== 'super_admin') {
      toast.error("Accès non autorisé");
      return;
    }
    setSelectedSynod(synod);
    setShowDeleteDialog(true);
  };

  const handleSaveSynod = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour cette action");
      setShowAccessDialog(true);
      return;
    }

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
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde du synode";
      toast.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour cette action");
      setShowAccessDialog(true);
      return;
    }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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