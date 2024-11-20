import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry } from '@/types/Entry';
import { Calendar, PenLine, Mic, Image, Heart, Activity } from 'lucide-react';

interface ReflectionCardProps {
    entry: Entry;
    className?: string;
}

const EntryTypeIcon = {
    'text': <PenLine className="h-4 w-4" />,
    'audio': <Mic className="h-4 w-4" />,
    'image': <Image className="h-4 w-4" />
};

const ReflectionCard: React.FC<ReflectionCardProps> = ({ entry, className }) => {
    const { title, date, content, contentType, feelings, activities } = entry;
    
    const getSummary = (content: string | Blob | File): string => {
        if (typeof content === 'string') {
            // For text entries, show first 150 characters
            return content.length > 150 ? `${content.substring(0, 150)}...` : content;
        }
        // For other types, show a placeholder
        return `[${contentType.toUpperCase()} Entry]`;
    };

    return (
        <Card className={className}>
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
                
                <CardTitle className="text-lg leading-tight">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-4">
                <p className="text-gray-600 text-sm">
                    {getSummary(content)}
                </p>

                {(feelings.length > 0 || activities.length > 0) && (
                    <div className="flex flex-wrap gap-2">
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

export default ReflectionCard;