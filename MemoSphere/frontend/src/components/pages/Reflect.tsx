import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';
import EntryCard from '../base/EntryCard';
import { REFLECTION_PROMPTS } from '../entry/PromptGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Reflect = () => {
    const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const navigate = useNavigate();
    const entryManager = new EntryManager();

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        const allEntries = await entryManager.getAllEntries();
        // Filter out entries that are already reflections
        const nonReflectionEntries = allEntries.filter(entry => !entry.isReflection);
        // Sort by date (oldest first)
        const sortedEntries = nonReflectionEntries.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEntries(sortedEntries);
        if (sortedEntries.length > 0) {
            setCurrentEntry(sortedEntries[0]);
            setRandomPrompt();
        }
    };

    const setRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
        setCurrentPrompt(REFLECTION_PROMPTS[randomIndex]);
    };

    const handleSkip = () => {
        setDirection('left');
        setTimeout(() => {
            if (entries.length > 1) {
                const nextEntries = entries.slice(1);
                setEntries(nextEntries);
                setCurrentEntry(nextEntries[0]);
                setRandomPrompt();
            } else {
                setCurrentEntry(null);
            }
            setDirection(null);
        }, 300);
    };

    const handleReflect = () => {
        setDirection('right');
        setTimeout(() => {
            if (currentEntry) {
                navigate(`/create/text?reflectOn=${currentEntry.id}`);
            }
        }, 300);
    };

    if (!currentEntry) {
        return (
            <div className="container mx-auto px-4 py-6">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6 text-center">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Entries to Reflect On</h3>
                        <p className="text-muted-foreground mb-4">
                            Create some entries first, then come back to reflect on them!
                        </p>
                        <Button onClick={() => navigate('/create/text')}>
                            Create an Entry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center">Find an Entry to Reflect On</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentEntry.id}
                            initial={{ 
                                x: direction === null ? 0 : direction === 'left' ? 300 : -300,
                                opacity: 0 
                            }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ 
                                x: direction === 'left' ? -300 : 300,
                                opacity: 0 
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full"
                        >
                            <EntryCard entry={currentEntry} mode="summary" />
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
                            >
                                <p className="text-lg text-center text-primary/80 italic">
                                    "{currentPrompt}"
                                </p>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-center gap-4 pt-6">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleSkip}
                            className="rounded-full h-16 w-16 p-0"
                        >
                            <X className="h-8 w-8 text-destructive" />
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Button
                            size="lg"
                            onClick={handleReflect}
                            className="rounded-full h-16 w-16 p-0 bg-primary/10 hover:bg-primary/20"
                        >
                            <ArrowRight className="h-8 w-8 text-primary" />
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </div>
    );
};