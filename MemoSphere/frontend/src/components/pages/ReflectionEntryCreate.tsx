import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';
import { ContentType, EntryContent } from '@/types/Entry';
import { PenLine, Mic, Image } from 'lucide-react';

interface ReflectionEntryCreateProps {
    onSave: (type: ContentType, content: EntryContent) => void;
}

const ReflectionEntryCreate: React.FC<ReflectionEntryCreateProps> = ({ onSave }) => {
    const [selectedType, setSelectedType] = useState<ContentType | null>(null);
    const [pendingContent, setPendingContent] = useState<EntryContent | null>(null);

    const handleContentUpdate = (content: EntryContent) => {
        setPendingContent(content);
    };

    const handleSave = () => {
        if (selectedType && pendingContent) {
            onSave(selectedType, pendingContent);
        }
    };

    const renderEntryComponent = () => {
        switch (selectedType) {
            case 'text':
                return <TextEntry onSave={handleContentUpdate} />;
            case 'audio':
                return <AudioEntry onSave={handleContentUpdate} />;
            case 'image':
                return <ImageEntry onSave={handleContentUpdate} />;
            default:
                return null;
        }
    };

    if (selectedType) {
        return (
            <Card>
                <CardContent className="p-6">
                    {renderEntryComponent()}
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
                    <Button 
                        variant="ghost" 
                        onClick={() => {
                            setSelectedType(null);
                            setPendingContent(null);
                        }}
                    >
                        Choose Different Format
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!pendingContent}
                    >
                        Save Reflection
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Choose Reflection Format</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Button
                        className="flex flex-col gap-2 h-24"
                        onClick={() => setSelectedType('text')}
                    >
                        <PenLine className="h-6 w-6" />
                        <span>Text</span>
                    </Button>
                    <Button
                        className="flex flex-col gap-2 h-24"
                        onClick={() => setSelectedType('audio')}
                    >
                        <Mic className="h-6 w-6" />
                        <span>Audio</span>
                    </Button>
                    <Button
                        className="flex flex-col gap-2 h-24"
                        onClick={() => setSelectedType('image')}
                    >
                        <Image className="h-6 w-6" />
                        <span>Image</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReflectionEntryCreate;