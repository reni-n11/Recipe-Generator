import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leftover Recipes — Какво готвим днес?',
  description: 'Въведи наличните съставки и намери перфектната рецепта',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  )
}
