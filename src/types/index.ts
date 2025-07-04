export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
}

export interface ChatModel {
  id: string
  name: string
  description: string
}

export interface ApiResponse {
  generated_text?: string
  text?: string
  error?: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentModel: string
}

export interface ApiSetupProps {
  onTokenSave: (token: string) => void
}

export interface ChatInterfaceProps {
  apiToken: string
  onShowSetup: () => void
}
