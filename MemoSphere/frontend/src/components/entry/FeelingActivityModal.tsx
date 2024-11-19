// src/components/reflection/FeelingActivityModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Sun, // Happy
    Cloud, // Sad
    Heart, // Grateful
    Zap, // Energetic
    Waves, // Calm
    Moon, // Tired
    Star, // Excited
    Wind, // Anxious
    Briefcase, // Work
    Dumbbell, // Exercise
    BookOpen, // Study
    Users, // Social
    Home, // Rest
    Palette, // Hobby
    Coffee, // Coffee
    Plane // Travel
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface FeelingActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (feelings: string[], activities: string[]) => void;
    onSkip: () => void;
}

const FEELINGS = [
    { id: 'happy', label: 'Happy', icon: <Sun className="h-6 w-6" />},
    { id: 'sad', label: 'Sad', icon: <Cloud className="h-6 w-6" />},
    { id: 'grateful', label: 'Grateful', icon: <Heart className="h-6 w-6" />},
    { id: 'energetic', label: 'Energetic', icon: <Zap className="h-6 w-6" />},
    { id: 'calm', label: 'Calm', icon: <Waves className="h-6 w-6" />},
    { id: 'tired', label: 'Tired', icon: <Moon className="h-6 w-6" />},
    { id: 'excited', label: 'Excited', icon: <Star className="h-6 w-6" />},
    { id: 'anxious', label: 'Anxious', icon: <Wind className="h-6 w-6" />},
];

const ACTIVITIES = [
    { id: 'work', label: 'Work', icon: <Briefcase className="h-6 w-6" /> },
    { id: 'exercise', label: 'Exercise', icon: <Dumbbell className="h-6 w-6" /> },
    { id: 'study', label: 'Study', icon: <BookOpen className="h-6 w-6" /> },
    { id: 'social', label: 'Social', icon: <Users className="h-6 w-6" /> },
    { id: 'rest', label: 'Rest', icon: <Home className="h-6 w-6" /> },
    { id: 'hobby', label: 'Hobby', icon: <Palette className="h-6 w-6" /> },
    { id: 'coffee', label: 'Coffee', icon: <Coffee className="h-6 w-6" /> },
    { id: 'travel', label: 'Travel', icon: <Plane className="h-6 w-6" /> },
];

const SelectionButton = ({
                             isSelected,
                             onClick,
                             icon,
                             label,
                             color
                         }: {
    isSelected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    color?: string;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "relative w-24 h-24 rounded-full flex flex-col items-center justify-center gap-2",
            "transition-all duration-300 ease-in-out",
            "hover:scale-105 active:scale-95",
            "focus:outline-none",
            isSelected
                ? "bg-primary/5 border-2 border-primary ring-2 ring-primary ring-offset-2"
                : "hover:bg-gray-50"
        )}
    >
        {/* Background Circle */}
        {isSelected && (
            <div className={cn(
                "absolute inset-0 rounded-full opacity-10",
                color
            )}/>
        )}

        {/* Emoji and Label Container */}
        <div className={cn(
            "flex flex-col items-center transition-transform duration-200",
            isSelected && "scale-110"
        )}>
            {/* Emoji */}
            <span className="text-2xl" role="img" aria-label={label}>
        {icon}
      </span>

            {/* Label */}
            <span className={cn(
                "text-xs font-medium mt-1 transition-colors duration-200",
                isSelected ? "text-primary" : "text-muted-foreground"
            )}>
        {label}
      </span>
        </div>
    </button>
);

const FeelingActivityModal: React.FC<FeelingActivityModalProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       onSave,
                                                                       onSkip
                                                                   }) => {
    const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [step, setStep] = useState<'feelings' | 'activities'>('feelings');

    const toggleFeeling = (feelingId: string) => {
        setSelectedFeelings(prev =>
            prev.includes(feelingId)
                ? prev.filter(id => id !== feelingId)
                : [...prev, feelingId]
        );
    };

    const toggleActivity = (activityId: string) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    const handleNext = async () => {
        if (step === 'feelings') {
            setStep('activities');
        } else if (step === 'activities') {
            try {
                await onSave(selectedFeelings, selectedActivities);
                onClose();
            } catch (error) {
                console.error('Error saving entry:', error);
                // Optionally show an error message to the user
            }
        }
    };

    const handleBack = () => {
        if (step === 'activities') {
            setStep('feelings');
        }
    };

    const handleReset = () => {
        setSelectedFeelings([]);
        setSelectedActivities([]);
        setStep('feelings');
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                    handleReset();
                }
            }}
        >
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {step === 'feelings' ? 'How are you feeling?' : 'What have you been up to?'}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {step === 'feelings'
                            ? 'Select all the emotions that apply'
                            : 'Select all the activities you did'}
                    </p>
                </DialogHeader>

                <div className="py-6">
                    {step === 'feelings' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
                            {FEELINGS.map((feeling) => (
                                <SelectionButton
                                    key={feeling.id}
                                    isSelected={selectedFeelings.includes(feeling.id)}
                                    onClick={() => toggleFeeling(feeling.id)}
                                    icon={feeling.icon}
                                    label={feeling.label}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
                            {ACTIVITIES.map((activity) => (
                                <SelectionButton
                                    key={activity.id}
                                    isSelected={selectedActivities.includes(activity.id)}
                                    onClick={() => toggleActivity(activity.id)}
                                    icon={activity.icon}
                                    label={activity.label}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                        {step === 'feelings'
                            ? `${selectedFeelings.length} feelings selected`
                            : `${selectedActivities.length} activities selected`
                        }
                    </div>
                    <div className="flex gap-2">
                        {step === 'activities' && (
                            <Button onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        <Button onClick={onSkip}>
                            Skip
                        </Button>
                        <Button onClick={handleNext} className="min-w-[80px]">
                            {step === 'feelings' ? 'Next' : 'Save'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FeelingActivityModal;