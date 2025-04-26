"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Building, Users, Phone } from "lucide-react"

export function CTASection() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Using NariShaktiBot Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join thousands of women who are accelerating their careers with NariShaktiBot's personalized guidance and
            support.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 p-8 rounded-xl border border-emerald-800/30 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Building className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Request Integration</h3>
                    <p className="text-gray-300">
                      Integrate NariShaktiBot with your organization's platform to support women in your workforce.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Join Our Network</h3>
                    <p className="text-gray-300">
                      Become part of our growing network of mentors, experts, and resources for women's professional
                      development.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Contact Team</h3>
                    <p className="text-gray-300">
                      Have questions or need custom solutions? Our team is ready to help you implement NariShaktiBot.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900/30 p-6 rounded-xl border border-emerald-800/30">
                <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated</h3>
                <p className="text-gray-300 mb-6">
                  Subscribe to receive updates about new features and opportunities for women's career development.
                </p>
                <form className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Organization (Optional)"
                      className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:ring-emerald-500"
                    />
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
    </section>
  )
}
