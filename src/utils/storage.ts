import { Assessment } from '../types';

const STORAGE_KEY = 'malnutrition_assessments';

export const saveAssessment = (assessment: Assessment): void => {
  try {
    const existing = getAssessments();
    const updated = [assessment, ...existing].slice(0, 50); // Keep only last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving assessment:', error);
  }
};

export const getAssessments = (): Assessment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading assessments:', error);
    return [];
  }
};

export const clearAssessments = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing assessments:', error);
  }
};