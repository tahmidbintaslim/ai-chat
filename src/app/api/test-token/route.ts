import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { apiToken } = await request.json()

        if (!apiToken) {
            return NextResponse.json(
                { error: 'API token is required' },
                { status: 400 }
            )
        }

        // Test with a simple, publicly available model
        const testResponse = await fetch('https://api-inference.huggingface.co/models/gpt2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: "Hello",
                parameters: {
                    max_new_tokens: 5
                }
            })
        })

        if (testResponse.ok) {
            return NextResponse.json({
                valid: true,
                message: 'API token is valid and working!'
            })
        } else {
            let errorData
            let errorMessage = 'API token validation failed'

            // Get response text first, then try to parse as JSON
            const responseText = await testResponse.text()

            try {
                errorData = JSON.parse(responseText)
                if (errorData.error && errorData.error.includes('sufficient permissions')) {
                    errorMessage = 'Your API token needs "Inference" permissions. Please create a new token with Inference permissions at https://huggingface.co/settings/tokens'
                }
            } catch (e) {
                // If it's not valid JSON, use the raw text
                errorData = { error: responseText }
            }

            return NextResponse.json({
                valid: false,
                status: testResponse.status,
                error: errorData.error || errorData.message || responseText || 'Unknown error',
                message: errorMessage
            }, { status: testResponse.status })
        }

    } catch (error) {
        console.error('Token validation error:', error)
        return NextResponse.json(
            { error: 'Internal server error during token validation' },
            { status: 500 }
        )
    }
}
