// src/components/entry/ImageEntry.tsx
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImageEntryProps {
    onSave: (data: { image: File, caption: string }) => void;
}

const ImageEntry: React.FC<ImageEntryProps> = ({ onSave }) => {
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef<HTMLInputElement>();
    const videoRef = useRef<HTMLVideoElement>();
    const streamRef = useRef<MediaStream | null>(null);

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

    return (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
            {image ? (
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
                        onChange={(e) => {
                            setCaption(e.target.value);
                            if (imageFile) {
                                onSave({ image: imageFile, caption: e.target.value });
                            }
                        }}
                        rows={3}
                    />
                </div>
            ) : (
                <div className="space-y-4">
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageEntry;