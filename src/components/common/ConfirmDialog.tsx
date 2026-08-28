import React, { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

export type ConfirmDialogType = "default" | "destructive" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  let icon = null;
  let confirmVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";
  
  switch (type) {
    case "destructive":
      icon = <XCircle className="w-6 h-6 text-destructive mb-2" />;
      confirmVariant = "destructive";
      break;
    case "warning":
      icon = <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />;
      confirmVariant = "default";
      break;
    case "success":
      icon = <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />;
      confirmVariant = "default";
      break;
    case "info":
      icon = <Info className="w-6 h-6 text-blue-500 mb-2" />;
      confirmVariant = "default";
      break;
    default:
      confirmVariant = "default";
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
             {icon}
             <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground mt-2">{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <Button 
            variant={confirmVariant} 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
