import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

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
      "rating": "poor",
      "finding": "specific finding - name actual problems, not generic observations",
      "fix": "specific actionable fix - not generic advice"
    },
    {
      "title": "Headline & Copy",
      "rating": "poor",
      "finding": "...",
      "fix": "..."
    },
    {
      "title": "Call to Action",
      "rating": "average",
      "finding": "...",
      "fix": "..."
    },
    {
      "title": "Trust Signals",
      "rating": "poor",
      "finding": "...",
      "fix": "..."
    },
    {
      "title": "SEO Basics",
      "rating": "average",
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

Rating values must be exactly: "poor", "average", or "good".
Be specific. If the headline is weak, quote it and say why.
Do not use phrases like "consider" or "you might want to". Say what is wrong and what to do.
Every fix must be something they can action this week.
Rank top3fixes by revenue impact.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    return NextResponse.json(JSON.parse(clean))
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return NextResponse.json(JSON.parse(match[0]))
    return NextResponse.json({ error: 'Parse error' }, { status: 500 })
  }
}
