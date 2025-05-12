"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react"
import type { Course } from "@/types/course-types"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/ai-course-gen/course/${course.id}`}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/20 bg-emerald-950/70 border-emerald-800 hover:border-emerald-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className="bg-emerald-600 hover:bg-emerald-700">{course.level}</Badge>
            {course.isGenerated && (
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
          <p className="text-emerald-300 text-sm mb-4 line-clamp-3">{course.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {course.topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-emerald-900/30 text-emerald-300 border-emerald-800">
                {topic}
              </Badge>
            ))}
            {course.topics.length > 3 && (
              <Badge variant="outline" className="bg-emerald-900/30 text-emerald-300 border-emerald-800">
                +{course.topics.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-emerald-400">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />8 lessons
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-end items-center">
          <span className="text-emerald-400 flex items-center gap-1 text-sm font-medium">
            View Course <ArrowRight className="h-3 w-3 ml-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
