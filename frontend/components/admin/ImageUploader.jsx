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
            ? 'border-gold-400 bg-gold-400/10 shadow-lg' 
            : 'border-white/20 bg-charcoal-950/50 hover:bg-charcoal-950/80 hover:border-gold-400/50'
        }`}
      >
        <UploadCloud className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-gold-400' : 'text-warm-400'}`} />
        <h3 className="text-sm font-medium text-white mb-1">
          Glissez-déposez vos images ici
        </h3>
        <p className="text-xs text-warm-300 mb-4">
          PNG, JPG, WEBP jusqu&apos;à 5MB (Max 10 images)
        </p>
        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-all">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {/* Existing Images (from Cloudinary) */}
          {localExistingImages.map((img, idx) => (
            <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-warm-200 group">
              <Image 
                src={img.url} 
                alt="Existing property image" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">Déjà en ligne</span>
              </div>
              <button
                type="button"
                onClick={() => removeExistingImage(img.publicId, idx)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                title="Supprimer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New Upload Previews */}
          {previewUrls.map((url, idx) => (
            <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gold-300 shadow-sm group">
              <Image 
                src={url} 
                alt={`New preview ${idx}`} 
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
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
