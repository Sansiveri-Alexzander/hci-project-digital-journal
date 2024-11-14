// src/pages/EntryCreate.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';

export const EntryCreate = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    const handleSave = async (content: any) => {
        // TODO: Implement save functionality
        console.log('Saving entry:', { type, content });
        navigate('/entries');
    };

    switch (type) {
        case 'text':
            return (
                <TextEntry
                    onBack={handleBack}
                    onSave={handleSave}
                />
            );
        case 'audio':
            return (
                <AudioEntry
                    onBack={handleBack}
                    onSave={handleSave}
                />
            );
        case 'image':
            return (
                <ImageEntry
                    onBack={handleBack}
                    onSave={handleSave}
                />
            );
        default:
            return <div>Invalid entry type</div>;
    }
};