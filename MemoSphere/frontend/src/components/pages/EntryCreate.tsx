// src/pages/EntryCreate.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';
import FeelingActivityModal from '@/components/entry/FeelingActivityModal';
import SaveConfirmationOverlay from '../entry/SaveConfirmationOverlay';
import PromptGenerator from '@/components/entry/PromptGenerator';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentType, Entry } from '@/types/Entry';
import ConfirmationModal from '../entry/ConfirmationModal';
import { Input } from '@/components/ui/input';
import { EntryManager } from '@/services/EntryManager';
import EntryCard from '../base/EntryCard';
import { ChevronDown, ChevronUp, ImageIcon, Mic, Type, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { REFLECTION_PROMPTS } from '../entry/PromptGenerator';

interface PendingEntry {
    type: ContentType;
    content: string | Blob | File | { image: File, caption: string };
    hasContent: boolean;
    title: string;
    isReflection: boolean;
    linkedEntryId?: string;
}

export const EntryCreate = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const [currentType, setCurrentType] = useState<ContentType>(type as ContentType);
    const [showReflection, setShowReflection] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const reflectionEntryId = searchParams.get('reflectOn');
    const [reflectionChain, setReflectionChain] = useState<Entry[]>([]);
    const [isChainExpanded, setIsChainExpanded] = useState(false);
    const entryManager = new EntryManager();
    const [pendingContent, setPendingContent] = useState<PendingEntry>({
        type: type as ContentType,
        content: '',
        hasContent: false,
        title: '',
        isReflection: !!reflectionEntryId,
        linkedEntryId: reflectionEntryId || undefined
    });
    const initialPrompt = () => {
        if (pendingContent.isReflection) {
            const prompts = Object.values(REFLECTION_PROMPTS);
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            return randomPrompt;
        }
        return null;
    }

    useEffect(() => {
        const loadReflectionChain = async () => {
            if (reflectionEntryId) {
                let currentEntryId = reflectionEntryId;
                const chain: Entry[] = [];
                
                while (currentEntryId) {
                    const entry = await entryManager.getEntryById(currentEntryId);
                    if (!entry) break;
                    chain.push(entry);
                    currentEntryId = entry.linkedEntryId || '';
                }
                
                setReflectionChain(chain);
            }
        };
        
        loadReflectionChain();
    }, [reflectionEntryId]);

    const getBackgroundClass = () => {
        switch (currentType) {
            case 'text':
                return 'animated-background-text';
            case 'audio':
                return 'animated-background-audio';
            case 'image':
                return 'animated-background-image';
            default:
                return 'animated-background';
        }
    };

    const handlePromptSelect = (prompt: string) => {
        setSelectedPrompt(prompt);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPendingContent(prev => ({
            ...prev,
            title: e.target.value
        }));
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
                    hasContent: false,
                    title: pendingContent.title,
                    isReflection: pendingContent.isReflection,
                    linkedEntryId: pendingContent.linkedEntryId
                });
            });
            setShowUnsavedModal(true);
        } else {
            setCurrentType(newType);
            setPendingContent({
                type: newType,
                content: '',
                hasContent: false,
                title: pendingContent.title,
                isReflection: pendingContent.isReflection,
                linkedEntryId: pendingContent.linkedEntryId
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
            hasContent,
            title: pendingContent.title,
            isReflection: pendingContent.isReflection,
            linkedEntryId: pendingContent.linkedEntryId
        });
    };

    const handleSave = () => {
        if (pendingContent.hasContent) {
            setShowReflection(true);
        }
    };

    const generateTitle = async (): Promise<string> => {
        const existingEntries = await entryManager.getAllEntries();
        let entryTitle = pendingContent.title.trim();
        
        if (!entryTitle) {
            const untitledCount = existingEntries.filter((entry: Entry) => 
                entry.title.startsWith('Untitled')).length;
            
            entryTitle = untitledCount === 0 
                ? 'Untitled' 
                : `Untitled ${untitledCount + 1}`;
        }
        return entryTitle;
    };

    const handleReflectionSave = async (feelings: string[], activities: string[]) => {
        const entryTitle = await generateTitle();
    
        await entryManager.createEntry(
            currentType,
            pendingContent.content,
            entryTitle,
            feelings.map(feeling => ({ id: feeling, name: feeling, intensity: 1 })),
            activities.map(activity => ({ id: activity, name: activity })),
            pendingContent.isReflection,
            pendingContent.linkedEntryId,
            selectedPrompt || undefined
        );
        
        setShowReflection(false);
        setShowSaveConfirmation(true);
    };

    const handleReflectionSkip = async () => {
        try {
            const entryTitle = await generateTitle();
    
            // Save entry without reflections
            await entryManager.createEntry(
                currentType,
                pendingContent.content,
                entryTitle,
                [],  // empty feelings array
                [],  // empty activities array
                pendingContent.isReflection,
                pendingContent.linkedEntryId,
                selectedPrompt || undefined
            );
    
            setShowReflection(false);
            setShowSaveConfirmation(true);  // Show the confirmation overlay
        } catch (error) {
            console.error('Error saving entry without reflections:', error);
            // You might want to show an error message to the user here
        }
    };

    // Add this section to the JSX before the entry component
    const renderReflectionChain = () => {
        if (!reflectionChain.length) return null;

        const handleEntryClick = (entryId: string) => {
          if (pendingContent.hasContent) {
            setPendingAction(() => () => navigate('/'));
            setShowUnsavedModal(true);
          } else {
            navigate(`/entries/${entryId}`);
          }
        };

        // If there's only one entry, just show it without the collapsible
        if (reflectionChain.length === 1) {
            return (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Reflecting on</h3>
                    <EntryCard 
                        entry={reflectionChain[0]} 
                        mode="summary" 
                        isReflectionTarget={true}
                        onClick={() => handleEntryClick(reflectionChain[0].id)}
                    />
                </div>
            );
        }

        // If there are multiple entries, show the collapsible UI
        return (
            <div className="mb-6">
                <Collapsible open={isChainExpanded} onOpenChange={setIsChainExpanded}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Reflecting on</h3>
                        <CollapsibleTrigger asChild>
                            <Button>
                                {isChainExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <EntryCard 
                        entry={reflectionChain[0]} 
                        mode="summary" 
                        isReflectionTarget={true}
                        onClick={() => handleEntryClick(reflectionChain[0].id)}
                    />

                    <CollapsibleContent>
                        {reflectionChain.slice(1).map((entry) => (
                            <div key={entry.id} className="mt-4">
                                <EntryCard 
                                    entry={entry} 
                                    mode="summary"
                                    isReflectionTarget={false}
                                    onClick={() => handleEntryClick(entry.id)}
                                />
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
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
        <>
            <div className={getBackgroundClass()} />
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <Card className="backdrop-blur-sm">
                    <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <Button onClick={handleBack}>
                                <X className="h-5 w-5" />
                            </Button>
                            <div className="flex-1 mx-4">
                                <Input
                                    type="text"
                                    placeholder="Entry Title"
                                    value={pendingContent.title}
                                    onChange={handleTitleChange}
                                    className="text-xl font-semibold h-12 px-4 text-foreground placeholder:text-muted-foreground"
                                    style={{ fontSize: '1.25rem' }}
                                />
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={!pendingContent.hasContent}
                            >
                                Save
                            </Button>
                        </div>

                        {/* Reflection chain */}
                        {renderReflectionChain()}

                        <div className="mb-6">
                            <PromptGenerator 
                                onPromptSelect={handlePromptSelect}
                                reflection={pendingContent.isReflection}
                                initialPrompt={initialPrompt()}
                            />
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
                    cancelText="Cancel"
                />

                <SaveConfirmationOverlay 
                    isVisible={showSaveConfirmation}
                    onComplete={() => {
                        setShowSaveConfirmation(false);
                        navigate('/entries');
                    }}
                />
            </div>
        </>
    );
};

export default EntryCreate;