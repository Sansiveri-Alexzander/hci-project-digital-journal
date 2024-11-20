import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface TextEntryProps {
    onSave: (content: string) => void;
    initialContent?: string;
}

const TextEntry: React.FC<TextEntryProps> = ({ onSave, initialContent = '' }) => {
    const [content, setContent] = useState(initialContent);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onSave(newContent);
    };

    return (
        <Textarea
            placeholder="Write your reflection here..."
            className="min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
            value={content}
            onChange={handleChange}
            autoFocus
        />
    );
};

export default TextEntry;