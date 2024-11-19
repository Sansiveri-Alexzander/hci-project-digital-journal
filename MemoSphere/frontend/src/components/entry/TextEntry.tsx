// src/components/entry/TextEntry.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface TextEntryProps {
    onSave: (content: string) => void;
    onBack: () => void;
    initialContent?: string;
    title: string;
    onTitleChange: (title: string) => void;
}

const TextEntry: React.FC<TextEntryProps> = ({
    onSave,
    onBack,
    initialContent = '',
    title,
    onTitleChange
}) => {
    // state management
    const [content, setContent] = useState(initialContent); // stores text content
    const [isPending, setIsPending] = useState(false); // tracks save operation status
    const [isEditingTitle, setIsEditingTitle] = useState(false);


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

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
                <div className="flex items-center justify-between mb-4">
                    <Button className="hover:bg-gray-100" onClick={onBack}>
                        <X className="h-5 w-5" />
                    </Button>
                    
                    {/* Editable Title */}
                    <div className="relative">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setIsEditingTitle(false);
                                    }
                                }}
                                className="text-xl font-semibold bg-transparent border-b-2 border-primary outline-none px-2"
                                autoFocus
                            />
                        ) : (
                            <h2 
                                className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
                                onClick={() => setIsEditingTitle(true)}
                                title="Click to edit title"
                            >
                                {title || 'Untitled Entry'}
                            </h2>
                        )}
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={!content.trim() || isPending}
                    >
                        Save
                    </Button>
                </div>

                <textarea
                    className="w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent outline-none"
                    placeholder="Write your thoughts..."
                    value={content}
                    onChange={handleChange}
                />
            </CardContent>
        </Card>
    );
};

export default TextEntry;