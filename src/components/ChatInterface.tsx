'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Settings, MessageSquare } from 'lucide-react'
import { ChatInterfaceProps, Message, ChatModel } from '@/types'
import { availableModels, callHuggingFaceAPI } from '@/lib/api'
import { formatTime, generateId } from '@/lib/utils'

export default function ChatInterface({ apiToken, onShowSetup }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState(availableModels[0].id)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: generateId(),
        content: "Hello! I'm your AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date()
      }
    ])
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await callHuggingFaceAPI(
        inputMessage,
        currentModel,
        apiToken,
        conversationHistory
      )

      const assistantMessage: Message = {
        id: generateId(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update conversation history
      setConversationHistory(prev => [...prev, inputMessage, aiResponse])
      
      // Keep only recent history
      if (conversationHistory.length > 20) {
        setConversationHistory(prev => prev.slice(-20))
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: generateId(),
        content: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        role: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId)
    setConversationHistory([])
    
    const systemMessage: Message = {
      id: generateId(),
      content: `Switched to ${availableModels.find(m => m.id === modelId)?.name}. Starting fresh conversation.`,
      role: 'system',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, systemMessage])
  }

  const getMessageIcon = (role: string) => {
    switch (role) {
      case 'user':
        return <User className="w-5 h-5" />
      case 'assistant':
        return <Bot className="w-5 h-5" />
      default:
        return <MessageSquare className="w-5 h-5" />
    }
  }

  const getMessageStyles = (role: string) => {
    switch (role) {
      case 'user':
        return 'bg-blue-500 text-white ml-auto'
      case 'assistant':
        return 'bg-gray-100 text-gray-800'
      case 'system':
        return 'bg-yellow-50 text-yellow-800 border border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
              <p className="text-purple-100">Powered by Hugging Face Models</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={currentModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Select AI Model"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id} className="text-gray-800">
                  {model.name}
                </option>
              ))}
            </select>
            <button
              onClick={onShowSetup}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 message-animate ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : message.role === 'assistant'
                ? 'bg-purple-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}>
              {getMessageIcon(message.role)}
            </div>
            <div className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${getMessageStyles(message.role)}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>Press Enter to send</span>
          <span>{inputMessage.length}/500</span>
        </div>
      </form>
    </div>
  )
}
