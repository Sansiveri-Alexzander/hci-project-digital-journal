import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, Activity, PenLine, Mic, Image, Trash2 } from 'lucide-react';
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';


const EntryTypeIcon = {
    'text': <PenLine className="h-5 w-5" />,
    'audio': <Mic className="h-5 w-5" />,
    'image': <Image className="h-5 w-5" />
};

export const ViewEntry = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const entryManager = new EntryManager();

    const handleDelete = async () => {
        if (!entry || !window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            return;
        }

        try {
            await entryManager.deleteEntry(entry.id);
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
                return <p className="text-gray-700 whitespace-pre-wrap">{entry.content as string}</p>;
            case 'audio':
                return (
                    <audio controls className="w-full mt-4">
                        <source src={entry.content as string} type="audio/webm" />
                        Your browser does not support the audio element.
                    </audio>
                );
            case 'image':
                return (
                    <div className="mt-4">
                        <img
                            src={typeof entry.content === 'string' ? entry.content : URL.createObjectURL(entry.content as File)}
                            alt="Entry"
                            className="rounded-lg max-h-96 w-full object-cover"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

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
                    onClick={handleDelete}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </button>
            </div>

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
                    
                    {/* Entry Type Badge */}
                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        {EntryTypeIcon[entry.contentType]}
                        <span className="capitalize">{entry.contentType} Entry</span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Entry Content */}
                    {renderContent()}

                    {/* Feelings and Activities */}
                    <div className="space-y-4">
                        {entry.feelings.length > 0 && (
                            <div className="flex items-start gap-2">
                                <Heart className="h-4 w-4 text-rose-500 mt-1" />
                                <div className="flex flex-wrap gap-1.5">
                                    {entry.feelings.map((feeling) => (
                                        <span
                                            key={feeling.id}
                                            className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium"
                                        >
                                            {feeling.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {entry.activities.length > 0 && (
                            <div className="flex items-start gap-2">
                                <Activity className="h-4 w-4 text-blue-500 mt-1" />
                                <div className="flex flex-wrap gap-1.5">
                                    {entry.activities.map((activity) => (
                                        <span
                                            key={activity.id}
                                            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                                        >
                                            {activity.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={() => navigate(`/reflect?entryId=${entry.id}`)}
                    >
                        Reflect!
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};