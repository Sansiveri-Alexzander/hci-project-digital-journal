import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, History } from "lucide-react";
import ReflectionCard from '../base/ReflectionCard';
import ReflectionPrompt from '../entry/ReflectionPrompt';
import ReflectionEntryCreate from '../pages/ReflectionEntryCreate';
import FeelingActivityModal from '../entry/FeelingActivityModal';
import { Entry, ContentType, EntryContent } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';

export const Reflect = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [originalEntry, setOriginalEntry] = useState<Entry | null>(null);
    const [reflectionChain, setReflectionChain] = useState<Entry[]>([]);
    const [showFeelingModal, setShowFeelingModal] = useState(false);
    const [pendingReflection, setPendingReflection] = useState<{
        type: ContentType;
        content: EntryContent;
    } | null>(null);
    
    const entryManager = new EntryManager();
    const entryId = searchParams.get('entryId');

    useEffect(() => {
        const loadEntryAndChain = async () => {
            if (!entryId) return;
            try {
                const entry = await entryManager.getEntryById(entryId);
                if (entry) {
                    setOriginalEntry(entry);
                    const chain = await entryManager.getReflectionChain(entryId);
                    setReflectionChain(chain);
                }
            } catch (error) {
                console.error('Error loading entry:', error);
            }
        };

        loadEntryAndChain();
    }, [entryId]);

    const handleReflectionCreate = (type: ContentType, content: EntryContent) => {
        setPendingReflection({ type, content });
        setShowFeelingModal(true);
    };

    const handleReflectionSave = async (feelings: string[], activities: string[]) => {
        if (!pendingReflection || !originalEntry) return;

        try {
            await entryManager.createEntry(pendingReflection.type, pendingReflection.content,
                `Reflection on: ${originalEntry.title}`,
                feelings.map(f => ({ id: crypto.randomUUID(), name: f, intensity: 3 })),
                activities.map(a => ({ id: crypto.randomUUID(), name: a })),
                true,
                originalEntry.id
            );
            navigate('/entries');
        } catch (error) {
            console.error('Error saving reflection:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!entryId || !originalEntry) {
        return (
            <div className="container mx-auto px-4 py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>No Entry Selected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please select an entry to reflect upon.</p>
                        <Button onClick={handleBack} className="mt-4">
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button className="hover:bg-accent hover:text-accent-foreground" onClick={handleBack}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Create Reflection</h1>
                <div className="w-20" /> {/* Spacer for alignment */}
            </div>

            {/* Reflection Chain */}
            {reflectionChain.length > 1 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                        <History className="h-4 w-4" />
                        <span>Previous Reflections</span>
                    </div>
                    <div className="space-y-4">
                        {reflectionChain.slice(1).map((entry) => (
                            <ReflectionCard
                                key={entry.id}
                                entry={entry}
                                onClick={() => navigate(`/entries/${entry.id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Original Entry */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Original Entry</h2>
                <ReflectionCard entry={originalEntry} />
            </div>

            {/* Reflection Prompt */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Reflection Prompt</h2>
                <ReflectionPrompt />
            </div>

            {/* Create Reflection */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Your Reflection</h2>
                <ReflectionEntryCreate onSave={handleReflectionCreate} />
            </div>

            {/* Feeling/Activity Modal */}
            <FeelingActivityModal
                isOpen={showFeelingModal}
                onClose={() => setShowFeelingModal(false)}
                onSave={handleReflectionSave}
                onSkip={() => navigate('/entries')}
            />
        </div>
    );
};