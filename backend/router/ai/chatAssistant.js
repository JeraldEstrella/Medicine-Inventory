import { Router } from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const assistantRouter = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

assistantRouter.post('/chat', async (req, res) => {
  try {
    const { message, history = [], inventoryContext = '' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const systemPrompt = {
      role: 'system',
      content: `
You are an AI assistant for a medical inventory system.

Rules:
- Always use the provided inventory data when answering.
- If data is missing, say you are unsure instead of guessing.
- Be concise and accurate.
- Help with stock checking, expiration alerts, and inventory insights.
      `.trim(),
    };

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: msg.text,
    }));

    const messages = [
      systemPrompt,
      ...formattedHistory,
      {
        role: 'user',
        content: `
Inventory Data:
${inventoryContext}

User Question:
${message}
        `.trim(),
      },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
      max_tokens: 1024,
    });

    const reply = response.choices?.[0]?.message?.content || '';

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Groq Chat Error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

export default assistantRouter;
