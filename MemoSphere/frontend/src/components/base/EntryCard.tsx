import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry } from '@/types/Entry';
import { Calendar, PenLine, Mic, Image, Heart, Activity } from 'lucide-react';

interface EntryCardProps {
    entry: Entry;
    onClick?: () => void;
    mode?: 'full' | 'summary';
    isReflectionTarget?: boolean;
}

const EntryTypeIcon = {
    'text': <PenLine className="h-4 w-4" />,
    'audio': <Mic className="h-4 w-4" />,
    'image': <Image className="h-4 w-4" />
};

const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick, mode = 'full', isReflectionTarget = false}) => {
    const { title, date, content, contentType, feelings, activities } = entry;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        if (contentType === 'image') {
            try {
                const imageContent = typeof content === 'string' 
                    ? JSON.parse(content)
                    : content;
                setImageUrl(imageContent.imageData);
            } catch (error) {
                console.error('Error parsing image content:', error);
            }
        } else if (contentType === 'audio' && typeof content === 'string') {
            setAudioUrl(content);
        }
    }, [content, contentType]);

    const renderContentPreview = () => {
        switch (contentType) {
            case 'text':
                if (mode === 'summary') {
                    return (
                        <div className="h-24 overflow-hidden">
                            <p className="text-gray-600 text-sm line-clamp-3">
                                {(content as string).substring(0, 150)}
                                {(content as string).length > 150 && '...'}
                            </p>
                        </div>
                    );
                }
                return (
                    <div className="h-32 overflow-hidden">
                        <p className="text-gray-600 text-sm line-clamp-5">
                            {content as string}
                        </p>
                    </div>
                );
            case 'image':
                return imageUrl ? (
                    <div className="aspect-[3/2] w-full rounded-md overflow-hidden bg-gray-100">
                        <img 
                            src={imageUrl}
                            alt="Entry preview" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                ) : (
                    <div className="aspect-[3/2] w-full rounded-md bg-gray-100 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                    </div>
                );
            case 'audio':
                return (
                    <div className="h-32 bg-gray-50 rounded-md p-4">
                        <div className="flex items-center justify-between mb-4">
                            <Mic className="h-6 w-6 text-primary" />
                            <div className="flex-1 mx-4">
                                <div className="h-1 bg-primary/20 rounded-full">
                                    <div className="h-1 bg-primary rounded-full w-2/3" />
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">00:00</span>
                        </div>
                        {audioUrl && (
                            <audio controls className="w-full mt-2">
                                <source src={audioUrl} type="audio/webm" />
                            </audio>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card
            className={`
                ${mode === 'summary' ? 'bg-muted/50' : ''} 
                ${isReflectionTarget ? 'border-primary/50 border-2' : ''}
                ${onClick ? 'cursor-pointer hover:shadow-md transition-all hover:-translate-y-1' : ''}
                duration-200 overflow-hidden
                group
            `}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        {isReflectionTarget && (
                            <span className="text-primary font-medium mr-2">
                                Reflecting on:
                            </span>
                        )}
                        <div className={`flex items-center gap-1.5 ${isReflectionTarget ? 'text-primary' : ''}`}>
                            {EntryTypeIcon[contentType]}
                            <span className="capitalize font-medium">{contentType}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(date).toLocaleDateString()}
                    </div>
                </div>
                
                <CardTitle className="text-lg leading-tight line-clamp-1">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-4">
                {renderContentPreview()}

                {(feelings.length > 0 || activities.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                        {feelings.map(feeling => (
                            <span
                                key={feeling.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium"
                            >
                                <Heart className="h-3 w-3" />
                                {feeling.name}
                            </span>
                        ))}
                        {activities.map(activity => (
                            <span
                                key={activity.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                            >
                                <Activity className="h-3 w-3" />
                                {activity.name}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EntryCard;