# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Beauty Review Reply Generator - 美容比較サイト向けネガティブレビュー自動返信システム

A web application that generates appropriate customer support replies for negative reviews on beauty comparison websites using Claude API.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Project Structure

```
replywise/
├── server.js           # Express backend server with Claude API integration
├── public/             # Static files served by Express
│   ├── index.html     # Main HTML file with beauty-themed UI
│   ├── css/
│   │   └── styles.css # Gradient-based beauty industry styling
│   └── js/
│       └── app.js     # Frontend JavaScript for UI interactions
├── .env.example       # Example environment variables
└── package.json       # Node.js dependencies and scripts
```

## Key Features

1. **Negative Review Input**: Users can input negative reviews or complaints
2. **Claude API Integration**: Automatically generates appropriate replies using Anthropic's Claude API
3. **Character Count**: Displays the character count of generated replies (target: 150-250 characters)
4. **Copy to Clipboard**: One-click copy functionality for generated replies
5. **Responsive Design**: Mobile-friendly interface with gradient aesthetics

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your Anthropic API key: `ANTHROPIC_API_KEY=your_key_here`
3. Optionally set PORT (defaults to 3000)

## API Endpoints

- `POST /api/generate-reply` - Generates a reply for the provided negative review
  - Request body: `{ "review": "negative review text" }`
  - Response: `{ "reply": "generated reply", "characterCount": number }`

## Development Notes

- The system uses Claude 3 Haiku model for fast response generation
- Frontend supports Ctrl+Enter for quick submission
- Copy button shows visual feedback on successful copy
- Error handling for both API failures and user input validation