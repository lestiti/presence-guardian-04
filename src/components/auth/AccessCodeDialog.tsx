import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AccessCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string;
}

export const AccessCodeDialog = ({ isOpen, onClose, redirectPath }: AccessCodeDialogProps) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value === "FPVM*2024") {
      toast.success("Code d'accès correct");
      onClose();
      navigate(redirectPath);
    } else {
      toast.error("Code d'accès incorrect");
      setValue("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Code d'accès requis</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <Input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Entrez le code d'accès"
            className="text-center"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <Button onClick={handleSubmit} className="w-full">
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};