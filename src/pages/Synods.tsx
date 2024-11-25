import { useState, useEffect } from "react";
import { Grid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Synod, SynodFormData } from "@/types/synod";
import { AccessCodeDialog } from "@/components/access/AccessCodeDialog";
import { useAccess } from "@/hooks/useAccess";
import { toast } from "sonner";
import { useSynodStore } from "@/stores/synodStore";
import { SynodDialogs } from "@/components/synods/SynodDialogs";
import { SynodsHeader } from "@/components/synods/SynodsHeader";
import { SynodsList } from "@/components/synods/SynodsList";
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowAccessDialog(true);
        setIsLoading(false);
        return;
      }

      try {
        await fetchSynods();
      } catch (error) {
        console.error('Error fetching synods:', error);
        toast.error("Erreur lors du chargement des synodes");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await fetchSynods();
      } else if (event === 'SIGNED_OUT') {
        setShowAccessDialog(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSynods]);

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        setShowAccessDialog(true);
        return;
      }

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
    }
  };

  const handleDelete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        setShowAccessDialog(true);
        return;
      }

      if (selectedSynod) {
        await deleteSynod(selectedSynod.id);
        setShowDeleteDialog(false);
        setSelectedSynod(null);
      }
    } catch (error) {
      console.error('Error deleting synod:', error);
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