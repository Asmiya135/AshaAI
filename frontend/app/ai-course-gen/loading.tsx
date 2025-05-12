import { Loader2 } from "lucide-react"

export default function CourseGenLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Loading courses...</h2>
        <p className="text-emerald-300 mt-2">Please wait while we prepare your learning experience.</p>
      </div>
    </div>
  )
}
