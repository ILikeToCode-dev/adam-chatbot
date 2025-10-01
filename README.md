# ADAM - AI Roleplay Chatbot

A full-stack AI-powered roleplay chatbot featuring a muscular character named Adam. Built with Node.js, Express, and OpenRouter API integration.

## Features

- 🤖 AI-powered roleplay character with persistent personality
- 💬 Real-time chat interface with smooth animations
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Responsive design
- 💾 Conversation history management

## Tech Stack

**Frontend:**
- HTML5
- Tailwind CSS
- Vanilla JavaScript
- Material Symbols Icons

**Backend:**
- Node.js
- Express.js
- OpenRouter API (Grok-4-Fast)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ILikeToCode-dev/adam-chatbot.git
cd adam-chatbot
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
OPENROUTER_API_KEY=your_api_key_here
MODEL=x-ai/grok-4-fast:free
PORT=3000
APP_URL=http://localhost:3000
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
adam-chatbot/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── css/
│   │   └── styles.css    # Custom styles and animations
│   └── js/
│       └── app.js        # Frontend JavaScript logic
├── .gitignore
└── README.md
```

## API Endpoints

### `POST /api/chat`
Send a message to the chatbot
```json
{
  "message": "Hello Adam",
  "conversationId": "optional-id"
}
```

### `GET /api/character`
Get character information

### `GET /api/health`
Health check endpoint

## Customization

You can customize the character by editing the `characterSettings` object in `backend/server.js`:

```javascript
const characterSettings = {
    name: "Adam",
    description: "Character description",
    background: "Character background story",
    traits: ["trait1", "trait2"],
    mood: "Current mood",
    // ... more settings
};
```

## License

MIT License

## Author

Created by [ILikeToCode-dev](https://github.com/ILikeToCode-dev)
