"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

const sampleQueries = [
  "Find mentorship programs for women in tech",
  "What government schemes support women entrepreneurs?",
  "Upcoming leadership webinars this month",
  "How to negotiate a salary increase?",
  "Career transition advice for women returning to work",
]

export function DemoSection() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm NariShaktiBot, your AI assistant for career growth. How can I help you today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (query = inputValue) => {
    if (!query.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: query }])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      let response = ""

      if (query.toLowerCase().includes("mentorship") || query.toLowerCase().includes("mentor")) {
        response =
          "I've found several mentorship programs for women in tech:\n\n1. Women in Tech Leadership Mentorship\n2. TechSisters Mentoring Circle\n3. Women Who Code Mentorship Program\n\nWould you like more details about any of these programs?"
      } else if (query.toLowerCase().includes("government") || query.toLowerCase().includes("scheme")) {
        response =
          "Here are some government schemes supporting women entrepreneurs:\n\n1. Stand-Up India Scheme\n2. Mudra Yojana for Women\n3. Women Entrepreneurship Platform (WEP)\n4. Mahila Udyam Nidhi Scheme\n\nI can provide more details about eligibility and benefits for any of these schemes."
      } else if (query.toLowerCase().includes("webinar") || query.toLowerCase().includes("event")) {
        response =
          "Upcoming leadership webinars this month:\n\n• May 15: 'Women in Leadership: Breaking Barriers'\n• May 18: 'Effective Communication Skills for Leaders'\n• May 22: 'Building Your Personal Brand'\n• May 29: 'Negotiation Strategies for Women'\n\nWould you like to register for any of these events?"
      } else if (query.toLowerCase().includes("salary") || query.toLowerCase().includes("negotiate")) {
        response =
          "Here are some tips for negotiating a salary increase:\n\n1. Research industry standards for your role and experience level\n2. Document your achievements and contributions\n3. Practice your negotiation pitch\n4. Consider the timing of your request\n5. Be confident but flexible\n\nWould you like a personalized negotiation strategy based on your industry?"
      } else if (query.toLowerCase().includes("transition") || query.toLowerCase().includes("returning")) {
        response =
          "For women returning to work, I recommend:\n\n1. Update your skills through online courses or workshops\n2. Refresh your resume highlighting transferable skills\n3. Build your network through professional groups\n4. Consider returnship programs specifically designed for career breaks\n5. Start with part-time or freelance work if needed\n\nWould you like information about returnship programs in your field?"
      } else {
        response =
          "I'd be happy to help with that. Could you provide more details about what you're looking for? I can assist with job searches, mentorship connections, skill development resources, and more."
      }

      setMessages((prev) => [...prev, { role: "bot", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  const handleSampleQuery = (query) => {
    setInputValue(query)
    handleSendMessage(query)
  }

  return (
    <section id="demo" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Try NariShaktiBot</h2>
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
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-4 bg-emerald-900/50 border-b border-emerald-800/30 flex items-center">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-emerald-400"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">NariShaktiBot Demo</h3>
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
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask NariShaktiBot..."
                    className="flex-1 bg-emerald-950/50 border border-emerald-800/50 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
    </section>
  )
}
