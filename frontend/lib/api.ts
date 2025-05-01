// API wrapper for the resume job search service

/**
 * Process a resume file and get job suggestions and LinkedIn jobs
 * @param resumeFile The resume file to process
 * @returns The processing results including OCR text, masked text, job suggestions, and LinkedIn jobs
 */
export async function processResume(resumeFile: File) {
    const formData = new FormData()
    formData.append('resume', resumeFile)
  
    try {
      const response = await fetch('http://localhost:5000/api/process-resume', {
        method: 'POST',
        body: formData,
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process resume')
      }
  
      return await response.json()
    } catch (error: any) {
      console.error('Error processing resume:', error)
      throw new Error(error.message || 'An error occurred while processing your resume')
    }
  }
  
  /**
   * Search for LinkedIn jobs based on a job title
   * @param jobTitle The job title to search for
   * @param location Optional location for the job search
   * @returns The LinkedIn job search results
   */
  export async function searchLinkedInJobs(jobTitle: string, location: string = 'None') {
    try {
      const response = await fetch('/api/search-linkedin-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle, location }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search for LinkedIn jobs')
      }
  
      return await response.json()
    } catch (error: any) {
      console.error('Error searching LinkedIn jobs:', error)
      throw new Error(error.message || 'An error occurred while searching for jobs')
    }
  }
  
  /**
   * Extract keywords from text (utility function)
   * @param text The text to extract keywords from
   * @param maxKeywords Maximum number of keywords to extract
   * @returns Array of extracted keywords
   */
  export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
    // Simple keyword extraction algorithm
    // Remove common words and punctuation, then get most frequent words
    const commonWords = new Set([
      'the', 'and', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i',
      'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'all', 'have', 'new',
      'more', 'an', 'was', 'we', 'will', 'can', 'about', 'which', 'their', 'has', 'but', 'our',
      'one', 'other', 'do', 'they', 'any', 'been', 'would', 'make', 'than', 'its', 'no', 'only',
      'who', 'when', 'what', 'some', 'time', 'may', 'these', 'use', 'first', 'should', 
    ])
    
    // Clean text and split into words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
    
    // Count word frequency
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(entry => entry[0])
  }
  
  /**
   * Types for the API responses
   */
  export interface JobSuggestion {
    title: string
    reason: string
  }
  
  export interface LinkedInJob {
    id: string
    title: string
    company: string
    location: string
    description: string
    date_posted: string
    applicationUrl: string
    company_url: string
    job_url: string
  }
  
  export interface ResumeProcessResult {
    ocr_text: string
    masked_text: string
    job_suggestions: JobSuggestion[]
    linkedin_jobs: LinkedInJob[]
  }