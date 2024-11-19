// src/components/entry/AudioEntry.tsx
import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AssemblyAI } from 'assemblyai';

interface AudioEntryProps {
    onSave: (audioBlob: Blob | null) => void;
}

const client = new AssemblyAI({
    apiKey: 'e00fcb246ffa4a358e10f30a2c7b392c',
  });

const AudioEntry: React.FC<AudioEntryProps> = ({ onSave }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const [transcription, setTranscription] = useState<string | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onSave(blob);
                chunksRef.current = [];
                setIsTranscribing(true);
                try {
                    const transcript = await transcribeAudio(blob);
                    setTranscription(transcript);
                } catch (error) {
                    console.error('Error during transcription:', error);
                } finally {
                    setIsTranscribing(false);
                }
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

    // handles audio transcription
    const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const response = await client.transcripts.transcribe({
            audio: new Uint8Array(arrayBuffer),
        });
        
        return response.text;
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

    return (
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
                {isRecording ? 'Recording...' : isTranscribing ? 'Transcribing...' : 'Press to record'}
            </p>

            {audioUrl && (
                <>
                <audio
                    src={audioUrl}
                    controls
                    className="w-full max-w-md mt-4"
                />
                {/* print transcript if recording successful */}
                {transcription && 
                        <p className="mt-4 text-gray-800">Transcript: {transcription}</p>}
                </>
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