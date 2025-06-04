# API Documentation

## Authentication

### POST /api/auth/login

Authenticate a user and receive a JWT token.

```typescript
Request: {
  email: string;
  password: string;
}

Response: {
  token: string;
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
  }
}
```

### POST /api/auth/register

Register a new user account.

```typescript
Request:
{
  email: string
  password: string
  name: string
}

Response:
{
  success: boolean
  message: string
  userId?: string
}
```

## Chat API

### GET /api/chat/history

Retrieve chat history for the authenticated user.

```typescript
Response: {
  messages: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
    status?: "sent" | "delivered" | "read";
    attachments?: Array<{
      type: "image" | "file";
      url: string;
      name: string;
    }>;
  }>;
}
```

### POST /api/chat/message

Send a new message in the chat.

```typescript
Request:
{
  content: string
  attachments?: Array<{
    type: "image" | "file"
    url: string
    name: string
  }>
}

Response:
{
  message: {
    id: string
    content: string
    role: "user"
    timestamp: string
    status: "sent"
  }
}
```

### WebSocket /api/chat/ws

Real-time chat connection endpoint.

```typescript
// Connect with token
//your-domain/api/chat/ws?token=${jwt}

// Message format
ws: {
  type: "message" | "typing" | "read" | "error";
  payload: {
    // Varies by type
  }
}
```

## Badge System API

### GET /api/badges

Get all available badges.

```typescript
Response: {
  badges: Array<{
    id: string;
    name: string;
    description: string;
    points: number;
    type: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    requirements: string[];
  }>;
}
```

### GET /api/badges/user

Get user's badge progress.

```typescript
Response: {
  badges: Array<{
    id: string;
    progress: number;
    earned: boolean;
    earnedAt?: string;
    currentValue: number;
    maxValue: number;
  }>;
}
```

### POST /api/badges/progress

Update progress for a badge.

```typescript
Request: {
  badgeId: string;
  progress: number;
}

Response: {
  success: boolean;
  newProgress: number;
  badgeEarned: boolean;
}
```

### POST /api/badges/share

Share a badge achievement.

```typescript
Request: {
  badgeId: string;
  platform: "twitter" | "facebook" | "linkedin";
}

Response: {
  success: boolean;
  shareUrl: string;
}
```

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- Chat endpoints: 60 messages per minute
- Badge endpoints: 30 requests per minute

When rate limit is exceeded, the API returns:

```typescript
Response (429 Too Many Requests):
{
  error: "Rate limit exceeded"
  retryAfter: number // Seconds until limit resets
}
```

## Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  error: {
    code: string
    message: string
    details?: any
  }
}
```

Common error codes:

- `auth_required`: Authentication required
- `invalid_credentials`: Invalid login credentials
- `validation_error`: Invalid request data
- `rate_limit`: Rate limit exceeded
- `not_found`: Resource not found
- `server_error`: Internal server error

## WebSocket Events

### Client to Server

```typescript
// Start typing
{
  type: "typing_start"
}

// Stop typing
{
  type: "typing_stop"
}

// Mark messages as read
{
  type: "mark_read",
  payload: {
    messageIds: string[]
  }
}
```

### Server to Client

```typescript
// New message
{
  type: "message",
  payload: {
    id: string
    content: string
    role: "assistant"
    timestamp: string
  }
}

// Typing indicator
{
  type: "typing",
  payload: {
    isTyping: boolean
  }
}

// Badge earned
{
  type: "badge_earned",
  payload: {
    badgeId: string
    badgeName: string
    points: number
  }
}
```

## Environment Variables

Required environment variables:

```bash
# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h

# Database
DATABASE_URL=your-database-url

# Storage (for attachments)
STORAGE_BUCKET=your-storage-bucket
STORAGE_REGION=your-storage-region

# External Services
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```
