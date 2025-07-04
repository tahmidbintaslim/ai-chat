import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'AI Chat Assistant',
    description: 'A beautiful AI chat application powered by Hugging Face models',
    keywords: ['AI', 'chat', 'assistant', 'Hugging Face', 'LLM'],
    authors: [{ name: 'AI Chat Assistant Team' }],
    creator: 'AI Chat Assistant',
    publisher: 'AI Chat Assistant',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen gradient-bg">
                    {children}
                </div>
            </body>
        </html>
    )
}
