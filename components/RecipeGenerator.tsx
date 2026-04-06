'use client'

import { useState } from 'react'

interface Recipe {
  emoji: string
  name: string
  time: string
  servings: string
  difficulty: string
  ingredients: string[]
  steps: string[]
  tip?: string
}

interface Prefs {
  type: string
  diet: string
  diff: string
}

const PREF_GROUPS = [
  {
    key: 'type',
    label: 'Тип ястие',
    options: ['Всичко', 'Закуска', 'Обяд', 'Вечеря', 'Десерт'],
  },
  {
    key: 'diet',
    label: 'Диета',
    options: ['Без ограничения', 'Вегетарианско', 'Веганско'],
  },
  {
    key: 'diff',
    label: 'Трудност',
    options: ['Всякаква', 'Лесно', 'Средно'],
  },
]

export default function RecipeGenerator() {
  const [inputVal, setInputVal] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [prefs, setPrefs] = useState<Prefs>({
    type: 'Всичко',
    diet: 'Без ограничения',
    diff: 'Всякаква',
  })
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)

  function addIngredient() {
    if (!inputVal.trim()) return
    const newItems = inputVal
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && !ingredients.includes(s))
    setIngredients((prev) => [...prev, ...newItems])
    setInputVal('')
  }

  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  }

  function setPref(key: string, value: string) {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  async function generate() {
    if (ingredients.length === 0) return
    setLoading(true)
    setRecipe(null)
    setError(null)

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, prefs }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Грешка')
      setRecipe(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Нещо се обърка. Опитай отново!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-10 gap-6 min-h-screen">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold text-gray-900 leading-tight mb-1">
          Какво готвим днес?
        </h1>
        <p className="text-gray-500 font-light text-base">
          Въведи наличните съставки и ще намерим идеалната рецепта
        </p>
      </div>

      {/* Ingredients */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xl">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Твоите съставки
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            placeholder="напр. яйца, домати, сирене..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-gray-400 placeholder-gray-400"
          />
          <button
            onClick={addIngredient}
            className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-xl text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-8">
          {ingredients.length === 0 ? (
            <span className="text-sm text-gray-400 italic py-1">
              Още няма добавени съставки
            </span>
          ) : (
            ingredients.map((ing, i) => (
              <span
                key={i}
                className="chip-enter inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border"
                style={{ background: '#EAF3DE', color: '#3B6D11', borderColor: '#C0DD97' }}
              >
                {ing}
                <button
                  onClick={() => removeIngredient(i)}
                  className="text-base leading-none opacity-70 hover:opacity-100 cursor-pointer"
                  style={{ color: '#639922' }}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xl">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          Предпочитания
        </p>
        <div className="flex flex-col gap-3">
          {PREF_GROUPS.map((group) => (
            <div key={group.key} className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-gray-500 w-20">{group.label}</span>
              {group.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPref(group.key, opt)}
                  className="text-xs px-3 py-1 rounded-full border transition-all cursor-pointer"
                  style={
                    prefs[group.key as keyof Prefs] === opt
                      ? { background: '#E6F1FB', color: '#185FA5', borderColor: '#85B7EB' }
                      : { background: 'transparent', color: '#6b7280', borderColor: '#e5e7eb' }
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={ingredients.length === 0 || loading}
        className="w-full max-w-xl py-3.5 font-serif text-lg rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: '#2C2C2A', color: '#F1EFE8' }}
      >
        {loading ? 'Търсим...' : 'Намери рецепта'}
      </button>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="spinner" />
          <p className="text-sm text-gray-400 italic">Търсим вкусна рецепта...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="w-full max-w-xl rounded-xl p-4 text-sm border"
          style={{ background: '#FCEBEB', color: '#791F1F', borderColor: '#F7C1C1' }}
        >
          {error}
        </div>
      )}

      {/* Recipe result */}
      {recipe && !loading && (
        <div className="result-enter bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xl">
          <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
            <span className="text-3xl leading-none flex-shrink-0">{recipe.emoji}</span>
            <div>
              <h2 className="font-serif text-xl font-semibold text-gray-900 leading-tight">
                {recipe.name}
              </h2>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {[`⏱ ${recipe.time}`, `🍽 ${recipe.servings}`, `⚡ ${recipe.difficulty}`].map((m) => (
                  <span
                    key={m}
                    className="text-xs text-gray-400 px-3 py-0.5 rounded-full border border-gray-200 bg-gray-50"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
            Продукти
          </p>
          <ul className="mb-5">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-gray-800 py-1.5 border-b border-gray-100"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#97C459' }}
                />
                {ing}
              </li>
            ))}
          </ul>

          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Начин на приготвяне
          </p>
          <ol className="flex flex-col gap-3 mb-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5"
                  style={{ background: '#F1EFE8', color: '#5F5E5A' }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-gray-800 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {recipe.tip && (
            <div
              className="rounded-lg p-3 text-sm border"
              style={{ background: '#FAEEDA', color: '#633806', borderColor: '#FAC775' }}
            >
              💡 {recipe.tip}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
