import { Synod } from "@/types/synod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SynodForm } from "@/components/synods/SynodForm";
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

interface SynodDialogsProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  selectedSynod: Synod | null;
  initialFormData: {
    name: string;
    description?: string;
    color: string;
  };
  onSave: (data: { name: string; description?: string; color: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const SynodDialogs = ({
  showDialog,
  setShowDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  selectedSynod,
  initialFormData,
  onSave,
  onDelete,
}: SynodDialogsProps) => {
  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSynod ? "Modifier le synode" : "Nouveau synode"}
            </DialogTitle>
          </DialogHeader>
          <SynodForm
            initialData={initialFormData}
            onSave={onSave}
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
            <AlertDialogAction onClick={onDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};