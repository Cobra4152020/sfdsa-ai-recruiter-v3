import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Configure different rate limiters
const loginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'login_attempt',
  points: 5, // Number of attempts
  duration: 60 * 15, // Per 15 minutes
  blockDuration: 60 * 60, // Block for 1 hour after limit exceeded
});

const apiLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'api_request',
  points: 100, // Number of requests
  duration: 60, // Per 1 minute
});

const adminLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'admin_request',
  points: 50, // Number of requests
  duration: 60, // Per 1 minute
});

// Progressive delay calculation
const calculateDelay = (numAttempts: number): number => {
  // Start with 1 second, double each time, cap at 30 seconds
  return Math.min(1000 * Math.pow(2, numAttempts - 1), 30000);
};

// Helper to get IP address from request
const getIP = (request: NextRequest): string => {
  const xff = request.headers.get('x-forwarded-for');
  return xff ? xff.split(',')[0] : '127.0.0.1';
};

// Rate limit middleware for login attempts
export async function loginRateLimit(request: NextRequest) {
  const ip = getIP(request);
  
  try {
    const rateLimitRes = await loginLimiter.consume(ip);
    
    // Add rate limit headers
    const headers = new Headers({
      'Retry-After': String(Math.ceil(rateLimitRes.msBeforeNext / 1000)),
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': String(rateLimitRes.remainingPoints),
      'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
    });

    // Calculate and apply progressive delay
    const delay = calculateDelay(5 - rateLimitRes.remainingPoints);
    await new Promise(resolve => setTimeout(resolve, delay));

    return { success: true, headers };
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const retryAfter = String(Math.ceil(error.msBeforeNext / 1000) || 3600);
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter,
              'X-RateLimit-Reset': new Date(Date.now() + (parseInt(retryAfter) * 1000)).toISOString(),
            },
          },
        ),
      };
    }
    throw error;
  }
}

// Rate limit middleware for API requests
export async function apiRateLimit(request: NextRequest) {
  const ip = getIP(request);
  
  try {
    const rateLimitRes = await apiLimiter.consume(ip);
    
    return {
      success: true,
      headers: new Headers({
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': String(rateLimitRes.remainingPoints),
        'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
      }),
    };
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const retryAfter = String(Math.ceil(error.msBeforeNext / 1000) || 60);
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter,
              'X-RateLimit-Reset': new Date(Date.now() + (parseInt(retryAfter) * 1000)).toISOString(),
            },
          },
        ),
      };
    }
    throw error;
  }
}

// Rate limit middleware for admin endpoints
export async function adminRateLimit(request: NextRequest) {
  const ip = getIP(request);
  
  try {
    const rateLimitRes = await adminLimiter.consume(ip);
    
    return {
      success: true,
      headers: new Headers({
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': String(rateLimitRes.remainingPoints),
        'X-RateLimit-Reset': new Date(Date.now() + rateLimitRes.msBeforeNext).toISOString(),
      }),
    };
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const retryAfter = String(Math.ceil(error.msBeforeNext / 1000) || 60);
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Admin rate limit exceeded. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter,
              'X-RateLimit-Reset': new Date(Date.now() + (parseInt(retryAfter) * 1000)).toISOString(),
            },
          },
        ),
      };
    }
    throw error;
  }
}

// Suspicious IP tracking
const suspiciousIPs = new Map<string, number>();

export async function trackSuspiciousIP(ip: string) {
  const count = (suspiciousIPs.get(ip) || 0) + 1;
  suspiciousIPs.set(ip, count);
  
  if (count >= 10) {
    // Block IP for 24 hours
    await loginLimiter.block(ip, 60 * 60 * 24);
    // Log suspicious activity
    console.error(`Blocked suspicious IP ${ip} for 24 hours after ${count} suspicious actions`);
  }
}

// Clear old suspicious IP records periodically
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  suspiciousIPs.clear();
}, 60 * 60 * 1000); // Clear every hour 