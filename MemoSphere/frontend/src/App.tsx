// src/App.tsx
import React from 'react';
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
interface EntriesContextType {
    entries: Entry[];
    addEntry: (entry: Omit<Entry, 'id' | 'date'>) => void;
    getEntry: (id: string) => Entry | undefined;
    searchEntries: (query: string) => Entry[];
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

// Create provider component
export const EntriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES);

    const addEntry = (newEntry: Omit<Entry, 'id' | 'date'>) => {
        const entry: Entry = {
            ...newEntry,
            id: Date.now().toString(),
            date: new Date().toISOString()
        };
        setEntries(prev => [entry, ...prev]);
    };

    const getEntry = (id: string) => {
        return entries.find(entry => entry.id === id);
    };

    const searchEntries = (query: string) => {
        return entries.filter(entry =>
            entry.title.toLowerCase().includes(query.toLowerCase()) ||
            entry.content.toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <EntriesContext.Provider value={{ entries, addEntry, getEntry, searchEntries }}>
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