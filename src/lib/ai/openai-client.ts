/**
 * OpenAI Client
 * Configured OpenAI client instance
 * Following SRP: Only handles OpenAI client configuration
 */

import OpenAI from 'openai';
import { getOpenAIToolConfig } from '@/lib/tools/config-loader';

let openaiClient: OpenAI | null = null;
let cachedApiKey: string | null = null;

/**
 * Get or create OpenAI client instance
 * Reads configuration from database (with env fallback)
 */
export async function getOpenAIClient(): Promise<OpenAI> {
  // Get configuration from database (with env fallback)
  const config = await getOpenAIToolConfig();
  
  if (!config || !config.enabled) {
    throw new Error('OpenAI is not configured. Please contact administrator.');
  }

  const apiKey = config.api_key;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please contact administrator.');
  }

  // Recreate client if API key changed
  if (!openaiClient || cachedApiKey !== apiKey) {
    openaiClient = new OpenAI({
      apiKey,
      // Default timeout: 60 seconds
      timeout: 60000,
    });
    cachedApiKey = apiKey;
  }

  return openaiClient;
}

/**
 * Check if OpenAI is configured
 * Note: This checks env vars as a quick sync check. For accurate status, use getOpenAIClient() which checks database.
 */
export function isOpenAIConfigured(): boolean {
  // Quick check for env var (backward compatibility)
  // For accurate status, tools should check database config
  return !!process.env.OPENAI_API_KEY;
}

