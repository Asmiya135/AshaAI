"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BotSelector } from "@/components/bot-selector"
import { JobBot } from "@/components/bots/job-bot"
import { ResumeBot } from "@/components/bots/resume-bot"
import { CourseBot } from "@/components/bots/course-bot"
import { EventBot } from "@/components/bots/event-bot"
import { FaqBot } from "@/components/bots/faq-bot"

export default function BotPage() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)

  const renderSelectedBot = () => {
    switch (selectedBot) {
      case "job":
        return <JobBot onBack={() => setSelectedBot(null)} />
      case "resume":
        return <ResumeBot onBack={() => setSelectedBot(null)} />
      case "course":
        return <CourseBot onBack={() => setSelectedBot(null)} />
      case "event":
        return <EventBot onBack={() => setSelectedBot(null)} />
      case "faq":
        return <FaqBot onBack={() => setSelectedBot(null)} />
      default:
        return <BotSelector onSelect={setSelectedBot} />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {renderSelectedBot()}
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
