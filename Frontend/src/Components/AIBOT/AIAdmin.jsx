import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, X, Sparkles, Zap, Brain, Check, CheckCheck } from 'lucide-react';
import axios from 'axios';

const AIAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    // Add user message with "sending" status
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    
    // Update message status to "sent"
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 500);

    // Update message status to "delivered" and show typing indicator
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
      setIsTyping(true);
    }, 1000);

    try {
      // Call AI API - Replace this with your actual AI API endpoint
      const response = await callAIAPI(currentMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('AI API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment! 🤖",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // AI API Integration Function
  const callAIAPI = async (message) => {
    try {
      // Option 1: OpenAI-style API (replace with your API)
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a helpful AI assistant for Crewzy, an organization management platform. Help users with questions about attendance, task management, employee records, and company policies. Be friendly, professional, and concise."
          },
          {
            role: "user", 
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;

    } catch (error) {
      // Fallback to demo responses if API fails
      console.warn('AI API unavailable, using demo responses');
      return getDemoResponse(message);
    }
  };

  // Demo Response Function (fallback)
  const getDemoResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('attendance')) {
      return "I can help you track attendance! Use the attendance tracker to clock in/out, view your attendance history, and manage leave requests. Would you like me to show you how to mark attendance?";
    }
    
    if (lowerMessage.includes('task') || lowerMessage.includes('project')) {
      return "For task management, you can create new tasks, assign them to team members, set deadlines, and track progress. Would you like me to guide you through creating a new task?";
    }
    
    if (lowerMessage.includes('policy') || lowerMessage.includes('policies')) {
      return "I can help you find company policies! Common policies include attendance guidelines, remote work policies, leave policies, and code of conduct. What specific policy are you looking for?";
    }
    
    if (lowerMessage.includes('employee') || lowerMessage.includes('staff')) {
      return "For employee management, you can view employee profiles, manage roles, track performance, and generate reports. What would you like to know about employee records?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you with anything related to Crewzy. I can assist with attendance tracking, task management, employee records, and company policies. How can I help you today?";
    }
    
    // Default response
    return `I understand you're asking about "${message}". I'm here to help with attendance tracking, task management, employee records, and company policies. Could you please be more specific about what you'd like to know?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    "How can I help with attendance?",
    "Show me task management",
    "What are the company policies?",
    "Help with employee records"
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-scroll::-webkit-scrollbar-track {
          background: #F4F7FF;
          border-radius: 3px;
        }
        
        .chat-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4786FA, #D1DFFA);
          border-radius: 3px;
        }
        
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #3B75E8, #B8CCFA);
        }
        
        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: #4786FA #F4F7FF;
        }
      `}</style>

      {/* Floating Chat Icon */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative group"
          animate={{
            boxShadow: [
              "0 0 20px rgba(71, 134, 250, 0.3)",
              "0 0 30px rgba(71, 134, 250, 0.5)",
              "0 0 20px rgba(71, 134, 250, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          {/* Notification Dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-2 h-2 text-white" />
          </motion.div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-[#2c3e50] text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              Ask AI Assistant
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2c3e50]"></div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.6
              }}
              className="fixed right-0 top-0 h-full w-full md:w-[40%] bg-gradient-to-b from-[#FEFEFE] to-[#F4F7FF] z-50 shadow-2xl border-l border-[#E2E9F9] flex flex-col"
            >
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0 bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] p-4 border-b border-[#E2E9F9]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                    >
                      <Bot className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">AI Assistant</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <p className="text-white text-opacity-80 text-sm">
                          {connectionStatus === 'online' ? 'Online' : 'Offline'} • Always here to help
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth chat-scroll"
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-[#4786FA] to-[#D1DFFA]' 
                              : 'bg-gradient-to-r from-[#E3EAFE] to-[#D1E1FB]'
                          }`}
                        >
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-[#4786FA]" />
                          )}
                        </motion.div>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] text-white'
                            : 'bg-gradient-to-r from-[#F4F7FF] to-[#E3EAFE] text-gray-800 border border-[#E2E9F9]'
                        } shadow-lg`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${
                              message.sender === 'user' ? 'text-white text-opacity-70' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </p>
                            {message.sender === 'user' && (
                              <div className="flex items-center space-x-1">
                                {message.status === 'sending' && (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-3 h-3 border border-white border-t-transparent rounded-full"
                                  />
                                )}
                                {message.status === 'sent' && (
                                  <Check className="w-3 h-3 text-white opacity-70" />
                                )}
                                {message.status === 'delivered' && (
                                  <CheckCheck className="w-3 h-3 text-white opacity-70" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E3EAFE] to-[#D1E1FB] flex items-center justify-center">
                          <Bot className="w-4 h-4 text-[#4786FA]" />
                        </div>
                        <div className="bg-gradient-to-r from-[#F4F7FF] to-[#E3EAFE] rounded-2xl px-4 py-3 border border-[#E2E9F9] shadow-lg">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 bg-[#4786FA] rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#FEFEFE] to-[#F4F7FF] border-t border-[#E2E9F9]"
                  >
                    <p className="text-sm text-gray-600 mb-3">✨ Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickReply(reply)}
                          className="bg-gradient-to-r from-[#F4F7FF] to-[#E3EAFE] border border-[#E2E9F9] text-[#4786FA] px-3 py-2 rounded-full text-xs hover:from-[#E3EAFE] hover:to-[#D1DFFA] transition-all duration-200 shadow-md"
                        >
                          {reply}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Input Area */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0 p-4 bg-gradient-to-r from-[#FEFEFE] to-[#F4F7FF] border-t border-[#E2E9F9]"
                >
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="w-full px-4 py-3 pr-12 border border-[#E2E9F9] rounded-2xl focus:ring-2 focus:ring-[#4786FA] focus:border-transparent outline-none resize-none bg-gradient-to-r from-[#FFFFFF] to-[#F4F7FF] text-gray-800 placeholder-gray-500 shadow-lg"
                        rows="1"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                        disabled={isTyping}
                      />
                      {/* Character count for long messages */}
                      {inputMessage.length > 100 && (
                        <div className="absolute bottom-2 right-14 text-xs text-gray-400">
                          {inputMessage.length}/500
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="w-12 h-12 bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <motion.div
                        animate={isTyping ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: isTyping ? Infinity : 0, ease: "linear" }}
                      >
                        {isTyping ? <Zap className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                      </motion.div>
                    </motion.button>
                  </div>
                  
                  {/* Connection Status */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span>{connectionStatus === 'online' ? 'Connected to AI' : 'Reconnecting...'}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdmin;
