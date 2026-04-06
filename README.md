# 🍳 Leftover Recipes

Уеб приложение за генериране на рецепти от налични съставки, базирано на Next.js и Claude AI.

## Бърз старт

### 1. Инсталирай зависимостите

```bash
npm install
```

### 2. Настрой API ключа

Копирай `.env.example` като `.env.local` и добави своя Anthropic API ключ:

```bash
cp .env.example .env.local
```

Редактирай `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...твоят-ключ...
```

Вземи API ключ от: https://console.anthropic.com

### 3. Стартирай локално

```bash
npm run dev
```

Отвори http://localhost:3000

---

## Деплойване във Vercel

1. Качи проекта в GitHub
2. Влез в [vercel.com](https://vercel.com) и импортирай репото
3. В настройките на проекта добави Environment Variable:
   - `ANTHROPIC_API_KEY` = твоят ключ
4. Натисни Deploy — готово!

---

## Структура на проекта

```
├── app/
│   ├── api/recipe/route.ts   # Server-side API route (пази API ключа)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── RecipeGenerator.tsx   # Главният компонент
├── .env.example              # Шаблон за environment variables
└── .gitignore                # .env.local е изключен автоматично
```

## Технологии

- **Next.js 14** — React framework
- **TypeScript** — type safety
- **Tailwind CSS** — стилизиране
- **Anthropic Claude API** — AI генериране на рецепти
