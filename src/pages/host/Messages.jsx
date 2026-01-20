import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, ChevronLeft, Search, MoreVertical, Phone, Video, Check, CheckCheck, Smile, Image, Paperclip, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useMessages } from '@/hooks/useMessages'
import { cn } from '@/lib/utils'

function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const {
    getConversationsWithPreview,
    getConversationMessages,
    sendMessage,
    markConversationAsRead,
  } = useMessages()

  const conversations = getConversationsWithPreview('host')
  const filteredConversations = conversations.filter(conv =>
    conv.cleanerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentMessages = selectedConversation
    ? getConversationMessages(selectedConversation.id)
    : []

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  // Mark as read when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      markConversationAsRead(selectedConversation.id, 'host')
    }
  }, [selectedConversation, markConversationAsRead])

  // Focus input when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      inputRef.current?.focus()
    }
  }, [selectedConversation])

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    sendMessage(selectedConversation.id, newMessage.trim(), 'host')
    setNewMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Hier'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Mobile: show conversation list or chat
  const showConversationList = !selectedConversation

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          {selectedConversation && (
            <button
              onClick={() => setSelectedConversation(null)}
              className="lg:hidden p-2 -ml-2 hover:bg-surface-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-surface-900 font-display">
              {selectedConversation ? selectedConversation.cleanerName : 'Messages'}
            </h1>
            {selectedConversation && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-surface-500">{selectedConversation.propertyName}</span>
                <span className="text-surface-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-surface-500">4.9</span>
                </div>
              </div>
            )}
            {!selectedConversation && (
              <p className="text-surface-500 mt-0.5">
                {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        {selectedConversation && (
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-500 hover:text-surface-700">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-500 hover:text-surface-700">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-500 hover:text-surface-700">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Conversations List */}
        <div className={cn(
          'w-full lg:w-80 flex-shrink-0 flex flex-col',
          selectedConversation ? 'hidden lg:flex' : 'flex'
        )}>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Rechercher un cleaner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 focus:bg-white transition-all"
            />
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-surface-400" />
                </div>
                <p className="text-surface-500">Aucune conversation</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    'w-full p-4 rounded-2xl text-left transition-all duration-200',
                    selectedConversation?.id === conv.id
                      ? 'bg-accent-50 border-2 border-accent-200'
                      : 'bg-white border-2 border-surface-100 hover:border-surface-200 hover:shadow-soft'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={conv.cleanerAvatar}
                        alt={conv.cleanerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cn(
                          'font-semibold truncate',
                          conv.unreadCount > 0 ? 'text-surface-900' : 'text-surface-700'
                        )}>
                          {conv.cleanerName}
                        </h3>
                        <span className={cn(
                          'text-xs flex-shrink-0 ml-2',
                          conv.unreadCount > 0 ? 'text-accent-600 font-semibold' : 'text-surface-400'
                        )}>
                          {conv.lastMessage && formatTime(conv.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-accent-600 mb-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        4.9 • {conv.propertyName}
                      </p>
                      {conv.lastMessage && (
                        <p className={cn(
                          'text-sm truncate',
                          conv.unreadCount > 0 ? 'text-surface-700 font-medium' : 'text-surface-500'
                        )}>
                          {conv.lastMessage.from === 'host' && (
                            <span className="text-surface-400">Vous : </span>
                          )}
                          {conv.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          'flex-1 flex flex-col min-w-0',
          !selectedConversation ? 'hidden lg:flex' : 'flex'
        )}>
          {selectedConversation ? (
            <>
              {/* Messages */}
              <Card className="flex-1 overflow-hidden p-0 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                  {currentMessages.map((message, index) => {
                    const isMe = message.from === 'host'
                    const showAvatar = index === 0 || 
                      currentMessages[index - 1]?.from !== message.from

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3 animate-fade-in-up',
                          isMe ? 'flex-row-reverse' : 'flex-row'
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {showAvatar ? (
                          <img
                            src={message.fromAvatar}
                            alt={message.fromName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 flex-shrink-0" />
                        )}
                        <div className={cn(
                          'max-w-[75%] lg:max-w-[60%]'
                        )}>
                          <div className={cn(
                            'px-4 py-3 rounded-2xl',
                            isMe
                              ? 'bg-accent-500 text-white rounded-br-md'
                              : 'bg-surface-100 text-surface-900 rounded-bl-md'
                          )}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.text}
                            </p>
                          </div>
                          <div className={cn(
                            'flex items-center gap-1 mt-1 text-xs',
                            isMe ? 'justify-end' : 'justify-start'
                          )}>
                            <span className="text-surface-400">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {isMe && (
                              message.readByCleaner ? (
                                <CheckCheck className="w-3.5 h-3.5 text-accent-500" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-surface-400" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-surface-100 bg-surface-50">
                  <div className="flex items-end gap-3">
                    <button className="p-2 hover:bg-surface-200 rounded-xl transition-colors text-surface-500 hover:text-surface-700">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-surface-200 rounded-xl transition-colors text-surface-500 hover:text-surface-700">
                      <Image className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Écrire un message..."
                        rows={1}
                        className="w-full px-4 py-3 pr-12 bg-white border-2 border-surface-200 rounded-2xl text-surface-900 placeholder-surface-400 focus:outline-none focus:border-accent-500 resize-none transition-all"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-400 hover:text-surface-600">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      variant="accent"
                      className="flex-shrink-0 !rounded-2xl !px-4"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            // Empty State
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-100 to-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                  <MessageCircle className="w-12 h-12 text-accent-500" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-2">
                  Vos messages
                </h3>
                <p className="text-surface-500 max-w-sm">
                  Sélectionnez une conversation pour voir vos échanges avec les cleaners.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
