"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

export function IntegrationsSection() {
  return (
    <section className="py-20 md:py-32 bg-emerald-950/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-time Integrations</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            NariShaktiBot stays up-to-date with the latest information through real-time API integrations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 p-6 rounded-xl border border-emerald-800/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-white">Live API-based Content Updates</h3>
              <p className="text-gray-300 mb-4">
                NariShaktiBot connects to multiple data sources to provide you with the most current information:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-emerald-400"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white">Job Listings API</span>
                    <p className="text-gray-300 text-sm">Real-time job opportunities from multiple platforms</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-emerald-400"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white">Events Calendar</span>
                    <p className="text-gray-300 text-sm">
                      Updated information on upcoming webinars and networking events
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-emerald-400"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white">Government Schemes Database</span>
                    <p className="text-gray-300 text-sm">
                      Latest information on government and NGO initiatives for women
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-emerald-400"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white">Mentorship Programs</span>
                    <p className="text-gray-300 text-sm">Current mentorship and leadership development opportunities</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="px-4 py-2 text-base bg-emerald-900/40 border-emerald-500/30 text-emerald-300 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4 animate-spin" />
                Always Fresh. Always Relevant.
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-emerald-900/80 to-emerald-950/80 p-6 rounded-2xl border border-emerald-800/50 shadow-xl backdrop-blur-sm">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-2xl blur opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Admin Dashboard Preview</h3>
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Live
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-900/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Active Users</h4>
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <div className="flex items-center mt-2 text-xs text-emerald-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1"
                        >
                          <path
                            d="M18 15L12 9L6 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        +12.5% this week
                      </div>
                    </div>
                    <div className="bg-emerald-900/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Queries Processed</h4>
                      <p className="text-2xl font-bold text-white">8,392</p>
                      <div className="flex items-center mt-2 text-xs text-emerald-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1"
                        >
                          <path
                            d="M18 15L12 9L6 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        +24.3% this week
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Top Query Categories</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300">Job Search</span>
                          <span className="text-emerald-400">42%</span>
                        </div>
                        <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300">Mentorship</span>
                          <span className="text-emerald-400">28%</span>
                        </div>
                        <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "28%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300">Skill Development</span>
                          <span className="text-emerald-400">18%</span>
                        </div>
                        <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "18%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300">Events</span>
                          <span className="text-emerald-400">12%</span>
                        </div>
                        <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-300">Recent Updates</h4>
                      <span className="text-xs text-emerald-400">View all</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        <p className="text-sm text-gray-300">Added 24 new job listings from JobsForHer</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        <p className="text-sm text-gray-300">Updated government schemes database</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        <p className="text-sm text-gray-300">Added 5 new mentorship programs</p>
                      </div>
                    </div>
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
    </section>
  )
}
