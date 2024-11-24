import React from 'react';
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

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel"
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between sm:justify-between">
            <AlertDialogCancel 
                onClick={onCancel}
                className="bg-secondary hover:bg-secondary/90 px-6 py-2 rounded-md"
            >
                {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction 
                onClick={onConfirm}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-2 rounded-md"
            >
                {confirmText}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;