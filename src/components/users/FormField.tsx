import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  disabled = false,
  className,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={error ? "text-destructive" : ""}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(error ? "border-destructive" : "", className)}
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};