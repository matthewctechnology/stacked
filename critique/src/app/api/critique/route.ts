import type { NextRequest } from 'next/server';
import OpenAI from 'openai';


const ENDPOINT = 'https://models.github.ai/inference';
const MODEL = 'openai/gpt-4.1';
const MAX_TOKENS = 256;

export async function POST(req: NextRequest) {
  const { input } = await req.json();
  if (!input || typeof input !== 'string' || input.length > 256) {
    return new Response(JSON.stringify({ error: 'invalid input' }), { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'server misconfigured' }), { status: 500 });
  }

  const systemMessage = ''.concat(
    'You are a concise, logical, and safe creative critique assistant. ',
    'Reference core design principles. ',
    'Respond with one to three sentences in paragraph form.'
  );

  const userMessage = input;

  try {
    const openai = new OpenAI({
      apiKey: token,
      baseURL: ENDPOINT
    });

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.2,
      top_p: 1,
      n: 1,
      stream: false
    });

    const aiMessage = completion.choices?.[0]?.message?.content?.trim() || 'empty response';
    return new Response(JSON.stringify({ message: aiMessage }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), { status: 502 });
  }
}
