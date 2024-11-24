import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, PenLine, Mic, Image, Trash2, Sparkles } from 'lucide-react';
import { Activity, Entry, Feeling } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';
import ConfirmationModal from '@/components/entry/ConfirmationModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import EntryCard from '../base/EntryCard';
import { ACTIVITIES, FEELINGS } from '../entry/FeelingActivityModal';

const EntryTypeIcon = {
    'text': <PenLine className="h-5 w-5" />,
    'audio': <Mic className="h-5 w-5" />,
    'image': <Image className="h-5 w-5" />
};

function getFeelingIcon(feeling: Feeling) {
    const feelingIcon = FEELINGS.find(f => f.id === feeling.id)
    return feelingIcon
}

function getActivityIcon(activity: Activity) {
    const activityIcon = ACTIVITIES.find(a => a.id === activity.id)
    return activityIcon
}

export const ViewEntry = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reflectionChain, setReflectionChain] = useState<Entry[]>([]);
    const [isChainExpanded, setIsChainExpanded] = useState(false);
    
    const entryManager = new EntryManager();

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!entry) return;

        try {
            await entryManager.deleteEntry(entry.id);
            setShowDeleteModal(false);
            navigate('/entries', { replace: true });
        } catch (err) {
            console.error('Error deleting entry:', err);
            setError('Failed to delete entry');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        const loadEntry = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                const loadedEntry = await entryManager.getEntryById(id);
                
                if (!loadedEntry) {
                    setError('Entry not found');
                    return;
                }
                
                setEntry(loadedEntry);

                // Load reflection chain if this is a reflection
                if (loadedEntry.isReflection && loadedEntry.linkedEntryId) {
                    let currentEntryId = loadedEntry.linkedEntryId;
                    const chain: Entry[] = [];
                    
                    while (currentEntryId) {
                        const chainEntry = await entryManager.getEntryById(currentEntryId);
                        if (!chainEntry) break;
                        chain.push(chainEntry);
                        currentEntryId = chainEntry.linkedEntryId || '';
                    }
                    
                    setReflectionChain(chain);
                }
            } catch (err) {
                setError('Failed to load entry');
                console.error('Error loading entry:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadEntry();
    }, [id]);

    const renderReflectionChain = () => {
        if (!entry?.isReflection || reflectionChain.length === 0) return null;

        const handleEntryClick = (entryId: string) => {
            navigate(`/entries/${entryId}`);
        };

        // If there's only one entry, just show it without the collapsible
        if (reflectionChain.length === 1) {
            return (
                <div className="mb-6">
                    <div className="flex flex-col gap-2 mb-2">
                    <h3 className="text-lg font-semibold">Reflecting on</h3>
                    <p className="text-sm text-muted-foreground">
                        Entry from {new Date(reflectionChain[0].date).toLocaleDateString()}
                    </p>
                </div>
                    <EntryCard 
                        entry={reflectionChain[0]} 
                        mode="summary" 
                        isReflectionTarget={true}
                        onClick={() => handleEntryClick(reflectionChain[0].id)}
                    />
                </div>
            );
        }

        // If there's only one entry, just show it without the collapsible
        return (
            <div className="mb-6">
                <Collapsible open={isChainExpanded} onOpenChange={setIsChainExpanded}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-semibold">Reflection Chain</h3>
                            <p className="text-sm text-muted-foreground">
                                {reflectionChain.length} connected entries
                            </p>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                {isChainExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </div>
    
                    {/* Always show the first entry being reflected upon */}
                    <div className="relative">
                        <EntryCard 
                            entry={reflectionChain[0]} 
                            mode="summary" 
                            isReflectionTarget={true}
                            onClick={() => handleEntryClick(reflectionChain[0].id)}
                        />
                        <span className="text-xs text-primary font-medium mt-1 ml-4 block">
                            Entry being reflected on
                        </span>
                    </div>
    
                    <CollapsibleContent>
                        <div className="space-y-4 mt-4">
                            {reflectionChain.slice(1).map((chainEntry, index) => (
                                <div key={chainEntry.id} className="relative">
                                    <div className="absolute -top-2 left-4 h-4 w-px bg-primary/30" />
                                    <EntryCard 
                                        entry={chainEntry} 
                                        mode="summary"
                                        isReflectionTarget={false}
                                        onClick={() => handleEntryClick(chainEntry.id)}
                                    />
                                    <span className="text-xs text-muted-foreground mt-1 ml-4 block">
                                        {index === reflectionChain.length - 2 ? 'First entry in chain' : 'Earlier reflection'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
    };

    const renderContent = () => {
        if (!entry) return null;

        switch (entry.contentType) {
            case 'text':
                return <p className="text-gray-700 whitespace-pre-wrap">{entry.content as string}</p>;
            case 'audio':
                return (
                    <audio controls className="w-full mt-4">
                        <source src={entry.content as string} type="audio/webm" />
                        Your browser does not support the audio element.
                    </audio>
                );
            case 'image':
                const imageContent = typeof entry.content === 'string' 
                    ? JSON.parse(entry.content)
                    : entry.content;
                
                return (
                    <div className="mt-4 space-y-2">
                        <img
                            src={imageContent.imageData}
                            alt="Entry"
                            className="rounded-lg w-full"
                        />
                        {imageContent.caption && (
                            <p className="text-sm text-gray-600 italic">
                                {imageContent.caption}
                            </p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderFeelingActivityIcons = () => {
        if (!entry) return null;

        return (
            <div className="p-2 left-4 space-y-2">
                {entry.feelings.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {entry.feelings.map(feeling => {
                            const feelingIcon = getFeelingIcon(feeling);
                            return feelingIcon ? (
                                <span
                                    key={feeling.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium"
                                >
                                    {feelingIcon.icon} 
                                    {feelingIcon.label}
                                </span>
                            ) : null;
                        })}
                    </div>
                )}

                {entry.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {entry.activities.map(activity => {
                            const activityIcon = getActivityIcon(activity);
                            return activityIcon ? (
                                <span
                                    key={activity.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                                >
                                    {activityIcon.icon} 
                                    {activityIcon.label}
                                </span>
                            ) : null;
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="text-center">Loading entry...</div>
            </div>
        );
    }

    if (error || !entry) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="text-center text-red-500">{error || 'Entry not found'}</div>
                <button
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Back Button and Delete Button */}
            <div className="flex justify-between mb-4">
                <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>

                <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={handleDeleteClick}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </button>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                title="Delete Entry"
                description="Are you sure you want to delete this entry? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Entry Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-2xl">{entry.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(entry.date).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Show reflection chain if this is a reflection */}
                    {renderReflectionChain()}

                    {/* Add Prompt Display */}
                    {entry?.prompt && (
                        <div className={`mt-4 p-4 ${entry.isReflection ? 'bg-primary/5' : 'bg-muted/50'} rounded-lg border border-border/50`}>
                            <p className={`text-base ${entry.isReflection ? 'text-primary/80' : 'text-muted-foreground'} pl-6 border-l-2 border-primary/20 italic`}>
                                "{entry.prompt}"
                            </p>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Entry Content */}
                    {renderContent()}

                    {/* Feelings and Activities */}
                    <div className="space-y-4">
                        {renderFeelingActivityIcons()}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={() => navigate(`/create/text?reflectOn=${entry.id}`)}
                    >
                        Reflect!
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};