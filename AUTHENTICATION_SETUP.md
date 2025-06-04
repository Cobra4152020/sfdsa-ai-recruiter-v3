# Authentication Setup Guide

The login functionality requires Supabase environment variables to be properly configured.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Your Supabase Credentials

1. **Go to [Supabase](https://supabase.com)** and sign in to your account
2. **Select your project** or create a new one
3. **Navigate to Settings → API**
4. **Copy the values:**
   - **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon public)** → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Example .env.local File

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## For Vercel Deployment

Add the same environment variables to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add both variables with their values

## Testing the Authentication

After setting up the environment variables:

1. **Restart your development server** (`npm run dev`)
2. **Click the Login button** in the header
3. **The modal should open** without configuration errors
4. **Try creating an account** or signing in

## Troubleshooting

- **"Supabase URL is not configured"** → Check `NEXT_PUBLIC_SUPABASE_URL`
- **"Supabase anonymous key is not configured"** → Check `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **"Invalid login credentials"** → The account doesn't exist or password is wrong
- **"Email not confirmed"** → Check email for confirmation link

## Database Setup

The authentication system also expects these database tables:
- `users` table for storing user profiles
- `auth.users` table (automatically created by Supabase)

Refer to the database migration files in the `/migrations` folder for the complete schema. 