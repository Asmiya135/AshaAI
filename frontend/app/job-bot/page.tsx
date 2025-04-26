"use client"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { JobSearch } from "@/components/job-search/job-search"
import { ResumeJobSearch } from "@/components/job-search/resume-job-search"
import { ResumeDevelopment } from "@/components/job-search/resume-development"
import { JobResults } from "@/components/job-search/job-results"
import { ResumeAnalysisModal } from "@/components/job-search/resume-analysis-modal"
import { JobSearchProvider } from "@/context/job-search-context"
import type { JobSearchFilters } from "@/types/job-types"

export default function JobBotPage() {
  // State for job search results
  const [showJobResults, setShowJobResults] = useState(false)
  const [jobSearchFilters, setJobSearchFilters] = useState<JobSearchFilters | null>(null)

  // State for resume analysis
  const [showResumeAnalysis, setShowResumeAnalysis] = useState(false)
  const [resumeAnalysisData, setResumeAnalysisData] = useState<{
    resumeName: string
    targetJob: string
  } | null>(null)

  // Handle job search
  const handleJobSearch = (filters: JobSearchFilters) => {
    setJobSearchFilters(filters)
    setShowJobResults(true)
  }

  // Handle resume job search
  const handleResumeJobSearch = (filters: JobSearchFilters) => {
    setJobSearchFilters(filters)
    setShowJobResults(true)
  }

  // Handle resume analysis
  const handleResumeAnalysis = (resumeName: string, targetJob: string) => {
    setResumeAnalysisData({ resumeName, targetJob })
    setShowResumeAnalysis(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white">
      <AuroraBackground />
      <Navbar />
      <JobSearchProvider>
        <div className="container mx-auto px-4 pt-32 pb-20">
          <JobSearch onSearch={handleJobSearch} />
          <ResumeJobSearch onSearch={handleResumeJobSearch} />
          <ResumeDevelopment onAnalyze={handleResumeAnalysis} />
        </div>

        {/* Page-level modals */}
        {showJobResults && jobSearchFilters && (
          <JobResults filters={jobSearchFilters} onClose={() => setShowJobResults(false)} />
        )}

        {showResumeAnalysis && resumeAnalysisData && (
          <ResumeAnalysisModal
            onClose={() => setShowResumeAnalysis(false)}
            resumeName={resumeAnalysisData.resumeName}
            targetJob={resumeAnalysisData.targetJob}
          />
        )}
      </JobSearchProvider>
      <Footer />
    </main>
  )
}
