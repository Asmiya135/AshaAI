"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Shield, Lock, MessageSquare, AlertTriangle, ThumbsUp } from "lucide-react"

export function EthicalAISection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section id="ethical-ai" ref={sectionRef} className="py-20 md:py-32 bg-emerald-950/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Ethical AI
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            NariShaktiBot is designed with ethics and privacy at its core, ensuring a safe and empowering experience for
            all users.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Gender Bias Detection and Reframing</h3>
                <p className="text-gray-300">
                  Our AI is trained to identify and neutralize gender bias in language, promoting fair and inclusive
                  communication.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Privacy-First Approach</h3>
                <p className="text-gray-300">
                  We prioritize your privacy by not storing personal data like name, phone number, or email, ensuring
                  your information remains secure.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageSquare className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Context-Aware Smart Responses</h3>
                <p className="text-gray-300">
                  Our AI understands the context of your queries, providing relevant and helpful responses tailored to
                  your specific needs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Guardrails for Harmful Queries</h3>
                <p className="text-gray-300">
                  We've implemented safeguards to redirect harmful or biased queries towards empowering statistics and
                  positive information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <ThumbsUp className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Human Support and Feedback Loop</h3>
                <p className="text-gray-300">
                  We offer human support when needed and continuously improve our AI through user feedback with a simple
                  thumbs up/down system.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-emerald-900/80 to-emerald-950/80 p-6 rounded-2xl border border-emerald-800/50 shadow-xl backdrop-blur-sm">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-2xl blur opacity-20"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Ethical AI in Action</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-800/20 p-3 rounded-lg ml-auto max-w-[80%]">
                    <p className="text-gray-300">Why aren't there more women CEOs?</p>
                  </div>

                  <div className="bg-emerald-900/30 p-3 rounded-lg">
                    <p className="text-gray-300">
                      While women make up nearly half the workforce, they're underrepresented in leadership positions
                      due to systemic barriers. However, companies with gender-diverse leadership outperform their peers
                      by 25% financially.
                    </p>
                    <div className="mt-3 p-3 bg-emerald-800/30 rounded-lg">
                      <h4 className="font-medium text-emerald-300 mb-1">Empowerment Statistics:</h4>
                      <ul className="list-disc list-inside text-gray-300 space-y-1">
                        <li>Women-led startups generate 10% more revenue over 5 years</li>
                        <li>78% of women in senior roles actively mentor other women</li>
                        <li>
                          Companies with 30%+ female executives are more likely to outperform companies with fewer women
                        </li>
                      </ul>
                    </div>
                    <p className="mt-3 text-gray-300">
                      Would you like resources on leadership development programs for women?
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-emerald-800/30 text-emerald-400 hover:bg-emerald-800/50 transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full bg-emerald-800/30 text-emerald-400 hover:bg-emerald-800/50 transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="rotate-180"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <span className="text-sm text-emerald-400">Ethical AI Response</span>
                  </div>
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
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ethical-circuit-pattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <path
                d="M0 50 H100 M50 0 V100 M25 25 H75 V75 H25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ethical-circuit-pattern)" />
        </svg>
      </div>
    </section>
  )
}
