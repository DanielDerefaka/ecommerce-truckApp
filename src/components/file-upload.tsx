"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { UploadDropzone } from "@/lib/uploadthing";


interface FileUploadProps {
  onChange: (urls: string[]) => void;
  value: string[];
}

export default function FileUpload({ onChange, value }: FileUploadProps) {
  const [images, setImages] = useState<string[]>(value || []);

  const onComplete = (res: { url: string }[]) => {
    const urls = res.map(image => image.url);
    const newImages = [...images, ...urls];
    setImages(newImages);
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  return (
    <div className="space-y-4 w-full">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            onComplete(res);
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Error:", error);
          alert(`Upload error: ${error.message}`);
        }}
        className="ut-button:bg-primary ut-label:text-primary ut-upload-loading:text-primary"
      />
      
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-rose-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:scale-110"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}