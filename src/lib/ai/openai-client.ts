/**
 * OpenAI Client
 * Configured OpenAI client instance
 * Following SRP: Only handles OpenAI client configuration
 */

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

/**
 * Get or create OpenAI client instance
 */
export function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  openaiClient = new OpenAI({
    apiKey,
    // Default timeout: 60 seconds
    timeout: 60000,
  });

  return openaiClient;
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

