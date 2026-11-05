import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

  let html = ''
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebsiteAuditBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    const raw = await res.text()
    // Trim to first 15,000 chars - enough for Claude to work with
    html = raw.slice(0, 15000)
  } catch {
    html = '(Could not fetch the website HTML - analyzing from URL alone)'
  }

  const prompt = `You are a brutally honest website conversion expert. A business owner paid £9 for your honest audit. Do not hold back.

Website URL: ${url}
Website HTML (first 15,000 chars):
${html}

Return a JSON object with this exact structure - no markdown, no explanation, just valid JSON:
{
  "verdict": "one brutal sentence verdict on this website",
  "score": <integer 1-10>,
  "sections": [
    {
      "title": "First Impression",
      "rating": "poor" | "average" | "good",
      "finding": "specific finding - name actual problems, not generic observations",
      "fix": "specific actionable fix - not generic advice"
    },
    {
      "title": "Headline & Copy",
      "rating": "poor" | "average" | "good",
      "finding": "...",
      "fix": "..."
    },
    {
      "title": "Call to Action",
      "rating": "poor" | "average" | "good",
      "finding": "...",
      "fix": "..."
    },
    {
      "title": "Trust Signals",
      "rating": "poor" | "average" | "good",
      "finding": "...",
      "fix": "..."
    },
    {
      "title": "SEO Basics",
      "rating": "poor" | "average" | "good",
      "finding": "...",
      "fix": "..."
    }
  ],
  "top3fixes": [
    { "priority": 1, "fix": "specific fix", "impact": "why this matters for revenue" },
    { "priority": 2, "fix": "specific fix", "impact": "why this matters for revenue" },
    { "priority": 3, "fix": "specific fix", "impact": "why this matters for revenue" }
  ]
}

Rules:
- Be specific. If the headline is weak, quote it and say why.
- Do not use phrases like "consider", "you might want to", "it would be beneficial". Say what is wrong and what to do.
- Every fix must be something they can action this week.
- Rank top3fixes by revenue impact, not ease of implementation.`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const json = JSON.parse(text)
    return NextResponse.json(json)
  } catch {
    // Claude returned non-JSON - extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      return NextResponse.json(JSON.parse(match[0]))
    }
    return NextResponse.json({ error: 'Parse error', raw: text }, { status: 500 })
  }
}
