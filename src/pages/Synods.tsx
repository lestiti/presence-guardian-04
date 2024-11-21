import { useState } from "react";
import { Grid, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SynodForm } from "@/components/synods/SynodForm";
import { Synod, SynodFormData } from "@/types/synod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Synods = () => {
  const [synods, setSynods] = useState<Synod[]>([
    { id: "1", name: "Synode Antananarivo", description: "Région d'Antananarivo", color: "#10B981", memberCount: 25 },
    { id: "2", name: "Synode Antsirabe", description: "Région d'Antsirabe", color: "#6366F1", memberCount: 30 },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSynod, setSelectedSynod] = useState<Synod | null>(null);
  const [formData, setFormData] = useState<SynodFormData>({
    name: "",
    description: "",
    color: "#10B981",
  });

  const handleNewSynod = () => {
    setSelectedSynod(null);
    setFormData({
      name: "",
      description: "",
      color: "#10B981",
    });
    setShowDialog(true);
  };

  const handleEditSynod = (synod: Synod) => {
    setSelectedSynod(synod);
    setFormData({
      name: synod.name,
      description: synod.description || "",
      color: synod.color,
    });
    setShowDialog(true);
  };

  const handleDeleteSynod = (synod: Synod) => {
    setSelectedSynod(synod);
    setShowDeleteDialog(true);
  };

  const handleSaveSynod = () => {
    if (selectedSynod) {
      setSynods(synods.map(s => s.id === selectedSynod.id ? { ...selectedSynod, ...formData } : s));
      toast.success("Le synode a été modifié avec succès");
    } else {
      const newSynod: Synod = {
        ...formData,
        id: (synods.length + 1).toString(),
        memberCount: 0,
      };
      setSynods([...synods, newSynod]);
      toast.success("Le nouveau synode a été créé avec succès");
    }
    setShowDialog(false);
    setSelectedSynod(null);
    setFormData({ name: "", description: "", color: "#10B981" });
  };

  const handleConfirmDelete = () => {
    if (selectedSynod) {
      setSynods(synods.filter(s => s.id !== selectedSynod.id));
      toast.success("Le synode a été supprimé avec succès");
    }
    setShowDeleteDialog(false);
    setSelectedSynod(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Gestion des Synodes</h1>
        <Button className="bg-primary hover:bg-primary/90 transition-colors" onClick={handleNewSynod}>
          <Grid className="w-4 h-4 mr-2" />
          Nouveau Synode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {synods.map((synod) => (
          <div
            key={synod.id}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-white/20 hover:shadow-lg transition-all duration-200 animate-fade-in"
            style={{ borderTop: `4px solid ${synod.color}` }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-semibold tracking-tight text-secondary">
                {synod.name}
              </h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="hover:bg-primary/10 transition-colors duration-200"
                  onClick={() => handleEditSynod(synod)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="hover:bg-destructive/10 transition-colors duration-200"
                  onClick={() => handleDeleteSynod(synod)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {synod.description && (
              <p className="text-secondary/60 mb-2">{synod.description}</p>
            )}
            <p className="text-lg text-secondary/80 font-medium">
              {synod.memberCount} membres
            </p>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSynod ? "Modifier le synode" : "Nouveau synode"}
            </DialogTitle>
          </DialogHeader>
          <SynodForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveSynod}
            onCancel={() => setShowDialog(false)}
            isEdit={!!selectedSynod}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le synode
              {selectedSynod && ` "${selectedSynod.name}"`} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Synods;