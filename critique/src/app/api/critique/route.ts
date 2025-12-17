import type { NextRequest } from 'next/server';


const GITHUB_AI_URL = 'https://api.github.com/ai/v1/completions';
const MODEL = 'gpt-4.1-turbo';
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

  try {
    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a concise, logical, and safe creative critique assistant. Reference core design principles. Respond in paragraph form.' },
        { role: 'user', content: input }
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.2,
      top_p: 1,
      n: 1,
      stream: false
    };

    const res = await fetch(GITHUB_AI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: res.statusText || 'AI API error' }), { status: res.status });
    }

    const data = await res.json();
    const aiMessage = data.choices?.[0]?.message?.content?.trim() || 'empty response';
    return new Response(JSON.stringify({ message: aiMessage }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), { status: 502 });
  }
}
