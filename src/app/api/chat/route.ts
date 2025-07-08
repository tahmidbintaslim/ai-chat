import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { message, model, apiToken, conversationHistory } = await request.json()

        if (!message || !model || !apiToken) {
            return NextResponse.json(
                { error: 'Missing required fields: message, model, or apiToken' },
                { status: 400 }
            )
        }

        const API_URL = `https://api-inference.huggingface.co/models/${model}`

        // Prepare the input based on model type
        let input: string
        if (model.includes('DialoGPT')) {
            // For DialoGPT, we can use conversation history
            const conversation = conversationHistory ? conversationHistory.slice(-5) : []
            conversation.push(message)
            input = conversation.join('\n')
        } else {
            // For other models, use simple input
            input = message
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: input,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    do_sample: true,
                    top_p: 0.9,
                    repetition_penalty: 1.1
                },
                options: {
                    wait_for_model: true,
                    use_cache: false
                }
            })
        })

        if (!response.ok) {
            let errorMessage = `API error: ${response.status}`

            // Try to get error details from Hugging Face API
            let errorDetails = ''
            try {
                const errorData = await response.json()
                errorDetails = errorData.error || errorData.message || JSON.stringify(errorData)
            } catch (e) {
                errorDetails = await response.text()
            }

            if (response.status === 401) {
                errorMessage = 'Invalid API token. Please check your Hugging Face token.'
            } else if (response.status === 403) {
                errorMessage = `Access forbidden. This could mean:\n• Your API token doesn't have access to model "${model}"\n• The model requires special permissions or is gated\n• Try a different model or check your Hugging Face account permissions`
            } else if (response.status === 429) {
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
            } else if (response.status === 404) {
                errorMessage = `Model ${model} not found. Please try a different model.`
            }

            console.error(`Hugging Face API Error ${response.status}:`, errorDetails)

            return NextResponse.json({
                error: errorMessage,
                details: errorDetails,
                model: model
            }, { status: response.status })
        }

        const data = await response.json()

        // Handle different response formats
        let aiResponse: string
        if (Array.isArray(data) && data.length > 0) {
            if (data[0].generated_text) {
                aiResponse = data[0].generated_text
                // Clean up response for DialoGPT
                if (model.includes('DialoGPT')) {
                    aiResponse = aiResponse.replace(input, '').trim()
                }
            } else if (data[0].text) {
                aiResponse = data[0].text
            } else {
                aiResponse = JSON.stringify(data[0])
            }
        } else if (!Array.isArray(data)) {
            if (data.generated_text) {
                aiResponse = data.generated_text
            } else if (data.text) {
                aiResponse = data.text
            } else {
                aiResponse = 'I received your message but I\'m not sure how to respond right now.'
            }
        } else {
            aiResponse = 'I received your message but I\'m not sure how to respond right now.'
        }

        return NextResponse.json({
            response: aiResponse || 'I\'m having trouble generating a response right now.'
        })

    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
