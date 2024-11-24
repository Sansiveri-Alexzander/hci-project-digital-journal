import React, { createContext, useContext, useState, useEffect } from 'react';
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';

interface EntriesContextType {
    entries: Entry[];
    isLoading: boolean;
    error: string | null;
    addEntry: (entry: Omit<Entry, 'id' | 'date'>) => Promise<Entry>;
    getEntry: (id: string) => Promise<Entry | undefined>;
    searchEntries: (query: string) => Promise<Entry[]>;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export const EntriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const entryManager = new EntryManager();

    useEffect(() => {
        const loadEntries = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loadedEntries = await entryManager.getAllEntries();
                setEntries(loadedEntries);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load entries');
                console.error('Error loading entries:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadEntries();
    }, []);

    const addEntry = async (newEntry: Omit<Entry, 'id' | 'date'>): Promise<Entry> => {
        setIsLoading(true);
        setError(null);
        try {
            const savedEntry = await entryManager.createEntry(
                newEntry.contentType,
                newEntry.content,
                newEntry.title,
                newEntry.feelings,
                newEntry.activities,
                newEntry.isReflection,
                newEntry.linkedEntryId,
                newEntry.prompt
            );
            setEntries(prev => [savedEntry, ...prev]);
            return savedEntry;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add entry');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getEntry = async (id: string): Promise<Entry | undefined> => {
        setIsLoading(true);
        setError(null);
        try {
            return await entryManager.getEntryById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get entry');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const searchEntries = async (query: string): Promise<Entry[]> => {
        // Implement search functionality using EntryManager
        // This would need to be added to EntryManager first
        return [];
    };

    return (
        <EntriesContext.Provider 
            value={{ 
                entries, 
                isLoading, 
                error,
                addEntry, 
                getEntry, 
                searchEntries 
            }}
        >
            {children}
        </EntriesContext.Provider>
    );
};

export const useEntries = () => {
    const context = useContext(EntriesContext);
    if (context === undefined) {
        throw new Error('useEntries must be used within an EntriesProvider');
    }
    return context;
};