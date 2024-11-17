import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import PromptGenerator from './PromptGenerator';

interface EntryInterfaceProps {
    title: string;
    onBack: () => void;
    onSave: () => void;
    canSave?: boolean;
    onPromptSelect: (prompt: string) => void;
    children: React.ReactNode;
}

const EntryInterface: React.FC<EntryInterfaceProps> = ({
                                                           title,
                                                           onBack,
                                                           onSave,
                                                           canSave = true,
                                                           onPromptSelect,
                                                           children
                                                       }) => {
    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <X className="h-5 w-5" />
                        </Button>

                        <h2 className="text-xl font-semibold">{title}</h2>

                        <Button
                            onClick={onSave}
                            disabled={!canSave}
                        >
                            Save
                        </Button>
                    </div>

                    <div className="mb-4">
                        <PromptGenerator onSelect={onPromptSelect} />
                    </div>

                    <div className="space-y-4">
                        {children}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EntryInterface;