// src/components/pages/AllEntries.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EntryCard from '@/components/base/EntryCard';
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';
import { ArrowLeft, PenLine, Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EntryFilter from '../entry/EntryFilter.tsx';
import '@/styles/background-animation.css';

export const AllEntries = () => {
    // state management for entries and filters
    const [entries, setEntries] = useState<Entry[]>([]); // all entries
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]); // entries after applying filters
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const navigate = useNavigate();
    const entryManager = new EntryManager();

    // entry type definitions for the "create new" view
    const entryTypes = [
        {
            type: 'text',
            icon: <PenLine className="h-10 w-10" />,
            title: 'Text Entry',
            description: 'Write down your thoughts',
            className: 'text-entry'
        },
        {
            type: 'audio',
            icon: <Mic className="h-10 w-10" />,
            title: 'Audio Entry',
            description: 'Record your voice',
            className: 'audio-entry'
        },
        {
            type: 'image',
            icon: <Camera className="h-10 w-10" />,
            title: 'Image Entry',
            description: 'Capture a moment',
            className: 'image-entry'
        }
    ];

    // load entries when component mounts
    useEffect(() => {
        const loadEntries = async () => {
            try {
                const loadedEntries = await entryManager.getAllEntries();
                setEntries(loadedEntries);
                setFilteredEntries(loadedEntries); // initially show all entries
            } catch (error) {
                console.error('Error loading entries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEntries();
    }, []);

    // handle filter changes from the EntryFilter component
    const handleFilterChange = (feelings: string[], activities: string[]) => {
        setSelectedFeelings(feelings);
        setSelectedActivities(activities);

        let filtered = [...entries];

        // apply feeling filters if any are selected
        if (feelings.length > 0) {
            filtered = filtered.filter(entry =>
                entry.feelings.some(feeling => feelings.includes(feeling.id))
            );
        }

        // apply activity filters if any are selected
        if (activities.length > 0) {
            filtered = filtered.filter(entry =>
                entry.activities.some(activity => activities.includes(activity.id))
            );
        }

        setFilteredEntries(filtered);
    };

    return (
        <div className="container mx-auto px-4 py-6 relative z-10">
            {/* header with back button */}
            <div className="flex justify-between items-center mb-6 relative">
                <Button
                    onClick={() => navigate(-1)}
                    className="gap-2 absolute"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-center mx-auto text-2xl font-bold">All Entries</h1>
            </div>

            {isLoading ? (
                // loading state
                <div className="text-center py-4">Loading entries...</div>
            ) : entries.length === 0 ? (
                // empty state - show create entry options
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center">Create Your First Entry</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground mb-8">
                            Choose a type of entry to get started with your journaling journey
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {entryTypes.map((entry) => (
                                <Button
                                    key={entry.type}
                                    className={`animated-button ${entry.className} h-40 flex flex-col items-center justify-center gap-4 p-6 border-2`}
                                    onClick={() => navigate(`/create/${entry.type}`)}
                                >
                                    {entry.icon}
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-semibold">{entry.title}</span>
                                        <span className="text-sm text-muted-foreground">{entry.description}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                // entries view with filters
                <>
                    {/* filter component */}
                    <EntryFilter
                        onFilterChange={handleFilterChange}
                        selectedFeelings={selectedFeelings}
                        selectedActivities={selectedActivities}
                        entriesCount={entries.length}
                        filteredCount={filteredEntries.length}
                    />

                    {/* grid of entry cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEntries.map((entry) => (
                            <EntryCard
                                key={entry.id}
                                entry={entry}
                                onClick={() => navigate(`/entries/${entry.id}`)}
                            />
                        ))}
                    </div>

                    {/* no results state */}
                    {filteredEntries.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No entries match your selected filters.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};