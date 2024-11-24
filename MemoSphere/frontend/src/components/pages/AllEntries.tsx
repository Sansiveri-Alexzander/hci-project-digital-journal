import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EntryCard from '@/components/base/EntryCard';
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';

export const AllEntries = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const entryManager = new EntryManager();

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
            <h1 className="text-2xl font-bold mb-6">All Entries</h1>
            {isLoading ? (
                <div className="text-center py-4">Loading entries...</div>
            ) : entries.length === 0 ? (
                <div className="text-center py-8">
                    <p className="mb-4">No entries saved yet. Create your first entry to get started!</p>
                    <button 
                        onClick={() => navigate('/create/text')} 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                    >
                        Create New Entry
                    </button>
                </div> 
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