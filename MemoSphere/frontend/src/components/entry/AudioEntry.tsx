// src/components/entry/AudioEntry.tsx
import React, { useState, useRef } from 'react';
import { Mic, X, Square } from 'lucide-react';
import Button from '../base/Button';
import { Card, CardContent } from '@/components/ui/card';
import AlertDialog from '../base/AlertDialog';

// defines props for audio entry component
interface AudioEntryProps {
    onSave: (audioBlob: Blob) => void; // callback when audio is saved
    onBack: () => void; // callback to go back
}

const AudioEntry: React.FC<AudioEntryProps> = ({ onSave, onBack }) => {
    // state management
    const [isRecording, setIsRecording] = useState(false); // tracks recording status
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // stores audio preview url
    const [showRestartDialog, setShowRestartDialog] = useState(false); // controls restart confirmation dialog
    const [isPending, setIsPending] = useState(false); // tracks save operation status

    // refs for managing audio recording
    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // reference to media recorder
    const chunksRef = useRef<Blob[]>([]); // stores audio chunks during recording

    // starts audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            // handle new audio data
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            // handle recording stop
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    // stops audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // cleanup audio tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    // handles record button toggle
    const handleRecordToggle = () => {
        if (audioUrl) {
            setShowRestartDialog(true);
        } else if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // handles restarting recording
    const handleRestart = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
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
            await onSave(blob);
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
                    <h2 className="text-xl font-semibold">Audio Entry</h2>
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
                        onClick={handleRecordToggle}
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

                    {/* audio playback if recording exists */}
                    {audioUrl && (
                        <audio
                            src={audioUrl}
                            controls
                            className="w-full max-w-md mt-4"
                        />
                    )}
                </div>

                {/* restart confirmation dialog */}
                <AlertDialog
                    isOpen={showRestartDialog}
                    onClose={() => setShowRestartDialog(false)}
                    title="Start Over?"
                    description="Starting over will delete your current recording. Continue?"
                    cancelText="Cancel"
                    confirmText="Start Over"
                    onConfirm={handleRestart}
                />
            </CardContent>
        </Card>
    );
};

export default AudioEntry;