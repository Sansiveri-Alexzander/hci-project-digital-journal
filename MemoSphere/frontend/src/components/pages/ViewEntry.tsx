// src/pages/ViewEntry.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, Activity } from 'lucide-react';

interface Entry {
    id: string;
    type: 'text' | 'audio' | 'image';
    content: string;
    date: string;
    title: string;
    feelings?: string[];
    activities?: string[];
}

export const ViewEntry = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Mock entry data
    const entry: Entry = {
        id: id || '',
        type: 'text',
        content: 'yapyapyap entry summary yapyapyap',
        date: new Date().toISOString(),
        title: 'Sample Entry',
        feelings: ['Happy', 'Grateful'],
        activities: ['Work', 'Exercise']
    };

    const renderContent = () => {
        switch (entry.type) {
            case 'text':
                return <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>;
            case 'audio':
                return (
                    <audio controls className="w-full mt-4">
                        <source src={entry.content} type="audio/webm" />

                    </audio>
                );
            case 'image':
                return (
                    <div className="mt-4">
                        <img
                            src={entry.content}
                            alt="Entry"
                            className="rounded-lg max-h-96 w-full object-cover"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            {/* Entry Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{entry.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(entry.date).toLocaleDateString()}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {renderContent()}

                    {/* Feelings and Activities */}
                    <div className="mt-6 space-y-4">
                        {entry.feelings && entry.feelings.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-primary" />
                                <div className="flex flex-wrap gap-2">
                                    {entry.feelings.map((feeling) => (
                                        <span
                                            key={feeling}
                                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                                        >
                      {feeling}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {entry.activities && entry.activities.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                <div className="flex flex-wrap gap-2">
                                    {entry.activities.map((activity) => (
                                        <span
                                            key={activity}
                                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                                        >
                      {activity}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/reflect?entryId=${entry.id}`)}
                    >
                        Reflect!
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};