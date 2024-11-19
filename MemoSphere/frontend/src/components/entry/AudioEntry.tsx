// src/components/entry/AudioEntry.tsx
import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AudioEntryProps {
    onSave: (data: { audio: Blob, title: string }) => void;
    onBack: () => void;
    title: string;
    onTitleChange: (title: string) => void;
}

const AudioEntry: React.FC<AudioEntryProps> = ({
    onSave,
    onBack,
    title,
    onTitleChange
}) => {
    // state management
    const [isRecording, setIsRecording] = useState(false); // tracks recording status
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // stores audio preview url
    const [showRestartDialog, setShowRestartDialog] = useState(false); // controls restart confirmation dialog
    const [isPending, setIsPending] = useState(false); // tracks save operation status
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    // refs for managing audio recording
    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // reference to media recorder
    const chunksRef = useRef<Blob[]>([]); // stores audio chunks during recording

    // starts audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onSave(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleRecordButton = () => {
        if (isRecording) {
            stopRecording();
        } else if (audioUrl) {
            setShowRestartDialog(true);
        } else {
            startRecording();
        }
    };

    const handleRestart = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
        onSave(null); // Clear the saved audio
        setShowRestartDialog(false);
        startRecording();
    };

    // handles saving audio recording
    const handleSave = async () => {
        if (!audioUrl) return;

        try {
            setIsPending(true);
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            await onSave({ audio: blob, title });
        } catch (error) {
            console.error('Error saving audio:', error);
        } finally {
            setIsPending(false);
        }
    };

    // render component UI
    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
                {/* header with back button, title and save button */}
                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" onClick={onBack}>
                        <X className="h-5 w-5" />
                    </Button>
                    
                    {/* Editable Title */}
                    <div className="relative">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setIsEditingTitle(false);
                                    }
                                }}
                                className="text-xl font-semibold bg-transparent border-b-2 border-primary outline-none px-2"
                                autoFocus
                            />
                        ) : (
                            <h2 
                                className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
                                onClick={() => setIsEditingTitle(true)}
                                title="Click to edit title"
                            >
                                {title || 'Untitled Entry'}
                            </h2>
                        )}
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={!audioUrl || isPending}
                    >
                        Save
                    </Button>
                </div>

                {/* recording interface */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        size="lg"
                        variant={isRecording ? "destructive" : "default"}
                        className="rounded-full h-20 w-20 flex items-center justify-center"
                        onClick={handleRecordButton}
                    >
                        {isRecording ? (
                            <Square className="h-8 w-8" />
                        ) : (
                            <Mic className="h-8 w-8" />
                        )}
                    </Button>

            <p className="text-gray-600">
                {isRecording ? "Recording..." : "Press to record"}
            </p>

            {audioUrl && (
                <audio
                    src={audioUrl}
                    controls
                    className="w-full max-w-md mt-4"
                />
            )}

            {/* Restart Dialog */}
            <Dialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start Over?</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">
                        Starting over will delete your current recording. Continue?
                    </p>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowRestartDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRestart}
                        >
                            Start Over
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AudioEntry;