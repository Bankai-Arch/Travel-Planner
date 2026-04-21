import { Response } from 'express';
import OpenAI from 'openai';
import { AuthRequest } from '../middleware/auth';
import Trip from '../models/Trip';
import { config } from '../config/env';
import { getWeatherInfo } from '../utils/weather';

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

// ─── AI Trip Planner ──────────────────────────────────────────────────────────
export const planTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { destination, days, budget, interests = [], travelStyle = 'balanced' } = req.body;

    // Fetch weather context
    const weatherInfo = await getWeatherInfo(destination);

    const systemPrompt = `You are an expert Indian travel planner.
Return ONLY valid JSON with no extra text, matching exactly this schema:
{
  "title": "string",
  "summary": "string",
  "totalEstimatedCost": number,
  "itinerary": [
    {
      "day": number,
      "theme": "string",
      "activities": [
        { "time": "string", "activity": "string", "cost": number, "tip": "string" }
      ]
    }
  ],
  "packingList": ["string"],
  "budgetBreakdown": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number
  }
}`;

    const userPrompt = `Plan a ${days}-day trip to ${destination}, India.
Budget: ₹${budget} total for ${days} days.
Interests: ${interests.join(', ') || 'general sightseeing'}.
Travel style: ${travelStyle}.
Weather: ${weatherInfo}.
Use realistic Indian Rupee costs. Be specific with place names.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const plan = JSON.parse(response.choices[0].message.content!);

    // Save to MongoDB
    const trip = await Trip.create({
      userId:      req.user!.id,
      destination,
      days,
      budget,
      weatherInfo,
      ...plan,
    });

    res.status(201).json({ success: true, trip });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Streaming AI Chatbot ─────────────────────────────────────────────────────
export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are a helpful Indian travel assistant. Give practical, concise advice.
Focus on Indian destinations, local culture, food, and budget travel tips.
Respond in the same language the user uses.`,
        },
        ...history.slice(-10),         // Keep last 10 messages for context
        { role: 'user', content: message },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

// ─── Budget Optimizer ─────────────────────────────────────────────────────────
export const optimizeBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { destination, days, budget, priorities } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a budget travel optimizer. Return ONLY valid JSON.',
        },
        {
          role: 'user',
          content: `Optimize a ₹${budget} budget for ${days} days in ${destination}.
Priorities: ${priorities?.join(', ') || 'balanced'}.
Return: { "tips": ["string"], "breakdown": { "accommodation": number, "food": number, "transport": number, "activities": number }, "savingOpportunities": ["string"] }`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
