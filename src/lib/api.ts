import { ApiResponse, ChatModel } from '@/types'

export const availableModels: ChatModel[] = [
  {
    id: 'microsoft/DialoGPT-medium',
    name: 'DialoGPT Medium',
    description: 'Microsoft\'s conversational AI model'
  },
  {
    id: 'facebook/blenderbot-400M-distill',
    name: 'BlenderBot 400M',
    description: 'Facebook\'s conversational AI model'
  },
  {
    id: 'microsoft/DialoGPT-large',
    name: 'DialoGPT Large',
    description: 'Larger version with better responses'
  }
]

export async function callHuggingFaceAPI(
  message: string,
  model: string,
  apiToken: string,
  conversationHistory: string[] = []
): Promise<string> {
  const API_URL = `https://api-inference.huggingface.co/models/${model}`
  
  // Prepare the input based on model type
  let input: string
  if (model.includes('DialoGPT')) {
    // For DialoGPT, we can use conversation history
    const conversation = conversationHistory.slice(-5) // Keep last 5 exchanges
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
    if (response.status === 401) {
      throw new Error('Invalid API token. Please check your Hugging Face token.')
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    } else {
      throw new Error(`API error: ${response.status}`)
    }
  }

  const data: ApiResponse[] | ApiResponse = await response.json()
  
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

  return aiResponse || 'I\'m having trouble generating a response right now.'
}
