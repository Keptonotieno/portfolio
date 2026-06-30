/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the reading time of a text based on word count.
 * Average reading speed is assumed to be 200 words per minute.
 * 
 * @param content The text content of the blog post
 * @returns A string representing the reading time (e.g., "5 min read")
 */
export function calculateReadingTime(content: string): string {
  if (!content || typeof content !== 'string') {
    return '1 min read';
  }
  
  const cleanText = content.trim();
  if (cleanText.length === 0) {
    return '1 min read';
  }
  
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Assuming average reading speed of 200 words per minute
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
}
