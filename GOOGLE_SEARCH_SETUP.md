# Google Custom Search API Setup for Sgt. Ken Internet Access

## Overview
To enable Sgt. Ken to access current information about SF Sheriff's Office and City/County benefits, you need to set up Google Custom Search API.

## Required Environment Variables
Add these to your `.env.local` file:

```env
# OpenAI Configuration (Already configured)
OPENAI_API_KEY=your_openai_api_key

# Google Custom Search API (MISSING - Required for Internet Access)
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_custom_search_api_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id
```

## Setup Steps

### 1. Enable Google Custom Search API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the "Custom Search API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key to `GOOGLE_CUSTOM_SEARCH_API_KEY`

### 2. Create Custom Search Engine
1. Go to [Google Custom Search Engine](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. Configure these settings:
   - **Sites to search**: Add these domains:
     - `sfsheriff.com`
     - `sf.gov`
     - `jobaps.com/sf`
     - `*.sf.gov`
     - `*.sfsheriff.com`
   - **Name**: "SF Sheriff's Office Information Search"
   - **Language**: English
4. After creation, go to "Setup" → "Basics"
5. Copy the "Search engine ID" to `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`

### 3. Configure Search Settings
In your Custom Search Engine control panel:
1. Go to "Setup" → "Advanced"
2. Enable "Search the entire web"
3. Set "SafeSearch" to "Moderate"
4. Enable "Image search" and "Web search"

### 4. Test the Setup
After adding the environment variables:
1. Restart your development server: `npm run dev`
2. Test Sgt. Ken with queries like:
   - "What are the current SF Sheriff salary ranges?"
   - "Latest SF Sheriff recruitment updates"
   - "Current SF city employee benefits"

## What This Enables

### ✅ Current SF Sheriff Information
- Real-time salary and benefits data
- Latest recruitment announcements
- Department news and updates
- Training program changes

### ✅ SF City/County Information  
- Current employee benefit packages
- Retirement system updates (SFERS)
- Housing assistance programs
- Government policy changes

### ✅ Enhanced AI Responses
- Bonus points for users (7 points vs 5 points)
- "Current info" indicator in chat
- More accurate and up-to-date answers
- Search results cited in responses

## Cost Information
- Google Custom Search API: **100 queries/day FREE**
- Additional queries: $5 per 1,000 queries
- Typical usage: 10-50 queries/day for small platform

## Fallback Behavior
Without API keys, Sgt. Ken will:
- Still function using built-in knowledge base
- Show "[Mock Web Search]" in logs
- Award standard points (5 instead of 7)
- Use static information from 2024

## Security Notes
- Never commit API keys to version control
- Use `.env.local` (already in .gitignore)
- Restrict API key usage to your domain in Google Cloud Console
- Monitor usage in Google Cloud Console

## Troubleshooting

### "Web Search functionality is currently unavailable"
- Check that both environment variables are properly set
- Verify API key is valid in Google Cloud Console
- Ensure Custom Search Engine is active

### "No results found from live search"
- Check Custom Search Engine configuration
- Verify domains are properly added
- Test search engine directly at cse.google.com

### API Quota Exceeded
- Monitor usage in Google Cloud Console
- Consider upgrading to paid tier if needed
- Implement caching for frequent queries

## Next Steps
1. Set up the API keys following steps above
2. Test with current SF Sheriff questions
3. Monitor logs for successful web searches
4. Consider adding more specific SF government domains 