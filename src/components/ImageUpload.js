import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';

const ImageUpload = ({ onImageSelect, currentImage, placeholder }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeImage = () => {
    onImageSelect(null);
  };

  return (
    <div className="image-upload">
      {currentImage ? (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(currentImage)}
            alt="Preview"
            className="preview-image"
          />
          <button
            type="button"
            onClick={removeImage}
            className="remove-button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            {isDragActive ? (
              <>
                <Upload className="w-8 h-8 text-blue-500" />
                <p>Drop the image here...</p>
              </>
            ) : (
              <>
                <Image className="w-8 h-8 text-gray-400" />
                <p>{placeholder || 'Click or drag to upload an image'}</p>
                <small>PNG, JPG, GIF up to 10MB</small>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .image-upload {
          width: 100%;
        }

        .dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .dropzone:hover,
        .dropzone.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .dropzone-content p {
          margin: 0;
          color: #6b7280;
          font-weight: 500;
        }

        .dropzone-content small {
          color: #9ca3af;
        }

        .image-preview {
          position: relative;
          display: inline-block;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .preview-image {
          width: 200px;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .remove-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .remove-button:hover {
          background: rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;