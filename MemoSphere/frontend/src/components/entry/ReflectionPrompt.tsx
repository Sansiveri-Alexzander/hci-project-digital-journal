import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const REFLECTION_PROMPTS = [
    "How do your feelings about this moment compare to when you first wrote about it?",
    "What new insights do you have about this experience now?",
    "What would you tell your past self about this moment?",
    "How has this experience influenced your current perspective?",
    "What lessons from this moment are still relevant today?",
    "What emotions arise when you reflect on this entry now?",
    "How has your understanding of this situation evolved?",
    "What growth do you notice when comparing then and now?",
];

const ReflectionPrompt: React.FC = () => {
    const getRandomPrompt = (): string => {
        const randomIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
        return REFLECTION_PROMPTS[randomIndex];
    };

    return (
        <Card className="bg-muted">
            <CardContent className="p-4 flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                    {getRandomPrompt()}
                </p>
            </CardContent>
        </Card>
    );
};

export default ReflectionPrompt;