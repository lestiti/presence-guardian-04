import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccess } from '@/hooks/useAccess';

interface AccessCodeDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AccessCodeDialog = ({ open, onClose }: AccessCodeDialogProps) => {
  const [code, setCode] = useState('');
  const { checkAccessCode } = useAccess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await checkAccessCode(code);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrez votre code d'accès</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Code d'accès"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Valider
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};