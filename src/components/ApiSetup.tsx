'use client'

import { ApiSetupProps } from '@/types'
import { ExternalLink, Key } from 'lucide-react'
import { useState } from 'react'

export default function ApiSetup({ onTokenSave }: ApiSetupProps) {
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid?: boolean
    message?: string
    error?: string
  } | null>(null)

  const validateToken = async () => {
    if (!token.trim()) {
      setValidationResult({ valid: false, message: 'Please enter a token first' })
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      const response = await fetch('/api/test-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiToken: token.trim() })
      })

      const result = await response.json()
      setValidationResult(result)
    } catch (error) {
      setValidationResult({
        valid: false,
        message: 'Failed to validate token',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return

    setIsLoading(true)

    // Simple validation - you could add more sophisticated validation here
    if (token.length < 10) {
      alert('Please enter a valid API token')
      setIsLoading(false)
      return
    }

    try {
      onTokenSave(token.trim())
    } catch (error) {
      console.error('Error saving token:', error)
      alert('Error saving token. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Key className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API Setup</h2>
          <p className="text-gray-600">
            To use this chat, you'll need a free Hugging Face API token
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mt-0.5">1</span>
                <span>
                  Go to{' '}
                  <a
                    href="https://huggingface.co/join"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                  >
                    huggingface.co/join
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>{' '}
                  and create a free account
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mt-0.5">2</span>
                <span>
                  Visit{' '}
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                  >
                    your tokens page
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mt-0.5">3</span>
                <span>Create a new token with <strong>"Inference"</strong> permissions (not just "Read")</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mt-0.5">4</span>
                <span>Paste your token below</span>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-1">⚠️ Important:</h4>
            <p className="text-sm text-blue-800">
              Your token must have <strong>"Inference"</strong> permissions to use AI models.
              Regular "Read" permissions are not sufficient for this chat application.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Hugging Face API Token
            </label>
            <input
              type="password"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your API token"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Token validation button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={validateToken}
              disabled={!token.trim() || isValidating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
            >
              {isValidating ? 'Validating...' : 'Test Token'}
            </button>

            {validationResult && (
              <div className={`p-3 rounded-lg text-sm ${validationResult.valid
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                <p>{validationResult.message}</p>
                {validationResult.error && (
                  <p className="mt-1 text-xs opacity-75">{validationResult.error}</p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!token.trim() || isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Token & Start Chatting'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your token is stored locally in your browser and never shared with anyone except Hugging Face.
          </p>
        </div>
      </div>
    </div>
  )
}
