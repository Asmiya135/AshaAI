"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Course, CourseGenerationInput, GeneratedCourse } from "@/types/course-types"

interface CourseContextType {
  courses: Course[]
  filteredCourses: Course[]
  generatedCourses: GeneratedCourse[]
  currentCourse: GeneratedCourse | null
  isGenerating: boolean
  completedSubsections: Record<string, number[]>
  progress: Record<string, number>
  filterCourses: (level?: string, category?: string) => void
  generateCourse: (input: CourseGenerationInput) => Promise<string>
  getCourseById: (id: string) => GeneratedCourse | null
  markSubsectionCompleted: (courseId: string, moduleId: number, subsectionId: number) => void
  getIsSubsectionCompleted: (courseId: string, moduleId: number, subsectionId: number) => boolean
  setCurrentCourse: (course: GeneratedCourse | null) => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export function CourseProvider({ children }: { children: ReactNode }) {
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [generatedCourses, setGeneratedCourses] = useState<GeneratedCourse[]>([])
  const [currentCourse, setCurrentCourse] = useState<GeneratedCourse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedSubsections, setCompletedSubsections] = useState<Record<string, number[]>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})

  const calculateProgress = (courseId: string) => {
    const course = generatedCourses.find((c) => c.id === courseId)
    if (!course) return 0

    const totalSubsections = course.modules.reduce((total, module) => total + module.subsections.length, 0)
    const completed = completedSubsections[courseId]?.length || 0
    return totalSubsections > 0 ? (completed / totalSubsections) * 100 : 0
  }

  useEffect(() => {
    const newProgress: Record<string, number> = {}
    generatedCourses.forEach((course) => {
      newProgress[course.id] = calculateProgress(course.id)
    })
    setProgress(newProgress)
  }, [completedSubsections, generatedCourses])

  const filterCourses = React.useCallback(
    (level?: string, category?: string) => {
      let filtered = [...allCourses]
      if (level) filtered = filtered.filter((course) => course.level === level)
      if (category) filtered = filtered.filter((course) => course.category === category)
      setFilteredCourses(filtered)
    },
    [allCourses]
  )

  const generateCourse = async (input: CourseGenerationInput): Promise<string> => {
    setIsGenerating(true)
    try {
      const response = await fetch("http://localhost:5002/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Course generation failed")
      }

      const generatedCourse: GeneratedCourse = await response.json()
      const newCourseId = `generated-${Date.now()}`

      // Update state with new course
      setGeneratedCourses(prev => [...prev, { ...generatedCourse, id: newCourseId }])
      
      const convertedCourse = convertGeneratedToCourse(generatedCourse, newCourseId)
      setAllCourses(prev => [...prev, convertedCourse])
      setFilteredCourses(prev => [...prev, convertedCourse])

      // Initialize completion tracking
      setCompletedSubsections(prev => ({
        ...prev,
        [newCourseId]: []
      }))

      return newCourseId
    } catch (error) {
      console.error("Course generation failed:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const convertGeneratedToCourse = (generated: GeneratedCourse, id: string): Course => ({
    id,
    title: generated.courseTitle,
    description: generated.courseGoal,
    level: generated.courseLevel,
    duration: "6-8 weeks",
    topics: generated.modules
      .flatMap(module => module.subsections.map(sub => sub.subsectionTitle.split(":")[0]))
      .slice(0, 5),
    category: "Custom Generated",
    image: "/default-course.png"
  })

  // Rest of the context methods remain similar...
  // [Keep the markSubsectionCompleted, getIsSubsectionCompleted, etc. implementations]

  return (
    <CourseContext.Provider
      value={{
        courses: allCourses,
        filteredCourses,
        generatedCourses,
        currentCourse,
        isGenerating,
        completedSubsections,
        progress,
        filterCourses,
        generateCourse,
        getCourseById: (id) => generatedCourses.find(c => c.id === id) || null,
        markSubsectionCompleted: (courseId, moduleId, subsectionId) => {
          const uniqueId = moduleId * 100 + subsectionId
          setCompletedSubsections(prev => ({
            ...prev,
            [courseId]: prev[courseId]?.includes(uniqueId)
              ? prev[courseId].filter(id => id !== uniqueId)
              : [...(prev[courseId] || []), uniqueId]
          }))
        },
        getIsSubsectionCompleted: (courseId, moduleId, subsectionId) => {
          const uniqueId = moduleId * 100 + subsectionId
          return completedSubsections[courseId]?.includes(uniqueId) || false
        },
        setCurrentCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CourseContext)
  if (!context) throw new Error("useCourses must be used within a CourseProvider")
  return context
}
