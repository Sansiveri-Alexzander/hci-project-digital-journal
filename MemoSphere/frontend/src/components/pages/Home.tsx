// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, PenLine, Camera, Eye, Sparkles } from "lucide-react";
import '@/styles/background-animation.css';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="animated-background" />

            <div className="container mx-auto px-4 py-6 relative z-10">
                {/* Welcome Card */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader className='text-center text-lg'>
                        <CardTitle>Welcome to MemoSphere</CardTitle>
                    </CardHeader>
                    <CardContent className='text-center'>
                        <p className="text-muted-foreground">
                            Choose how you'd like to capture your thoughts today
                        </p>
                    </CardContent>
                </Card>

                {/* Entry Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Text Entry Button */}
                    <Button
                        className="h-40 flex flex-col items-center justify-center gap-4 p-6 border-2 animated-button text-entry"
                        onClick={() => navigate('/create/text')}
                    >
                        <PenLine className="h-10 w-10" />
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">Text Entry</span>
                            <span className="text-sm">Write down your thoughts</span>
                        </div>
                    </Button>

                    {/* Audio Entry Button */}
                    <Button
                        className="h-40 flex flex-col items-center justify-center gap-4 p-6 border-2 animated-button audio-entry"
                        onClick={() => navigate('/create/audio')}
                    >
                        <Mic className="h-10 w-10" />
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">Audio Entry</span>
                            <span className="text-sm">Record your voice</span>
                        </div>
                    </Button>

                    {/* Image Entry Button */}
                    <Button
                        className="animated-button image-entry h-40 flex flex-col items-center justify-center gap-4 p-6 border-2"
                        onClick={() => navigate('/create/image')}
                    >
                        <Camera className="h-10 w-10" />
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">Image Entry</span>
                            <span className="text-sm">Capture a moment</span>
                        </div>
                    </Button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Button
                        className="h-32 flex flex-col items-center justify-center gap-3 p-6 border-2 animated-button view-entry"
                        onClick={() => navigate('/entries')}
                    >
                        <Eye className="h-8 w-8" />
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">View All Entries</span>
                            <span className="text-sm">Browse your journey</span>
                        </div>
                    </Button>
                    <Button
                        className="h-32 flex flex-col items-center justify-center gap-3 p-6 border-2 animated-button reflect-entry"
                        onClick={() => navigate('/reflect')}
                    >
                        <Sparkles className="h-8 w-8" />
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">Reflect</span>
                            <span className="text-sm">Review and contemplate</span>
                        </div>
                    </Button>
                </div>
            </div>
        </>
    );
};