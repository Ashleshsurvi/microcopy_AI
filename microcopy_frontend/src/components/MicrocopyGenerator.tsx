import React, { useState, useCallback } from 'react';
import { Copy, Wand2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { microcopyService } from '../services/api';
import { copyToClipboard } from '../utils/clipboard';
import { MicrocopyState } from '../types';

/**
 * Main Microcopy Generator component
 * Handles input, API calls, and displaying results
 */
const MicrocopyGenerator: React.FC = () => {
  const [state, setState] = useState<MicrocopyState>({
    inputText: '',
    tone: 'Formal',
    alternatives: [],
    isLoading: false,
    error: null,
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /**
   * Handle input text changes
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({
      ...prev,
      inputText: e.target.value,
      error: null, // Clear error when user types
    }));
  }, []);

  /**
   * Generate alternatives by calling the API
   */
  const handleGenerate = useCallback(async () => {
    if (!state.inputText.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter some text to generate alternatives' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, alternatives: [] }));

    try {
      const alternatives = await microcopyService.generateAlternatives(state.inputText.trim(), state.tone);
      setState(prev => ({ ...prev, alternatives, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate alternatives',
      }));
    }
  }, [state.inputText]);

  /**
   * Copy alternative text to clipboard
   */
  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await copyToClipboard(text);
      setCopiedIndex(index);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to copy text to clipboard',
      }));
    }
  }, []);

  /**
   * Handle Enter key press in textarea (with Cmd/Ctrl+Enter to generate)
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  const isInputValid = state.inputText.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Microcopy Generator
          </h1>
          <p className="text-lg text-gray-600">
            Transform your text into compelling alternatives with AI
          </p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
  <label style={{ marginRight: '0.5rem' }}>Tone:</label>
  <select
    value={state.tone}
    onChange={(e) =>
      setState((prev) => ({ ...prev, tone: e.target.value }))
    }
    style={{
      padding: '0.5rem',
      fontSize: '1rem',
    }}
  >
    <option value="Friendly">Friendly</option>
    <option value="Formal">Formal</option>
    <option value="Persuasive">Persuasive</option>
    <option value="Casual">Casual</option>
  </select>
</div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-100">
            <label htmlFor="input-text" className="block text-sm font-semibold text-gray-700 mb-3">
              Enter your text to rewrite
            </label>
            <textarea
              id="input-text"
              value={state.inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your text here... (Cmd/Ctrl+Enter to generate)"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-gray-900 placeholder-gray-500"
              disabled={state.isLoading}
            />
            
            {/* Generate Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={!isInputValid || state.isLoading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate Variations
                  </>
                )}
              </button>
            </div>
            
            {/* Hint */}
            {!state.isLoading && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Tip: Use Cmd/Ctrl+Enter to quickly generate alternatives
              </p>
            )}
          </div>

          {/* Results Section */}
          <div className="p-6">
            {/* Error Display */}
            {state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1">{state.error}</p>
              </div>
            )}

            {/* Loading State */}
            {state.isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                </div>
                <p className="text-gray-600">Generating creative alternatives...</p>
              </div>
            )}

            {/* Results */}
            {state.alternatives.length > 0 && !state.isLoading && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generated Alternatives ({state.alternatives.length})
                </h2>
                <div className="space-y-3">
                  {state.alternatives.map((alternative, index) => (
                    <div
                      key={index}
                      className="group bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-900 flex-1 mr-4 leading-relaxed">
                          {alternative}
                        </p>
                        <button
                          onClick={() => handleCopy(alternative, index)}
                          className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="hidden sm:inline">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!state.isLoading && state.alternatives.length === 0 && !state.error && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Wand2 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  Enter some text above and click "Generate Variations" to see alternatives
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Powered by AI • Made with ❤️ for better microcopy
          </p>
        </div>
      </div>
    </div>
  );
};

export default MicrocopyGenerator;