/**
 * Web Search Tool
 * Implements web search functionality using Tavily API
 * Following SRP: Only handles web search logic
 */

import type {
  Tool,
  WebSearchParams,
  WebSearchData,
  ToolResult,
} from '@/types/tool.types';

// Tavily API response type
interface TavilyResponse {
  results: Array<{
    title: string;
    url: string;
    content: string;
    published_date?: string;
  }>;
}

// Web Search tool configuration
const WEB_SEARCH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

/**
 * Execute web search using Tavily API
 */
async function executeWebSearch(
  params: WebSearchParams
): Promise<ToolResult<WebSearchData>> {
  const startTime = Date.now();

  try {
    // Validate API key
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.error('[Web Search] TAVILY_API_KEY not configured');
      return {
        success: false,
        error: 'Web search is not configured. Please contact administrator.',
        executionTime: Date.now() - startTime,
      };
    }

    // Validate params
    if (!params.query || params.query.trim().length === 0) {
      return {
        success: false,
        error: 'Search query is required',
        executionTime: Date.now() - startTime,
      };
    }

    const maxResults = params.maxResults || 5;

    console.log('[Web Search] Executing search:', {
      query: params.query,
      maxResults,
    });

    // Call Tavily API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEB_SEARCH_TIMEOUT);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: params.query,
        max_results: maxResults,
        search_depth: 'basic',
        include_answer: false,
        include_raw_content: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Web Search] API error:', {
        status: response.status,
        error: errorText,
      });
      
      return {
        success: false,
        error: `Search failed: ${response.statusText}`,
        executionTime: Date.now() - startTime,
      };
    }

    const data: TavilyResponse = await response.json();

    // Transform results
    const results = data.results.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.content.substring(0, 300), // Truncate to 300 chars
      publishedDate: result.published_date,
    }));

    const executionTime = Date.now() - startTime;

    console.log('[Web Search] Success:', {
      query: params.query,
      resultCount: results.length,
      executionTime,
    });

    return {
      success: true,
      data: {
        query: params.query,
        results,
        totalResults: results.length,
      },
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[Web Search] Timeout:', {
        query: params.query,
        timeout: WEB_SEARCH_TIMEOUT,
      });
      return {
        success: false,
        error: 'Search request timed out',
        executionTime,
      };
    }

    // Handle other errors
    console.error('[Web Search] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      executionTime,
    };
  }
}

/**
 * Web Search tool with retry logic
 */
async function executeWithRetry(
  params: WebSearchParams,
  retriesLeft: number = MAX_RETRIES
): Promise<ToolResult<WebSearchData>> {
  const result = await executeWebSearch(params);

  // Retry on failure (except for validation errors)
  if (
    !result.success &&
    retriesLeft > 0 &&
    !result.error?.includes('required') &&
    !result.error?.includes('not configured')
  ) {
    console.log(`[Web Search] Retrying... (${retriesLeft} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
    return executeWithRetry(params, retriesLeft - 1);
  }

  return result;
}

/**
 * Web Search Tool Definition
 */
export const webSearchTool: Tool<WebSearchParams, WebSearchData> = {
  id: 'web_search',
  name: 'Web Search',
  description:
    'Search the web for real-time information on any topic. Returns a list of relevant search results with titles, URLs, and snippets.',
  
  // JSON schema for OpenAI function calling
  paramsSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query to execute',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of results to return (default: 5)',
        default: 5,
        minimum: 1,
        maximum: 10,
      },
    },
    required: ['query'],
  },
  
  execute: executeWithRetry,
};

