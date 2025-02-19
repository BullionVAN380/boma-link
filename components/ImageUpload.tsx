'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { TbPhotoPlus } from 'react-icons/tb';

interface ImageUploadProps {
  onUpload: (value: { url: string }) => void;
  value?: { url: string };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  value
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();
      onUpload({ url: data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    }
  }, [onUpload]);

  return (
    <div className="relative">
      <div className={`relative cursor-pointer hover:opacity-70 border-dashed border-2 border-gray-300 p-20 flex flex-col justify-center items-center gap-4 text-gray-600 ${isUploading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload image"
        />
        
        {isUploading ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">Uploading...</div>
          </div>
        ) : (
          <>
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
          </>
        )}
        
        {value?.url && !isUploading && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              fill 
              style={{ objectFit: 'cover' }} 
              src={value.url} 
              alt="Property" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>
      
      {uploadError && (
        <div className="mt-2 text-red-500 text-sm">
          {uploadError}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
