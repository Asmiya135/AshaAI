"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, BookOpen } from "lucide-react"

interface CourseBotProps {
  onBack: () => void
}

export function CourseBot({ onBack }: CourseBotProps) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I'm the Course Generator Bot. I can help you find personalized learning paths and courses based on your career goals. What skills are you interested in developing?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: inputValue }])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Great choice! Based on your interests, I recommend starting with these courses:\n\n1. Introduction to Data Science\n2. Python for Data Analysis\n3. Machine Learning Fundamentals\n\nWould you like more information about any of these courses?",
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center"
      >
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 text-gray-300 hover:text-white hover:bg-emerald-900/30"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center mr-3">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Course Generator Bot</h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden"
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
        </div>

        <div className="p-4 border-t border-emerald-800/30">
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
    </div>
  )
}
