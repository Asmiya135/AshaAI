"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { JobListing } from "@/types/job-types"

interface JobSearchContextType {
  savedJobs: JobListing[]
  saveJob: (job: JobListing) => void
  removeJob: (id: string) => void
  isJobSaved: (id: string) => boolean
}

const JobSearchContext = createContext<JobSearchContextType | undefined>(undefined)

export function JobSearchProvider({ children }: { children: ReactNode }) {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([])

  const saveJob = (job: JobListing) => {
    setSavedJobs((prev) => [...prev, job])
  }

  const removeJob = (id: string) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== id))
  }

  const isJobSaved = (id: string) => {
    return savedJobs.some((job) => job.id === id)
  }

  return (
    <JobSearchContext.Provider value={{ savedJobs, saveJob, removeJob, isJobSaved }}>
      {children}
    </JobSearchContext.Provider>
  )
}

export function useJobSearch() {
  const context = useContext(JobSearchContext)
  if (context === undefined) {
    throw new Error("useJobSearch must be used within a JobSearchProvider")
  }
  return context
}
