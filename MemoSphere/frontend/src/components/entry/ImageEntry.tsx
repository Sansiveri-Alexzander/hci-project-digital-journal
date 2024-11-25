import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ConfirmationModal from '@/components/entry/ConfirmationModal';

interface ImageEntryProps {
    onSave: (data: { image: File, caption: string }) => void;
}

const ImageEntry: React.FC<ImageEntryProps> = ({ onSave }) => {
    // State management remains the same
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraAvailable, setIsCameraAvailable] = useState(true);

    // Refs remain the same
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // All handlers remain the same
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                onSave({ image: file, caption });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const initializeCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsCameraOpen(true);
        } catch (err) {
            console.error('Error accessing camera:', err);
            setIsCameraAvailable(false);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');

            if (context) {
                context.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
                        setImageFile(file);
                        setImage(canvas.toDataURL('image/jpeg'));
                        onSave({ image: file, caption });
                        handleCloseCamera();
                    }
                }, 'image/jpeg');
            }
        }
    };

    const handleCloseCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const handleDeleteConfirm = () => {
        setImage(null);
        setImageFile(null);
        setCaption('');
        onSave({ image: null as unknown as File, caption: '' });
        setShowDeleteModal(false);
    };

    return (
        <div className="space-y-4">
            {image ? (
                <div className="space-y-4">
                    <div className="relative">
                        <img
                            src={image}
                            alt="Entry"
                            className="max-h-96 w-full object-contain rounded-lg border bg-background"
                        />
                        <div className="absolute top-4 right-4">
                            <Button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center px-4 py-2 gap-3 bg-red-600 hover:bg-red-700 text-white"
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="font-medium">Delete Image</span>
                            </Button>
                        </div>
                    </div>
                    <textarea
                        className="w-full p-2 border rounded-lg resize-none focus:ring-2
                                 focus:ring-ring focus:border-transparent outline-none min-h-[100px]"
                        placeholder="Add a caption..."
                        value={caption}
                        onChange={(e) => {
                            setCaption(e.target.value);
                            if (imageFile) {
                                onSave({ image: imageFile, caption: e.target.value });
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-muted-foreground mb-6">
                        Capture a photo or upload an image
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />
                    <div className="flex gap-4 justify-center">
                        {isCameraAvailable && (
                            <Button
                                onClick={() => initializeCamera()}
                                className="gap-2"
                            >
                                <Camera className="h-4 w-4" />
                                Take Photo
                            </Button>
                        )}
                        <Button
                            onClick={handleUploadClick}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Upload Image
                        </Button>
                    </div>
                </div>
            )}

            {/* Camera Dialog */}
            <Dialog open={isCameraOpen} onOpenChange={handleCloseCamera}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Take a Photo</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <Button
                            onClick={handleCloseCamera}
                            className="bg-secondary hover:bg-secondary/90"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCapture}>
                            Capture
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteModal(false)}
                title="Delete Image"
                description="Are you sure you want to delete this image? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default ImageEntry;