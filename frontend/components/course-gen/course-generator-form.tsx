"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCourses } from "@/context/course-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import type { CourseGenerationInput } from "@/types/course-types"

export function CourseGeneratorForm() {
  const router = useRouter()
  const { generateCourse, isGenerating } = useCourses()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CourseGenerationInput>({
    title: "Stitching",
    level: "beginner",
    goal: "To earn at home for housewives",
    currentState: "Nothing",
  })

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
      await generateCourse(formData)
      setOpen(false)
      router.push("/course-gen/view-course")
    } catch (error) {
      console.error("Error generating course:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Custom Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-emerald-950 border-emerald-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Generate Personalized Course
          </DialogTitle>
          <DialogDescription className="text-gray-300">
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
  )
}
