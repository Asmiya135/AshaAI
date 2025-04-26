"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
} from "date-fns"
import type { SavedEvent } from "@/types/event-types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EventCalendarProps {
  savedEvents: SavedEvent[]
}

export function EventCalendar({ savedEvents }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get days from previous month to fill the first week
  const firstDayOfMonth = monthStart.getDay()
  const prevMonthDays =
    firstDayOfMonth === 0
      ? []
      : Array.from({ length: firstDayOfMonth }, (_, i) => {
          const date = new Date(monthStart)
          date.setDate(-i)
          return date
        }).reverse()

  // Get days from next month to fill the last week
  const lastDayOfMonth = monthEnd.getDay()
  const nextMonthDays =
    lastDayOfMonth === 6
      ? []
      : Array.from({ length: 6 - lastDayOfMonth }, (_, i) => {
          const date = new Date(monthEnd)
          date.setDate(monthEnd.getDate() + i + 1)
          return date
        })

  const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays]

  // Check if a day has events
  const hasEvents = (date: Date) => {
    return savedEvents.some((event) => {
      const eventDate = new Date(event.date)
      return isSameDay(date, eventDate)
    })
  }

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return savedEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return isSameDay(date, eventDate)
    })
  }

  // Get the number of events for a specific day
  const getEventCount = (date: Date) => {
    return getEventsForDay(date).length
  }

  // Handle day click
  const handleDayClick = (date: Date) => {
    if (isSameMonth(date, currentMonth)) {
      setSelectedDay(isSameDay(date, selectedDay || new Date(0)) ? null : date)
    }
  }

  // Get events for selected day or today if no day is selected
  const displayEvents = selectedDay
    ? getEventsForDay(selectedDay)
    : savedEvents
        .filter((event) => {
          const eventDate = new Date(event.date)
          const today = new Date()
          return eventDate >= today
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Events Calendar</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 border-emerald-800/50 bg-emerald-900/20 text-emerald-300 hover:bg-emerald-800/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white font-medium">{format(currentMonth, "MMMM yyyy")}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 border-emerald-800/50 bg-emerald-900/20 text-emerald-300 hover:bg-emerald-800/40"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div key={i} className="text-center text-xs text-emerald-300 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day, i) => {
          const dayEvents = getEventsForDay(day)
          const eventCount = dayEvents.length
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isCurrentDay = isToday(day)
          const isPastDay = isBefore(day, new Date()) && !isCurrentDay
          const hasEventOnDay = hasEvents(day)
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false

          return (
            <TooltipProvider key={i}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "h-10 flex flex-col items-center justify-center rounded-md text-sm relative transition-all",
                      isCurrentMonth ? "text-white" : "text-gray-500",
                      isCurrentDay && "bg-emerald-800/30 font-bold",
                      isSelected && "bg-emerald-700/40 ring-1 ring-emerald-500",
                      hasEventOnDay && isCurrentMonth && !isSelected && "border border-emerald-500/50",
                      isPastDay && isCurrentMonth && !hasEventOnDay && "text-gray-400",
                      isCurrentMonth && !isPastDay && "hover:bg-emerald-800/20",
                    )}
                    disabled={!isCurrentMonth}
                  >
                    {day.getDate()}
                    {hasEventOnDay && (
                      <div className="absolute bottom-1 flex gap-0.5 justify-center">
                        {Array.from({ length: Math.min(eventCount, 3) }).map((_, idx) => (
                          <div
                            key={idx}
                            className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-emerald-500")}
                          ></div>
                        ))}
                        {eventCount > 3 && (
                          <div
                            className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white/70" : "bg-emerald-500/70")}
                          ></div>
                        )}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                {hasEventOnDay && (
                  <TooltipContent side="bottom" className="bg-emerald-900 border-emerald-700 text-white p-2">
                    <div className="text-xs font-medium">{format(day, "MMMM d, yyyy")}</div>
                    <div className="text-xs text-emerald-300">
                      {eventCount} event{eventCount !== 1 ? "s" : ""}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {/* Event preview section */}
      <div className="mt-4 pt-4 border-t border-emerald-800/30">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-emerald-300">
            {selectedDay ? `Events on ${format(selectedDay, "MMMM d, yyyy")}` : "Upcoming Events"}
          </h4>
          {selectedDay && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDay(null)}
              className="h-6 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30"
            >
              Show all
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent">
          {displayEvents.length > 0 ? (
            displayEvents.map((event, index) => (
              <div
                key={index}
                className="bg-emerald-900/30 p-2 rounded-md text-xs group hover:bg-emerald-800/30 transition-colors"
              >
                <div className="font-medium text-white group-hover:text-emerald-300 transition-colors">
                  {event.title}
                </div>
                <div className="text-emerald-300">{format(new Date(event.date), "MMM dd, yyyy")}</div>
                {event.location && (
                  <div className="text-gray-400 mt-1 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    {event.location}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-20 text-gray-400 text-xs">
              {selectedDay ? "No events on this day" : "No upcoming events"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
