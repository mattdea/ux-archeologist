// netlify/functions/chat.js
// Serverless proxy: receives { messages } from client, streams Groq SSE back.

export default async (req) => {
  const { messages } = await req.json()

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 150,
      temperature: 0.7,
      stream: true,
    }),
  })

  if (!groqRes.ok) {
    return new Response('Groq API error', { status: groqRes.status })
  }

  return new Response(groqRes.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
