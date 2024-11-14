// src/components/base/EntryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EntryCardProps {
    title: string;
    date: string;
    preview: string;
    type: 'text' | 'audio' | 'image';
    onClick?: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({
                                                 title,
                                                 date,
                                                 preview,
                                                 type,
                                                 onClick
                                             }) => {
    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="text-sm text-gray-500">{date}</p>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">{type}</span>
                </div>
                <p className="text-gray-700 line-clamp-3">{preview}</p>
            </CardContent>
        </Card>
    );
};

export default EntryCard;