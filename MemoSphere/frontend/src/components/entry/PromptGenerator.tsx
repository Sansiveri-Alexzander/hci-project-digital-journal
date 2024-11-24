import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Sparkles } from "lucide-react";

interface PromptGeneratorProps {
    onPromptSelect: (prompt: string) => void;
}

const PROMPTS = [
    "What made you smile today?",
    "What's something you're looking forward to?",
    "Describe a challenge you faced today and how you handled it.",
    "What's something new you learned recently?",
    "Write about a person who influenced you positively.",
    "What's a goal you're working towards?",
    "Describe your perfect day.",
    "What's something you're grateful for today?",
    "What's a memory that made you laugh recently?",
    "How have you grown in the past year?",
    "What's something you'd like to improve about yourself?",
    "Describe a place that makes you feel peaceful.",
    "What advice would you give to your younger self?",
    "What's a recent accomplishment you're proud of?",
    "How do you feel right now and why?"
];

const PromptGenerator = ({ onPromptSelect }: PromptGeneratorProps) => {
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

    const getRandomPrompt = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * PROMPTS.length);
        } while (PROMPTS[randomIndex] === selectedPrompt);
        setSelectedPrompt(PROMPTS[randomIndex]);
        onPromptSelect(PROMPTS[randomIndex]);
    };

    return (
        <div className="flex items-center gap-4 justify-center">
            {selectedPrompt ? (
                <>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm italic text-muted-foreground">
                            {selectedPrompt}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={getRandomPrompt}
                        className="flex items-center gap-2"
                        size="sm"
                    >
                        <RefreshCw className="h-4 w-4" />
                        New Prompt
                    </Button>
                </>
            ) : (
                <Button 
                    variant="outline"
                    onClick={getRandomPrompt}
                    className="flex items-center gap-2"
                >
                    <Sparkles className="h-4 w-4" />
                    Generate Writing Prompt
                </Button>
            )}
        </div>
    );
};

export default PromptGenerator;