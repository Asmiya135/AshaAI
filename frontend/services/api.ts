

// // src/services/api.ts

// import type { JobSearchFilters, JobListing } from "@/types/job-types"

// // Base API URL - can be configured via environment variable
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// /**
//  * Search for jobs with the given filters
//  */
// export async function searchJobs(filters: JobSearchFilters): Promise<JobListing[]> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/jobs/search`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(filters),
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(errorData.error || "Failed to search jobs")
//     }

//     const data = await response.json()
//     return data.jobs
//   } catch (error) {
//     console.error("Error searching jobs:", error)
//     throw error
//   }
// }

// /**
//  * Health check for the API
//  */
// export async function checkApiHealth(): Promise<boolean> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/health`)
//     return response.ok
//   } catch (error) {
//     console.error("API health check failed:", error)
//     return false
//   }
// }