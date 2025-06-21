import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, RotateCcw, Download, Share2 } from 'lucide-react';
import { ApiResponse } from '../types';

interface AnalysisResultsProps {
  result: ApiResponse;
  onNewAssessment: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onNewAssessment }) => {
  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return {
          color: 'green',
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-100 text-green-800',
          iconColor: 'text-green-600'
        };
      case 'Medium':
        return {
          color: 'yellow',
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-100 text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'High':
        return {
          color: 'red',
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-100 text-red-800',
          iconColor: 'text-red-600'
        };
      default:
        return {
          color: 'gray',
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getRiskConfig(result.riskLevel);
  const Icon = config.icon;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendations = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return [
          'Continue regular growth monitoring',
          'Maintain current feeding practices',
          'Schedule routine follow-up in 3 months',
          'Provide nutritional education to caregivers'
        ];
      case 'Medium':
        return [
          'Increase monitoring frequency to monthly',
          'Assess feeding practices and dietary intake',
          'Consider nutritional counseling',
          'Refer to nutritionist if available',
          'Follow up in 2-4 weeks'
        ];
      case 'High':
        return [
          'Immediate referral to healthcare facility',
          'Urgent nutritional assessment required',
          'Consider therapeutic feeding program',
          'Weekly monitoring recommended',
          'Caregiver education on urgent feeding needs'
        ];
      default:
        return ['Consult with supervisor for next steps'];
    }
  };

  const recommendations = getRecommendations(result.riskLevel);

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 shadow-sm`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`${config.badgeColor} p-3 rounded-full`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Analysis Complete</h3>
              <p className="text-gray-600">Assessment results and recommendations</p>
            </div>
          </div>
          <span className={`${config.badgeColor} px-4 py-2 rounded-full text-sm font-semibold`}>
            {result.riskLevel} Risk
          </span>
        </div>

        {/* Risk Level and Confidence */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">{result.riskLevel}</span>
              <span className="text-gray-500">Risk Level</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Confidence Score</h4>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                {Math.round(result.confidence * 100)}%
              </span>
              <span className="text-gray-500">Confidence</span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-lg p-4 border border-gray-100 mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Analysis Details</h4>
          <p className={`${config.textColor} leading-relaxed`}>{result.explanation}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onNewAssessment}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Assessment</span>
          </button>
          <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Download Report</span>
          </button>
          <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-gray-700 flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Important Notice</p>
            <p>This AI assessment is a screening tool and should not replace professional medical diagnosis. Always consult with healthcare professionals for comprehensive evaluation and treatment decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;