import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.98-6.084-2.555.636-.247 1.363-.445 2.134-.445C9.26 12 10.468 12.274 11.52 12.8A4.978 4.978 0 0112 13c.34 0 .672.033 1 .092A7.956 7.956 0 0117 15c.34 0 .672-.033 1-.092.636.247 1.363.445 2.134.445C18.926 15.353 17.66 16 16 16c-.34 0-.672-.033-1-.092A7.956 7.956 0 0112 17z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The page you're looking for doesn't exist. Let's get you back to chatting with our AI assistant!
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go to AI Chat
                    </Link>
                </div>
            </div>
        </div>
    )
}
