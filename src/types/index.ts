export interface Message {
  readonly id: string
  readonly content: string
  readonly role: 'user' | 'assistant' | 'system'
  readonly timestamp: Date
}

export interface ChatModel {
  readonly id: string
  readonly name: string
  readonly description: string
}

export interface ChatState {
  readonly messages: Message[]
  readonly isLoading: boolean
  readonly currentModel: string
}
