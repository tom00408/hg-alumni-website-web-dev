import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Event } from '../lib/types'
import { getAllEvents, createEvent, updateEvent as updateFirebaseEvent, deleteEvent as deleteFirebaseEvent } from '../services/events'

export const useEventsStore = defineStore('events', () => {
  // State
  const events = ref<Event[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value
      .filter(event => event.date.toDate() >= now)
      .sort((a, b) => a.date.toMillis() - b.date.toMillis())
  })

  const pastEvents = computed(() => {
    const now = new Date()
    return events.value
      .filter(event => event.date.toDate() < now)
      .sort((a, b) => b.date.toMillis() - a.date.toMillis())
  })

  const featuredEvents = computed(() => {
    return upcomingEvents.value.filter(event => event.isFeatured)
  })

  const nextUpcomingEvents = computed(() => {
    return upcomingEvents.value.slice(0, 2)
  })

  // Actions
  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    try {
      events.value = await getAllEvents()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Laden der Termine'
      console.error('Error fetching events:', err)
    } finally {
      loading.value = false
    }
  }

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const newEvent = await createEvent(eventData)
      events.value.push(newEvent)
      return newEvent
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Erstellen des Termins'
      throw err
    }
  }

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      await updateFirebaseEvent(id, eventData)
      
      const index = events.value.findIndex(event => event.id === id)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...eventData }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Aktualisieren des Termins'
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await deleteFirebaseEvent(id)
      events.value = events.value.filter(event => event.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Löschen des Termins'
      throw err
    }
  }

  const getEventById = (id: string) => {
    return events.value.find(event => event.id === id)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    events,
    loading,
    error,
    
    // Getters
    upcomingEvents,
    pastEvents,
    featuredEvents,
    nextUpcomingEvents,
    
    // Actions
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    clearError
  }
})
