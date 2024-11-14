// src/components/entry/TextEntry.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../base/Button';
import { Card, CardContent } from '@/components/ui/card';

// defines props for text entry component
interface TextEntryProps {
    onSave: (content: string) => void; // callback when text is saved
    onBack: () => void; // callback to go back
    initialContent?: string; // optional initial text content
}

const TextEntry: React.FC<TextEntryProps> = ({
                                                 onSave,
                                                 onBack,
                                                 initialContent = ''
                                             }) => {
    // state management
    const [content, setContent] = useState(initialContent); // stores text content
    const [isPending, setIsPending] = useState(false); // tracks save operation status

    // handles saving text content
    const handleSave = async () => {
        if (!content.trim()) return;

        try {
            setIsPending(true);
            await onSave(content);
        } finally {
            setIsPending(false);
        }
    };

    // render component UI
    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
                {/* header with back button, title and save button */}
                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" onClick={onBack}>
                        <X className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-semibold">Text Entry</h2>
                    <Button
                        onClick={handleSave}
                        disabled={!content.trim() || isPending}
                    >
                        Save
                    </Button>
                </div>

                {/* text input area */}
                <textarea
                    className="w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent outline-none"
                    placeholder="Write your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </CardContent>
        </Card>
    );
};

export default TextEntry;