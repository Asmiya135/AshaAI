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

// News article interface
interface NewsArticle {
  id: string
  title: string
  category: string
  source: string
  date: string
  image: string
  summary: string
  url: string
  tags?: string[]
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch news on component mount
  useEffect(() => {
    fetchNews()
  }, [])

  // Simulate fetching news from an API
  const fetchNews = async () => {
    setIsLoading(true)

    // In a real implementation, this would be an API call
    // Example: const response = await fetch('https://newsapi.org/v2/everything?q=women+empowerment&apiKey=YOUR_API_KEY')

    // Simulate API delay
    setTimeout(() => {
      setNewsArticles(mockNewsArticles)
      setIsLoading(false)
    }, 1500)
  }

  // Handle saving an article
  const toggleSaveArticle = (id: string) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter((articleId) => articleId !== id))
    } else {
      setSavedArticles([...savedArticles, id])
    }
  }

  // Filter articles based on active tab and search query
  const filteredArticles = newsArticles.filter((article) => {
    const matchesTab = activeTab === "all" || article.category === activeTab
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    return matchesTab && matchesSearch
  })

  // Get unique categories from articles
  const categories = ["all", ...Array.from(new Set(newsArticles.map((article) => article.category)))]

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 to-black text-white">
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
              <h1 className="text-3xl font-bold">Women Empowerment News</h1>
              <p className="text-gray-300 mt-2">
                Stay informed with the latest news, trends, and opportunities for women
              </p>
            </div>

            <div className="relative w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-emerald-950/50 border-emerald-800/50 text-white placeholder-gray-500 pr-10 w-full md:w-64"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="overflow-x-auto">
              <TabsList className="bg-emerald-900/50 border border-emerald-800/50 p-1 mb-6 inline-flex min-w-max">
                {categories.map((category) => (
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
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                  <p className="text-emerald-300">Loading latest news...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      isSaved={savedArticles.includes(article.id)}
                      onSave={() => toggleSaveArticle(article.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-900/50 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-medium text-lg mb-2">No articles found</h3>
                  <p className="text-gray-400 max-w-md">
                    We couldn't find any articles matching your search criteria. Try adjusting your filters or search
                    terms.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}

interface NewsCardProps {
  article: NewsArticle
  isSaved: boolean
  onSave: () => void
}

function NewsCard({ article, isSaved, onSave }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-emerald-700/90 text-white border-0 capitalize">
          {article.category.replace(/-/g, " ")}
        </Badge>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-emerald-400">{article.source}</span>
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(article.date)}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>

        <p className="text-gray-300 text-sm mb-4 flex-1">{article.summary}</p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-emerald-900/30 text-emerald-300 border-emerald-800/50 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-emerald-800/30">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
          >
            Read more <ExternalLink className="h-3 w-3 ml-1" />
          </a>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isSaved ? "text-emerald-400" : "text-gray-400 hover:text-emerald-400"} hover:bg-emerald-900/50`}
              onClick={onSave}
            >
              {isSaved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/50"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Mock news data - in a real implementation, this would come from an API
const mockNewsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "Women Leaders Breaking Barriers in Corporate India",
    category: "leadership-career",
    source: "Economic Times",
    date: "2023-06-15",
    image: "/diverse-women-leading.png",
    summary:
      "A new report shows a 12% increase in women holding C-suite positions in Indian corporations, with technology and financial sectors leading the change.",
    url: "#",
    tags: ["Leadership", "Corporate", "C-Suite", "Gender Equality"],
  },
  {
    id: "news-2",
    title: "Government Launches ₹500 Crore Fund for Women Entrepreneurs",
    category: "entrepreneurship",
    source: "Business Standard",
    date: "2023-06-12",
    image: "/indian-women-business-leaders.png",
    summary:
      "The Ministry of Women and Child Development has announced a new fund to support women-led startups and businesses across India, with special focus on rural entrepreneurs.",
    url: "#",
    tags: ["Funding", "Startups", "Government Initiative", "Rural Development"],
  },
  {
    id: "news-3",
    title: "Digital Literacy Program Reaches 1 Million Women in Rural Areas",
    category: "education-skills",
    source: "The Hindu",
    date: "2023-06-10",
    image: "/placeholder.svg?key=5xbmx",
    summary:
      "A nationwide digital literacy initiative has successfully trained one million women in rural India, equipping them with essential tech skills for the modern workforce.",
    url: "#",
    tags: ["Digital Literacy", "Rural Women", "Education", "Technology"],
  },
  {
    id: "news-4",
    title: "New Maternity Benefits Act Amendment Extends Coverage to Gig Workers",
    category: "policy-legislation",
    source: "LiveLaw",
    date: "2023-06-08",
    image: "/placeholder.svg?key=ex36u",
    summary:
      "The Parliament has passed an amendment to the Maternity Benefits Act, extending its provisions to include women working in the gig economy and freelance sectors.",
    url: "#",
    tags: ["Legislation", "Maternity Benefits", "Gig Economy", "Women's Rights"],
  },
  {
    id: "news-5",
    title: "Women's Health Initiative Launches Free Screening Programs Nationwide",
    category: "health-wellness",
    source: "India Today",
    date: "2023-06-05",
    image: "/empowering-indian-women-health.png",
    summary:
      "A new health initiative is offering free cancer screening and reproductive health services for women across 100 cities in India, aiming to improve early detection rates.",
    url: "#",
    tags: ["Healthcare", "Cancer Screening", "Women's Health", "Public Health"],
  },
  {
    id: "news-6",
    title: "Women in Tech: New Report Shows Growing Representation in Indian IT Sector",
    category: "technology-innovation",
    source: "TechCrunch India",
    date: "2023-06-03",
    image: "/placeholder.svg?height=300&width=500&query=women%20in%20tech%20india%20IT",
    summary:
      "The representation of women in India's IT sector has grown to 34%, according to a new industry report, with significant increases in technical and leadership roles.",
    url: "#",
    tags: ["Women in Tech", "IT Sector", "Gender Diversity", "STEM"],
  },
  {
    id: "news-7",
    title: "Women's Self-Help Groups Generate ₹1,200 Crore in Annual Revenue",
    category: "entrepreneurship",
    source: "Financial Express",
    date: "2023-06-01",
    image: "/placeholder.svg?height=300&width=500&query=women%20self%20help%20groups%20india",
    summary:
      "Women's self-help groups across India have collectively generated over ₹1,200 crore in revenue last year, creating sustainable livelihoods for over 2 million women.",
    url: "#",
    tags: ["Self-Help Groups", "Rural Economy", "Microenterprise", "Financial Inclusion"],
  },
  {
    id: "news-8",
    title: "New Scholarship Program to Support 10,000 Girls in STEM Education",
    category: "education-skills",
    source: "Indian Express",
    date: "2023-05-28",
    image: "/placeholder.svg?height=300&width=500&query=girls%20STEM%20education%20india",
    summary:
      "A coalition of tech companies and educational institutions has launched a scholarship program to support 10,000 girls from underprivileged backgrounds in pursuing STEM education.",
    url: "#",
    tags: ["STEM Education", "Scholarships", "Girls Education", "Tech Skills"],
  },
  {
    id: "news-9",
    title: "Supreme Court Ruling Strengthens Workplace Sexual Harassment Protections",
    category: "policy-legislation",
    source: "Bar and Bench",
    date: "2023-05-25",
    image: "/placeholder.svg?height=300&width=500&query=workplace%20harassment%20legal%20india",
    summary:
      "A landmark Supreme Court judgment has expanded the interpretation of the POSH Act, strengthening protections for women against workplace sexual harassment.",
    url: "#",
    tags: ["Legal", "POSH Act", "Workplace Safety", "Supreme Court"],
  },
  {
    id: "news-10",
    title: "Women Athletes Secure Record Medal Haul at Asian Games",
    category: "sports-achievement",
    source: "Sports Today",
    date: "2023-05-22",
    image: "/placeholder.svg?height=300&width=500&query=women%20athletes%20india%20medals",
    summary:
      "Indian women athletes have won a record number of medals at the Asian Games, with particularly strong performances in wrestling, boxing, and athletics.",
    url: "#",
    tags: ["Sports", "Asian Games", "Women Athletes", "Olympic Sports"],
  },
  {
    id: "news-11",
    title: "Rural Women Artisans Go Global Through E-commerce Platform",
    category: "entrepreneurship",
    source: "Business Line",
    date: "2023-05-20",
    image: "/placeholder.svg?height=300&width=500&query=rural%20women%20artisans%20handicrafts%20india",
    summary:
      "A new e-commerce platform is connecting rural women artisans directly with global markets, helping traditional handicraft makers increase their income by up to 300%.",
    url: "#",
    tags: ["E-commerce", "Handicrafts", "Rural Artisans", "Global Market"],
  },
  {
    id: "news-12",
    title: "Women-Led Climate Solutions Receive Major Funding Boost",
    category: "environment-sustainability",
    source: "Down To Earth",
    date: "2023-05-18",
    image: "/placeholder.svg?height=300&width=500&query=women%20climate%20solutions%20sustainability",
    summary:
      "Several women-led initiatives focusing on climate solutions and sustainable development have received significant funding from international climate finance organizations.",
    url: "#",
    tags: ["Climate Change", "Sustainability", "Green Initiatives", "Environmental Leadership"],
  },
  {
    id: "news-13",
    title: "Women's Participation in Local Governance Reaches All-Time High",
    category: "leadership-career",
    source: "Governance Today",
    date: "2023-05-15",
    image: "/placeholder.svg?height=300&width=500&query=women%20panchayat%20local%20governance%20india",
    summary:
      "Women's representation in Panchayati Raj institutions has reached an all-time high of 46%, with several states exceeding the mandated 33% reservation.",
    url: "#",
    tags: ["Panchayati Raj", "Local Governance", "Political Representation", "Rural Leadership"],
  },
  {
    id: "news-14",
    title: "AI Tool Developed to Detect Gender Bias in Job Descriptions",
    category: "technology-innovation",
    source: "Tech Today",
    date: "2023-05-12",
    image: "/placeholder.svg?height=300&width=500&query=AI%20gender%20bias%20job%20descriptions",
    summary:
      "An Indian startup has developed an AI tool that helps companies identify and eliminate gender bias in their job descriptions and hiring materials.",
    url: "#",
    tags: ["AI", "Gender Bias", "Recruitment", "Workplace Equality"],
  },
  {
    id: "news-15",
    title: "Women's Mental Health Initiative Launches in 50 Cities",
    category: "health-wellness",
    source: "Health Chronicle",
    date: "2023-05-10",
    image: "/placeholder.svg?height=300&width=500&query=women%20mental%20health%20counseling%20india",
    summary:
      "A new initiative focusing on women's mental health has launched across 50 Indian cities, offering free counseling services and support groups.",
    url: "#",
    tags: ["Mental Health", "Counseling", "Healthcare", "Wellbeing"],
  },
]
