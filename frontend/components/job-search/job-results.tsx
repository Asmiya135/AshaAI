"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Briefcase, Building, MapPin, Calendar, ExternalLink, BookmarkPlus, Check } from "lucide-react"
import type { JobSearchFilters, JobListing } from "@/types/job-types"
import { useJobSearch } from "@/context/job-search-context"

interface JobResultsProps {
  filters: JobSearchFilters
  onClose: () => void
}

export function JobResults({ filters, onClose }: JobResultsProps) {
  const { savedJobs, saveJob, isJobSaved } = useJobSearch()
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Generate mock job listings based on filters
  useEffect(() => {
    setLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockJobs = generateMockJobs(filters)
      setJobListings(mockJobs)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [filters])

  // Filter jobs based on active tab
  const filteredJobs = jobListings.filter((job) => {
    if (activeTab === "all") return true
    if (activeTab === "remote" && job.locationType === "Remote") return true
    if (activeTab === "fullTime" && job.jobType === "Full-time") return true
    if (activeTab === "recent" && new Date(job.postedDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      return true
    return false
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-emerald-900/90 to-emerald-950/90 rounded-xl border border-emerald-800/50 backdrop-blur-sm shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-800/70 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Job Matches</h2>
                <p className="text-emerald-300 text-sm">
                  Based on your search for <span className="font-medium">{filters.position}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-emerald-800/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-emerald-900/50 border border-emerald-800/50 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
                  All Jobs
                </TabsTrigger>
                <TabsTrigger
                  value="remote"
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                >
                  Remote
                </TabsTrigger>
                <TabsTrigger
                  value="fullTime"
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                >
                  Full-time
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                >
                  Recent
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-12 w-12 rounded-full border-4 border-emerald-800/50 border-t-emerald-500 animate-spin mb-4"></div>
                    <p className="text-emerald-300">Searching for the perfect job matches...</p>
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} onSave={() => saveJob(job)} isSaved={isJobSaved(job.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-16 w-16 rounded-full bg-emerald-900/50 flex items-center justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-medium text-lg mb-2">No jobs found</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      We couldn't find any jobs matching your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="p-4 border-t border-emerald-800/50 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-emerald-700 text-emerald-300 hover:bg-emerald-800/50"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface JobCardProps {
  job: JobListing
  onSave: () => void
  isSaved: boolean
}

function JobCard({ job, onSave, isSaved }: JobCardProps) {
  return (
    <div className="bg-emerald-900/40 border border-emerald-800/50 rounded-lg p-4 hover:bg-emerald-900/60 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="text-white font-semibold text-lg">{job.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault()
            onSave()
          }}
          disabled={isSaved}
          className={`h-8 w-8 ${
            isSaved
              ? "text-emerald-400 bg-emerald-900/50"
              : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/50"
          }`}
        >
          {isSaved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-2 text-emerald-300 text-sm">
        <Building className="h-4 w-4" />
        <span>{job.company}</span>
      </div>

      <div className="flex items-center gap-2 mt-1 text-emerald-300 text-sm">
        <MapPin className="h-4 w-4" />
        <span>{job.location}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-700/50">
          {job.jobType}
        </Badge>
        <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-700/50">
          {job.locationType}
        </Badge>
        {job.salary && (
          <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-700/50">
            {job.salary}
          </Badge>
        )}
      </div>

      <div className="mt-3 text-sm text-gray-300">
        <p className="line-clamp-2">{job.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>Posted {formatDate(job.postedDate)}</span>
        </div>

        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-emerald-700/50 hover:bg-emerald-700/70 text-white px-2 py-1 rounded-md transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Apply Now
        </a>
      </div>
    </div>
  )
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

// Generate mock job listings based on filters
function generateMockJobs(filters: JobSearchFilters): JobListing[] {
  const companies = [
    "TechNova",
    "GlobalSoft",
    "InnovateCorp",
    "DataSphere",
    "FutureTech",
    "EcoSolutions",
    "MindWave",
    "QuantumWorks",
    "Stellar Systems",
    "Horizon AI",
    "MetaVerse Inc",
    "CloudPeak",
  ]

  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Chicago, IL",
    "Denver, CO",
    "Remote",
    "Los Angeles, CA",
    "Atlanta, GA",
    "Miami, FL",
    "Portland, OR",
  ]

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]
  const locationTypes = ["Remote", "On-site", "Hybrid"]

  const availableSalaryRanges = ["$50K - $70K", "$70K - $90K", "$90K - $120K", "$120K - $150K", "$150K+"]

  // Generate random jobs based on filters
  const numJobs = Math.floor(Math.random() * 10) + 5 // 5-15 jobs
  const jobs: JobListing[] = []

  for (let i = 0; i < numJobs; i++) {
    // Use filter values when provided, otherwise randomize
    const company = filters.company || companies[Math.floor(Math.random() * companies.length)]
    const location = filters.location || locations[Math.floor(Math.random() * locations.length)]
    const jobType = filters.jobType
      ? mapJobTypeValue(filters.jobType)
      : jobTypes[Math.floor(Math.random() * jobTypes.length)]
    const locationType = filters.workLocationType
      ? mapWorkLocationTypeValue(filters.workLocationType)
      : locationTypes[Math.floor(Math.random() * locationTypes.length)]

    // Generate random experience requirement within filter range if provided
    const minExp = filters.experience ? filters.experience[0] : Math.floor(Math.random() * 5)
    const maxExp = filters.experience ? filters.experience[1] : minExp + Math.floor(Math.random() * 5) + 1

    // Generate random posted date (within last 30 days)
    const daysAgo = Math.floor(Math.random() * 30)
    const postedDate = new Date()
    postedDate.setDate(postedDate.getDate() - daysAgo)

    jobs.push({
      id: `job-${i + 1}`,
      title: generateJobTitle(filters.position),
      company,
      location,
      jobType,
      locationType,
      salary: availableSalaryRanges[Math.floor(Math.random() * availableSalaryRanges.length)],
      description: generateJobDescription(filters.position, minExp, maxExp),
      requirements: `${minExp}-${maxExp} years of experience`,
      postedDate: postedDate.toISOString(),
      applyUrl: "#",
    })
  }

  return jobs
}

// Helper function to generate job title variations
function generateJobTitle(basePosition: string): string {
  const prefixes = ["Senior ", "Junior ", "Lead ", "Principal ", "", "Staff ", "Associate "]
  const suffixes = ["", " Specialist", "Engineer", "Developer", "Manager", "Analyst", "Consultant"]

  // 70% chance to use the exact position provided
  if (Math.random() < 0.7) return basePosition

  // Otherwise, generate a variation
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  // Avoid adding suffix if the base position already contains it
  const finalSuffix = basePosition.toLowerCase().includes(suffix.toLowerCase().trim()) ? "" : suffix

  return `${prefix}${basePosition}${finalSuffix}`
}

// Helper function to generate job descriptions
function generateJobDescription(position: string, minExp: number, maxExp: number): string {
  const descriptions = [
    `We are seeking a talented ${position} with ${minExp}-${maxExp} years of experience to join our growing team.`,
    `Join our innovative team as a ${position}. Ideal candidates have ${minExp}-${maxExp} years of relevant experience.`,
    `Exciting opportunity for a ${position} to work on cutting-edge projects. ${minExp}-${maxExp} years of experience required.`,
    `Looking for a passionate ${position} to help drive our mission forward. ${minExp}-${maxExp} years of experience preferred.`,
  ]

  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

// Map select values to display values
function mapJobTypeValue(value: string): string {
  const mapping: Record<string, string> = {
    fullTime: "Full-time",
    partTime: "Part-time",
    contract: "Contract",
    internship: "Internship",
  }
  return mapping[value] || "Full-time"
}

function mapWorkLocationTypeValue(value: string): string {
  const mapping: Record<string, string> = {
    remote: "Remote",
    onsite: "On-site",
    hybrid: "Hybrid",
  }
  return mapping[value] || "On-site"
}
