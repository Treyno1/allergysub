import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  onImageChange: (url: string | null) => void;
  className?: string;
}

export default function ImageUpload({ onImageChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or GIF file');
      return false;
    }

    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return false;
    }

    return true;
  };

  const uploadToSupabase = async (file: Blob, fileName: string, contentType: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .storage
        .from('recipe_images')
        .upload(`public/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType
        });

      if (error) {
        console.error('Upload failed:', error.message);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recipe_images')
        .getPublicUrl(`public/${fileName}`);

      console.log('Successfully uploaded image:', {
        path: `public/${fileName}`,
        publicUrl,
        bucket: 'recipe_images'
      });

      return publicUrl;
    } catch (error) {
      console.error('Upload function error:', error);
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('permission') || message.includes('unauthorized')) {
          throw new Error('Permission denied. Please check your access rights.');
        } else if (message.includes('network') || message.includes('connection')) {
          throw new Error('Network error. Please check your internet connection.');
        } else if (message.includes('bucket') || message.includes('not found')) {
          throw new Error('Storage bucket not found. Please contact support.');
        }
      }
      throw new Error('Failed to upload image. Please try again later.');
    }
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          0.8 // compression quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setError(null);
    setIsUploading(true);

    try {
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      let uploadedUrl: string;
      try {
        // Try compressing first
        const compressedImage = await compressImage(file);
        uploadedUrl = await uploadToSupabase(compressedImage, fileName, file.type);
      } catch (compressError) {
        console.warn('Image compression failed, trying original file:', compressError);
        // Fallback to original file if compression fails
        uploadedUrl = await uploadToSupabase(file, fileName, file.type);
      }

      onImageChange(uploadedUrl);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(`Upload failed: ${errorMessage}. Please try again.`);
      setPreview(null);
      onImageChange(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {!preview ? (
        <div className="flex flex-col items-center">
          <label
            htmlFor="recipe-image"
            className={`
              flex flex-col items-center justify-center w-full h-32
              border-2 border-dashed rounded-lg cursor-pointer
              transition-colors duration-200
              ${error ? 'border-red-300 bg-red-50' : ''}
              ${isUploading ? 'bg-gray-100 border-gray-300' : 'border-gray-300 hover:border-blue-500'}
            `}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                <span className="text-sm text-gray-500 mt-2">Uploading...</span>
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add a photo (optional)</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (max 5MB)</span>
              </>
            )}
          </label>
          <input
            id="recipe-image"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Recipe preview"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
              hover:bg-red-600 transition-colors duration-200"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 