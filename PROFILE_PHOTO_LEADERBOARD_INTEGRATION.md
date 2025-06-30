# Profile Photo Leaderboard Integration

## Overview
Approved profile photos automatically integrate into all leaderboards throughout the SFDSA application. When users upload and get their profile photos approved, they will appear alongside their names in all leaderboard displays.

## How It Works

### 1. Photo Upload & Approval Process
- Users upload photos through `/profile/edit` page
- Photos are stored in Supabase storage bucket 'profile-photos'
- Admin reviews and approves/rejects photos through admin interface
- Approved photos update the `user_profiles.avatar_url` field

### 2. Leaderboard API Integration
The following APIs have been updated to fetch approved profile photos:

#### Main Leaderboard API (`/api/leaderboard`)
```sql
SELECT users.*, user_profiles.avatar_url 
FROM users 
LEFT JOIN user_profiles ON users.id = user_profiles.user_id
```

#### User Profile API (`/api/users/[id]/profile`)
```sql  
SELECT users.*, user_profiles.avatar_url
FROM users
LEFT JOIN user_profiles ON users.id = user_profiles.user_id
WHERE users.id = $1
```

### 3. Frontend Components
All leaderboard components already support avatars:
- `TriviaLeaderboard` - Shows photos in trivia rankings
- `AdvancedLeaderboard` - Main leaderboard with photos
- `EnhancedLeaderboard` - Enhanced leaderboard display
- `DonationLeaderboard` - Donation rankings with photos
- `UserProfileCard` - Profile cards with photos

### 4. Fallback Behavior
- If no approved photo exists: Shows default avatar with user initials
- If photo fails to load: Falls back to placeholder image
- Mock users: Use predefined avatar images

## Visual Integration

### Leaderboard Display
```
🏆 #1 Sarah Johnson [Photo] - 2,500 pts
🥈 #2 Michael Chen [Photo] - 2,200 pts  
🥉 #3 David Rodriguez [Default] - 1,800 pts
```

### Status Indicators
- ✅ Green checkmark badge for approved photos
- 📷 Default avatar icon for users without photos
- 🔄 Pending badge during approval process

## Benefits

### User Engagement
- Personalized leaderboards increase user connection
- Visual recognition encourages participation
- Profile photos make rankings more social

### Trust & Authenticity
- Admin-approved photos ensure appropriate content
- Real faces build community trust
- Professional appearance maintains SFDSA standards

## Implementation Status

✅ **Completed:**
- Database schema with photo approval system
- Profile photo upload interface
- Admin approval management
- API integration for main leaderboards
- Fallback handling for missing photos

🔄 **In Progress:**
- Trivia leaderboard API updates
- Additional leaderboard component optimizations

## Usage Examples

### Component Usage
```tsx
<Avatar className="h-10 w-10">
  <AvatarImage 
    src={user.avatar_url || "/placeholder.svg"} 
    alt={user.name} 
  />
  <AvatarFallback>
    {user.name.substring(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

### API Response
```json
{
  "id": "user-123",
  "name": "Sarah Johnson", 
  "avatar_url": "https://storage.supabase.co/profile-photos/approved/user-123.jpg",
  "points": 2500,
  "rank": 1
}
```

## Security & Privacy

### Admin Approval Required
- All photos must be approved before appearing publicly
- Inappropriate content is rejected with feedback
- Multiple review stages ensure quality control

### Privacy Controls  
- Users can remove photos at any time
- Photos are only visible after explicit approval
- Strict content guidelines enforced

---

This integration ensures that approved profile photos seamlessly appear across all leaderboard displays, creating a more engaging and personalized user experience while maintaining professional standards. 