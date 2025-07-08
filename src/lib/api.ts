import { ChatModel } from '@/types'

export const availableModels: ChatModel[] = [
  {
    id: 'Xenova/flan-t5-small',
    name: 'Flan-T5 Small',
    description: 'Instruction-tuned model - Best for educational Q&A, explanations, and study help (runs in browser)'
  },
  {
    id: 'Xenova/t5-small',
    name: 'T5 Small',
    description: 'Text-to-text model - Excellent for Q&A, summarization, and learning tasks (runs in browser)'
  },
  {
    id: 'Xenova/DialoGPT-small',
    name: 'DialoGPT Small',
    description: 'Conversational AI model - Good for interactive discussions and tutoring (runs in browser)'
  },
  {
    id: 'Xenova/blenderbot_small-90M',
    name: 'BlenderBot Small',
    description: 'Facebook conversational model - Great for educational discussions and explanations (runs in browser)'
  },
  {
    id: 'Xenova/gpt2',
    name: 'GPT-2',
    description: 'Advanced text generation - Helpful for creative writing and detailed explanations (runs in browser)'
  }
]

// Cache for loaded models
const modelCache = new Map()

export async function callTransformersAPI(
  message: string,
  model: string,
  conversationHistory: string[] = []
): Promise<string> {
  // Input validation
  if (!message?.trim()) {
    throw new Error('Message cannot be empty')
  }

  if (!model) {
    throw new Error('Model must be specified')
  }

  try {
    // Dynamic import to avoid SSR issues
    const { pipeline } = await import('@huggingface/transformers')

    // Get or create model pipeline
    let generator = modelCache.get(model)
    if (!generator) {
      console.log(`Loading model: ${model}`)

      // Create pipeline based on model type with error handling
      try {
        if (model.includes('DialoGPT')) {
          generator = await pipeline('text-generation', model, {
            device: 'auto',
            dtype: 'fp32'
          })
        } else if (model.includes('blenderbot')) {
          generator = await pipeline('text2text-generation', model, {
            device: 'auto',
            dtype: 'fp32'
          })
        } else if (model.includes('t5') || model.includes('flan')) {
          generator = await pipeline('text2text-generation', model, {
            device: 'auto',
            dtype: 'fp32'
          })
        } else {
          generator = await pipeline('text-generation', model, {
            device: 'auto',
            dtype: 'fp32'
          })
        }
      } catch (modelError) {
        console.error(`Failed to load model ${model}:`, modelError)
        throw new Error(`Failed to load model: ${model}. Please try a different model or refresh the page.`)
      }

      modelCache.set(model, generator)
    }    // Prepare input based on model type
    let input = ''

    if (model.includes('DialoGPT')) {
      // DialoGPT expects conversation format
      if (conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-6) // Last 3 exchanges
        input = recentHistory.join(' ') + ' ' + message
      } else {
        input = message
      }
    } else if (model.includes('blenderbot')) {
      // BlenderBot works well with direct input
      input = message
    } else if (model.includes('t5') || model.includes('flan')) {
      // T5/Flan-T5 models work well with educational task formatting
      if (message.includes('?')) {
        input = `Question: ${message}`
      } else if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('what is') || message.toLowerCase().includes('how does')) {
        input = `Explain: ${message}`
      } else if (message.toLowerCase().includes('summarize') || message.toLowerCase().includes('summary')) {
        input = `Summarize: ${message}`
      } else if (message.toLowerCase().includes('solve') || message.toLowerCase().includes('calculate')) {
        input = `Solve: ${message}`
      } else {
        input = `Question: ${message}`
      }
    } else {
      // For GPT-2 models, format as a conversation
      input = `Human: ${message}\nAssistant:`
    }    // Generate response with appropriate parameters
    let generationOptions = {}

    if (model.includes('blenderbot')) {
      generationOptions = {
        max_new_tokens: 60,
        do_sample: true,
        temperature: 0.8,
        top_p: 0.9
      }
    } else if (model.includes('t5') || model.includes('flan')) {
      generationOptions = {
        max_new_tokens: 80,
        do_sample: true,
        temperature: 0.6,
        top_p: 0.9,
        repetition_penalty: 1.1
      }
    } else {
      generationOptions = {
        max_new_tokens: 50,
        do_sample: true,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        repetition_penalty: 1.1,
        pad_token_id: 50256,
        eos_token_id: 50256
      }
    }

    const outputs = await generator(input, generationOptions)

    // Extract and clean response
    let response = ''
    if (Array.isArray(outputs)) {
      response = outputs[0]?.generated_text || outputs[0]?.text || ''
    } else {
      response = outputs?.generated_text || outputs?.text || ''
    }

    // Clean up response based on model type
    if (model.includes('DialoGPT')) {
      // Remove the input from DialoGPT response
      if (response.includes(input)) {
        response = response.replace(input, '').trim()
      }
    } else if (model.includes('blenderbot')) {
      // BlenderBot usually gives clean responses
      response = response.trim()
    } else if (model.includes('t5') || model.includes('flan')) {
      // T5/Flan-T5 models typically give clean, direct responses
      response = response.trim()
      // Remove any input prefixes that might remain
      response = response.replace(/^(Question:|Explain:|Summarize:|Solve:|Answer:)/gi, '').trim()
      // Remove any trailing repetition
      const sentences = response.split('.')
      if (sentences.length > 1) {
        // Keep only unique sentences to avoid repetition
        const uniqueSentences = Array.from(new Set(sentences.filter(s => s.trim().length > 0)))
        response = uniqueSentences.join('.').trim()
        if (response && !response.endsWith('.')) {
          response += '.'
        }
      }
    } else {
      // For GPT-2, extract only the assistant's response
      if (response.includes('Assistant:')) {
        const parts = response.split('Assistant:')
        response = parts[parts.length - 1].trim()
      }
      // Remove any remaining human/assistant markers
      response = response.replace(/^(Human:|Assistant:)/gi, '').trim()
      // Remove the original input if it appears
      if (response.startsWith(message)) {
        response = response.substring(message.length).trim()
      }
    }

    // Final cleanup and validation
    response = response.replace(/^\W+/, '').trim() // Remove leading punctuation

    if (!response || response.length < 3) {
      return "I'm having trouble generating a good response. Please try again or switch to a different model."
    }

    // Limit response length for better UX
    if (response.length > 500) {
      const sentences = response.split(/[.!?]+/)
      let truncated = ''
      for (const sentence of sentences) {
        if ((truncated + sentence).length > 400) break
        truncated += sentence + '. '
      }
      response = truncated.trim()
    }

    return response

  } catch (error) {
    console.error('Transformers.js error:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Please check your internet connection and try again.')
      } else if (error.message.includes('out of memory') || error.message.includes('OOM')) {
        throw new Error('Memory error: Please try a smaller model or refresh the page.')
      } else if (error.message.includes('model')) {
        throw new Error(`Model error: ${error.message}`)
      }
    }

    throw new Error(`Model error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Legacy function name for compatibility
export const callHuggingFaceAPI = callTransformersAPI
