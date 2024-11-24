import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EntryManager } from '@/services/EntryManager';
import EntryCard from '@/components/base/EntryCard';
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';
import FeelingActivityModal from '@/components/entry/FeelingActivityModal';
import { Entry, ContentType } from '@/types/Entry';

const reflectionPrompts = [
    "How has your perspective changed since this entry?",
    "What have you learned since writing this?",
    "What would you tell yourself when you wrote this?",
    "How do you feel about this entry now?",
    "What progress have you made since this entry?",
    "What emotions come up when reading this entry now?",
];

export const ReflectionCreate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [originalEntry, setOriginalEntry] = useState<Entry | null>(null);
    const [currentType, setCurrentType] = useState<ContentType>('text');
    const [showReflection, setShowReflection] = useState(false);
    const [pendingContent, setPendingContent] = useState<any>('');
    const [reflectionPrompt] = useState(
        reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)]
    );
    
    const entryManager = new EntryManager();

    useEffect(() => {
        const loadOriginalEntry = async () => {
            const entryId = searchParams.get('entryId');
            if (!entryId) {
                navigate('/');
                return;
            }

            const entry = await entryManager.getEntryById(entryId);
            if (!entry) {
                navigate('/');
                return;
            }

            setOriginalEntry(entry);
        };

        loadOriginalEntry();
    }, [searchParams]);

    const handleContentUpdate = (content: any) => {
        setPendingContent(content);
    };

    const handleReflectionSave = async (feelings: string[], activities: string[]) => {
        if (!originalEntry) return;

        await entryManager.createEntry(
            currentType,
            pendingContent,
            `Reflection on: ${originalEntry.title}`,
            feelings.map(feeling => ({ id: feeling, name: feeling, intensity: 1 })),
            activities.map(activity => ({ id: activity, name: activity })),
            true,  // isReflection
            originalEntry.id,  // linkedEntryId
            reflectionPrompt  // prompt
        );

        navigate('/entries');
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
            {/* Original Entry Card */}
            {originalEntry && (
                <div className="space-y-2">
                    <h2 className="text-lg font-medium">Reflecting on:</h2>
                    <EntryCard entry={originalEntry} mode="summary" />
                </div>
            )}

            {/* Reflection Prompt */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <p className="text-base text-muted-foreground pl-6 border-l-2 border-primary/20 italic">
                    "{reflectionPrompt}"
                </p>
            </div>

            {/* Entry Creation Card */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Entry Type Switcher */}
                    <div className="flex gap-2">
                        <Button
                            variant={currentType === 'text' ? 'default' : 'outline'}
                            onClick={() => setCurrentType('text')}
                        >
                            Text
                        </Button>
                        <Button
                            variant={currentType === 'audio' ? 'default' : 'outline'}
                            onClick={() => setCurrentType('audio')}
                        >
                            Audio
                        </Button>
                        <Button
                            variant={currentType === 'image' ? 'default' : 'outline'}
                            onClick={() => setCurrentType('image')}
                        >
                            Image
                        </Button>
                    </div>

                    {/* Entry Component */}
                    {currentType === 'text' && (
                        <TextEntry onSave={handleContentUpdate} />
                    )}
                    {currentType === 'audio' && (
                        <AudioEntry onSave={handleContentUpdate} />
                    )}
                    {currentType === 'image' && (
                        <ImageEntry onSave={handleContentUpdate} />
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => setShowReflection(true)}
                            disabled={!pendingContent}
                        >
                            Save Reflection
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Feeling/Activity Modal */}
            <FeelingActivityModal
                isOpen={showReflection}
                onClose={() => setShowReflection(false)}
                onSave={handleReflectionSave}
            />
        </div>
    );
};

export default ReflectionCreate;