"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, BookmarkPlus, Share2, ExternalLink, Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Mic, MicOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast" // Import toast if available

// Add SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// Update the NewsArticle interface to match the provided JSON structure
interface NewsArticle {
  id?: string
  title: string
  description: string
  content: string
  publishedAt: string
  source:
    | {
        name: string
      }
    | string
  url: string
  urlToImage: string
  category?: string
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Add state for modal and selected article
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("Women related news")

  // Load saved articles from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedArticles')
    if (saved) {
      setSavedArticles(JSON.parse(saved))
    }
    
    // Initial news fetch with default query
    fetchNews('Women related news')
  }, [])

  // Save to localStorage whenever savedArticles changes
  useEffect(() => {
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles))
  }, [savedArticles])

  // Fetch news directly from Flask backend API
  const fetchNews = async (query = '') => {
    setIsLoading(true);
    
    // Use the provided query or fall back to the current query state
    const searchTerm = query || currentQuery || 'women in India';
    
    // Update the current query state to match what we're searching for
    setCurrentQuery(searchTerm);
    
    try {
      const response = await fetch('http://localhost:5002/get-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle: searchTerm }),
      });
  
      if (!response.ok) {
        // Try to extract error message from backend, if any
        let errorMsg = 'Failed to fetch news';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
  
      const data = await response.json();
  
      // Defensive: Ensure articles is always an array
      const articles = Array.isArray(data.articles) ? data.articles : [];
  
      // Process the articles to add IDs and categories
      const processedArticles = articles.map((article: { title: string; content: string }, index: any) => ({
        ...article,
        id: `article-${index}`,
        category: assignCategory(article.title, article.content),
      }));
  
      setNewsArticles(processedArticles);
    } catch (error) {
      console.error('Error fetching news:', error);
  
      toast?.({
        title: "Error",
         description: (error as Error).message|| "Failed to fetch news. Using mock data instead.",
        variant: "destructive",
      });
  
      // Fallback to mock data in case of error
      setNewsArticles([
        ...(womenInTechNews || []),
        ...(mockNewsArticles || []),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to assign categories based on content
  const assignCategory = (title: string, content: string) => {
    const combinedText = `${title} ${content}`.toLowerCase()
    
    if (combinedText.includes('tech') || combinedText.includes('technology') || 
        combinedText.includes('digital') || combinedText.includes('innovation')) {
      return 'technology-innovation'
    } else if (combinedText.includes('entrepreneur') || combinedText.includes('startup') || 
               combinedText.includes('business')) {
      return 'entrepreneurship'
    } else if (combinedText.includes('education') || combinedText.includes('learning') || 
               combinedText.includes('skills') || combinedText.includes('training')) {
      return 'education-skills'
    } else if (combinedText.includes('leadership') || combinedText.includes('career') || 
               combinedText.includes('executive') || combinedText.includes('corporate')) {
      return 'leadership-career'
    }
    
    return 'general'
  }

  // Handle search submission
  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Execute search with current searchQuery value
    fetchNews(searchQuery)
  }

  // Add voice recognition functionality
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = "en-US"
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: { results: { transcript: any }[][] }) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        // Auto-search when voice input is complete
        fetchNews(transcript)
      }

      recognition.onerror = (event: { error: any }) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        
        toast?.({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again or use text search.`,
          variant: "destructive",
        });
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      toast?.({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
    }
  }

  const stopListening = () => {
    setIsListening(false)
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.stop()
    }
  }

  // Handle saving an article
  const toggleSaveArticle = (id: string) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter((articleId) => articleId !== id))
      
      toast?.({
        title: "Article Removed",
        description: "Article has been removed from saved items.",
        variant: "default",
      });
    } else {
      setSavedArticles([...savedArticles, id])
      
      toast?.({
        title: "Article Saved",
        description: "Article has been added to your saved items.",
        variant: "default",
      });
    }
  }

  // Filter articles based on active tab and search query
  const filteredArticles = newsArticles.filter((article) => {
    const matchesTab = activeTab === "all" || article.category === activeTab
    return matchesTab
  })

  // Get unique categories from articles with proper sorting
  const categories = ["all", ...Array.from(new Set(newsArticles
    .filter(article => article.category) // Filter out undefined categories
    .map((article) => article.category)))
    .sort()]; // Sort categories alphabetically

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-emerald-950 text-white">
      <AuroraBackground />
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Women's News Bot</h1>
              <p className="text-emerald-300 mt-2">
                Stay informed with the latest news, trends, and opportunities for women
              </p>
              
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-auto flex">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 pr-20 w-full md:w-64"
              />
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isListening ? "text-emerald-400" : "text-emerald-800"}`}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2"
                disabled={isLoading}
              >
                <Search className="h-4 w-4 text-gray-400" />
              </Button>
            </form>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="overflow-x-auto">
            <TabsList className="bg-gradient-to-b from-emerald-950 to-black p-1 mb-6 inline-flex min-w-max">
  {categories
    .filter((category): category is string => typeof category === "string") // ✅ filters out undefined
    .map((category) => (
      <TabsTrigger
        key={category}
        value={category}
        className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white capitalize"
      >
        {category === "all" ? "All News" : category.replace(/-/g, " ")}
      </TabsTrigger>
    ))}
</TabsList>

            </div>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="bg-gradient-to-b from-emerald-950 to-black flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                  <p className="text-emerald-300">Loading latest news...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles
  .filter((article) => article.id !== undefined) // ✅ only proceed with defined IDs
  .map((article) => (
    <NewsHeadline
      key={article.id}
      article={article}
      isSaved={savedArticles.includes(article.id!)} // `!` since you've already filtered
      onSave={() => toggleSaveArticle(article.id!)}
      setSelectedArticle={setSelectedArticle}
      setIsModalOpen={setIsModalOpen}
    />
))}

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-900 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg mb-2">No articles found</h3>
                  <p className="text-emerald-300 max-w-md">
                    We couldn't find any articles matching your search criteria. Try adjusting your filters or search
                    terms.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      {/* Article Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedArticle && (
          <DialogContent className="bg-gradient-to-b from-emerald-950 to-black border-emerald-800/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">{selectedArticle.title}</DialogTitle>
              <DialogDescription className="text-emerald-100">
                {typeof selectedArticle.source === "string" ? selectedArticle.source : selectedArticle.source.name} •{" "}
                {new Date(selectedArticle.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DialogDescription>
            </DialogHeader>

            {selectedArticle.urlToImage && selectedArticle.urlToImage !== "No image available." && (
              <div className="w-full h-64 overflow-hidden rounded-md mb-4">
                <img
                  src={selectedArticle.urlToImage || "/placeholder.svg"}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            )}

            <div className="space-y-4">
              <p className="text-white font-medium">{selectedArticle.description}</p>
              <p className="text-white">{selectedArticle.content}</p>

              <div className="pt-4 flex justify-between items-center border-t border-emerald-800/30">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-emerald-400 hover:bg-emerald-900/50"
                    onClick={() => {
                      if (selectedArticle?.id) {
                        toggleSaveArticle(selectedArticle.id)
                      }
                    }}
                    
                  >
                    {selectedArticle?.id && savedArticles.includes(selectedArticle.id)? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-900/50">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-emerald-400 hover:text-emerald-300"
                >
                  Read full article
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      <Footer />
    </main>
  )
}

interface NewsHeadlineProps {
  article: NewsArticle
  isSaved: boolean
  onSave: () => void
  setSelectedArticle: (article: NewsArticle | null) => void
  setIsModalOpen: (open: boolean) => void
}

function NewsHeadline({ article, isSaved, onSave, setSelectedArticle, setIsModalOpen }: NewsHeadlineProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const sourceName = typeof article.source === "string" ? article.source : article.source.name

  const openArticleDetail = () => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  return (
    <Card
      className="bg-gradient-to-br from-emerald-900 to-black border-emerald-800 p-4 hover:bg-emerald-900/50 transition-colors cursor-pointer"
      onClick={openArticleDetail}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {article.urlToImage && article.urlToImage !== "No image available." && (
          <div className="w-full md:w-1/4 h-40 md:h-auto overflow-hidden rounded-md">
            <img
              src={article.urlToImage || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {article.category && (
              <Badge className="bg-emerald-700/90 text-white border-0 capitalize">
                {article.category.replace(/-/g, " ")}
              </Badge>
            )}
            <span className="text-sm text-emerald-400">{sourceName}</span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>

          <p className="text-white text-sm mb-3 line-clamp-2">{article.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-emerald-300">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.publishedAt)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:ml-4 justify-end md:flex-col">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isSaved ? "text-emerald-400" : "text-emerald-800 hover:text-emerald-400"} hover:bg-emerald-900/50`}
            onClick={(e) => {
              e.stopPropagation()
              onSave()
            }}
          >
            {isSaved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-emerald-800 hover:text-emerald-400 hover:bg-emerald-900/50"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 flex items-center justify-center text-emerald-800 hover:text-emerald-400 hover:bg-emerald-900/50 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  )
}

// Fallback mock data in case API fails
const womenInTechNews: NewsArticle[] = [
  {
    id: "tech-1",
    title: "WordCamp Central: EmpowerWP Bhopal 2025: A Journey of Inclusion and Impact!",
    description:
      "Some moments in life leave an indelible mark on our hearts, and for me, EmpowerWP Bhopal 2025 was one of them. As the lead organizer, I envisioned an event that would bring a positive change to the lives of people around us, in society, and not just in the co…",
    content:
      "Some moments in life leave an indelible mark on our hearts, and for me, EmpowerWP Bhopal 2025 was one of them. As the lead organizer, I envisioned an event that would bring a positive change to the lives of people around us, in society, and not just in the coding community. This vision materialized into a successful event that celebrated diversity, inclusion, and the power of technology to drive positive change.",
    publishedAt: "2025-04-29T10:06:01Z",
    source: "Wordcamp.org",
    url: "https://central.wordcamp.org/news/2025/04/empowerwp-bhopal-2025-a-journey-of-inclusion-and-impact/",
    urlToImage:
      "https://events.wordpress.org/bhopal/2025/WomensDay/files/2025/03/IMG_1159-edited-scaled-e1742113068243-1024x398.jpg",
    category: "technology-innovation",
  },
  {
    id: "tech-2",
    title: "Women in Tech Report Shows 22% Increase in Leadership Roles",
    description:
      "A new industry report reveals a significant increase in women holding leadership positions in tech companies over the past year.",
    content:
      "A new industry report reveals a significant 22% increase in women holding leadership positions in tech companies over the past year, with the highest growth in AI and cybersecurity sectors. This positive trend indicates that diversity initiatives and mentorship programs are beginning to show measurable results in the technology industry.",
    publishedAt: "2025-06-18T14:30:00Z",
    source: "TechCrunch",
    url: "#",
    urlToImage: "/placeholder.svg?key=fholz",
    category: "technology-innovation",
  },
  {
    id: "tech-3",
    title: "Google Launches $25M Fund for Women-Led AI Startups",
    description: "Google has announced a new fund specifically targeting AI startups founded or co-founded by women.",
    content:
      "Google has announced a new $25 million fund specifically targeting AI startups founded or co-founded by women, aiming to address the gender gap in AI development and funding. The initiative comes as part of Google's broader commitment to fostering diversity in the tech ecosystem and ensuring AI technologies are developed by diverse teams.",
    publishedAt: "2025-06-15T09:45:00Z",
    source: "VentureBeat",
    url: "#",
    urlToImage: "/placeholder.svg?key=0nihd",
    category: "technology-innovation",
  },
]

const mockNewsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "Women Leaders Breaking Barriers in Corporate India",
    description: "A new report shows a significant increase in women holding C-suite positions in Indian corporations.",
    content:
      "A new report shows a 12% increase in women holding C-suite positions in Indian corporations, with technology and financial sectors leading the change. This trend represents a significant shift in corporate leadership dynamics and highlights the growing recognition of the value that diverse leadership brings to organizational success.",
    publishedAt: "2025-06-15T08:30:00Z",
    source: "Economic Times",
    url: "#",
    urlToImage: "/placeholder.svg?key=flbh3",
    category: "leadership-career",
  },
  {
    id: "news-2",
    title: "Government Launches ₹500 Crore Fund for Women Entrepreneurs",
    description:
      "The Ministry of Women and Child Development has announced a new fund to support women-led startups and businesses across India.",
    content:
      "The Ministry of Women and Child Development has announced a new fund to support women-led startups and businesses across India, with special focus on rural entrepreneurs. The ₹500 crore initiative aims to address the funding gap faced by women entrepreneurs and provide them with the necessary capital to scale their businesses.",
    publishedAt: "2025-06-12T11:20:00Z",
    source: "Business Standard",
    url: "#",
    urlToImage: "/placeholder.svg?key=xoun3",
    category: "entrepreneurship",
  },
  {
    id: "news-3",
    title: "Digital Literacy Program Reaches 1 Million Women in Rural Areas",
    description: "A nationwide digital literacy initiative has successfully trained one million women in rural India.",
    content:
      "A nationwide digital literacy initiative has successfully trained one million women in rural India, equipping them with essential tech skills for the modern workforce. The program, which combines online and offline learning methods, has been particularly effective in helping women access new economic opportunities through digital platforms.",
    publishedAt: "2025-06-10T13:45:00Z",
    source: "The Hindu",
    url: "#",
    urlToImage: "/placeholder.svg?key=p4myj",
    category: "education-skills",
  },
]