// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, PenLine, Camera, Eye, Sparkles } from "lucide-react";
import { useEntries } from "@/hooks/useEntries";

export const Home = () => {
    const navigate = useNavigate();
    const { entries } = useEntries();
    const mostRecentEntry = entries.length > 0 ? entries[0] : null;

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Card */}
            <Card className="mb-8">
                <CardHeader className='text-center text-lg'>
                    <CardTitle>Welcome to MemoSphere</CardTitle>
                </CardHeader>
                <CardContent className='text-center'>
                    <p className="text-muted-foreground">
                        Choose how you'd like to capture your thoughts today
                    </p>
                </CardContent>
            </Card>

            {/* Most Recent Entry Card */}
            {mostRecentEntry && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Most Recent Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{mostRecentEntry.title}</p>
                        <p>{mostRecentEntry.content}</p>
                    </CardContent>
                </Card>
            )}

            {/* Entry Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Text Entry Button */}
                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-4 p-6 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => navigate('/create/text')}
                >
                    <PenLine className="h-8 w-8" />
                    <span>Text</span>
                </Button>

                {/* Audio Entry Button */}
                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-4 p-6 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => navigate('/create/audio')}
                >
                    <Mic className="h-10 w-10" />
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">Audio Entry</span>
                        <span className="text-sm text-muted-foreground">Record your voice</span>
                    </div>
                </Button>

                {/* Image Entry Button */}
                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-4 p-6 border-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => navigate('/create/image')}
                >
                    <Camera className="h-10 w-10" />
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">Image Entry</span>
                        <span className="text-sm text-muted-foreground">Capture a moment</span>
                    </div>
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
                <Button
                    className="p-4 border-2 flex-1 hover:bg-primary/5"
                    onClick={() => navigate('/entries')}
                >
                    <Eye />
                    <p>View All Entries</p>
                </Button>
                <Button
                    className="p-4 border-2 flex-1 hover:bg-primary/5"
                    variant="secondary"
                    onClick={() => navigate('/reflect')}
                >
                    <Sparkles />
                    <p>Reflect</p>
                </Button>
            </div>
        </div>
    );
};