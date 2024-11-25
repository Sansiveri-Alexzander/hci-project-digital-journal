import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Entry, Feeling } from '@/types/Entry';
import { Calendar, PenLine, Mic, Image } from 'lucide-react';
import { FEELINGS, ACTIVITIES } from '@/components/entry/FeelingActivityModal';

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

// Get colors based on entry type
const getEntryColors = (type: string) => {
    switch (type) {
        case 'text':
            return {
                background: 'bg-[#F2D0A4]/10',
                border: 'border-[#F2D0A4]/30',
                hover: 'hover:border-[#F2D0A4]/60',
                icon: 'text-[#F2D0A4]'
            };
        case 'audio':
            return {
                background: 'bg-[#69DC9E]/10',
                border: 'border-[#69DC9E]/30',
                hover: 'hover:border-[#69DC9E]/60',
                icon: 'text-[#69DC9E]'
            };
        case 'image':
            return {
                background: 'bg-[#7D80DA]/10',
                border: 'border-[#7D80DA]/30',
                hover: 'hover:border-[#7D80DA]/60',
                icon: 'text-[#7D80DA]'
            };
        default:
            return {
                background: 'bg-background',
                border: 'border-border',
                hover: 'hover:border-primary',
                icon: 'text-foreground'
            };
    }
};

function getFeelingIcon(feeling: Feeling) {
    return FEELINGS.find(f => f.id === feeling.id);
}

function getActivityIcon(activity: Activity) {
    return ACTIVITIES.find(a => a.id === activity.id);
}

const EntryCard: React.FC<EntryCardProps> = ({
                                                 entry,
                                                 onClick,
                                                 isReflectionTarget = false
                                             }) => {
    const { title, date, content, contentType, feelings, activities } = entry;
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
    const colors = getEntryColors(contentType);

    React.useEffect(() => {
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
                return (
                    <div className={`h-32 overflow-hidden rounded-md p-4 ${colors.background}`}>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                            {(content as string).substring(0, 150)}
                            {(content as string).length > 150 && '...'}
                        </p>
                    </div>
                );
            case 'image':
                return imageUrl ? (
                    <div className="aspect-video rounded-md overflow-hidden bg-muted">
                        <img
                            src={imageUrl}
                            alt="Entry preview"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                ) : (
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                );
            case 'audio':
                return (
                    <div className={`aspect-video ${colors.background} rounded-md p-6 flex flex-col items-center justify-center gap-4`}>
                        <div className="w-full flex items-center gap-4">
                            <Mic className={`h-8 w-8 ${colors.icon}`} />
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                <div className={`h-full w-2/3 ${colors.background}`} />
                            </div>
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

    const renderFeelingActivityIcons = () => {
        return (
            <div className="space-y-2">
                {feelings.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {feelings.map(feeling => {
                            const feelingIcon = getFeelingIcon(feeling);
                            return feelingIcon ? (
                                <span
                                    key={feeling.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#ed786b]/10 text-[#ed786b] rounded-full text-xs font-medium"
                                >
                                    {feelingIcon.icon}
                                    {feelingIcon.label}
                                </span>
                            ) : null;
                        })}
                    </div>
                )}

                {activities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {activities.map(activity => {
                            const activityIcon = getActivityIcon(activity);
                            return activityIcon ? (
                                <span
                                    key={activity.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#752239]/10 text-[#752239] rounded-full text-xs font-medium"
                                >
                                    {activityIcon.icon}
                                    {activityIcon.label}
                                </span>
                            ) : null;
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card
            className={`
                ${colors.background} ${colors.border} ${colors.hover}
                ${isReflectionTarget ? 'border-primary/50 border-2' : ''}
                ${onClick ? 'cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1' : ''}
                duration-300 border overflow-hidden
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
                        <div className={`flex items-center gap-1.5 ${colors.icon}`}>
                            {EntryTypeIcon[contentType]}
                            <span className="capitalize font-medium">{contentType}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(date).toLocaleDateString()}
                    </div>
                </div>

                <CardTitle className="text-lg font-semibold leading-tight line-clamp-1">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {renderContentPreview()}
                {renderFeelingActivityIcons()}
            </CardContent>
        </Card>
    );
};

export default EntryCard;