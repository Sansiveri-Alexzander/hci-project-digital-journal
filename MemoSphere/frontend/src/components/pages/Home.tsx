// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, PenLine, Camera } from "lucide-react";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Card */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Welcome to MemoSphere</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Choose how you'd like to capture your thoughts today
                    </p>
                </CardContent>
            </Card>

            {/* Entry Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Text Entry Button */}
                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-4 p-6 hover:border-primary hover:bg-primary/5"
                    onClick={() => navigate('/create/text')}
                >
                    <PenLine className="h-10 w-10" />
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">Text Entry</span>
                        <span className="text-sm text-muted-foreground">Write your thoughts</span>
                    </div>
                </Button>

                {/* Audio Entry Button */}
                <Button
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center gap-4 p-6 hover:border-primary hover:bg-primary/5"
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
                    className="h-40 flex flex-col items-center justify-center gap-4 p-6 hover:border-primary hover:bg-primary/5"
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
                    className="flex-1"
                    onClick={() => navigate('/entries')}
                >
                    View All Entries
                </Button>
                <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => navigate('/reflect')}
                >
                    Reflect
                </Button>
            </div>
        </div>
    );
};