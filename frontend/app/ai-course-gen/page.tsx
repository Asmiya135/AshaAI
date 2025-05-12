"use client"
import { useState, useEffect, useRef } from "react"

import type React from "react"

import { useRouter } from "next/navigation"
import { CourseSidebar } from "@/components/course-gen/course-sidebar"
import { CourseCard } from "@/components/course-gen/course-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import { useCourses } from "@/context/course-context"
import { Navbar } from "@/components/navbar"
import { AuroraBackground } from "@/components/aurora-background"


export default function CourseGenPage() {
  const router = useRouter()
  const { courses, filteredCourses, generateCourse, isGenerating, filterCourses } = useCourses()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "Stitching",
    level: "beginner",
    goal: "To earn at home for housewives",
    currentState: "Nothing",
  })

  // Use a ref to track if we've already initialized
  const initializedRef = useRef(false)

  // Only filter courses on initial mount
  useEffect(() => {
    if (!initializedRef.current) {
      filterCourses()
      initializedRef.current = true
    }
  }, [filterCourses])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const courseId = await generateCourse(formData)
      setIsFormOpen(false)

      // Stay on the current page to show the newly generated course
      // The context will update filteredCourses automatically
    } catch (error) {
      console.error("Error generating course:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <AuroraBackground />
        <Navbar />
      <div className="mb-8 mt-19">
        <h1 className="text-3xl md:text-4xl font-bold text-white">AI Course Generator</h1>
        <p className="text-emerald-300 mt-2 max-w-3xl">
          Discover curated courses or generate personalized learning paths tailored to your goals, experience level, and
          interests.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 mb-6 md:mb-0">
          <CourseSidebar />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Available Courses</h2>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Custom Course
            </Button>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-emerald-300 mb-6">Try adjusting your filters or generate a custom course.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {/* Course Generator Form Dialog */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[500px] bg-emerald-950 border-emerald-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Generate Personalized Course
                </DialogTitle>
                <DialogDescription className="text-emerald-300">
                  Fill in the details below to create a customized learning path tailored to your needs.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-white">
                      Course Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Stitching"
                      value={formData.title}
                      onChange={handleChange}
                      className="border-emerald-800 bg-emerald-900/30 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="level" className="text-white">
                      Experience Level
                    </Label>
                    <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                      <SelectTrigger className="border-emerald-800 bg-emerald-900/30 text-white">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent className="border-emerald-800 bg-emerald-950 text-white">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal" className="text-white">
                      Learning Goal
                    </Label>
                    <Textarea
                      id="goal"
                      name="goal"
                      placeholder="What do you want to achieve with this course?"
                      value={formData.goal}
                      onChange={handleChange}
                      className="border-emerald-800 bg-emerald-900/30 text-white placeholder:text-gray-400 min-h-[80px]"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currentState" className="text-white">
                      Current Knowledge
                    </Label>
                    <Textarea
                      id="currentState"
                      name="currentState"
                      placeholder="What do you already know about this subject?"
                      value={formData.currentState}
                      onChange={handleChange}
                      className="border-emerald-800 bg-emerald-900/30 text-white placeholder:text-gray-400 min-h-[80px]"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Course
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
