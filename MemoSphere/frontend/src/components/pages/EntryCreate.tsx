import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextEntry, AudioEntry, ImageEntry } from '@/components/entry';
import FeelingActivityModal from '@/components/entry/FeelingActivityModal';
import { EntryManager } from '@/services/EntryManager';
import { ContentType, Feeling, Activity } from '@/types/Entry';

export const EntryCreate = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const entryManager = new EntryManager();
    
    const [showReflection, setShowReflection] = useState(false);
    const [pendingContent, setPendingContent] = useState<any>(null);
    const [entryTitle, setEntryTitle] = useState<string>('');

    const handleBack = () => {
        navigate('/');
    };


    const handleTitleChange = (newTitle: string) => {
        setEntryTitle(newTitle);
    };

    const handleInitialSave = async (content: any) => {
        setPendingContent(content);
        
        // If no title exists and hasn't been generated yet, set a default one
        if (!entryTitle) {
            const timestamp = new Date().toLocaleString();
            setEntryTitle(`${type?.charAt(0).toUpperCase()}${type?.slice(1)} Entry - ${timestamp}`);
        }
        
        setShowReflection(true);
    };

    const handleReflectionSave = async (feelingIds: string[], activityIds: string[]) => {
        try {
            // Convert feeling IDs to Feeling objects
            const feelings: Feeling[] = feelingIds.map(id => ({
                id,
                name: id, // Using ID as name for simplicity
                intensity: 1 // Default intensity
            }));

            // Convert activity IDs to Activity objects
            const activities: Activity[] = activityIds.map(id => ({
                id,
                name: id // Using ID as name for simplicity
            }));

            await entryManager.createEntry(
                type as ContentType,
                pendingContent,
                entryTitle,
                feelings,
                activities
            );
            
            navigate('/entries');
        } catch (error) {
            console.error('Error saving entry:', error);
            // TODO: Show error message to user
        }
    };

    const handleReflectionSkip = async () => {
        try {
            await entryManager.createEntry(
                type as ContentType,
                pendingContent,
                entryTitle,
                [], // Empty feelings array
                [] // Empty activities array
            );
            navigate('/entries');
        } catch (error) {
            console.error('Error saving entry:', error);
            // TODO: Show error message to user
        }
    };

    const getEntryTitle = () => {
        switch (type) {
            case 'text': return 'Text Entry';
            case 'audio': return 'Audio Entry';
            case 'image': return 'Image Entry';
            default: return 'New Entry';
        }
    };

    const renderEntryComponent = () => {
        const commonProps = {
            onBack: handleBack,
            onSave: handleInitialSave,
            title: entryTitle,
            onTitleChange: handleTitleChange
        };

        switch (type) {
            case 'text':
                return <TextEntry onSave={handleContentUpdate} />;
            case 'audio':
                return <AudioEntry onSave={handleContentUpdate} />;
            case 'image':
                return <ImageEntry onSave={handleContentUpdate} />;
            default:
                return <div>Invalid entry type</div>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <Card>
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <X className="h-5 w-5" />
                        </Button>
                        <h2 className="text-xl font-semibold">{getEntryTitle()}</h2>
                        <Button
                            onClick={handleSave}
                            disabled={!pendingContent.hasContent}
                        >
                            Save
                        </Button>
                    </div>

                    {/* Prompt Generator */}
                    <PromptGenerator />

                    {/* Entry Component */}
                    {renderEntryComponent()}
                </CardContent>
            </Card>
            {/* Reflection Modal */}
            <FeelingActivityModal
                isOpen={showReflection}
                onClose={() => setShowReflection(false)}
                onSave={handleReflectionSave}
                onSkip={handleReflectionSkip}
            />
        </div>
    );
};

export default EntryCreate;