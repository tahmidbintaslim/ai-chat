'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => { }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
                    <p className="text-gray-600 mb-6">
                        The AI assistant encountered an unexpected error. This might be due to a model loading issue or memory constraints.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={reset}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Try again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Refresh page
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        If this problem persists, try using a different AI model or refresh your browser.
                    </p>
                </div>
            </div>
        </div>
    )
}
