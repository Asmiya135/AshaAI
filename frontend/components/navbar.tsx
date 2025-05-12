"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LanguageSelector } from "@/components/language-selector"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-emerald-950/90 backdrop-blur-md shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg overflow-hidden">
            <img src="/narishakti-logo.png" alt="NariShaktiBot Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-xl font-bold text-white">NariShaktiBot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link href="/job-bot" className="text-gray-300 hover:text-white transition-colors">
            Job-Bot
          </Link>
          <Link href="/event-bot" className="text-gray-300 hover:text-white transition-colors">
            Event-Bot
          </Link>
          <Link href="/ai-course-gen" className="text-gray-300 hover:text-white transition-colors">
            CourseGen
          </Link>
          <Link href="/faq-bot" className="text-gray-300 hover:text-white transition-colors">
            FAQs
          </Link>
          <Link href="/sakhi-bot" className="text-gray-300 hover:text-white transition-colors">
            Sakhi-Bot
          </Link>
          <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
            My Analytics
          </Link>
          <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
            News
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector />
          <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
            <Link href="/">Launch app</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSelector />
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-emerald-950/95 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/job-bot"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Job-Bot
            </Link>
            
            <Link
              href="/ai-course-gen"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              CourseGen
            </Link>
            <Link
              href="/event-bot"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Event-Bot
            </Link>
            <Link
              href="/faq-bot"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              FAQs
            </Link>
            <Link
              href="/sakhi-bot"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Sakhi-Bot
            </Link>
            <Link
              href="/analytics"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              My Analytics
            </Link>
            <Link
              href="/news"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full mt-2" asChild>
              <Link href="/">Launch app</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
