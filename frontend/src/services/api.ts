import type { TranscriptRequest, TranscriptResponse, ErrorResponse } from '../types/api';

const API_BASE_URL = '/api';

export class ApiService {
  static async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
    const response = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ErrorResponse;
      throw new Error(error.message || 'An error occurred');
    }

    return data as TranscriptResponse;
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
