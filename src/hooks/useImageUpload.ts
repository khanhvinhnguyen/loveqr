import { useState } from 'react';

export interface UploadedImage {
  originalName: string;
  key: string;
  url: string;
  size: number;
  type: string;
}

export interface PresignedUrlInfo {
  originalName: string;
  key: string;
  presignedUrl: string;
  publicUrl: string;
  type: string;
  size: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useImageUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const getPresignedUrls = async (files: File[]): Promise<PresignedUrlInfo[]> => {
    if (files.length === 0) {
      throw new Error('Không có file nào để tạo presigned URL');
    }

    if (files.length > 5) {
      throw new Error('Tối đa 5 ảnh được phép upload');
    }

    try {
      const fileInfos = files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }));

      const response = await fetch('/api/upload-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: fileInfos }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi tạo presigned URL');
      }

      const data = await response.json();
      return data.presignedUrls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi tạo presigned URL';
      throw new Error(errorMessage);
    }
  };

  const uploadFilesToS3 = async (files: File[]): Promise<UploadedImage[]> => {
    if (files.length === 0) {
      throw new Error('Không có file nào để upload');
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
    }));

    try {
      // Get presigned URLs
      const presignedUrls = await getPresignedUrls(files);
      
      // Upload files using presigned URLs
      const uploadPromises = files.map(async (file, index) => {
        const urlInfo = presignedUrls[index];
        
        const uploadResponse = await fetch(urlInfo.presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Lỗi upload file ${file.name}`);
        }

        return {
          originalName: urlInfo.originalName,
          key: urlInfo.key,
          url: urlInfo.publicUrl,
          size: urlInfo.size,
          type: urlInfo.type
        };
      });

      const uploadResults = await Promise.all(uploadPromises);
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        error: null,
      }));

      return uploadResults;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi upload không xác định';
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: errorMessage,
      }));

      throw error;
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
    });
  };

  return {
    uploadState,
    uploadFilesToS3,
    resetUpload,
  };
}; 