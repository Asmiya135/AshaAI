"use client"

import { useState } from "react"
import { useCourses } from "@/context/course-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Briefcase, Sparkles, GraduationCap, RefreshCw } from "lucide-react"

export function CourseSidebar() {
  const { filterCourses } = useCourses()
  const [level, setLevel] = useState<string | undefined>(undefined)
  const [category, setCategory] = useState<string | undefined>(undefined)

  const handleLevelChange = (value: string) => {
    const newLevel = value === level ? undefined : value
    setLevel(newLevel)
    filterCourses(newLevel, category)
  }

  const handleCategoryChange = (value: string) => {
    const newCategory = value === category ? undefined : value
    setCategory(newCategory)
    filterCourses(level, newCategory)
  }

  const clearFilters = () => {
    setLevel(undefined)
    setCategory(undefined)
    filterCourses(undefined, undefined)
  }

  return (
    <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/50"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white mb-3 block">Experience Level</Label>
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                level === "beginner" ? "bg-emerald-900/50 text-emerald-400" : "text-emerald-200 hover:bg-emerald-900/30"
              }`}
              onClick={() => handleLevelChange("beginner")}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Beginner</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                level === "intermediate"
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "text-emerald-200 hover:bg-emerald-900/30"
              }`}
              onClick={() => handleLevelChange("intermediate")}
            >
              <BookOpen className="h-4 w-4" />
              <span>Intermediate</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                level === "advanced" ? "bg-emerald-900/50 text-emerald-400" : "text-emerald-200 hover:bg-emerald-900/30"
              }`}
              onClick={() => handleLevelChange("advanced")}
            >
              <Sparkles className="h-4 w-4" />
              <span>Advanced</span>
            </div>
          </div>
        </div>

        <Separator className="bg-emerald-800" />

        <div>
          <Label className="text-white mb-3 block">Category</Label>
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                category === "Frontend Development"
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "text-emerald-200 hover:bg-emerald-900/30"
              }`}
              onClick={() => handleCategoryChange("Frontend Development")}
            >
              <BookOpen className="h-4 w-4" />
              <span>Frontend Development</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                category === "Backend Development"
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "text-emerald-200 hover:bg-emerald-900/30"
              }`}
              onClick={() => handleCategoryChange("Backend Development")}
            >
              <Briefcase className="h-4 w-4" />
              <span>Backend Development</span>
            </div>
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                category === "Crafts & Skills"
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "text-emerald-200 hover:bg-emerald-900/30"
              }`}
              onClick={() => handleCategoryChange("Crafts & Skills")}
            >
              <Sparkles className="h-4 w-4" />
              <span>Crafts & Skills</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
