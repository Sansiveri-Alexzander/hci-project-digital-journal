import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, X } from "lucide-react";

interface PromptGeneratorProps {
    onPromptSelect: (prompt: string) => void;
    reflection?: boolean;
    initialPrompt?: string | null;
}

export const PROMPTS = [
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

export const REFLECTION_PROMPTS = [
    "What would you tell yourself when you wrote this?",
    "How do you feel about this entry now?",
    "What progress have you made since this entry?",
    "What emotions come up when reading this entry now?",
    "What would you tell yourself if you could go back in time to before this entry?",
    "What would you do differently if you could go back in time to before this entry?",
    "What did you learn about yourself from this experience?",
    "How has this experience shaped you as a person?",
    "What would you do differently if faced with a similar situation in the future?",
    "What strengths did you use to overcome this challenge?",
    "How did this experience make you feel, and why?",
    "What did you discover about your values or priorities from this experience?",
    "How can you apply what you learned from this experience to other areas of your life?",
    "What advice would you give to someone facing a similar challenge?",
    "How has this experience influenced your goals or aspirations?",
    "What skills or knowledge did you gain from this experience?",
    "How did this experience impact your relationships with others?",
    "What did you find most challenging about this experience, and how did you overcome it?",
    "How has this experience changed your perspective on life or your priorities?",
    "What are you most proud of accomplishing from this experience?",
    "How did this experience align with or challenge your personal values or beliefs?",
    "What did you learn about resilience or perseverance from this experience?",
    "How can you use what you learned from this experience to help others?"
];

const PromptGenerator = ({ onPromptSelect, reflection = false, initialPrompt = null }: PromptGeneratorProps) => {
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(initialPrompt || null);

    const getRandomPrompt = () => {
        if (reflection) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
            } while (REFLECTION_PROMPTS[randomIndex] === selectedPrompt);
            setSelectedPrompt(REFLECTION_PROMPTS[randomIndex]);
            onPromptSelect(REFLECTION_PROMPTS[randomIndex]);
        } else {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * PROMPTS.length);
            } while (PROMPTS[randomIndex] === selectedPrompt);
            setSelectedPrompt(PROMPTS[randomIndex]);
            onPromptSelect(PROMPTS[randomIndex]);
        }
        
    };

    const clearPrompt = () => {
        setSelectedPrompt(null);
        onPromptSelect(''); // or null, depending on how you want to handle empty prompts
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
                        onClick={getRandomPrompt}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        New Prompt
                    </Button>

                    <Button
                        onClick={clearPrompt}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Remove Prompt
                    </Button>
                </>
            ) : (
                <Button 
                    onClick={getRandomPrompt}
                    className="flex items-center gap-2"
                >
                    <Sparkles className="h-4 w-4" />
                    {reflection ? "Get Reflection Prompt" : "Generate Prompt"}
                </Button>
            )}
        </div>
    );
};


export default PromptGenerator;