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

export async function callTransformersAPI(
  message: string,
  model: string,
  conversationHistory: string[] = []
): Promise<string> {
  if (!message?.trim()) {
    throw new Error('Message cannot be empty')
  }

  if (!model) {
    throw new Error('Model must be specified')
  }

  const sanitizedMessage = message.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  if (!sanitizedMessage) {
    throw new Error('Message contains only invalid characters')
  }

  if (sanitizedMessage.length > 500) {
    throw new Error('Message is too long. Please keep it under 500 characters.')
  }

  try {
    const { pipeline } = await import('@huggingface/transformers')

    let generator = modelCache.get(model)
    if (!generator) {
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
      } catch {
        throw new Error(`Failed to load model: ${model}. Please try a different model or refresh the page.`)
      }

      modelCache.set(model, generator)
    }

    let input = ''

    if (model.includes('DialoGPT')) {
      if (conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-6)
        input = recentHistory.join(' ') + ' ' + message
      } else {
        input = message
      }
    } else if (model.includes('blenderbot')) {
      input = message
    } else if (model.includes('t5') || model.includes('flan')) {
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
      input = `Human: ${message}\nAssistant:`
    }

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

    let response = ''
    if (Array.isArray(outputs)) {
      const firstOutput = outputs[0]
      response = firstOutput?.generated_text || firstOutput?.text || ''
    } else {
      response = outputs?.generated_text || outputs?.text || ''
    }

    if (model.includes('DialoGPT')) {
      if (response.includes(input)) {
        response = response.replace(input, '').trim()
      }
    } else if (model.includes('blenderbot')) {
      response = response.trim()
    } else if (model.includes('t5') || model.includes('flan')) {
      response = response.trim()
      response = response.replace(/^(Question:|Explain:|Summarize:|Solve:|Answer:)/gi, '').trim()
      const sentences = response.split('.')
      if (sentences.length > 1) {
        const uniqueSentences = Array.from(new Set(sentences.filter(s => s.trim().length > 0)))
        response = uniqueSentences.join('.').trim()
        if (response && !response.endsWith('.')) {
          response += '.'
        }
      }
    } else {
      if (response.includes('Assistant:')) {
        const parts = response.split('Assistant:')
        const lastPart = parts[parts.length - 1]
        if (lastPart) {
          response = lastPart.trim()
        }
      }
      response = response.replace(/^(Human:|Assistant:)/gi, '').trim()
      if (response.startsWith(message)) {
        response = response.substring(message.length).trim()
      }
    }

    response = response.replace(/^\W+/, '').trim()

    if (!response || response.length < 3) {
      return "I'm having trouble generating a good response. Please try again or switch to a different model."
    }

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

export const callHuggingFaceAPI = callTransformersAPI
