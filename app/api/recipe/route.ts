import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { ingredients, prefs } = await req.json()

  if (!ingredients || ingredients.length === 0) {
    return NextResponse.json({ error: 'Няма въведени съставки' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Липсва API ключ' }, { status: 500 })
  }

  const prompt = `Ти си кулинарен асистент. Потребителят има следните съставки: ${ingredients.join(', ')}.
Предпочитания: тип ястие - ${prefs.type}, диета - ${prefs.diet}, трудност - ${prefs.diff}.
Предложи ЕДНА подходяща рецепта. Отговори САМО с валиден JSON обект (без markdown, без \`\`\`), в следния формат:
{"emoji":"","name":"","time":"","servings":"","difficulty":"","ingredients":[],"steps":[],"tip":""}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const text = (data.content || []).map((b: { text?: string }) => b.text || '').join('')
  const clean = text.replace(/```json|```/g, '').trim()
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')

  if (start === -1 || end === -1) {
    return NextResponse.json({ error: 'Невалиден отговор от AI' }, { status: 500 })
  }

  const recipe = JSON.parse(clean.slice(start, end + 1))
  return NextResponse.json(recipe)
}
