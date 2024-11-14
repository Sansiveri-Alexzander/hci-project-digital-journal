// src/components/entry/EntryInterface.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

// defines the expected props for the entry interface wrapper
interface EntryInterfaceProps {
    title: string;      // displays at the top of the entry interface
    onBack: () => void; // callback function when back button is clicked
    onSave: () => void; // callback function when save button is clicked
    canSave?: boolean;  // optional flag to enable/disable save button, defaults to true
    children: React.ReactNode; // content to be rendered inside the interface
}

const EntryInterface: React.FC<EntryInterfaceProps> = ({
                                                           title,
                                                           onBack,
                                                           onSave,
                                                           canSave = true, // default value if not provided
                                                           children
                                                       }) => {
    return (
        // container with responsive padding and maximum width
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* card component provides consistent styling and elevation */}
            <Card>
                <div className="p-6">
                    {/* header section with consistent layout */}
                    <div className="flex items-center justify-between mb-6">
                        {/* back button with icon */}
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <X className="h-5 w-5" />
                        </Button>

                        {/* entry type title */}
                        <h2 className="text-xl font-semibold">{title}</h2>

                        {/* save button that can be disabled */}
                        <Button
                            onClick={onSave}
                            disabled={!canSave}
                        >
                            Save
                        </Button>
                    </div>

                    {/* content section with consistent spacing */}
                    <div className="space-y-4">
                        {/* renders the specific entry type content passed as children */}
                        {children}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EntryInterface;