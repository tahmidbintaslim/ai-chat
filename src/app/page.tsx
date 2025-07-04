'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import ApiSetup from '@/components/ApiSetup'

export default function Home() {
  const [apiToken, setApiToken] = useState<string>('')
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('hf_token')
    if (savedToken) {
      setApiToken(savedToken)
    } else {
      setShowSetup(true)
    }
  }, [])

  const handleTokenSave = (token: string) => {
    localStorage.setItem('hf_token', token)
    setApiToken(token)
    setShowSetup(false)
  }

  return (
    <main className="container mx-auto p-4 min-h-screen">
      {showSetup ? (
        <ApiSetup onTokenSave={handleTokenSave} />
      ) : (
        <ChatInterface apiToken={apiToken} onShowSetup={() => setShowSetup(true)} />
      )}
    </main>
  )
}
