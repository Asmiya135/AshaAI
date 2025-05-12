import type React from "react"
import { CourseProvider } from "@/context/course-context"

export default function CourseGenLayout({ children }: { children: React.ReactNode }) {
  return (
    <CourseProvider>
      <div className="min-h-screen bg-emerald-950 text-white">{children}</div>
    </CourseProvider>
  )
}
