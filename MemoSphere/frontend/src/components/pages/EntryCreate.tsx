// src/pages/EntryCreate.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';
import FeelingActivityModal from '@/components/entry/FeelingActivityModal';
import PromptGenerator from '@/components/entry/PromptGenerator';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PendingEntry {
    type: 'text' | 'audio' | 'image';
    content: string | Blob | File | { image: File, caption: string };
    hasContent: boolean;
}

export const EntryCreate = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [showReflection, setShowReflection] = useState(false);
    const [pendingContent, setPendingContent] = useState<PendingEntry>({
        type: type as 'text' | 'audio' | 'image',
        content: '',
        hasContent: false
    });

    const handleBack = () => {
        navigate('/');
    };

    const handleContentUpdate = (content: any) => {
        let hasContent = false;
        if (type === 'text') {
            hasContent = content.trim().length > 0;
        } else if (type === 'audio') {
            hasContent = content instanceof Blob;
        } else if (type === 'image') {
            hasContent = content.image instanceof File;
        }

        setPendingContent({
            type: type as 'text' | 'audio' | 'image',
            content,
            hasContent
        });
    };

    const handleSave = () => {
        if (pendingContent.hasContent) {
            setShowReflection(true);
        }
    };

    const handleReflectionSave = (feelings: string[], activities: string[]) => {
        console.log('Saving entry:', {
            type,
            content: pendingContent.content,
            feelings,
            activities
        });
        navigate('/entries');
    };

    const handleReflectionSkip = () => {
        console.log('Saving entry without reflections:', {
            type,
            content: pendingContent.content
        });
        navigate('/entries');
    };

    const getEntryTitle = () => {
        switch (type) {
            case 'text': return 'Text Entry';
            case 'audio': return 'Audio Entry';
            case 'image': return 'Image Entry';
            default: return 'New Entry';
        }
    };

    const renderEntryComponent = () => {
        switch (type) {
            case 'text':
                return <TextEntry onSave={handleContentUpdate} />;
            case 'audio':
                return <AudioEntry onSave={handleContentUpdate} />;
            case 'image':
                return <ImageEntry onSave={handleContentUpdate} />;
            default:
                return <div>Invalid entry type</div>;
        }
    };

    return (
        <div className={"container mx-auto px-4 py-6 max-w-2xl"}>
            <Card>
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <X className="h-5 w-5" />
                        </Button>
                        <h2 className="text-xl font-semibold">{getEntryTitle()}</h2>
                        <Button
                            onClick={handleSave}
                            disabled={!pendingContent.hasContent}
                        >
                            Save
                        </Button>
                    </div>

                    {/* Prompt Generator */}
                    <PromptGenerator />

                    {/* Entry Component */}
                    {renderEntryComponent()}
                </CardContent>
            </Card>

            {/* Reflection Modal */}
            <FeelingActivityModal
                isOpen={showReflection}
                onClose={() => setShowReflection(false)}
                onSave={handleReflectionSave}
                onSkip={handleReflectionSkip}
            />
        </div>
    );
};

export default EntryCreate;