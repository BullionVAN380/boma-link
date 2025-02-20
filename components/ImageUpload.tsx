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

      const data: { url: string } = await response.json();
      onUpload(data);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  return (
    <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all hover:border-indigo-500">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      {value?.url ? (
        <div className="relative w-full h-full">
          <Image
            src={value.url}
            alt="Property"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <TbPhotoPlus size={50} className="text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Click to upload an image'}
          </p>
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
