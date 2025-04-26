"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ThumbsUp, ThumbsDown } from "lucide-react"

export function GeneralChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm NariShaktiBot One, your AI assistant for career growth. How can I help you today?",
      feedback: null as null | "up" | "down",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: inputValue, feedback: null }])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I'd be happy to help with that. Could you provide more details about what you're looking for? I can assist with job searches, mentorship connections, skill development resources, and more.",
          feedback: null,
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const handleFeedback = (index: number, type: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg, i) => {
        if (i === index) {
          return { ...msg, feedback: type }
        }
        return msg
      }),
    )
  }

  const sampleQueries = [
    "Find mentorship programs for women in tech",
    "What government schemes support women entrepreneurs?",
    "Upcoming leadership webinars this month",
    "How to negotiate a salary increase?",
    "Career transition advice for women returning to work",
  ]

  const handleSampleQuery = (query: string) => {
    setInputValue(query)
    handleSendMessage()
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">NariShaktiBot One</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience how NariShaktiBot can assist you with your career questions and professional development.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-emerald-900/20"
          >
            <div className="p-4 bg-emerald-900/50 border-b border-emerald-800/30 flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img src="/narishakti-logo.png" alt="NariShaktiBot Logo" className="h-full w-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-white">NariShaktiBot One</h3>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4" id="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user" ? "bg-emerald-600/30 text-white" : "bg-emerald-900/50 text-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.role === "bot" && (
                      <div className="flex items-center justify-end mt-2 gap-2">
                        <button
                          onClick={() => handleFeedback(index, "up")}
                          className={`p-1 rounded-full ${
                            message.feedback === "up"
                              ? "bg-emerald-500/50 text-white"
                              : "bg-emerald-800/30 text-emerald-400 hover:bg-emerald-800/50"
                          } transition-colors`}
                          aria-label="Thumbs up"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(index, "down")}
                          className={`p-1 rounded-full ${
                            message.feedback === "down"
                              ? "bg-emerald-500/50 text-white"
                              : "bg-emerald-800/30 text-emerald-400 hover:bg-emerald-800/50"
                          } transition-colors`}
                          aria-label="Thumbs down"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-emerald-900/50 text-gray-200">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></div>
                      <div
                        className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-emerald-800/30">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuery(query)}
                      className="text-xs bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask NariShaktiBot..."
                    className="flex-1 bg-emerald-950/50 border border-emerald-800/50 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
