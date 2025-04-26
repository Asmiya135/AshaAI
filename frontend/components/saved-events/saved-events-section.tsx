"use client"

import { useState } from "react"
import { Trash2, Calendar, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SavedEvent } from "@/types/event-types"
import { format } from "date-fns"

interface SavedEventsSectionProps {
  savedEvents: SavedEvent[]
  onRemoveEvent: (id: string) => void
}

export function SavedEventsSection({ savedEvents, onRemoveEvent }: SavedEventsSectionProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all")

  const filteredEvents = savedEvents.filter((event) => {
    const eventDate = new Date(event.date)
    const today = new Date()

    if (filter === "upcoming") {
      return eventDate >= today
    } else if (filter === "past") {
      return eventDate < today
    }
    return true
  })

  return (
    <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 rounded-xl border border-emerald-800/30 backdrop-blur-sm p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Saved Events</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("all")}
            className={`text-xs h-7 px-2 ${filter === "all" ? "bg-emerald-700/50 text-white" : "bg-emerald-900/20 text-emerald-300"} border-emerald-800/50 hover:bg-emerald-800/40`}
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("upcoming")}
            className={`text-xs h-7 px-2 ${filter === "upcoming" ? "bg-emerald-700/50 text-white" : "bg-emerald-900/20 text-emerald-300"} border-emerald-800/50 hover:bg-emerald-800/40`}
          >
            Upcoming
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("past")}
            className={`text-xs h-7 px-2 ${filter === "past" ? "bg-emerald-700/50 text-white" : "bg-emerald-900/20 text-emerald-300"} border-emerald-800/50 hover:bg-emerald-800/40`}
          >
            Past
          </Button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-900/30 flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-gray-400 text-sm">No saved events found</p>
          <p className="text-gray-500 text-xs mt-1">Events you save from the chat will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-26rem)] overflow-y-auto pr-1">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-emerald-900/30 p-3 rounded-lg border border-emerald-800/30">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white">{event.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveEvent(event.id)}
                  className="h-6 w-6 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 mt-2 text-emerald-300 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                <span>{format(new Date(event.date), "MMMM dd, yyyy")}</span>
              </div>

              {event.location && (
                <div className="flex items-center gap-1 mt-1 text-emerald-300 text-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.description && <p className="text-gray-300 text-sm mt-2">{event.description}</p>}

              {event.url && (
                <div className="mt-3">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs bg-emerald-800/30 hover:bg-emerald-800/50 text-emerald-300 px-2 py-1 rounded-md transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Details
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
