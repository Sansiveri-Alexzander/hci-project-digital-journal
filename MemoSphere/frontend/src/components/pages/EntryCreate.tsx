// src/pages/EntryCreate.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';
import FeelingActivityModal from '@/components/entry/FeelingActivityModal';

export const EntryCreate = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [showReflection, setShowReflection] = useState(false);
    const [pendingContent, setPendingContent] = useState<any>(null);

    const handleBack = () => {
        navigate('/');
    };

    const handleInitialSave = (content: any) => {
        setPendingContent(content);
        setShowReflection(true);
    };

    const handleReflectionSave = (feelings: string[], activities: string[]) => {
        // Here you would typically save the entry with its reflections
        console.log('Saving entry:', {
            type,
            content: pendingContent,
            feelings,
            activities
        });
        navigate('/entries');
    };

    const handleReflectionSkip = () => {
        // Save entry without reflections
        console.log('Saving entry without reflections:', {
            type,
            content: pendingContent
        });
        navigate('/entries');
    };

    const renderEntryComponent = () => {
        const commonProps = {
            onBack: handleBack,
            onSave: handleInitialSave,
        };

        switch (type) {
            case 'text':
                return <TextEntry {...commonProps} />;
            case 'audio':
                return <AudioEntry {...commonProps} />;
            case 'image':
                return <ImageEntry {...commonProps} />;
            default:
                return <div>Invalid entry type</div>;
        }
    };

    return (
        <>
            {renderEntryComponent()}

            <FeelingActivityModal
                isOpen={showReflection}
                onClose={() => setShowReflection(false)}
                onSave={handleReflectionSave}
                onSkip={handleReflectionSkip}
            />
        </>
    );
};

export default EntryCreate;