"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuroraBackground } from "@/components/aurora-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Calendar,
  ChevronDown,
  Download,
  FileText,
  BarChart2,
  PieChartIcon,
  TrendingUp,
  Clock,
  Briefcase,
  Award,
} from "lucide-react"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for charts
  const jobApplicationData = [
    { name: "Jan", applications: 5, interviews: 2, offers: 0 },
    { name: "Feb", applications: 8, interviews: 3, offers: 1 },
    { name: "Mar", applications: 12, interviews: 5, offers: 2 },
    { name: "Apr", applications: 10, interviews: 4, offers: 1 },
    { name: "May", applications: 15, interviews: 6, offers: 2 },
    { name: "Jun", applications: 18, interviews: 8, offers: 3 },
  ]

  const skillProgressData = [
    { name: "JavaScript", score: 85 },
    { name: "React", score: 75 },
    { name: "Node.js", score: 65 },
    { name: "Python", score: 45 },
    { name: "UI/UX", score: 70 },
    { name: "Data Analysis", score: 50 },
  ]

  const jobCategoryData = [
    { name: "Software Development", value: 45 },
    { name: "Data Science", value: 20 },
    { name: "Product Management", value: 15 },
    { name: "UI/UX Design", value: 10 },
    { name: "Other", value: 10 },
  ]

  const COLORS = ["#10B981", "#059669", "#047857", "#065F46", "#064E3B"]

  const learningTimeData = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.0 },
    { day: "Wed", hours: 1.0 },
    { day: "Thu", hours: 2.5 },
    { day: "Fri", hours: 1.8 },
    { day: "Sat", hours: 3.0 },
    { day: "Sun", hours: 2.2 },
  ]

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
              <h1 className="text-3xl font-bold">My Analytics</h1>
              <p className="text-gray-300 mt-2">Track your progress and performance insights</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-900/40 rounded-lg border border-emerald-800/30 p-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-300">Last 6 months</span>
                <ChevronDown className="h-4 w-4 text-emerald-400" />
              </div>

              <Button variant="outline" size="sm" className="border-emerald-800/50 bg-emerald-900/20 text-emerald-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-900/70 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Applications</p>
                  <h3 className="text-2xl font-bold text-white">68</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-900/70 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Interviews</p>
                  <h3 className="text-2xl font-bold text-white">28</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-900/70 flex items-center justify-center">
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Job Offers</p>
                  <h3 className="text-2xl font-bold text-white">9</h3>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-900/70 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Learning Hours</p>
                  <h3 className="text-2xl font-bold text-white">86</h3>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-emerald-900/50 border border-emerald-800/50 p-1 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
              >
                Applications
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="learning"
                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
              >
                Learning
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-emerald-400" />
                      Job Applications
                    </h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobApplicationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF30" />
                        <XAxis dataKey="name" stroke="#94A3B8" />
                        <YAxis stroke="#94A3B8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#064E3B",
                            borderColor: "#065F46",
                            borderRadius: "0.5rem",
                            color: "#F0FDF4",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="applications" fill="#10B981" name="Applications" />
                        <Bar dataKey="interviews" fill="#059669" name="Interviews" />
                        <Bar dataKey="offers" fill="#047857" name="Offers" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-emerald-400" />
                      Job Categories
                    </h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={jobCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {jobCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#064E3B",
                            borderColor: "#065F46",
                            borderRadius: "0.5rem",
                            color: "#F0FDF4",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-emerald-400" />
                    Application Trends
                  </h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobApplicationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF30" />
                      <XAxis dataKey="name" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#064E3B",
                          borderColor: "#065F46",
                          borderRadius: "0.5rem",
                          color: "#F0FDF4",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="applications" fill="#10B981" name="Applications" />
                      <Bar dataKey="interviews" fill="#059669" name="Interviews" />
                      <Bar dataKey="offers" fill="#047857" name="Offers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Skill Progress
                  </h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillProgressData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF30" />
                      <XAxis type="number" stroke="#94A3B8" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" stroke="#94A3B8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#064E3B",
                          borderColor: "#065F46",
                          borderRadius: "0.5rem",
                          color: "#F0FDF4",
                        }}
                        formatter={(value) => [`${value}%`, "Score"]}
                      />
                      <Bar dataKey="score" fill="#10B981" name="Proficiency" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="learning">
              <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-800/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    Learning Time
                  </h3>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={learningTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF30" />
                      <XAxis dataKey="day" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#064E3B",
                          borderColor: "#065F46",
                          borderRadius: "0.5rem",
                          color: "#F0FDF4",
                        }}
                        formatter={(value) => [`${value} hours`, "Time Spent"]}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="hours" stroke="#10B981" activeDot={{ r: 8 }} name="Hours" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
