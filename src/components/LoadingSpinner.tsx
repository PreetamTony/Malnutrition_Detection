import React from 'react';
import { Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = {
    small: 'p-2',
    medium: 'p-8',
    large: 'p-12'
  };

  if (size === 'small') {
    return (
      <div className={`animate-spin ${sizeClasses[size]}`}>
        <div className="border-2 border-gray-300 border-t-blue-600 rounded-full w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className={`text-center ${containerClasses[size]}`}>
      <div className="inline-flex items-center justify-center space-x-4">
        <div className="relative">
          <div className={`animate-spin ${sizeClasses[size]}`}>
            <div className="border-4 border-gray-200 border-t-blue-600 rounded-full w-full h-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
          </div>
        </div>
        <div className="text-left">
          <p className="text-lg font-semibold text-gray-900">Analyzing Image</p>
          <p className="text-sm text-gray-600">AI is processing the facial features...</p>
        </div>
      </div>
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-blue-800">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
          </div>
          <span>Processing with Meta LLaMA-4 Scout</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;