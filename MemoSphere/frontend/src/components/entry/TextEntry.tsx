// src/components/entry/TextEntry.tsx
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface TextEntryProps {
    onSave: (content: string) => void;
}

const TextEntry: React.FC<TextEntryProps> = ({ onSave }) => {
    const [content, setContent] = useState('');

    // Handle content changes and notify parent
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        onSave(e.target.value);
    };

    return (
        <Textarea
            className="min-h-[300px] font-medium resize-none"
            placeholder="Start writing here..."
            value={content}
            onChange={handleChange}
        />
    );
};

export default TextEntry;