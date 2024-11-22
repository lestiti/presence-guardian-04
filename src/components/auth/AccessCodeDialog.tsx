import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
      sessionStorage.setItem("hasAccess", "true");
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
          <InputOTP
            value={value}
            onChange={(value) => setValue(value)}
            maxLength={8}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} index={index} />
                ))}
              </InputOTPGroup>
            )}
          />
          <Button onClick={handleSubmit} className="w-full">
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};