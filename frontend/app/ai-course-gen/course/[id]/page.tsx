"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useCourses } from "@/context/course-context"
import {
  BookOpen,
  Clock,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Circle,
  PlayCircle,
  Award,
  Download,
} from "lucide-react"

export default function CourseViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getCourseById, progress, markSubsectionCompleted, getIsSubsectionCompleted } = useCourses()
  const [activeTab, setActiveTab] = useState("content")
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)
  const [activeSubsectionId, setActiveSubsectionId] = useState<number | null>(null)
  const [course, setCourse] = useState(getCourseById(params.id))

  useEffect(() => {
    const foundCourse = getCourseById(params.id)
    setCourse(foundCourse)

    if (!foundCourse) {
      router.push("/ai-course-gen")
    } else if (foundCourse.modules.length > 0) {
      setActiveModuleId(foundCourse.modules[0].moduleId)
      if (foundCourse.modules[0].subsections.length > 0) {
        setActiveSubsectionId(foundCourse.modules[0].subsections[0].subsectionId)
      }
    }
  }, [params.id, getCourseById, router])

  if (!course) {
    return (
      <div className="container mx-auto px-4 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course not found</h2>
          <p className="text-emerald-300 mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => router.push("/ai-course-gen")}
            variant="outline"
            className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const handleSubsectionClick = (moduleId: number, subsectionId: number) => {
    setActiveModuleId(moduleId)
    setActiveSubsectionId(subsectionId)
  }

  const getActiveSubsection = () => {
    if (!activeModuleId || !activeSubsectionId) return null

    const module = course.modules.find((m) => m.moduleId === activeModuleId)
    if (!module) return null

    return module.subsections.find((s) => s.subsectionId === activeSubsectionId)
  }

  const activeSubsection = getActiveSubsection()

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const totalSubsections = course.modules.reduce((total, module) => total + module.subsections.length, 0)
  const completedCount = course.modules.reduce((count, module) => {
    return (
      count +
      module.subsections.filter((subsection) =>
        getIsSubsectionCompleted(course.id, module.moduleId, subsection.subsectionId),
      ).length
    )
  }, 0)

  const courseProgress = progress[course.id] || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <Button
          onClick={() => router.push("/ai-course-gen")}
          variant="outline"
          className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-white font-medium">Course Progress:</span>
          <span className="text-emerald-400 font-medium">
            {completedCount}/{totalSubsections} completed
          </span>
        </div>
      </div>

      <div className="mb-8">
        <Progress
          value={courseProgress}
          className="h-2 bg-emerald-900/50"
          
        />
      </div>

      <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
         

          <div className="flex-1">
            <Badge className="bg-emerald-700 hover:bg-emerald-600 mb-2">{course.courseLevel}</Badge>

            <h1 className="text-3xl font-bold text-white mb-2">{course.courseTitle}</h1>

            <p className="text-emerald-200 mb-4">{course.courseGoal}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1 bg-emerald-900/30 px-3 py-1.5 rounded-md">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-200">{course.modules.length} Modules</span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-900/30 px-3 py-1.5 rounded-md">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-200">6-8 Weeks</span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-900/30 px-3 py-1.5 rounded-md">
                <Award className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-200">Certificate Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-4 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Course Modules</h2>

            <Accordion type="single" collapsible defaultValue={activeModuleId?.toString()} className="w-full">
              {course.modules.map((module, moduleIndex) => (
                <AccordionItem key={module.moduleId} value={module.moduleId.toString()} className="border-emerald-800">
                  <AccordionTrigger className="text-white hover:text-emerald-400">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-900 text-emerald-400 font-medium">
                        {moduleIndex + 1}
                      </div>
                      <div>
                        <div className="font-medium">{module.moduleTitle}</div>
                        <div className="text-sm text-emerald-400 font-normal">
                          {
                            module.subsections.filter((s) =>
                              getIsSubsectionCompleted(course.id, module.moduleId, s.subsectionId),
                            ).length
                          }
                          /{module.subsections.length} completed
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="text-emerald-200 pl-11">
                    <p className="mb-4">{module.moduleDescription}</p>

                    <h4 className="font-medium text-white mb-2">Lessons:</h4>
                    <ul className="space-y-2">
                      {module.subsections.map((subsection, subsectionIndex) => {
                        const isCompleted = getIsSubsectionCompleted(
                          course.id,
                          module.moduleId,
                          subsection.subsectionId,
                        )
                        const isActive =
                          activeModuleId === module.moduleId && activeSubsectionId === subsection.subsectionId

                        return (
                          <li
                            key={subsection.subsectionId}
                            className={`p-2 rounded-md cursor-pointer transition-colors ${
                              isActive
                                ? "bg-emerald-800/50 border border-emerald-700"
                                : isCompleted
                                  ? "bg-emerald-900/20 hover:bg-emerald-900/40"
                                  : "hover:bg-emerald-900/20"
                            }`}
                            onClick={() => handleSubsectionClick(module.moduleId, subsection.subsectionId)}
                          >
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-emerald-700 shrink-0" />
                              )}
                              <span className={isCompleted ? "text-emerald-400" : "text-white"}>
                                {subsection.subsectionTitle}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          {activeSubsection ? (
            <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-emerald-900/30">
                    <TabsTrigger value="content" className="data-[state=active]:bg-emerald-700">
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="video" className="data-[state=active]:bg-emerald-700">
                      Video
                    </TabsTrigger>
                  </TabsList>

                  <Button
                    onClick={() => markSubsectionCompleted(course.id, activeModuleId!, activeSubsectionId!)}
                    variant={
                      getIsSubsectionCompleted(course.id, activeModuleId!, activeSubsectionId!) ? "default" : "outline"
                    }
                    className={
                      getIsSubsectionCompleted(course.id, activeModuleId!, activeSubsectionId!)
                        ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                        : "border-emerald-700 text-emerald-400 hover:bg-emerald-900/50"
                    }
                  >
                    {getIsSubsectionCompleted(course.id, activeModuleId!, activeSubsectionId!) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </>
                    )}
                  </Button>
                </div>

                <TabsContent value="content" className="mt-0">
                  <h2 className="text-2xl font-bold text-white mb-4">{activeSubsection.subsectionTitle}</h2>
                  <div className="prose prose-emerald prose-invert max-w-none">
                    <p className="text-emerald-200 whitespace-pre-line">{activeSubsection.content}</p>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  <h2 className="text-2xl font-bold text-white mb-4">{activeSubsection.subsectionTitle}</h2>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    {activeSubsection.youtubeVideoId ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(activeSubsection.youtubeVideoId)}`}
                        title={activeSubsection.subsectionTitle}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-900/30">
                        <div className="text-center">
                          <PlayCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                          <p className="text-emerald-300">Video not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/50"
                  onClick={() => {
                    // Find previous subsection
                    const currentModuleIndex = course.modules.findIndex((m) => m.moduleId === activeModuleId)
                    const currentSubsectionIndex = course.modules[currentModuleIndex].subsections.findIndex(
                      (s) => s.subsectionId === activeSubsectionId,
                    )

                    if (currentSubsectionIndex > 0) {
                      // Previous subsection in same module
                      const prevSubsection = course.modules[currentModuleIndex].subsections[currentSubsectionIndex - 1]
                      handleSubsectionClick(activeModuleId!, prevSubsection.subsectionId)
                    } else if (currentModuleIndex > 0) {
                      // Last subsection of previous module
                      const prevModule = course.modules[currentModuleIndex - 1]
                      const lastSubsection = prevModule.subsections[prevModule.subsections.length - 1]
                      handleSubsectionClick(prevModule.moduleId, lastSubsection.subsectionId)
                    }
                  }}
                  disabled={
                    activeModuleId === course.modules[0].moduleId &&
                    activeSubsectionId === course.modules[0].subsections[0].subsectionId
                  }
                >
                  Previous Lesson
                </Button>

                <Button
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  onClick={() => {
                    // Find next subsection
                    const currentModuleIndex = course.modules.findIndex((m) => m.moduleId === activeModuleId)
                    const currentSubsectionIndex = course.modules[currentModuleIndex].subsections.findIndex(
                      (s) => s.subsectionId === activeSubsectionId,
                    )

                    if (currentSubsectionIndex < course.modules[currentModuleIndex].subsections.length - 1) {
                      // Next subsection in same module
                      const nextSubsection = course.modules[currentModuleIndex].subsections[currentSubsectionIndex + 1]
                      handleSubsectionClick(activeModuleId!, nextSubsection.subsectionId)
                    } else if (currentModuleIndex < course.modules.length - 1) {
                      // First subsection of next module
                      const nextModule = course.modules[currentModuleIndex + 1]
                      const firstSubsection = nextModule.subsections[0]
                      handleSubsectionClick(nextModule.moduleId, firstSubsection.subsectionId)
                    }
                  }}
                  disabled={
                    activeModuleId === course.modules[course.modules.length - 1].moduleId &&
                    activeSubsectionId ===
                      course.modules[course.modules.length - 1].subsections[
                        course.modules[course.modules.length - 1].subsections.length - 1
                      ].subsectionId
                  }
                >
                  Next Lesson
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Select a lesson to begin</h3>
                <p className="text-emerald-300">Choose a lesson from the course outline to start learning</p>
              </div>
            </div>
          )}

          {courseProgress === 100 && (
            <div className="bg-emerald-950/70 border border-emerald-800 rounded-lg p-6 mt-8">
              <div className="text-center">
                <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Course Completed!</h3>
                <p className="text-emerald-300 mb-6">
                  Congratulations on completing the course. You can now download your certificate.
                </p>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
