import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw } from "lucide-react";

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

const PromptGenerator = () => {
    const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

    const generateNewPrompt = () => {
        const randomIndex = Math.floor(Math.random() * PROMPTS.length);
        setCurrentPrompt(PROMPTS[randomIndex]);
    };

    return (
        <div className="mb-6">
            {currentPrompt ? (
                <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                    <p className="flex-1 text-muted-foreground">
                        {currentPrompt}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={generateNewPrompt}
                        className="ml-2 h-8 w-8 shrink-0"
                        title="Try another prompt"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={generateNewPrompt}
                >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate Entry Prompt
                </Button>
            )}
        </div>
    );
};

export default PromptGenerator;