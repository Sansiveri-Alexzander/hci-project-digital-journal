// src/pages/EntryCreate.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextEntry, AudioEntry, ImageEntry, EntryType } from '@/components/entry';
import FeelingActivityModal from '@/components/entry/FeelingActivityModal';
import PromptGenerator from '@/components/entry/PromptGenerator';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Mic, Type, X } from "lucide-react";
import { ContentType } from '@/types/Entry';
import ConfirmationModal from '../entry/ConfirmationModal';

interface PendingEntry {
    type: ContentType;
    content: string | Blob | File | { image: File, caption: string };
    hasContent: boolean;
}

export const EntryCreate = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [currentType, setCurrentType] = useState<ContentType>(type as ContentType);
    const [showReflection, setShowReflection] = useState(false);
    const [showSwitchModal, setShowSwitchModal] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [pendingTypeSwitch, setPendingTypeSwitch] = useState<ContentType | null>(null);
    const [pendingContent, setPendingContent] = useState<PendingEntry>({
        type: type as ContentType,
        content: '',
        hasContent: false
    });

     // Modal handlers
     const handleModalConfirm = () => {
        if (pendingTypeSwitch) {
            setCurrentType(pendingTypeSwitch);
            setPendingContent({
                type: pendingTypeSwitch,
                content: '',
                hasContent: false
            });
        }
        setShowSwitchModal(false);
        setPendingTypeSwitch(null);
    };

    const handleModalCancel = () => {
        setShowSwitchModal(false);
        setPendingTypeSwitch(null);
    };

    // Type switching handler
    const handleTypeSwitch = (newType: ContentType) => {
        if (newType === currentType) return;
    
        if (pendingContent.hasContent) {
            setPendingAction(() => () => {
                setCurrentType(newType);
                setPendingContent({
                    type: newType,
                    content: '',
                    hasContent: false
                });
            });
            setShowUnsavedModal(true);
        } else {
            setCurrentType(newType);
            setPendingContent({
                type: newType,
                content: '',
                hasContent: false
            });
        }
    };

    const handleBack = () => {
        if (pendingContent.hasContent) {
            setPendingAction(() => () => navigate('/'));
            setShowUnsavedModal(true);
        } else {
            navigate('/');
        }
    };

    const handleUnsavedConfirm = () => {
        if (pendingAction) {
            pendingAction();
        }
        setShowUnsavedModal(false);
        setPendingAction(null);
    };

    const handleUnsavedCancel = () => {
        setShowUnsavedModal(false);
        setPendingAction(null);
    };

    const handleContentUpdate = (content: any) => {
        let hasContent = false;
        if (currentType === 'text') {
            hasContent = content.trim().length > 0;
        } else if (currentType === 'audio') {
            hasContent = content instanceof Blob;
        } else if (currentType === 'image') {
            hasContent = content.image instanceof File;
        }

        setPendingContent({
            type: currentType,
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
            type: currentType,
            content: pendingContent.content,
            feelings,
            activities
        });
        navigate('/entries');
    };

    const handleReflectionSkip = () => {
        console.log('Saving entry without reflections:', {
            type: currentType,
            content: pendingContent.content
        });
        navigate('/entries');
    };

    const getEntryTitle = () => {
        switch (currentType) {
            case 'text': return 'Text Entry';
            case 'audio': return 'Audio Entry';
            case 'image': return 'Image Entry';
            default: return 'New Entry';
        }
    };

    const renderEntryComponent = () => {
        switch (currentType) {
            case 'text':
                return <TextEntry onSave={(content) => handleContentUpdate(content)} />;
            case 'audio':
                return <AudioEntry onSave={(content) => handleContentUpdate(content)} />;
            case 'image':
                return <ImageEntry onSave={(content) => handleContentUpdate(content)} />;
            default:
                return <div>Invalid entry type</div>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <Card>
                <CardContent className="p-6">
                    {/* Header */}
                    {/* Header - Simplified */}
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

                    {/* Entry Type Switcher - Moved to bottom */}
                    <div className="mb-6">
                        <PromptGenerator />
                    </div>

                    {/* Entry Component */}
                    {renderEntryComponent()}

                    {/* Entry Type Switcher - New position */}
                    <div className="mt-6 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Change entry type:</p>
                        <div className="flex gap-2 justify-center">
                            {currentType !== 'text' && (
                                <Button
                                    onClick={() => handleTypeSwitch('text')}
                                    className="gap-2"
                                >
                                    <Type className="h-4 w-4" />
                                    Text
                                </Button>
                            )}
                            {currentType !== 'audio' && (
                                <Button
                                    onClick={() => handleTypeSwitch('audio')}
                                    className="gap-2"
                                >
                                    <Mic className="h-4 w-4" />
                                    Audio
                                </Button>
                            )}
                            {currentType !== 'image' && (
                                <Button
                                    onClick={() => handleTypeSwitch('image')}
                                    className="gap-2"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    Image
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reflection Modal */}
            <FeelingActivityModal
                isOpen={showReflection}
                onClose={() => setShowReflection(false)}
                onSave={handleReflectionSave}
                onSkip={handleReflectionSkip}
            />

            {/* Unsaved Changes Modal */}
            <ConfirmationModal
                isOpen={showUnsavedModal}
                onConfirm={handleUnsavedConfirm}
                onCancel={handleUnsavedCancel}
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
                confirmText="Leave"
                cancelText="Stay"
            />
        </div>
    );
};

export default EntryCreate;