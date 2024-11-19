import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry } from '@/types/Entry';
import { Calendar, PenLine, Mic, Image, Heart, Activity } from 'lucide-react';

interface EntryCardProps {
    entry: Entry;
    onClick?: () => void;
}

const EntryTypeIcon = {
    'text': <PenLine className="h-4 w-4" />,
    'audio': <Mic className="h-4 w-4" />,
    'image': <Image className="h-4 w-4" />
};

const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick }) => {
    const { title, date, content, contentType, feelings, activities } = entry;
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    
    useEffect(() => {
        if (contentType === 'image' && content instanceof Blob) {
            const url = URL.createObjectURL(content);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (contentType === 'image' && typeof content === 'string') {
            setImageUrl(content);
        }
    }, [content, contentType]);

    const renderContentPreview = () => {
        switch (contentType) {
            case 'text':
                return <p className="text-gray-600 text-sm line-clamp-3">{content as string}</p>;
            case 'image':
                return imageUrl ? (
                    <div className="aspect-[3/2] w-full rounded-md overflow-hidden bg-gray-100">
                        <img 
                            src={imageUrl}
                            alt="Entry preview" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-[3/2] w-full rounded-md bg-gray-100 flex items-center justify-center">
                        <Image className="h-8 w-8 text-gray-400" />
                    </div>
                );
            case 'audio':
                return (
                    <div className="flex items-center justify-center h-24 bg-gray-50 rounded-md">
                        <Mic className="h-8 w-8 text-gray-400" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 duration-200"
            onClick={onClick}
        >
            <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-primary">
                        {EntryTypeIcon[contentType]}
                        <span className="capitalize font-medium">{contentType}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(date).toLocaleDateString()}
                    </div>
                </div>
                
                <CardTitle className="text-lg leading-tight line-clamp-1">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-4">
                {renderContentPreview()}

                {(feelings.length > 0 || activities.length > 0) && (
                    <div className="flex flex-wrap gap-2 pt-2">
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