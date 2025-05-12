"use client"

import { useCourses } from "@/context/course-context"
import { CourseCard } from "@/components/course-gen/course-card"

export function CourseList() {
  const { filteredCourses } = useCourses()

  return (
    <div>
      {filteredCourses.length === 0 ? (
        <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-emerald-300 mb-6">Try adjusting your filters or generate a custom course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
