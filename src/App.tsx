import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import AssessmentHistory from './components/AssessmentHistory';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeImage } from './services/groqApi';
import { saveAssessment, getAssessments } from './utils/storage';
import { Assessment, ApiResponse } from './types';
import { Brain, Stethoscope, Users, Shield } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>(() => getAssessments());

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedFile(null);
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Pass the full data URL with correct MIME type
      const result = await analyzeImage(selectedImage);
      
      setAnalysisResult(result);

      // Save assessment to localStorage
      const assessment: Assessment = {
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl: selectedImage,
        riskLevel: result.riskLevel,
        explanation: result.explanation,
        confidence: result.confidence
      };

      saveAssessment(assessment);
      setAssessments(getAssessments());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, selectedImage]);

  const handleNewAssessment = useCallback(() => {
    handleClearImage();
    setAnalysisResult(null);
    setError(null);
  }, [handleClearImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Malnutrition Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering community health workers with advanced AI technology to quickly assess 
            malnutrition risk in children through facial image analysis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clinical Accuracy</h3>
            <p className="text-gray-600">Advanced AI model trained on clinical data for reliable malnutrition assessment.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Focused</h3>
            <p className="text-gray-600">Designed specifically for community health workers in resource-limited settings.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600">Images processed securely with no data stored on external servers.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <ImageUpload 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClearImage={handleClearImage}
            />

            {/* Analysis Button */}
            {selectedImage && !analysisResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Analysis</h3>
                    <p className="text-gray-600">Click analyze to assess malnutrition risk using AI</p>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5" />
                        <span>Analyze Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Analysis Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResult && (
              <AnalysisResults 
                result={analysisResult}
                onNewAssessment={handleNewAssessment}
              />
            )}
          </div>

          {/* Assessment History Sidebar */}
          <div className="lg:col-span-1">
            <AssessmentHistory assessments={assessments} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;