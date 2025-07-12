/**
 * Utility functions for clipboard operations
 */

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves when copy is successful
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Modern clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (!successful) {
      throw new Error('Copy command failed');
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    throw new Error('Failed to copy text to clipboard');
  }
};