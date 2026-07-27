"use client";

import React, { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

export function ImageUploader({ existingImages = [], onFilesSelected, onFilesDeleted }) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [localExistingImages, setLocalExistingImages] = useState(existingImages);
  const [deletedPublicIds, setDeletedPublicIds] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    // Add to selected files state
    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    
    // Generate object URLs for preview
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
    
    // Notify parent
    onFilesSelected(newFiles);
  }, [selectedFiles, previewUrls, onFilesSelected]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeNewImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previewUrls];
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
    
    onFilesSelected(newFiles);
  };

  const removeExistingImage = (publicId, index) => {
    const updatedExisting = [...localExistingImages];
    updatedExisting.splice(index, 1);
    setLocalExistingImages(updatedExisting);
    
    const newDeleted = [...deletedPublicIds, publicId];
    setDeletedPublicIds(newDeleted);
    
    if (onFilesDeleted) {
      onFilesDeleted(newDeleted);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging 
            ? 'border-[#133E26] bg-[#133E26]/10 shadow-md' 
            : 'border-[#A8BAB1] bg-white hover:bg-[#EBF0EE] hover:border-[#133E26]/60'
        }`}
      >
        <UploadCloud className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-[#133E26]' : 'text-[#4A6455]'}`} />
        <h3 className="text-sm font-bold text-[#0B150F] mb-1">
          Glissez-déposez vos images ici (ou appuyez pour parcourir)
        </h3>
        <p className="text-xs text-[#52665A] mb-4 font-medium">
          PNG, JPG, WEBP jusqu&apos;à 5MB (Max 10 images)
        </p>
        <label className="cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-[#C5D2CB] rounded-xl shadow-sm text-sm font-bold text-[#133E26] bg-[#E2EAE5] hover:bg-[#D3DDD7] transition-all min-w-[180px] min-h-[44px]">
          <span>Parcourir les fichiers</span>
          <input 
            type="file" 
            className="sr-only" 
            multiple 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleFileInput}
          />
        </label>
      </div>

      {/* Previews */}
      {(existingImages.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-4">
          {/* Existing Images (from Cloudinary) */}
          {localExistingImages.map((img, idx) => (
            <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-[#C5D2CB] shadow-sm group">
              <Image 
                src={img.url} 
                alt={`Existing ${idx}`} 
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-1.5 left-2 text-[10px] text-white font-mono bg-[#133E26]/90 px-2 py-0.5 rounded font-bold">
                EN LIGNE
              </span>
              <button
                type="button"
                onClick={() => removeExistingImage(img.publicId, idx)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 sm:p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Supprimer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New Upload Previews */}
          {previewUrls.map((url, idx) => (
            <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#133E26] shadow-sm group">
              <Image 
                src={url} 
                alt={`New preview ${idx}`} 
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 sm:p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
