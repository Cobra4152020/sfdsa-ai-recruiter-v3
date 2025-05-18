# SFDSA AI Recruiter

An AI-powered recruitment platform for the San Francisco Deputy Sheriff's Association, featuring an interactive chat interface and gamified badge system.

## Features

### Chat Interface
- Real-time messaging with AI assistant (Sgt. Ken)
- Rich message formatting with Markdown support
- File and image attachments
- Message status indicators
- Typing indicators
- Auto-scrolling chat
- Rate limiting protection
- Error handling and reconnection

### Badge System
- Achievement tracking
- Progress visualization
- Requirement checklists
- Reward system
- Social sharing
- Unlock animations
- Timeline view
- Leaderboard integration

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Testing Library
- Jest

## Documentation

- [API Documentation](API.md) - Detailed API endpoints and usage
- [Component Documentation](#component-documentation) - UI component usage
- [Contributing Guidelines](#contributing) - How to contribute to the project

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-org/sfdsa-ai-recruiter.git
cd sfdsa-ai-recruiter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Component Documentation

### Chat Components

#### ChatMessage
Displays individual chat messages with support for:
- User/Assistant avatars
- Markdown formatting
- Image/file attachments
- Message status
- Timestamps

#### ChatInput
Message input component with:
- Text input
- File attachment
- Send button
- Character limit

### Badge Components

#### AchievementBadge
Displays achievement badges with:
- Multiple sizes (sm, md, lg, xl)
- Rarity levels
- Points display
- Earned/Unearned states

#### BadgeProgress
Shows progress towards badge completion:
- Progress bar
- Current/Max value
- Loading states
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.