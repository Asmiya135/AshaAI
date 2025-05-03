

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Briefcase, Building, Calendar, ChevronDown, ExternalLink, MapPin, Trophy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Job {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  date_posted?: string;
  url?: string;
}

interface JobSuggestion {
  title: string;
  reason: string;
}

interface ResumeJobSearchResultsProps {
  results: {
    ocr_text: string;
    masked_text: string;
    job_suggestions: JobSuggestion[];
    // linkedin_jobs: Job[] | { error: string };
    linkedin_jobs: any;
  };
}

export function ResumeJobSearchResults({ results }: ResumeJobSearchResultsProps) {
  const [activeTab, setActiveTab] = useState("suggestions")
  const [showFullResume, setShowFullResume] = useState(false)
  const [linkedinJobs, setLinkedinJobs] = useState<Job[] | { error: string }>(results.linkedin_jobs);

const searchLinkedInJobs = async (jobTitle: string) => {
    try {
      const response = await fetch('https://ashai-jobsearchingwithresume.onrender.com/api/search-linkedin-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn jobs');
      }
      
      const data = await response.json();
      console.log("LinkedIn jobs:", data);
      setLinkedinJobs(data);
      // If there's a URL in the response, open it in a new tab
      if (data.url_scraped) {
        window.open(data.url_scraped, "_blank");
        // return;
      }
      
      // Otherwise update state with the jobs data
      // setLinkedinJobs(data); // ✅ Store in state
      setActiveTab("linkedin"); // Optional: switch tab after search
    } catch (error) {
      console.error("Error searching LinkedIn jobs:", error);
      setLinkedinJobs({ error: "Failed to fetch jobs. Please try again later." });
    }
  };
  return (
    <div className="mt-8">
      <Tabs defaultValue="suggestions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="suggestions" className="text-sm">Job Suggestions</TabsTrigger>
          <TabsTrigger value="resume" className="text-sm">Resume Content</TabsTrigger>
          <TabsTrigger value="linkedin" className="text-sm">LinkedIn Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.job_suggestions.map((suggestion, index) => (
              <Card key={index} className="bg-emerald-950/30 border-emerald-800/30">
                <CardHeader>
                  <CardTitle className="text-emerald-300 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {suggestion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{suggestion.reason}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full bg-emerald-900/30 hover:bg-emerald-800/50 border-emerald-800/50 text-emerald-300"
                    onClick={() => searchLinkedInJobs(suggestion.title)}
                  >
                    Search LinkedIn for this role
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="resume">
          <Card className="bg-emerald-950/30 border-emerald-800/30">
            <CardHeader>
              <CardTitle className="text-emerald-300">Resume Content</CardTitle>
              <CardDescription className="text-gray-400">
                The extracted text from your resume (with sensitive information masked)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-emerald-950/50 p-4 rounded-md border border-emerald-800/50 text-gray-300 overflow-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap">
                  {showFullResume ? results.masked_text : results.masked_text.split('\n').slice(0, 20).join('\n') + '...'}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full bg-emerald-900/30 hover:bg-emerald-800/50 border-emerald-800/50 text-emerald-300"
                onClick={() => setShowFullResume(!showFullResume)}
              >
                {showFullResume ? "Show Less" : "Show Full Resume"}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFullResume ? 'rotate-180' : ''}`} />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin">
          <Card className="bg-emerald-950/30 border-emerald-800/30">
            <CardHeader>
              <CardTitle className="text-emerald-300">LinkedIn Jobs</CardTitle>
              <CardDescription className="text-gray-400">
                Jobs found on LinkedIn matching your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(linkedinJobs) ? (
                <div className="space-y-4">
                  {linkedinJobs.length > 0 ? (
                    linkedinJobs.map((job, index) => (
                      <div key={index} className="bg-emerald-950/50 p-4 rounded-md border border-emerald-800/50">
                        <h3 className="text-emerald-300 font-medium">{job.title}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company || "Unknown company"}</span>
                          <MapPin className="h-4 w-4 ml-2" />
                          <span>{job.location || "Remote/Various"}</span>
                          <Calendar className="h-4 w-4 ml-2" />
                          <span>{job.date_posted || "Recent"}</span>
                        </div>
                        <p className="text-gray-300 mt-2 line-clamp-3">{job.description || "No description available"}</p>
                        {job.url && (
                          <Button 
                            variant="link" 
                            className="text-emerald-400 hover:text-emerald-300 p-0 h-auto mt-2 flex items-center"
                            onClick={() => window.open(job.url, "_blank")}
                          >
                            View on LinkedIn
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-300 py-8">
                      <Trophy className="h-12 w-12 mx-auto mb-2 text-emerald-700/50" />
                      <p>No LinkedIn job results yet</p>
                      <p className="text-gray-400 text-sm mt-2">Select a job suggestion to search for matching positions</p>
                    </div>
                  )}
                </div>
              ) : (
                <Alert variant="destructive" className="bg-red-900/30 border-red-800/50 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {linkedinJobs.error || "Unable to retrieve LinkedIn jobs at this time"}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}