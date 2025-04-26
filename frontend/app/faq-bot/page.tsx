"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, ThumbsUp, HelpCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

interface FAQ {
  id: string
  question: string
  answer: string
  upvotes: number
  category: string
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "faq-1",
      question: "How do I create an account on NariShaktiBot?",
      answer:
        "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. You'll need to provide your email address and create a password. You can also sign up using your Google or LinkedIn account for faster registration.",
      upvotes: 245,
      category: "account",
    },
    {
      id: "faq-2",
      question: "Is NariShaktiBot free to use?",
      answer:
        "Yes, NariShaktiBot offers a free basic plan that gives you access to essential features. We also offer premium plans with additional features and benefits for career development, job searching, and mentorship connections.",
      upvotes: 189,
      category: "general",
    },
    {
      id: "faq-3",
      question: "How does the Job Matcher Bot work?",
      answer:
        "The Job Matcher Bot uses AI to analyze your skills, experience, and preferences to find job opportunities that match your profile. You can upload your resume or manually enter your information, and the bot will provide personalized job recommendations from various sources.",
      upvotes: 176,
      category: "jobs",
    },
    {
      id: "faq-4",
      question: "Can I connect with mentors through NariShaktiBot?",
      answer:
        "Yes, NariShaktiBot offers mentorship connections. You can browse available mentors based on industry, expertise, and availability. Once you find a suitable mentor, you can request a connection and schedule sessions through our platform.",
      upvotes: 152,
      category: "mentorship",
    },
    {
      id: "faq-5",
      question: "How do I update my skills and experience on my profile?",
      answer:
        "To update your profile, go to 'My Profile' from the dropdown menu in the top right corner. Click on the 'Edit Profile' button and navigate to the 'Skills & Experience' section. Here you can add, remove, or update your skills, work experience, and education details.",
      upvotes: 134,
      category: "account",
    },
    {
      id: "faq-6",
      question: "What types of events can I find through the Event Finder Bot?",
      answer:
        "The Event Finder Bot helps you discover various professional events including networking meetups, conferences, workshops, webinars, and career fairs. You can filter events by location, date, industry, and format (in-person or virtual).",
      upvotes: 128,
      category: "events",
    },
    {
      id: "faq-7",
      question: "How can I track my job applications?",
      answer:
        "NariShaktiBot provides a job application tracker in the 'My Applications' section. Here you can see all the jobs you've applied to, their status, upcoming interviews, and follow-up reminders. You can also add notes and set reminders for each application.",
      upvotes: 121,
      category: "jobs",
    },
    {
      id: "faq-8",
      question: "Is my personal information secure on NariShaktiBot?",
      answer:
        "Yes, we take data security very seriously. NariShaktiBot uses encryption to protect your personal information and follows strict privacy policies. We do not share your data with third parties without your consent. You can review our privacy policy for more details.",
      upvotes: 118,
      category: "privacy",
    },
    {
      id: "faq-9",
      question: "How can I get personalized career advice?",
      answer:
        "You can get personalized career advice through our Sakhi Bot, which provides guidance based on your profile, goals, and industry trends. For more in-depth advice, you can also connect with career coaches and mentors through our platform.",
      upvotes: 105,
      category: "career",
    },
    {
      id: "faq-10",
      question: "What government schemes are available for women entrepreneurs?",
      answer:
        "NariShaktiBot provides information on various government schemes for women entrepreneurs, including financial assistance, subsidies, training programs, and incubation support. You can find these details in the 'Resources' section under 'Government Schemes'.",
      upvotes: 98,
      category: "resources",
    },
  ])

  // Handle upvoting a question
  const handleUpvote = (id: string) => {
    setFaqs(
      faqs.map((faq) => {
        if (faq.id === id) {
          return { ...faq, upvotes: faq.upvotes + 1 }
        }
        return faq
      }),
    )
  }

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqs
    .filter((faq) => {
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = activeCategory === "all" || faq.category === activeCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => b.upvotes - a.upvotes) // Sort by upvotes

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Questions" },
    { id: "account", name: "Account" },
    { id: "general", name: "General" },
    { id: "jobs", name: "Jobs" },
    { id: "mentorship", name: "Mentorship" },
    { id: "events", name: "Events" },
    { id: "career", name: "Career" },
    { id: "privacy", name: "Privacy" },
    { id: "resources", name: "Resources" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white">
      <AuroraBackground />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 flex items-center">
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
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-3">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className={`whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-emerald-700/50 text-white border-emerald-600"
                      : "bg-emerald-900/20 text-emerald-300 border-emerald-800/50 hover:bg-emerald-800/40"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-emerald-900/20"
          >
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b border-emerald-800/30">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center pt-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpvote(faq.id)
                          }}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-emerald-400 mt-1">{faq.upvotes}</span>
                      </div>
                      <div className="flex-1">
                        <AccordionTrigger className="py-4 px-0 hover:no-underline">
                          <span className="text-left font-medium text-white hover:text-emerald-300 transition-colors">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-0 pr-4 pb-4 text-gray-300">{faq.answer}</AccordionContent>
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center p-6">
                <div className="h-16 w-16 rounded-full bg-emerald-900/50 flex items-center justify-center mb-4">
                  <HelpCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-white font-medium text-lg mb-2">No questions found</h3>
                <p className="text-gray-400 max-w-md">
                  We couldn't find any questions matching your search criteria. Try adjusting your search terms or
                  category filter.
                </p>
              </div>
            )}
          </motion.div>

          <div className="mt-8 bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Can't find what you're looking for?</h3>
            <p className="text-gray-300 mb-4">
              If you couldn't find the answer to your question, you can ask our support team or community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Contact Support</Button>
              <Button variant="outline" className="border-emerald-700 text-emerald-300 hover:bg-emerald-800/50">
                Ask the Community
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
