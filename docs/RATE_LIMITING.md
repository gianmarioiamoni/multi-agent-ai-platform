# Rate Limiting

## Overview

Rate limiting is implemented using **Upstash Redis** to protect the API from abuse and ensure fair usage. It tracks requests per user and endpoint using a high-performance, serverless Redis database.

## Configuration

Default rate limits are defined in `src/lib/rate-limiting/rate-limiter.ts`:

- **Agent Execution**: 10 requests per minute (sliding window)
- **Workflow Execution**: 5 requests per 5 minutes (sliding window)

These limits use the **sliding window** algorithm, which provides smooth rate limiting without abrupt resets.

## Implementation

### Technology Stack

- **Upstash Redis**: Serverless Redis database
- **@upstash/ratelimit**: Rate limiting library optimized for serverless
- **@upstash/redis**: Redis client for serverless environments

### Setup

1. Create an Upstash Redis database (see `docs/UPSTASH_SETUP.md`)
2. Add environment variables to `.env.local`:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```
3. Rate limiting will work automatically!

## Usage

Rate limiting is automatically applied to:

- `executeAgent()` - Agent execution server action
- `runWorkflow()` - Workflow execution server action

When a rate limit is exceeded, the user receives a clear error message indicating:
- How long to wait before retrying
- The current rate limit configuration

## Error Messages

When rate limited, users see messages like:

```
Rate limit exceeded. Please try again in X minute(s). 
You can make Y requests per Z minute(s).
```

## Fallback Behavior

If Upstash Redis is not configured:
- All requests are allowed (fail-open approach)
- A warning is logged to the console
- This allows development without Redis setup

**Production**: Always configure Upstash Redis for proper rate limiting.

## Algorithm: Sliding Window

The rate limiting uses a **sliding window** algorithm, which:
- ✅ Provides smooth rate limiting (no abrupt resets)
- ✅ Distributes requests evenly over the time window
- ✅ More accurate than fixed window
- ✅ Better user experience

Example: With 10 requests/minute limit:
- Request at 00:00:00 ✅
- Request at 00:00:05 ✅
- ...
- Request at 00:00:55 ✅ (10th request)
- Request at 00:01:00 ❌ (too soon, oldest request still in window)
- Request at 00:01:05 ✅ (oldest request has expired)

## Monitoring

You can monitor rate limiting in the Upstash dashboard:
- View request counts
- Monitor usage and quotas
- See performance metrics
- Track rate limit hits

## Testing

To test rate limiting:

1. Configure Upstash Redis (see `docs/UPSTASH_SETUP.md`)
2. Make multiple rapid requests to an endpoint
3. Verify that requests beyond the limit are rejected with appropriate error messages

## Cost

### Free Tier
- ✅ 10,000 requests/day
- ✅ Persistent database
- ✅ Perfect for development and small apps

### Paid Tier
- 💰 ~$0.20 per 1M requests
- No monthly fixed costs
- Pay-as-you-go pricing

## Migration from Database

This implementation replaced the previous database-backed rate limiting for better performance and scalability. The old database migration has been removed as it's no longer needed.

## Customization

To change rate limits, edit `src/lib/rate-limiting/rate-limiter.ts`:

```typescript
const agentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  // ...
});
```

Available algorithms:
- `Ratelimit.slidingWindow(requests, window)` - Smooth, recommended
- `Ratelimit.tokenBucket(tokens, refillInterval)` - Burst-friendly
- `Ratelimit.fixedWindow(requests, window)` - Simple, may have bursts
