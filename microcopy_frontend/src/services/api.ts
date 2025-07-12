import { MicrocopyRequest, MicrocopyResponse, ApiError } from '../types';

/**
 * API service for communicating with the Django backend
 */
class MicrocopyService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  /**
   * Generate microcopy alternatives from the backend
   * @param text - The input text to generate alternatives for
   * @returns Promise with alternatives array
   */
  async generateAlternatives(text: string, tone:string): Promise<string[]> {
    try {
      const payload: MicrocopyRequest = { text, tone };
      
      const response = await fetch(`${this.baseUrl}/api/generateMicrocopy/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MicrocopyResponse = await response.json();
      
      if (!data.alternatives || !Array.isArray(data.alternatives)) {
        throw new Error('Invalid response format from server');
      }

      return data.alternatives;
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : undefined,
      };
      
      throw apiError;
    }
  }
}

export const microcopyService = new MicrocopyService();