import React, { useState } from 'react';
import { History, Calendar, TrendingUp, Trash2, Eye } from 'lucide-react';
import { Assessment } from '../types';
import { clearAssessments } from '../utils/storage';

interface AssessmentHistoryProps {
  assessments: Assessment[];
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ assessments }) => {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all assessment history?')) {
      clearAssessments();
      window.location.reload();
    }
  };

  const getStatistics = () => {
    if (assessments.length === 0) return null;

    const riskCounts = assessments.reduce((acc, assessment) => {
      acc[assessment.riskLevel] = (acc[assessment.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgConfidence = assessments.reduce((sum, assessment) => sum + assessment.confidence, 0) / assessments.length;

    return {
      total: assessments.length,
      riskCounts,
      avgConfidence: Math.round(avgConfidence * 100)
    };
  };

  const stats = getStatistics();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <History className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assessment History</h3>
            <p className="text-sm text-gray-500">Recent evaluations</p>
          </div>
        </div>
        {assessments.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Clear history"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {assessments.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <History className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No assessments yet</p>
          <p className="text-sm text-gray-400">Your assessment history will appear here</p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          {stats && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Overview</h4>
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Assessments</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg. Confidence</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.avgConfidence}%</p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                {Object.entries(stats.riskCounts).map(([risk, count]) => (
                  <span key={risk} className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(risk)}`}>
                    {risk}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assessment List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(assessment.timestamp)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(assessment.riskLevel)}`}>
                    {assessment.riskLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={assessment.imageUrl}
                      alt="Assessment"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assessment.riskLevel} Risk Assessment
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(assessment.confidence * 100)}% confidence
                      </p>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Assessment Details</h3>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(selectedAssessment.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedAssessment.riskLevel)}`}>
                    {selectedAssessment.riskLevel}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(selectedAssessment.confidence * 100)}%
                  </span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Image:</span>
                  <img
                    src={selectedAssessment.imageUrl}
                    alt="Assessment"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block mb-2">Analysis:</span>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedAssessment.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;