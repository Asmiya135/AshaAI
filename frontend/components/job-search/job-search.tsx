"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Briefcase, Search, MapPin, Clock, Filter, Info } from "lucide-react"
import type { JobSearchFilters } from "@/types/job-types"

interface JobSearchProps {
  onSearch: (filters: JobSearchFilters) => void
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [position, setPosition] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [experience, setExperience] = useState<[number, number]>([0, 10])
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60])
  const [workLocationType, setWorkLocationType] = useState<string>("")
  const [jobType, setJobType] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!position.trim()) {
      alert("Please enter a job position")
      return
    }

    onSearch({
      position,
      company,
      location,
      experience,
      ageRange,
      workLocationType,
      jobType,
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-3">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Search Jobs</h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Find the perfect job opportunities tailored to your skills and preferences. Our AI-powered job matcher will
          help you discover roles that align with your career goals.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-emerald-900/20 p-6"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="position" className="text-white mb-2 block">
                Job Position <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager"
                  required
                  className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:bg-emerald-950/70 focus:border-emerald-700/70 pl-10"
                />
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white bg-emerald-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="company" className="text-white mb-2 block">
                Company (Optional)
              </Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 focus:bg-emerald-950/70 focus:border-emerald-700/70"
              />
            </div>
          </div>

          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full border-emerald-800/50 bg-emerald-900/20 text-emerald-300 hover:bg-emerald-800/40 flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 mb-6"
            >
              <div>
                <Label htmlFor="location" className="text-white mb-2 block">
                  Location (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, Remote"
                    className="bg-emerald-950/50 border-emerald-800/50 text-white pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Experience Range (Years)</Label>
                <div className="pt-6 px-2">
                  <Slider
                    value={experience}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => setExperience(value as [number, number])}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-sm text-emerald-300">
                    <span>{experience[0]} years</span>
                    <span>{experience[1]} years</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Age Range</Label>
                <div className="pt-6 px-2">
                  <Slider
                    value={ageRange}
                    min={18}
                    max={70}
                    step={1}
                    onValueChange={(value) => setAgeRange(value as [number, number])}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-sm text-emerald-300">
                    <span>{ageRange[0]} years</span>
                    <span>{ageRange[1]} years</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="workLocationType" className="text-white mb-2 block">
                    Work Location Type
                  </Label>
                  <Select value={workLocationType} onValueChange={setWorkLocationType}>
                    <SelectTrigger className="bg-emerald-950/50 border-emerald-800/50 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-emerald-900 border-emerald-800 text-white">
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jobType" className="text-white mb-2 block">
                    Job Type
                  </Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger className="bg-emerald-950/50 border-emerald-800/50 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-emerald-900 border-emerald-800 text-white">
                      <SelectItem value="fullTime">Full-time</SelectItem>
                      <SelectItem value="partTime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg">
            <Search className="h-5 w-5 mr-2" />
            Find Jobs
          </Button>
        </form>

        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="how-it-works" className="border-emerald-800/30">
            <AccordionTrigger className="text-emerald-300 hover:text-emerald-200">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                How It Works
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-300">
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-medium">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Enter Job Details</h4>
                    <p className="text-sm text-gray-400">
                      Start by entering the job position you're looking for. Add optional details like company name and
                      location.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-medium">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Set Your Preferences</h4>
                    <p className="text-sm text-gray-400">
                      Use the filters to narrow down your search based on experience, age range, work location type, and
                      job type.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-medium">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">AI-Powered Matching</h4>
                    <p className="text-sm text-gray-400">
                      Our AI analyzes your criteria and matches you with the most relevant job opportunities from our
                      extensive database.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-900/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-400 text-xs font-medium">4</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Explore Opportunities</h4>
                    <p className="text-sm text-gray-400">
                      Review the matched job listings, save your favorites, and apply directly through the provided
                      links.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm p-5">
          <div className="h-12 w-12 rounded-lg bg-emerald-900/70 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Smart Matching</h3>
          <p className="text-gray-300 text-sm">
            Our AI analyzes thousands of job listings to find the perfect match for your skills and preferences.
          </p>
        </div> */}

        {/* <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm p-5">
          <div className="h-12 w-12 rounded-lg bg-emerald-900/70 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Location Flexibility</h3>
          <p className="text-gray-300 text-sm">
            Find jobs that match your location preferences, whether you're looking for remote, hybrid, or on-site
            opportunities.
          </p>
        </div> */}

        {/* <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm p-5">
          <div className="h-12 w-12 rounded-lg bg-emerald-900/70 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Real-time Updates</h3>
          <p className="text-gray-300 text-sm">
            Get access to the latest job postings with real-time updates from multiple sources and job boards.
          </p>
        </div> */}
      </motion.div>
    </div>
  )
}
