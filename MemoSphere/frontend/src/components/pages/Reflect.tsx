// src/pages/AllEntries.tsx
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Entry } from '@/types/Entry';
import { EntryManager } from '@/services/EntryManager';
import EntryCard from '../base/EntryCard';
import { REFLECTION_PROMPTS } from '../entry/PromptGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, PenLine, Check, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const Reflect = () => {
    const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const entryManager = new EntryManager();

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {

        const allEntries = await entryManager.getAllEntries();

        if (allEntries.length === 0) {
            setCurrentEntry(null);
            setHasCompletedCycle(false);
            return;
        }
    
        // Create a map to count reflections for each entry
        const reflectionCounts = new Map<string, number>();
        
        // Count reflections for each entry
        allEntries.forEach(entry => {
            if (entry.isReflection && entry.linkedEntryId) {
                const currentCount = reflectionCounts.get(entry.linkedEntryId) || 0;
                reflectionCounts.set(entry.linkedEntryId, currentCount + 1);
            }
        });
        
        // Prepare entries for sorting
        const entriesToSort = allEntries.map(entry => ({
            entry,
            reflectionCount: reflectionCounts.get(entry.id) || 0,
            date: new Date(entry.date).getTime()
        }));

        // Sort entries by reflection count (ascending) and then by date (oldest first)
        const sortedEntries = entriesToSort.sort((a, b) => {
            // First, compare by reflection count
            if (a.reflectionCount !== b.reflectionCount) {
                return a.reflectionCount - b.reflectionCount;
            }
            // If reflection counts are equal, sort by date
            return a.date - b.date;
        }).map(item => item.entry);

        
        setEntries(sortedEntries);
        if (sortedEntries.length > 0) {
            setCurrentEntry(sortedEntries[0]);
            setRandomPrompt();
            setHasCompletedCycle(false);
        }
    };

    const setRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
        setCurrentPrompt(REFLECTION_PROMPTS[randomIndex]);
    };

    // Modify handleSkip to handleNext
    const handleNext = () => {
        setDirection('left');
        setTimeout(() => {
            if (currentIndex < entries.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setCurrentEntry(entries[currentIndex + 1]);
                setRandomPrompt();
            } else {
                setCurrentEntry(null);
                setHasCompletedCycle(true);
            }
            setDirection(null);
        }, 300);
    };

    // Add handleBack function
    const handleBack = () => {
        if (currentIndex > 0) {
            setDirection('right');
            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
                setCurrentEntry(entries[currentIndex - 1]);
                setRandomPrompt();
                setDirection(null);
            }, 300);
        }
    };

    const handleRestartCycle = () => {
        loadEntries();
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
                        {hasCompletedCycle ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="relative mb-4">
                                    <Sparkles className="h-12 w-12 text-primary" />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="absolute -right-1 -top-1 bg-green-500 rounded-full p-1"
                                    >
                                        <Check className="h-4 w-4 text-white" />
                                    </motion.div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Reflection Cycle Complete!
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    You've gone through all your entries. You can start a new cycle or create a new entry if you haven't found what you're looking for.
                                </p>
                                <div className="flex gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button 
                                            onClick={handleRestartCycle}
                                            className="gap-2"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Start New Cycle
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => navigate('/create/text')}
                                            className="gap-2"
                                        >
                                            <PenLine className="h-4 w-4" />
                                            Create New Entry
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center"
                            >
                                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-xl font-semibold mb-2">
                                    No Entries to Reflect On
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Create some entries first, then come back to reflect on them!
                                </p>
                                <Button 
                                    onClick={() => navigate('/create/text')}
                                    className="gap-2"
                                >
                                    <PenLine className="h-4 w-4" />
                                    Create an Entry
                                </Button>
                            </motion.div>
                        )}
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
                <CardFooter className="flex flex-col items-center gap-6 pt-6">
                    <div className="flex justify-center gap-8">
                        {/* Back Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <Button
                                onClick={handleBack}
                                disabled={currentIndex === 0}
                                className={`rounded-full h-16 w-16 p-0 border-2 ${
                                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Previous entry"
                            >
                                <ArrowLeft className="h-8 w-8 text-muted-foreground" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Previous
                            </span>
                        </motion.div>

                        {/* Reflect Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <Button
                                onClick={handleReflect}
                                className="rounded-full h-16 w-16 p-0 bg-primary hover:bg-primary/90"
                                title="Reflect on this entry"
                            >
                                <Sparkles className="h-8 w-8 text-primary-foreground" />
                            </Button>
                            <span className="text-sm font-medium text-primary">
                                Reflect
                            </span>
                        </motion.div>

                        {/* Next Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <Button
                                onClick={handleNext}
                                className="rounded-full h-16 w-16 p-0 border-2"
                                title="Next entry"
                            >
                                <ArrowRight className="h-8 w-8 text-muted-foreground" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Next
                            </span>
                        </motion.div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Entry {currentIndex + 1} of {entries.length}</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};