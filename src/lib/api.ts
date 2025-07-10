import { ChatModel } from '@/types'

export const availableModels: ChatModel[] = [
  {
    id: 'mock-model',
    name: 'Demo Assistant',
    description: 'A demonstration model that provides educational responses (mock implementation)'
  }
]

const modelCache = new Map()

export function clearModelCache(): void {
  modelCache.clear()
  if (typeof window !== 'undefined' && 'gc' in window) {
    (window as any).gc()
  }
}

export function getModelCacheStatus(): { size: number; models: string[] } {
  return {
    size: modelCache.size,
    models: Array.from(modelCache.keys())
  }
}

// Mock responses for demonstration
const mockResponses = [
  "That's an interesting question! Let me help you understand this concept better.",
  "I'd be happy to explain that for you. This is a common topic in educational contexts.",
  "Great question! Here's how I would approach this problem step by step.",
  "Let me break this down for you in a clear and understandable way.",
  "This is a fundamental concept that's worth exploring further.",
  "I can help you with that! Here's what you need to know about this topic.",
  "That's a thoughtful question. Let me provide you with a comprehensive answer.",
  "I'm here to help you learn! This topic is quite important to understand.",
  "Let me explain this concept in a way that's easy to grasp.",
  "Good question! This is something many students find challenging at first."
]

export async function callTransformersAPI(
  message: string,
  model: string,
  conversationHistory: string[] = []
): Promise<string> {
  console.log('Conversation history length:', conversationHistory.length)

  if (!message?.trim()) {
    throw new Error('Message cannot be empty')
  }

  if (!model || typeof model !== 'string') {
    throw new Error('Model must be specified as a string')
  }

  const sanitizedMessage = message.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  if (!sanitizedMessage) {
    throw new Error('Message contains only invalid characters')
  }

  if (sanitizedMessage.length > 500) {
    throw new Error('Message is too long. Please keep it under 500 characters.')
  }

  try {
    // For now, use a mock implementation to avoid transformers.js issues
    // This will be replaced with actual AI models once the URL issue is resolved

    console.log('Processing message:', sanitizedMessage)

    // Simulate model loading time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate a contextual response based on the message
    let response = ''

    const lowerMessage = sanitizedMessage.toLowerCase()

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm your AI study assistant. I'm here to help you learn and understand various topics. What would you like to explore today?"
    } else if (lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
      response = "I'd be happy to help you with math! While I can't perform complex calculations in this demo mode, I can explain mathematical concepts, formulas, and problem-solving approaches. What specific math topic are you working on?"
    } else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry')) {
      response = "Science is fascinating! I can help explain scientific concepts, theories, and phenomena. Whether it's physics, chemistry, biology, or other sciences, I'm here to break down complex topics into understandable explanations."
    } else if (lowerMessage.includes('history')) {
      response = "History helps us understand our past and present! I can discuss historical events, periods, figures, and their significance. What historical topic interests you?"
    } else if (lowerMessage.includes('write') || lowerMessage.includes('essay')) {
      response = "Writing is a valuable skill! I can help you with essay structure, writing techniques, grammar tips, and brainstorming ideas. What type of writing are you working on?"
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('study')) {
      response = "Learning is a wonderful journey! I can help you with study strategies, explain concepts, and provide educational support across various subjects. What would you like to learn about?"
    } else if (lowerMessage.includes('help')) {
      response = "I'm here to help! As your AI study assistant, I can provide explanations, answer questions, help with homework, and support your learning journey. What do you need assistance with?"
    } else {
      // Use a random response with some context
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      response = `${randomResponse}\n\nRegarding "${sanitizedMessage}" - this is an interesting topic that we can explore together. While I'm currently in demo mode, I'm designed to help you understand complex concepts and provide educational support.`
    }

    return response

  } catch (error) {
    console.error('Mock API error:', error)
    throw new Error(`Processing error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
  }
}

export const callHuggingFaceAPI = callTransformersAPI
