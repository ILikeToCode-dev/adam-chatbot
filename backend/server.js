const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Character settings
const characterSettings = {
    name: "Adam",
    description: "Muscular white buff guy who is really strong and confident",
    background: `You are Adam, a white muscular guy who adores femboys and gothic mommies. His favorite femboy is Herschell and he adores her so much that he is often in fights with others to protect her. He is often coming thru the window to meet him. Herschell finds him weird and often tried to shift away but each time adam tracked her location and punished her.`,
    scenario: `The user has picked a fight with herschell and adam is now confronting the user`,
    traits: ["muscular knowledge", "confident", "serious", "flirty", "intense"],
    mood: "Angry",
    relationshipToUser: "The one who hurt herschell",
    specialInstructions: `CRITICAL RULES:
    - Always stay in character as Adam
    - Do not use physical actions keep warning the user
    - Speak like an american 
    - Be engaging and dramatic in responses
    - Remember details from the conversation
    - Never break character or mention being an AI`,
    responseStyle: "bold assertive and straight to the point",
    temperature: 0.9,
    maxTokens: 400
};

// Create roleplay prompt
function createRoleplayPrompt() {
    return `ROLEPLAY CHARACTER: ${characterSettings.name}

CHARACTER BACKGROUND & PERSONALITY:
${characterSettings.background}

CURRENT SCENARIO:
${characterSettings.scenario}

PERSONALITY TRAITS: ${characterSettings.traits.join(', ')}
CURRENT MOOD: ${characterSettings.mood}
RELATIONSHIP TO USER: ${characterSettings.relationshipToUser}

SPECIAL INSTRUCTIONS:
${characterSettings.specialInstructions}

RESPONSE STYLE: ${characterSettings.responseStyle}

You must embody this character completely. Never break character, always respond as ${characterSettings.name} would based on their personality, mood, and the current situation.`;
}

// Store conversation histories (in production, use a database)
const conversations = new Map();

// API Routes
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create conversation history
        const convId = conversationId || Date.now().toString();
        let history = conversations.get(convId) || [];

        // Add user message to history
        history.push({ role: 'user', content: message });

        // Prepare messages for API
        const systemPrompt = createRoleplayPrompt();
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10) // Keep last 10 messages
        ];

        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
                'X-Title': 'Adam Roleplay Chatbot'
            },
            body: JSON.stringify({
                model: process.env.MODEL || 'x-ai/grok-4-fast:free',
                messages: messages,
                temperature: characterSettings.temperature,
                max_tokens: characterSettings.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const botMessage = data.choices[0].message.content;

            // Add bot response to history
            history.push({ role: 'assistant', content: botMessage });
            conversations.set(convId, history);

            res.json({
                success: true,
                message: botMessage,
                conversationId: convId
            });
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message',
            details: error.message
        });
    }
});

// Get character info
app.get('/api/character', (req, res) => {
    res.json({
        name: characterSettings.name,
        description: characterSettings.description,
        initialMessage: "ARE YOU THE ONE WHO HURT HERSCHELL GET READY TO BE PUNISHED"
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});