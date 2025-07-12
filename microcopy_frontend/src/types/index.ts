/**
 * API Response types for the Microcopy Generator
 */
export interface MicrocopyResponse {
  alternatives: string[];
}

/**
 * API Request payload
 */
export interface MicrocopyRequest {
  text: string;
  tone: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Component state for managing API calls
 */
export interface MicrocopyState {
  inputText: string;
  tone: string;
  alternatives: string[];
  isLoading: boolean;
  error: string | null;
}