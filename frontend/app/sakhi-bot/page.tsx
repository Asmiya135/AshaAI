"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ThumbsUp, ThumbsDown, Heart, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import Link from "next/link"

export default function SakhiBotPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I'm Sakhi, your personal well-being assistant. I'm here to support your mental health, provide emotional guidance, and help you navigate life's challenges. How are you feeling today?",
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
      let response = ""

      // Generate different responses based on keywords in the user's message
      const userMessage = inputValue.toLowerCase()

      if (userMessage.includes("stress") || userMessage.includes("anxious") || userMessage.includes("anxiety")) {
        response =
          "I understand that feeling stressed or anxious can be overwhelming. Remember that it's okay to take breaks and practice self-care. Have you tried any relaxation techniques like deep breathing or mindfulness meditation? These can be helpful for managing stress in the moment."
      } else if (userMessage.includes("sad") || userMessage.includes("depressed") || userMessage.includes("unhappy")) {
        response =
          "I'm sorry to hear you're feeling down. It's important to acknowledge these feelings and be gentle with yourself. Would you like to talk more about what's causing these feelings? Sometimes sharing your thoughts can help lighten the emotional burden."
      } else if (userMessage.includes("happy") || userMessage.includes("good") || userMessage.includes("great")) {
        response =
          "I'm so glad to hear you're feeling good! It's wonderful to celebrate these positive moments. What's contributing to your happiness today? Recognizing what brings us joy can help us cultivate more positive experiences."
      } else if (userMessage.includes("tired") || userMessage.includes("exhausted") || userMessage.includes("sleep")) {
        response =
          "Feeling tired can really affect our overall wellbeing. Are you getting enough rest? Sometimes establishing a regular sleep routine and creating a calming bedtime environment can help improve sleep quality. Would you like some tips for better sleep?"
      } else {
        response =
          "Thank you for sharing that with me. I'm here to support you through whatever you're experiencing. Would you like to explore some strategies that might help you navigate this situation? Or perhaps you'd just like a space to express yourself - that's perfectly fine too."
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: response,
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

  const suggestionPrompts = [
    "I'm feeling stressed about work",
    "I need help with anxiety",
    "How can I improve my mood?",
    "I'm having trouble sleeping",
    "I feel overwhelmed with responsibilities",
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white">
      <AuroraBackground />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 text-gray-300 hover:text-white hover:bg-emerald-900/30"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mr-3">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Sakhi Bot</h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-emerald-900/20"
          >
            <div className="h-[500px] overflow-y-auto p-4 space-y-4" id="chat-messages">
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
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestionPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(prompt)
                    }}
                    className="text-xs bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-300 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-emerald-950/50 border border-emerald-800/50 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
