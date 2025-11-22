import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const MAX_FILE_SIZE = 500 * 1024; // 500KB (before compression)
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/x-icon',
  'image/webp'
];

interface UseIconUploadReturn {
  icon: string;
  preview: string;
  error: string;
  handleUpload: (file: File) => Promise<void>;
  removeIcon: () => void;
  setInitialIcon: (iconUrl: string) => void;
}

export const useIconUpload = (): UseIconUploadReturn => {
  const [icon, setIcon] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleUpload = async (file: File): Promise<void> => {
    // Reset error state
    setError('');

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PNG, JPG, SVG, ICO, WebP formats are supported');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size cannot exceed ${MAX_FILE_SIZE / 1024}KB`);
      return;
    }

    try {
      let processedFile = file;

      // SVG and ICO don't need compression, convert directly
      if (!['image/svg+xml', 'image/x-icon'].includes(file.type)) {
        // Compress image
        processedFile = await imageCompression(file, {
          maxSizeMB: 0.1, // Compress to max 100KB
          maxWidthOrHeight: 128, // Max dimension 128px
          useWebWorker: true,
          initialQuality: 0.8
        });
      }

      // Convert to Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;

          // Validate if it's a valid image (by creating an Image object)
          const img = new Image();
          img.onload = () => resolve(result);
          img.onerror = () => reject(new Error('Invalid image file'));
          img.src = result;
        };
        reader.onerror = () => reject(new Error('Failed to read image, please try again'));
        reader.readAsDataURL(processedFile);
      });

      setIcon(base64);
      setPreview(base64);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image, please try again';
      setError(errorMessage);
      console.error('Icon upload error:', err);
    }
  };

  const removeIcon = () => {
    setIcon('');
    setPreview('');
    setError('');
  };

  const setInitialIcon = (iconUrl: string) => {
    setIcon(iconUrl);
    setPreview(iconUrl);
    setError('');
  };

  return {
    icon,
    preview,
    error,
    handleUpload,
    removeIcon,
    setInitialIcon
  };
};
