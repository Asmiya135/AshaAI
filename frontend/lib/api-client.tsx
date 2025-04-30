import type { JobSearchFilters, JobListing } from "@/types/job-types"

const API_URL = "http://localhost:5000/api"

export async function searchJobs(filters: JobSearchFilters): Promise<JobListing[]> {
  try {
    const response = await fetch(`${API_URL}/search-jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.jobs || []
  } catch (error) {
    console.error('Error searching jobs:', error)
    
    // Fall back to mock data in case of API failure
    return []
  }
}
