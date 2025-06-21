export interface Assessment {
  id: string;
  timestamp: Date;
  imageUrl: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  confidence: number;
}

export interface ApiResponse {
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  confidence: number;
}