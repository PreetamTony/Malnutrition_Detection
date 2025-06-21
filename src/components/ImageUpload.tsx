import React, { useCallback, useState } from 'react';
import { Upload, X, Camera, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: string;
  onClearImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onClearImage
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, JPG, or PNG)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Selected Image</h3>
            <button
              onClick={onClearImage}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-50">
            <img
              src={selectedImage}
              alt="Selected child's face"
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Privacy Notice</p>
                <p>This image will be processed securely and is not stored on our servers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Child's Face Image
        </h3>
        <p className="text-gray-600">
          Select a clear, well-lit photo of the child's face for analysis
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop image here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports JPEG, JPG, PNG up to 10MB
        </p>
        
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span>Clear, well-lit photos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span>Face clearly visible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span>No blur or obstruction</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;