'use client'

import { availableModels, callHuggingFaceAPI } from '@/lib/api'
import { formatTime, generateId } from '@/lib/utils'
import { Message } from '@/types'
import { Bot, MessageSquare, Send, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState(availableModels[0]?.id || 'Xenova/flan-t5-small')
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const [modelLoading, setModelLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        id: generateId(),
        content: "Welcome to your AI Study Assistant! 📚\n\n🔒 **Privacy-First**: I run entirely in your browser using Transformers.js - no data leaves your device, no API keys needed!\n\n🎓 **Educational Focus**: I'm designed to help with:\n• Study questions and explanations\n• Learning new concepts\n• Homework assistance\n• Creative writing practice\n\n⚠️ **Important Limitations**:\n• No internet access - I can't browse the web or get current information\n• Knowledge limited to my training data\n• Best for educational topics, not real-time information\n\nChoose a model above and ask me anything! I'm here to help you learn.",
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
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setModelLoading(true)

    try {
      const modelName = availableModels.find(m => m.id === currentModel)?.name || 'AI model'
      const loadingMessage: Message = {
        id: generateId(),
        content: `🤖 Loading ${modelName}... This may take a moment on first use as the model downloads to your browser.`,
        role: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, loadingMessage])

      const aiResponse = await callHuggingFaceAPI(
        inputMessage.trim(),
        currentModel,
        conversationHistory
      )

      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))

      const assistantMessage: Message = {
        id: generateId(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      setConversationHistory(prev => [...prev, inputMessage.trim(), aiResponse])

      if (conversationHistory.length > 20) {
        setConversationHistory(prev => prev.slice(-20))
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.role !== 'system' || !msg.content.includes('Loading')))

      const errorMessage: Message = {
        id: generateId(),
        content: `❌ ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}`,
        role: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setModelLoading(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId)
    setConversationHistory([])

    const modelInfo = availableModels.find(m => m.id === modelId)
    if (!modelInfo) return
    const systemMessage: Message = {
      id: generateId(),
      content: `🔄 Switched to **${modelInfo.name}**\n\n${modelInfo.description}\n\nStarting fresh conversation - previous context cleared.`,
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">AI Study Assistant</h1>
              <p className="text-purple-100">Educational AI powered by Transformers.js - Privacy-first, browser-based!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={currentModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Select AI Model"
              aria-label="Select AI Model"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id} className="text-gray-800">
                  {model.name}
                </option>
              ))}
            </select>
            {modelLoading && (
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading model...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 message-animate ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
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
            aria-label="Chat message input"
            aria-describedby="message-help"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span id="message-help">Press Enter to send</span>
          <span aria-live="polite">{inputMessage.length}/500</span>
        </div>
      </form>
    </div>
  )
}
