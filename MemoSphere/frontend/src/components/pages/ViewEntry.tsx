import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {ArrowLeft, Calendar, Trash2, PenLine, Mic, Image as ImageIcon, Sparkles} from 'lucide-react';
import { Activity, Entry, Feeling } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';
import ConfirmationModal from '@/components/entry/ConfirmationModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import EntryCard from '../base/EntryCard';
import { ACTIVITIES, FEELINGS } from '../entry/FeelingActivityModal';
import '@/styles/background-animation.css';

// Get colors based on entry type
const getEntryColors = (type: string) => {
    switch (type) {
        case 'text':
            return {
                background: 'bg-[#F2D0A4]/10',
                border: 'border-[#F2D0A4]/30',
                hover: 'hover:border-[#F2D0A4]/60',
                icon: 'text-[#F2D0A4] bg-[#F2D0A4]/10 px-2 py-1 rounded-md font-medium',
                accent: '#F2D0A4'
            };
        case 'audio':
            return {
                background: 'bg-[#69DC9E]/10',
                border: 'border-[#69DC9E]/30',
                hover: 'hover:border-[#69DC9E]/60',
                icon: 'text-[#69DC9E] bg-[#69DC9E]/10 px-2 py-1 rounded-md font-medium',
                accent: '#69DC9E'
            };
        case 'image':
            return {
                background: 'bg-[#7D80DA]/10',
                border: 'border-[#7D80DA]/30',
                hover: 'hover:border-[#7D80DA]/60',
                icon: 'text-[#7D80DA] bg-[#7D80DA]/10 px-2 py-1 rounded-md font-medium',
                accent: '#7D80DA'
            };
        default:
            return {
                background: 'bg-background',
                border: 'border-border',
                hover: 'hover:border-primary',
                icon: 'text-foreground bg-foreground/10 px-2 py-1 rounded-md font-medium',
                accent: '#ed786b'
            };
    }
};

const EntryTypeIcon = {
    'text': <PenLine className="h-5 w-5" />,
    'audio': <Mic className="h-5 w-5" />,
    'image': <ImageIcon className="h-5 w-5" />
};

function getFeelingIcon(feeling: Feeling) {
    return FEELINGS.find(f => f.id === feeling.id);
}

function getActivityIcon(activity: Activity) {
    return ACTIVITIES.find(a => a.id === activity.id);
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
    const [colors, setColors] = useState(getEntryColors('text'));

    const entryManager = new EntryManager();

    useEffect(() => {
        if (entry?.contentType) {
            setColors(getEntryColors(entry.contentType));
        }
    }, [entry?.contentType]);

    const handleDeleteClick = () => setShowDeleteModal(true);

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

    const renderContent = () => {
        if (!entry) return null;

        switch (entry.contentType) {
            case 'text':
                return (
                    <div className={`${colors.background} rounded-lg p-6 border ${colors.border}`}>
                        <p className="text-foreground whitespace-pre-wrap">{entry.content as string}</p>
                    </div>
                );
            case 'audio':
                return (
                    <div className={`${colors.background} rounded-lg p-6 border ${colors.border}`}>
                        <div className="flex items-center justify-center">
                            <Mic className={`h-8 w-8 ${colors.icon} mb-4`} />
                        </div>
                        <audio controls className="w-full">
                            <source src={entry.content as string} type="audio/webm" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            case 'image':
                const imageContent = typeof entry.content === 'string'
                    ? JSON.parse(entry.content)
                    : entry.content;

                return (
                    <div className={`${colors.background} rounded-lg p-6 border ${colors.border} space-y-4`}>
                        <img
                            src={imageContent.imageData}
                            alt="Entry"
                            className="rounded-lg w-full"
                        />
                        {imageContent.caption && (
                            <p className="text-muted-foreground italic text-sm">
                                {imageContent.caption}
                            </p>
                        )}
                    </div>
                );
        }
    };

    const renderFeelingActivityIcons = () => {
        if (!entry) return null;

        return (
            <div className="space-y-3">
                {entry.feelings.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Feelings</h3>
                        <div className="flex flex-wrap gap-2">
                            {entry.feelings.map(feeling => {
                                const feelingIcon = getFeelingIcon(feeling);
                                return feelingIcon ? (
                                    <span
                                        key={feeling.id}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#ed786b]/10 text-[#ed786b] rounded-full text-sm font-medium"
                                    >
                                        {feelingIcon.icon}
                                        {feelingIcon.label}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {entry.activities.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Activities</h3>
                        <div className="flex flex-wrap gap-2">
                            {entry.activities.map(activity => {
                                const activityIcon = getActivityIcon(activity);
                                return activityIcon ? (
                                    <span
                                        key={activity.id}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#752239]/10 text-[#752239] rounded-full text-sm font-medium"
                                    >
                                        {activityIcon.icon}
                                        {activityIcon.label}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderActionButtons = () => (
        <div className="flex justify-between mb-6">
            <Button
                onClick={() => navigate(-1)}
                className="gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            <Button
                onClick={handleDeleteClick}
                className="
                gap-2 bg-red-600 hover:bg-red-700
                text-white border-red-600 hover:border-red-700
                px-4 py-2 text-base
            "
            >
                <Trash2 className="h-4 w-4" />
                Delete Entry
            </Button>
        </div>
    );

    const renderReflectionButton = () => (
        <Button
            onClick={() => navigate(`/create/text?reflectOn=${entry?.id}`)}
            className="
            bg-zinc-800 hover:bg-zinc-900
            text-white font-medium
            px-4 py-2 text-sm
            gap-2 transition-all duration-300
            hover:scale-[1.02] shadow-sm
            border border-zinc-800 hover:border-zinc-900
        "
        >
            <Sparkles className="h-4 w-4" />
            Reflect on this entry
        </Button>
    );

    const renderReflectionChain = () => {
        if (!entry?.isReflection || reflectionChain.length === 0) return null;

        const handleEntryClick = (entryId: string) => {
            navigate(`/entries/${entryId}`);
        };

        // Get the immediate parent entry (the one being reflected upon)
        const parentEntry = reflectionChain[0];
        // Get the rest of the chain for the collapsible
        const olderEntries = reflectionChain.slice(1);

        return (
            <div className="space-y-6">
                {/* Always show the parent entry */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <h3 className="text-lg font-semibold">Reflected On</h3>
                    </div>
                    <EntryCard
                        entry={parentEntry}
                        mode="summary"
                        isReflectionTarget={true}
                        onClick={() => handleEntryClick(parentEntry.id)}
                    />
                </div>

                {/* Only show collapsible if there are more entries in the chain */}
                {olderEntries.length > 0 && (
                    <Collapsible open={isChainExpanded} onOpenChange={setIsChainExpanded}>
                        <CollapsibleTrigger asChild>
                            <button className="w-full group">
                                <div className="flex items-center gap-3 py-2 px-4 rounded-lg border border-border/40 hover:border-border hover:bg-accent/5 transition-colors">
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            View earlier reflections ({olderEntries.length} more {olderEntries.length === 1 ? 'entry' : 'entries'})
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                        {isChainExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <div className="pt-4 space-y-6">
                                {olderEntries.map((chainEntry, index) => (
                                    <div key={chainEntry.id} className="relative">
                                        <div className="absolute -left-[17px] top-0 h-full w-px bg-border" />
                                        <div className="absolute -left-[21px] top-[24px] h-4 w-4 rounded-full border-2 border-background bg-border" />
                                        <div className="pl-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    {index === olderEntries.length - 1 ? 'Original entry' : `Earlier reflection ${olderEntries.length - index}`}
                                                </span>
                                            </div>
                                            <EntryCard
                                                entry={chainEntry}
                                                mode="summary"
                                                onClick={() => handleEntryClick(chainEntry.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <>
                <div className="animated-background-view" />
                <div className="container mx-auto px-4 py-6 max-w-3xl relative z-10">
                    <Card className={`animate-pulse ${colors.background} ${colors.border}`}>
                        <CardContent className="p-6 space-y-4">
                            <div className="h-8 bg-muted rounded w-1/3" />
                            <div className="h-4 bg-muted rounded w-1/4" />
                            <div className="h-40 bg-muted rounded" />
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (error || !entry) {
        return (
            <>
                <div className="animated-background-view" />
                <div className="container mx-auto px-4 py-6 max-w-3xl relative z-10">
                    <Card className="bg-destructive/10 border-destructive/20">
                        <CardContent className="p-6 text-center space-y-4">
                            <p className="text-destructive">{error || 'Entry not found'}</p>
                            <Button
                                onClick={() => navigate(-1)}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
            </div>
            </>
        );
    }

    return (
        <>
            <div className={`animated-background-${entry.contentType}`} />
            <div className="container mx-auto px-4 py-6 max-w-3xl relative z-10">
                {renderActionButtons()}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteModal(false)}
                    title="Delete Entry"
                    description="Are you sure you want to delete this entry? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />

                <Card className={`
                    ${colors.background} 
                    ${colors.border} 
                    bg-white/95 
                    backdrop-blur-md 
                    shadow-lg 
                    border-2
                    rounded-xl
                `}>
                    <CardHeader className="space-y-6">
                        {/* Entry Type Badge */}
                        <div className={`
                            inline-flex items-center gap-2 
                            bg-white/50
                            shadow-sm 
                            px-3 py-2 
                            rounded-md 
                            border 
                            ${colors.border}
                        `}>
                            {EntryTypeIcon[entry.contentType]}
                            <span className="text-sm font-medium capitalize">
                                {entry.contentType} Entry
                            </span>
                        </div>

                        {/* Title and Date */}
                        <div className="space-y-2">
                            <CardTitle className="text-2xl leading-tight">
                                {entry.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(entry.date).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Reflection Chain */}
                        {renderReflectionChain()}

                        {/* Prompt if exists */}
                        {entry.prompt && (
                            <div className={`p-4 rounded-lg border ${colors.border} bg-white/50`}>
                                <p className={`text-lg ${colors.icon} pl-6 border-l-2 italic`}>
                                    "{entry.prompt}"
                                </p>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-6 border-t border-border/20 pt-6">
                        {renderContent()}
                        {renderFeelingActivityIcons()}
                    </CardContent>

                    <CardFooter className="flex justify-end pt-6 border-t border-border/20">
                        {renderReflectionButton()}
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};