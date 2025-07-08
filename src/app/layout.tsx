import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'AI Chat Assistant - Privacy-First Browser-Based AI',
    description: 'Educational AI chat assistant powered by Transformers.js. No API keys required, runs entirely in your browser with complete privacy.',
    keywords: ['AI', 'chat', 'assistant', 'transformers.js', 'privacy', 'browser-based', 'educational', 'huggingface', 'LLM'],
    authors: [{ name: 'AI Chat Assistant Team' }],
    creator: 'AI Chat Assistant',
    publisher: 'AI Chat Assistant',
    applicationName: 'AI Chat Assistant',
    category: 'education',
    classification: 'AI Assistant',
    openGraph: {
        title: 'AI Chat Assistant - Privacy-First Browser-Based AI',
        description: 'Educational AI chat assistant that runs entirely in your browser. No API keys, complete privacy.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Chat Assistant - Privacy-First Browser-Based AI',
        description: 'Educational AI chat assistant that runs entirely in your browser. No API keys, complete privacy.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
    },
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
