"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block px-4 py-2 bg-emerald-900/50 rounded-full mb-6">
              <span className="text-emerald-400 font-medium">AI-Powered Career Assistant</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Meet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                NariShaktiBot
              </span>{" "}
              – Your Empowerment Assistant
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              AI-driven support for women's careers, leadership, and growth. Personalized guidance to help you navigate
              your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                <Link href="/bot">
                  Try the Bot <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-600 text-emerald-400 hover:bg-emerald-950"
                asChild
              >
                <Link href="#how-it-works">
                  Learn How It Works <Play className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-emerald-900/80 to-emerald-950/80 p-6 rounded-2xl border border-emerald-800/50 shadow-xl backdrop-blur-sm">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-2xl blur opacity-20"></div>
              <div className="relative">
                <div className="flex items-center mb-4">
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
                  <h3 className="text-xl font-semibold text-white">NariShaktiBot</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-900/30 p-3 rounded-lg">
                    <p className="text-gray-300">
                      Hello! I'm NariShaktiBot, your AI assistant for career growth. How can I help you today?
                    </p>
                  </div>

                  <div className="bg-emerald-800/20 p-3 rounded-lg ml-auto max-w-[80%]">
                    <p className="text-gray-300">I'm looking for mentorship programs in tech leadership.</p>
                  </div>

                  <div className="bg-emerald-900/30 p-3 rounded-lg">
                    <p className="text-gray-300">I've found 3 mentorship programs for women in tech leadership:</p>
                    <ul className="list-disc list-inside mt-2 text-gray-300">
                      <li>Women in Tech Leadership Summit</li>
                      <li>TechWomen Mentorship Program</li>
                      <li>Leadership Accelerator for Women in STEM</li>
                    </ul>
                    <p className="mt-2 text-gray-300">Would you like more details about any of these programs?</p>
                  </div>
                </div>

                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Ask NariShaktiBot..."
                    className="w-full bg-emerald-950/50 border border-emerald-800/50 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22 2L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>

      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <path
                d="M0 50 H100 M50 0 V100 M25 25 H75 V75 H25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>
    </section>
  )
}
