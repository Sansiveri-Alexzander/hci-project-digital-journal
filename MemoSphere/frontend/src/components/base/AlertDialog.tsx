// src/components/base/AlertDialog.tsx
import React from 'react';
import {
    AlertDialog as AlertDialogPrimitive,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
}

const AlertDialog: React.FC<AlertDialogProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     title,
                                                     description,
                                                     cancelText = 'Cancel',
                                                     confirmText = 'Confirm',
                                                     onConfirm,
                                                     variant = 'default'
                                                 }) => {
    return (
        <AlertDialogPrimitive open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogPrimitive>
    );
};

export default AlertDialog;