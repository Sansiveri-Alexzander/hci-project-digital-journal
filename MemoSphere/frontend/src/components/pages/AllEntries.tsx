// src/components/pages/AllEntries.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EntryCard from '@/components/base/EntryCard';
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';
import { ArrowLeft, PenLine, Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export const AllEntries = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const entryManager = new EntryManager();

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

    useEffect(() => {
        const loadEntries = async () => {
            try {
                const loadedEntries = await entryManager.getAllEntries();
                setEntries(loadedEntries);
            } catch (error) {
                console.error('Error loading entries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEntries();
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6 relative">
                <button
                    className="absolute left-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>
                <h1 className="text-center mx-auto text-2xl font-bold mb-6">All Entries</h1>
            </div>

            {isLoading ? (
                <div className="text-center py-4">Loading entries...</div>
            ) : entries.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map((entry) => (
                        <EntryCard
                            key={entry.id}
                            entry={entry}
                            onClick={() => navigate(`/entries/${entry.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
