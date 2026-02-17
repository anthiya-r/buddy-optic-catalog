'use client';

import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { cn } from '@/lib/utils';
import { ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './button';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (value.length + files.length > maxImages) {
        toast.error(`สามารถอัปโหลดได้สูงสุด ${maxImages} รูป`);
        return;
      }

      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<{ filename: string }>(
          API_URLS.ADMIN.UPLOAD.IMAGE,
          formData
        );

        if (response.success && response.data?.filename) {
          // Store only the filename, the full URL will be constructed when displaying
          uploadedUrls.push(response.data.filename);
        } else {
          toast.error(`อัปโหลด ${file.name} ไม่สำเร็จ: ${response.message}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast.success(`อัปโหลดสำเร็จ ${uploadedUrls.length} รูป`);
      }

      setIsUploading(false);
    },
    [value, onChange, maxImages]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      onChange(value.filter((_, index) => index !== indexToRemove));
    },
    [value, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleUpload(files);
      }
    },
    [disabled, isUploading, handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          disabled || isUploading
            ? 'bg-muted cursor-not-allowed'
            : 'hover:border-primary cursor-pointer',
          value.length >= maxImages && 'opacity-50'
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled || isUploading || value.length >= maxImages}
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={cn(
            'flex flex-col items-center gap-2',
            disabled || isUploading || value.length >= maxImages
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                กำลังอัปโหลด...
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                คลิกหรือลากไฟล์มาวางที่นี่
              </span>
              <span className="text-xs text-muted-foreground">
                รองรับ JPG, PNG, WebP (สูงสุด 5MB)
              </span>
              <span className="text-xs text-muted-foreground">
                {value.length}/{maxImages} รูป
              </span>
            </>
          )}
        </label>
      </div>

      {/* Preview Images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((filename, index) => (
            <div
              key={filename}
              className="relative aspect-square rounded-lg overflow-hidden border group"
            >
              <Image
                src={API_URLS.IMAGES.GET(filename)}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                  หลัก
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
