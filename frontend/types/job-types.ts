export interface JobSearchFilters {
  position: string
  company: string
  location: string
  experience: [number, number]
  ageRange: [number, number]
  workLocationType: string
  jobType: string
}

export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  locationType: string
  salary?: string
  description: string
  requirements: string
  postedDate: string
  applyUrl: string
}


