export interface Course {
    id: string
    title: string
    description: string
    level: string
    duration: string
    topics: string[]
    category: string
    image: string
    isGenerated?: boolean
  }
  
  export interface CourseGenerationInput {
    title: string
    level: string
    goal: string
    currentState: string
  }
  
  export interface GeneratedCourse {
    id: string
    courseTitle: string
    courseLevel: "beginner" | "intermediate" | "advanced"
    courseGoal: string
    modules: CourseModule[]
    image: string
  }
  
  export interface CourseModule {
    moduleId: number
    moduleTitle: string
    moduleDescription: string
    subsections: CourseSubsection[]
  }
  
  export interface CourseSubsection {
    subsectionId: number
    subsectionTitle: string
    content: string
    youtubeVideoId: string
    completed?: boolean
  }
  