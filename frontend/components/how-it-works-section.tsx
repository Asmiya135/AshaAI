"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    title: "User Query",
    description: "You ask NariShaktiBot a question about your career or professional development.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Contextual Understanding",
    description: "Our AI analyzes your query to understand the context and your specific needs.",
    color: "from-emerald-600 to-teal-500",
  },
  {
    title: "RAG + Semantic Search",
    description: "The system searches through relevant databases and resources to find the best information.",
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Real-time Results",
    description: "NariShaktiBot delivers personalized, actionable insights based on your query.",
    color: "from-teal-600 to-emerald-500",
  },
  {
    title: "Redirect or Feedback",
    description: "You're directed to relevant resources or can provide feedback to improve future responses.",
    color: "from-emerald-500 to-emerald-600",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            NariShaktiBot uses advanced AI technology to provide personalized support for your professional journey.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                  <div
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold z-10`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-500/50 to-transparent"></div>
                  )}
                </div>
                <div className="flex-1 bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 p-6 rounded-xl border border-emerald-800/30 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <ArrowRight className="h-6 w-6 text-emerald-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
    </section>
  )
}
