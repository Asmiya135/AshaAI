"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle, XCircle, BookOpen, FileText, Award, ArrowRight } from "lucide-react"

interface ResumeAnalysisModalProps {
  onClose: () => void
  resumeName: string
  targetJob: string
}

export function ResumeAnalysisModal({ onClose, resumeName, targetJob }: ResumeAnalysisModalProps) {
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false)
  const [courseGenerated, setCourseGenerated] = useState(false)

  // Mock data for resume analysis
  const resumeSkills = [
    { name: "JavaScript", level: "Advanced", match: true },
    { name: "React", level: "Intermediate", match: true },
    { name: "Node.js", level: "Intermediate", match: true },
    { name: "Python", level: "Beginner", match: false },
    { name: "Project Management", level: "Advanced", match: true },
    { name: "UI/UX Design", level: "Intermediate", match: false },
    { name: "Data Analysis", level: "Beginner", match: false },
  ]

  const recommendedSkills = [
    { name: "TypeScript", priority: "High", reason: "Essential for modern frontend development" },
    { name: "AWS", priority: "Medium", reason: "Cloud infrastructure knowledge is increasingly important" },
    { name: "GraphQL", priority: "Medium", reason: "Modern API technology used by many companies" },
    { name: "Docker", priority: "High", reason: "Container technology used in most development environments" },
    { name: "CI/CD", priority: "Medium", reason: "Automation skills are highly valued" },
  ]

  const matchScore = 65 // Percentage match

  const handleGenerateCourse = () => {
    setIsGeneratingCourse(true)

    // Simulate course generation
    setTimeout(() => {
      setIsGeneratingCourse(false)
      setCourseGenerated(true)
    }, 2500)
  }

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
          className="bg-gradient-to-br from-emerald-900/90 to-emerald-950/90 rounded-xl border border-emerald-800/50 backdrop-blur-sm shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-800/70 flex items-center justify-center">
                <FileText className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Resume Analysis</h2>
                <p className="text-emerald-300 text-sm">
                  For <span className="font-medium">{targetJob}</span>
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

          <div className="p-6 max-h-[calc(85vh-80px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <span className="text-white font-medium">{resumeName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Match Score:</span>
                <div className="w-32 h-2 bg-emerald-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${matchScore >= 70 ? "bg-emerald-500" : matchScore >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${matchScore}%` }}
                  ></div>
                </div>
                <span
                  className={`text-sm font-medium ${matchScore >= 70 ? "text-emerald-400" : matchScore >= 40 ? "text-yellow-400" : "text-red-400"}`}
                >
                  {matchScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-400" />
                  Skills in Your Resume
                </h3>

                <div className="space-y-3">
                  {resumeSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-emerald-900/30 p-3 rounded-lg border border-emerald-800/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{skill.name}</span>
                          {skill.match ? (
                            <Badge className="bg-emerald-700/50 text-emerald-200 border-0">Match</Badge>
                          ) : null}
                        </div>
                        <span className="text-sm text-gray-400">{skill.level}</span>
                      </div>

                      {skill.match ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  Recommended Skills to Add
                </h3>

                <div className="space-y-3">
                  {recommendedSkills.map((skill, index) => (
                    <div key={index} className="bg-emerald-900/30 p-3 rounded-lg border border-emerald-800/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{skill.name}</span>
                        <Badge
                          className={`${
                            skill.priority === "High"
                              ? "bg-red-900/50 text-red-200"
                              : skill.priority === "Medium"
                                ? "bg-yellow-900/50 text-yellow-200"
                                : "bg-emerald-900/50 text-emerald-200"
                          } border-0`}
                        >
                          {skill.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{skill.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-emerald-800/30 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Skill Development Plan</h3>

              <p className="text-gray-300 mb-6">
                Based on our analysis, we recommend focusing on developing the following skills to increase your chances
                of landing your dream job.
              </p>

              {courseGenerated ? (
                <div className="bg-emerald-900/30 p-4 rounded-lg border border-emerald-800/50">
                  <h4 className="text-white font-medium mb-3">Personalized Learning Path Generated</h4>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-800/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs font-medium">1</span>
                      </div>
                      <div>
                        <h5 className="text-emerald-300 font-medium">TypeScript Fundamentals</h5>
                        <p className="text-sm text-gray-400">
                          Learn the basics of TypeScript to enhance your JavaScript skills
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-800/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs font-medium">2</span>
                      </div>
                      <div>
                        <h5 className="text-emerald-300 font-medium">Docker & Containerization</h5>
                        <p className="text-sm text-gray-400">
                          Master Docker basics and learn how to containerize applications
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-800/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs font-medium">3</span>
                      </div>
                      <div>
                        <h5 className="text-emerald-300 font-medium">AWS Cloud Essentials</h5>
                        <p className="text-sm text-gray-400">Introduction to AWS services and cloud infrastructure</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      View Full Learning Path <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateCourse}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg"
                  disabled={isGeneratingCourse}
                >
                  {isGeneratingCourse ? (
                    <>
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Generating Course...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-5 w-5 mr-2" />
                      Generate Personalized Course
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-emerald-800/50 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              This analysis is based on current job market trends and requirements
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
