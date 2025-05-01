
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileUp, Search, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ResumeJobSearchResults } from "./resume-job-search-results"
import type { JobSearchFilters } from "@/types/job-types"

interface ResumeJobSearchProps {
  onSearch: (JobSearchFilters: any) => void
}

export function ResumeJobSearch({ onSearch }: ResumeJobSearchProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setResults(null)
      // Clear any previous results when a new file is selected
      setExtractedKeywords([])
    }
  }

  const handleResumeUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setError(null)
    setIsUploading(true)
    setIsProcessing(false)
    setResults(null)

    try {
      // Create form data for the file upload
      const formData = new FormData()
      formData.append('resume', file)

      // Upload to the backend
      const response = await fetch('http://localhost:5000/api/process-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process resume')
      }

      setIsUploading(false)
      setIsProcessing(true)

      // Process the results
      const data = await response.json()
      
      // Extract keywords from job suggestions
      const keywords = data.job_suggestions.flatMap((suggestion: any) => {
        // Extract keywords from job titles and reasons
        const titleWords = suggestion.title.split(/\s+/).filter((word: string) => word.length > 3)
        const reasonWords = suggestion.reason
          .split(/\s+/)
          .filter((word: string) => word.length > 3 && !titleWords.includes(word))
          .slice(0, 5) // Limit reason words to avoid too many keywords
        
        return [...titleWords, ...reasonWords]
      })
      
      // Remove duplicates and limit to 10 keywords
      // const uniqueKeywords = [...new Set(keywords)].slice(0, 10)
      const uniqueKeywords: string[] = [...new Set(keywords as string[])].slice(0, 10);

      setExtractedKeywords(uniqueKeywords)
      setResults(data)
      setIsProcessing(false)

    } catch (err: any) {
      setIsUploading(false)
      setIsProcessing(false)
      setError(err.message || 'An error occurred while processing your resume')
      console.error('Resume processing error:', err)
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setExtractedKeywords(extractedKeywords.filter((k) => k !== keyword))
  }

  const handleMatchJobs = () => {
    if (extractedKeywords.length === 0) {
      setError("Please upload a resume to extract keywords first")
      return
    }

    // Create search filters based on extracted keywords
    const filters: JobSearchFilters = {
      position: extractedKeywords.slice(0, 2).join(" "), // Use first two keywords for position
      company: "",
      location: "",
      experience: [0, 10],
      ageRange: [18, 60],
      workLocationType: "",
      jobType: "",
      //keywords: extractedKeywords, // Add keywords to filters
    }

    onSearch(filters)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12 bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-emerald-900/20 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Search Jobs According to Resume</h2>
      <p className="text-gray-300 mb-6">
        Upload your resume and we'll extract relevant keywords to find job matches that align with your skills and
        experience.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-800/50 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="border-2 border-dashed border-emerald-800/50 rounded-lg p-6 text-center">
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          {!file && !isUploading && !isProcessing ? (
            <div>
              <div className="h-16 w-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileUp className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-gray-300 mb-4">Drag and drop your resume here, or click to browse</p>
              <Button
                onClick={() => document.getElementById("resume-upload")?.click()}
                className="bg-emerald-700 hover:bg-emerald-600 text-white"
              >
                Upload Resume
              </Button>
            </div>
          ) : (
            <div>
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-800/50 border-t-emerald-500 animate-spin mb-4"></div>
                  <p className="text-emerald-300">Uploading resume...</p>
                </div>
              ) : isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-800/50 border-t-emerald-500 animate-spin mb-4"></div>
                  <p className="text-emerald-300">Analyzing resume and finding jobs...</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-10 w-10 bg-emerald-900/50 rounded-full flex items-center justify-center">
                      <FileUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">{file?.name}</p>
                      <p className="text-gray-400 text-sm">
                        {file?.size ? (file.size / 1024 / 1024).toFixed(2) : "0"} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto text-gray-400 hover:text-white hover:bg-emerald-800/50"
                      onClick={() => {
                        setFile(null)
                        setExtractedKeywords([])
                        setResults(null)
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* <div className="mt-6">
                    <Label className="text-white mb-2 block">Extracted Keywords</Label>
                    <div className="flex flex-wrap gap-2 mt-2 min-h-[60px] bg-emerald-950/50 rounded-md p-3 border border-emerald-800/50">
                      {extractedKeywords.length > 0 ? (
                        extractedKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-emerald-800/50 text-emerald-300 border-emerald-700/50 flex items-center gap-1"
                          >
                            {keyword}
                            <button
                              className="ml-1 text-emerald-300 hover:text-white"
                              onClick={() => handleRemoveKeyword(keyword)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No keywords extracted yet</p>
                      )}
                    </div>
                  </div> */}

                  {!results ? (
                    <Button
                      onClick={handleResumeUpload}
                      className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Analyze Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={handleMatchJobs}
                      className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={extractedKeywords.length === 0}
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Match Jobs
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <ResumeJobSearchResults results={results} />
      )}
    </motion.div>
  )
}
