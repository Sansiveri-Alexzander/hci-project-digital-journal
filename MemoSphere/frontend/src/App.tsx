// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home } from '@/components/pages/Home.tsx';
import { AllEntries } from '@/components/pages/AllEntries';
import { Reflect } from '@/components/pages/Reflect';
import { EntryCreate } from '@/components/pages/EntryCreate';
import { ViewEntry } from '@/components/pages/ViewEntry';

// Mock data type definitions
export interface Entry {
    id: string;
    type: 'text' | 'audio' | 'image';
    content: string;
    date: string;
    title: string;
    feelings?: string[];
    activities?: string[];
}

// Mock initial entries
const INITIAL_ENTRIES: Entry[] = [
    {
        id: '1',
        type: 'text',
        content: 'This is a sample text entry.',
        date: new Date().toISOString(),
        title: 'First Entry',
        feelings: ['Happy', 'Productive'],
        activities: ['Work', 'Exercise']
    },
    {
        id: '2',
        type: 'audio',
        content: '/sample-audio.webm',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        title: 'Voice Note',
        feelings: ['Reflective'],
        activities: ['Planning']
    },
    {
        id: '3',
        type: 'image',
        content: '/api/placeholder/400/300',
        date: new Date(Date.now() - 172800000).toISOString(), // Day before yesterday
        title: 'Photo Memory',
        feelings: ['Grateful'],
        activities: ['Travel']
    }
];

import { createContext, useContext, useState } from 'react';

// Create context for entries
// Update the interface to reflect async operations
interface EntriesContextType {
    entries: Entry[];
    addEntry: (entry: Omit<Entry, 'id' | 'date'>) => Promise<void>;
    getEntry: (id: string) => Promise<Entry | undefined>;
    searchEntries: (query: string) => Promise<Entry[]>;
    isLoading: boolean;
    error: string | null;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

// Create provider component with proper error handling and loading states
export const EntriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial entries
    useEffect(() => {
        const fetchEntries = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8080/api/entries');
                if (!response.ok) {
                    throw new Error('Failed to fetch entries');
                }
                const data = await response.json();
                setEntries(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching entries:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntries();
    }, []);

    const addEntry = async (newEntry: Omit<Entry, 'id' | 'date'>) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) {
                throw new Error('Failed to create entry');
            }

            const savedEntry = await response.json();
            setEntries(prev => [savedEntry, ...prev]);
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
            const response = await fetch(`http://localhost:8080/api/entries/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return undefined;
                }
                throw new Error('Failed to fetch entry');
            }
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get entry');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const searchEntries = async (query: string): Promise<Entry[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/api/entries/search?query=${encodeURIComponent(query)}`
            );
            if (!response.ok) {
                throw new Error('Failed to search entries');
            }
            const results = await response.json();
            return results;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search entries');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <EntriesContext.Provider 
            value={{ 
                entries, 
                addEntry, 
                getEntry, 
                searchEntries,
                isLoading,
                error
            }}
        >
            {children}
        </EntriesContext.Provider>
    );
};

// Custom hook for using entries context
export const useEntries = () => {
    const context = useContext(EntriesContext);
    if (context === undefined) {
        throw new Error('useEntries must be used within an EntriesProvider');
    }
    return context;
};

const App = () => {
    return (
        <EntriesProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/entries" element={<AllEntries />} />
                    <Route path="/entries/:id" element={<ViewEntry />} />
                    <Route path="/reflect" element={<Reflect />} />
                    <Route path="/search" element={<ViewEntry />} />
                    <Route
                        path="/create/:type"
                        element={
                            <EntryCreate />
                        }
                    />
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </EntriesProvider>
    );
};

export default App;