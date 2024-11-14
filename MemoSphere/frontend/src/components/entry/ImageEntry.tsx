// src/components/entry/ImageEntry.tsx
import React, { useState, useRef } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import Button from '../base/Button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageEntryProps {
    onSave: (data: { image: File, caption: string }) => void; // callback for when image is saved
    onBack: () => void; // callback for when user wants to go back
}

const ImageEntry: React.FC<ImageEntryProps> = ({ onSave, onBack }) => {
    // state management for the component
    const [image, setImage] = useState<string | null>(null); // stores the image preview url
    const [imageFile, setImageFile] = useState<File | null>(null); // stores the actual image file
    const [caption, setCaption] = useState(''); // stores the image caption
    const [isPending, setIsPending] = useState(false); // tracks save operation status

    // refs for accessing DOM elements and managing camera stream
    const fileInputRef = useRef<HTMLInputElement>(null); // reference to hidden file input
    const videoRef = useRef<HTMLVideoElement>(null); // reference to video element for camera
    const streamRef = useRef<MediaStream | null>(null); // reference to active camera stream

    // handles when user selects an image file
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            // create preview url for the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // initializes camera stream
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    // stops camera stream and cleans up resources
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    // captures image from camera stream
    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0);

            // convert canvas to blob and create file
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
                    setImageFile(file);
                    setImage(canvas.toDataURL('image/jpeg'));
                    stopCamera();
                }
            }, 'image/jpeg');
        }
    };

    // handles saving the image and caption
    const handleSave = async () => {
        if (!imageFile) return;

        try {
            setIsPending(true);
            await onSave({ image: imageFile, caption });
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
                    <h2 className="text-xl font-semibold">Image Entry</h2>
                    <Button
                        onClick={handleSave}
                        disabled={!image || isPending}
                    >
                        Save
                    </Button>
                </div>

                {/* main content area */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    {image ? (
                        // show image preview and caption input if image exists
                        <div className="space-y-4">
                            <img
                                src={image}
                                alt="Entry"
                                className="max-h-64 mx-auto rounded"
                            />
                            <textarea
                                className="w-full p-2 border rounded resize-none focus:ring-2
                           focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Add a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={3}
                            />
                        </div>
                    ) : (
                        // show upload/capture options if no image exists
                        <div className="space-y-4">
                            {streamRef.current ? (
                                // show camera view if stream is active
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="max-h-64 mx-auto rounded"
                                    />
                                    <Button
                                        className="mt-4"
                                        onClick={captureImage}
                                    >
                                        <Camera className="h-5 w-5 mr-2" />
                                        Capture
                                    </Button>
                                </div>
                            ) : (
                                // show upload/capture buttons if no stream
                                <>
                                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                                    <p>Click to upload or capture an image</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                    />
                                    <div className="flex gap-4 justify-center">
                                        <Button onClick={() => fileInputRef.current?.click()}>
                                            Upload Image
                                        </Button>
                                        <Button onClick={startCamera}>
                                            Take Photo
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageEntry;