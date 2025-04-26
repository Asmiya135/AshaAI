"use client"

import { motion } from "framer-motion"
import { Briefcase, FileText, BookOpen, Calendar, HelpCircle, ArrowRight } from "lucide-react"

interface BotSelectorProps {
  onSelect: (bot: string) => void
}

const bots = [
  {
    id: "job",
    name: "Job Matcher",
    description: "Find the perfect job opportunities tailored to your skills and preferences",
    icon: Briefcase,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "resume",
    name: "Resume Enhancer",
    description: "Improve your resume and get personalized feedback to stand out to employers",
    icon: FileText,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "course",
    name: "Course Generator",
    description: "Get personalized course recommendations based on your career goals",
    icon: BookOpen,
    color: "from-emerald-600 to-teal-500",
  },
  {
    id: "event",
    name: "Event Finder",
    description: "Discover networking events and educational webinars in your field",
    icon: Calendar,
    color: "from-teal-600 to-emerald-500",
  },
  {
    id: "faq",
    name: "FAQ Helper",
    description: "Get answers to common questions about career development and opportunities",
    icon: HelpCircle,
    color: "from-emerald-500 to-emerald-600",
  },
]

export function BotSelector({ onSelect }: BotSelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to NariShaktiBot</h1>
        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Choose the specialized assistant that best fits your current needs
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {bots.map((bot) => (
          <motion.div
            key={bot.id}
            variants={itemVariants}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 p-6 rounded-xl border border-emerald-800/30 backdrop-blur-sm hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => onSelect(bot.id)}
          >
            <div
              className={`h-16 w-16 rounded-lg bg-gradient-to-br ${bot.color} flex items-center justify-center mb-4`}
            >
              <bot.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{bot.name}</h3>
            <p className="text-gray-300 mb-4">{bot.description}</p>
            <div className="flex items-center justify-end text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <span className="mr-2 text-sm font-medium">Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
