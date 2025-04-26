"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, X } from "lucide-react"

interface ResumeDevelopmentProps {
  onAnalyze: (resumeName: string, targetJob: string) => void
}

export function ResumeDevelopment({ onAnalyze }: ResumeDevelopmentProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dreamJob, setDreamJob] = useState("")
  const [dreamCompany, setDreamCompany] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
    }, 1500)
  }

  const handleAnalyzeResume = () => {
    if (!file) {
      alert("Please upload your resume")
      return
    }

    if (!dreamJob && !dreamCompany) {
      alert("Please enter your dream job or company")
      return
    }

    onAnalyze(file.name, dreamJob || dreamCompany)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-12 bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-emerald-900/20 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Develop Resume According to Your Dream Job</h2>
      <p className="text-gray-300 mb-6">
        Upload your resume and tell us your dream job or company. We'll analyze your resume and provide recommendations
        to help you land your dream role.
      </p>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-emerald-800/50 rounded-lg p-6 text-center">
          <input
            type="file"
            id="resume-development-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          {!file && !isUploading ? (
            <div>
              <div className="h-16 w-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileUp className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-gray-300 mb-4">Drag and drop your resume here, or click to browse</p>
              <Button
                onClick={() => document.getElementById("resume-development-upload")?.click()}
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
              ) : (
                <div className="flex items-center justify-center gap-2">
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
                    onClick={() => setFile(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dream-job" className="text-white mb-2 block">
              Dream Job
            </Label>
            <Input
              id="dream-job"
              value={dreamJob}
              onChange={(e) => setDreamJob(e.target.value)}
              placeholder="e.g. Senior Software Engineer, Product Manager"
              className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:bg-emerald-950/70 focus:border-emerald-700/70"
            />
          </div>

          <div>
            <Label htmlFor="dream-company" className="text-white mb-2 block">
              Dream Company
            </Label>
            <Input
              id="dream-company"
              value={dreamCompany}
              onChange={(e) => setDreamCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft, Tesla"
              className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:bg-emerald-950/70 focus:border-emerald-700/70"
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyzeResume}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg"
          disabled={!file || (!dreamJob && !dreamCompany) || isUploading}
        >
          Analyze Resume
        </Button>
      </div>
    </motion.div>
  )
}
