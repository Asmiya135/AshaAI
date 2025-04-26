"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { SavedEvent } from "@/types/event-types"

interface EventContextType {
  savedEvents: SavedEvent[]
  saveEvent: (event: SavedEvent) => void
  removeEvent: (id: string) => void
  isEventSaved: (id: string) => boolean
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: ReactNode }) {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([])

  const saveEvent = (event: SavedEvent) => {
    setSavedEvents((prev) => [...prev, event])
  }

  const removeEvent = (id: string) => {
    setSavedEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const isEventSaved = (id: string) => {
    return savedEvents.some((event) => event.id === id)
  }

  return (
    <EventContext.Provider value={{ savedEvents, saveEvent, removeEvent, isEventSaved }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
