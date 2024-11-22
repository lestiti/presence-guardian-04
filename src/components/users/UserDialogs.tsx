import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { UserForm } from "@/components/users/UserForm";
import { CodeDownloader } from "@/components/users/CodeDownloader";
import { UserData } from "@/types/user";

interface UserDialogsProps {
  selectedUser: UserData | null;
  showUserDialog: boolean;
  showDeleteDialog: boolean;
  showCodesDialog: boolean;
  formData: Partial<UserData>;
  setFormData: (data: Partial<UserData>) => void;
  onSaveUser: () => void;
  onConfirmDelete: () => void;
  setShowUserDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
  setShowCodesDialog: (show: boolean) => void;
}

export const UserDialogs = ({
  selectedUser,
  showUserDialog,
  showDeleteDialog,
  showCodesDialog,
  formData,
  setFormData,
  onSaveUser,
  onConfirmDelete,
  setShowUserDialog,
  setShowDeleteDialog,
  setShowCodesDialog,
}: UserDialogsProps) => {
  return (
    <>
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <UserForm
            formData={formData}
            setFormData={setFormData}
            onSave={onSaveUser}
            onCancel={() => setShowUserDialog(false)}
            isEdit={!!selectedUser}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'utilisateur
              {selectedUser && ` "${selectedUser.name}"`} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showCodesDialog} onOpenChange={setShowCodesDialog}>
        <DialogContent className="sm:max-w-md">
          {selectedUser && (
            <CodeDownloader 
              userId={selectedUser.id} 
              userName={selectedUser.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};