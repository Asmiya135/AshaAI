"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ThumbsUp, ThumbsDown, Calendar, ArrowLeft, Bookmark, Check } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { EventCalendar } from "@/components/calendar/event-calendar"
import { SavedEventsSection } from "@/components/saved-events/saved-events-section"
import { EventProvider, useEvents } from "@/context/event-context"
import type { SavedEvent, EventMessage } from "@/types/event-types"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"

// Sample event data
const sampleEvents: EventMessage[] = [
  {
    id: uuidv4(),
    title: "Women in Tech Leadership Summit",
    date: "2023-05-15",
    location: "Virtual",
    description: "Join industry leaders for discussions on advancing women in technology leadership roles.",
    url: "https://example.com/events/women-tech-summit",
  },
  {
    id: uuidv4(),
    title: "Networking Mixer for Women in STEM",
    date: "2023-05-22",
    location: "Delhi",
    description: "Connect with other women in STEM fields and build your professional network.",
    url: "https://example.com/events/networking-mixer",
  },
  {
    id: uuidv4(),
    title: "Career Development Workshop",
    date: "2023-06-05",
    location: "Mumbai",
    description: "Two-day workshop focused on career advancement strategies for women professionals.",
    url: "https://example.com/events/career-workshop",
  },
]

interface MessageProps {
  role: "user" | "bot"
  content: string | EventMessage[]
  feedback: null | "up" | "down"
}

function EventBotContent() {
  const { savedEvents, saveEvent, removeEvent, isEventSaved } = useEvents()
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      role: "bot",
      content:
        "Hi there! I'm the Event Finder Bot. I can help you discover networking events, webinars, and conferences related to your professional interests. What type of events are you looking for?",
      feedback: null,
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
      // If the message contains keywords related to events, show the sample events
      if (
        inputValue.toLowerCase().includes("event") ||
        inputValue.toLowerCase().includes("webinar") ||
        inputValue.toLowerCase().includes("conference") ||
        inputValue.toLowerCase().includes("workshop") ||
        inputValue.toLowerCase().includes("tech") ||
        inputValue.toLowerCase().includes("leadership")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: sampleEvents,
            feedback: null,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "I found several upcoming events that might interest you. Could you specify what type of events you're looking for? For example: tech conferences, leadership workshops, networking events, etc.",
            feedback: null,
          },
        ])
      }
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

  const handleSaveEvent = (event: EventMessage) => {
    const savedEvent: SavedEvent = {
      ...event,
      id: event.id,
    }
    saveEvent(savedEvent)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
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
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center mr-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Event Finder Bot</h2>
          </div>
        </motion.div>

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
                  className={`max-w-[95%] p-3 rounded-lg ${
                    message.role === "user" ? "bg-emerald-600/30 text-white" : "bg-emerald-900/50 text-gray-200"
                  }`}
                >
                  {typeof message.content === "string" ? (
                    <p className="whitespace-pre-line">{message.content}</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-emerald-300 font-medium">I found these events that might interest you:</p>
                      {message.content.map((event) => (
                        <div key={event.id} className="bg-emerald-900/30 p-2 rounded-md border border-emerald-800/30">
                          <div className="flex justify-between items-start">
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white font-medium hover:text-emerald-300 transition-colors"
                            >
                              {event.title}
                            </a>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveEvent(event)}
                              disabled={isEventSaved(event.id)}
                              className="h-6 w-6 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800/50"
                            >
                              {isEventSaved(event.id) ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="text-sm text-emerald-300 mt-1">
                            Date: {new Date(event.date).toLocaleDateString()}
                          </div>
                          {event.location && <div className="text-sm text-emerald-300">Location: {event.location}</div>}
                          {event.description && <div className="text-sm text-gray-300 mt-1">{event.description}</div>}
                        </div>
                      ))}
                    </div>
                  )}
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

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EventCalendar savedEvents={savedEvents} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          <SavedEventsSection savedEvents={savedEvents} onRemoveEvent={removeEvent} />
        </motion.div>
      </div>
    </div>
  )
}

export default function EventBotPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white">
      <AuroraBackground />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <EventProvider>
          <EventBotContent />
        </EventProvider>
      </div>
      <Footer />
    </main>
  )
}
