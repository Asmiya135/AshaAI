"use client"

import { motion } from "framer-motion"
import { Search, Calendar, Award, Users, Bell, BookOpen, Map, FileText } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Job Discovery via Smart Search",
    description: "Find the perfect job opportunities tailored to your skills and preferences.",
  },
  {
    icon: Calendar,
    title: "Events & Webinars Finder",
    description: "Discover networking events and educational webinars to expand your knowledge and connections.",
  },
  {
    icon: Award,
    title: "Government & NGO Schemes",
    description: "Access information about government and NGO schemes designed to support women's careers.",
  },
  {
    icon: Users,
    title: "Mentorship & Leadership Programs",
    description: "Connect with mentors and leadership programs to accelerate your professional growth.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Get timely reminders via WhatsApp, email, or call for important career opportunities.",
  },
  {
    icon: BookOpen,
    title: "Personalized Course Generator",
    description: "Receive customized course recommendations based on your career goals and interests.",
  },
  {
    icon: Map,
    title: "Career Roadmap Builder",
    description: "Create a personalized career roadmap to visualize and achieve your professional goals.",
  },
  {
    icon: FileText,
    title: "OCR Integration for Documents",
    description: "Extract information from resumes and certificates to enhance your profile and recommendations.",
  },
]

export function FeaturesSection() {
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
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            NariShaktiBot offers a comprehensive suite of tools designed to support women throughout their professional
            journey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 p-6 rounded-xl border border-emerald-800/30 backdrop-blur-sm hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors duration-300">
                <feature.icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
    </section>
  )
}
