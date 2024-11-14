// src/App.tsx
import React from 'react';
import { Layout } from './components/layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, PenLine, Camera } from "lucide-react";

const App = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Welcome Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Welcome to MemoSphere</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Choose how you'd like to capture your thoughts today
                        </p>
                    </CardContent>
                </Card>

                {/* Entry Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Text Entry Button */}
                    <Button
                        variant="outline"
                        className="h-40 flex flex-col items-center justify-center gap-4"
                    >
                        <PenLine className="h-10 w-10" />
                        <span className="text-lg font-semibold">Text Entry</span>
                    </Button>

                    {/* Audio Entry Button */}
                    <Button
                        variant="outline"
                        className="h-40 flex flex-col items-center justify-center gap-4"
                    >
                        <Mic className="h-10 w-10" />
                        <span className="text-lg font-semibold">Audio Entry</span>
                    </Button>

                    {/* Image Entry Button */}
                    <Button
                        variant="outline"
                        className="h-40 flex flex-col items-center justify-center gap-4"
                    >
                        <Camera className="h-10 w-10" />
                        <span className="text-lg font-semibold">Image Entry</span>
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default App;