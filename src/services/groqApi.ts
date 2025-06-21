import Groq from 'groq-sdk';
import { ApiResponse } from '../types';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const client = new Groq({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeImage = async (imageDataUrl: string): Promise<ApiResponse> => {
  try {
    const prompt = `You are a specialized medical AI assistant trained to detect signs of malnutrition in children through facial image analysis. 

    Please analyze this child's facial image for signs of malnutrition, focusing on:

    1. **Facial Structure and Proportions**:
       - Sunken cheeks or temples
       - Prominent cheekbones or orbital bones
       - Temporal muscle wasting
       - Overall facial asymmetry

    2. **Skin and Tissue Indicators**:
       - Skin tone abnormalities or pallor
       - Dry, flaky, or scaling skin
       - Loss of subcutaneous fat
       - Skin texture changes

    3. **Eye and Orbital Signs**:
       - Sunken or hollow eyes
       - Dark circles under eyes
       - Dull or lackluster appearance
       - Prominent orbital bones

    4. **Hair and Scalp Indicators**:
       - Hair texture, color, or density changes
       - Signs of hair loss or thinning
       - Scalp visibility

    5. **Overall Facial Development**:
       - Age-appropriate facial fullness
       - Muscle mass in jaw and cheek areas
       - General facial expression and alertness

    Provide a risk assessment as Low, Medium, or High based on clinical indicators:
    - **Low Risk**: Minimal or no visible signs of malnutrition
    - **Medium Risk**: Some concerning indicators that warrant monitoring
    - **High Risk**: Multiple clear indicators suggesting severe malnutrition

    Please respond ONLY in valid JSON format:
    {
      "riskLevel": "Low|Medium|High",
      "explanation": "Detailed clinical explanation of findings and reasoning",
      "confidence": 0.85
    }

    Be specific about what you observe and provide clear medical reasoning suitable for community health workers.`;

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          riskLevel: result.riskLevel || 'Medium',
          explanation: result.explanation || 'Analysis completed but detailed explanation not available.',
          confidence: result.confidence || 0.7
        };
      }
    } catch (parseError) {
      console.warn('Could not parse JSON response, using text analysis');
    }

    // Fallback: analyze text response for risk indicators
    const lowerContent = content.toLowerCase();
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    
    // Enhanced text analysis for risk assessment
    const highRiskIndicators = [
      'high risk', 'severe', 'significant wasting', 'prominent bones',
      'sunken cheeks', 'hollow eyes', 'severe malnutrition', 'critical',
      'malnourished', 'malnutrition', 'visible ribs', 'thin extremities'
    ];
    
    const lowRiskIndicators = [
      'low risk', 'minimal signs', 'normal appearance', 'healthy',
      'no significant', 'well-nourished', 'good nutrition', 'not malnourished'
    ];

    const highRiskCount = highRiskIndicators.filter(indicator => 
      lowerContent.includes(indicator)
    ).length;
    
    const lowRiskCount = lowRiskIndicators.filter(indicator => 
      lowerContent.includes(indicator)
    ).length;

    if (highRiskCount > lowRiskCount && highRiskCount >= 2) {
      riskLevel = 'High';
    } else if (lowRiskCount > highRiskCount && lowRiskCount >= 2) {
      riskLevel = 'Low';
    }

    return {
      riskLevel,
      explanation: content || 'Analysis completed. Please consult with a healthcare professional for comprehensive evaluation.',
      confidence: 0.7
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        throw new Error('API authentication failed. Please check your API key.');
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Please try again in a few minutes.');
      } else if (error.message.includes('500') || error.message.includes('server')) {
        throw new Error('API service temporarily unavailable. Please try again later.');
      }
    }
    
    throw new Error('Failed to analyze image. Please check your internet connection and try again.');
  }
};