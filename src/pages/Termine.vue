<template>
  <div class="termine">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Termine</h1>
      <p class="page-subtitle">
        Bleiben Sie über alle wichtigen Veranstaltungen und Termine informiert
      </p>
    </div>

    <!-- Filter -->
    <div class="filter-section">
      <HgCard compact class="filter-card">
        <div class="filter-controls">
          <div class="filter-tabs">
            <button 
              v-for="filter in filterOptions" 
              :key="filter.value"
              class="filter-tab"
              :class="{ 'filter-tab--active': activeFilter === filter.value }"
              @click="setFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="view-toggle">
            <div class="view-toggle-background" :class="{ 'view-toggle-background--list': viewMode === 'list' }"></div>
            <button 
              class="view-button"
              :class="{ 'view-button--active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              aria-label="Kachel-Ansicht"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
              </svg>
              <span class="view-button-label">Kacheln</span>
            </button>
            <button 
              class="view-button"
              :class="{ 'view-button--active': viewMode === 'list' }"
              @click="viewMode = 'list'"
              aria-label="Listen-Ansicht"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              <span class="view-button-label">Liste</span>
            </button>
          </div>
        </div>
      </HgCard>
    </div>

    <!-- Loading State -->
    <div v-if="eventsStore.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Termine werden geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="eventsStore.error" class="error-state">
      <HgCard variant="secondary">
        <div class="error-content">
          <h3>Fehler beim Laden der Termine</h3>
          <p>{{ eventsStore.error }}</p>
          <button class="btn-primary" @click="eventsStore.fetchEvents()">
            Erneut versuchen
          </button>
        </div>
      </HgCard>
    </div>

    <!-- Events Grid/List -->
    <div v-else-if="filteredEvents.length" class="events-container">
      <div 
        class="events-grid"
        :class="{ 
          'events-grid--list': viewMode === 'list',
          'events-grid--grid': viewMode === 'grid'
        }"
      >
        <EventItem 
          v-for="event in filteredEvents" 
          :key="event.id"
          :event="event"
          @view-details="viewEventDetails"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <HgCard>
        <div class="empty-content">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
          </div>
          <h3>Keine Termine gefunden</h3>
          <p>
            {{ activeFilter === 'upcoming' 
              ? 'Derzeit sind keine kommenden Termine geplant.' 
              : 'Es sind keine Termine in diesem Zeitraum vorhanden.' 
            }}
          </p>
        </div>
      </HgCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import HgCard from '../components/HgCard.vue'
import EventItem from '../components/EventItem.vue'
import type { Event } from '../lib/types'

const router = useRouter()

const eventsStore = useEventsStore()
const activeFilter = ref<'all' | 'upcoming' | 'past'>('upcoming')

// Automatisch Liste-Ansicht auf mobilen Geräten
const isMobile = window.innerWidth <= 768
const viewMode = ref<'grid' | 'list'>(isMobile ? 'list' : 'grid')

const filterOptions = [
  { value: 'upcoming' as const, label: 'Kommende Termine' },
  { value: 'all' as const, label: 'Alle Termine' },
  { value: 'past' as const, label: 'Vergangene Termine' }
]

const filteredEvents = computed(() => {
  switch (activeFilter.value) {
    case 'upcoming':
      return eventsStore.upcomingEvents
    case 'past':
      return eventsStore.pastEvents
    default:
      return eventsStore.events
  }
})

const setFilter = (filter: 'all' | 'upcoming' | 'past') => {
  activeFilter.value = filter
}

const viewEventDetails = (event: Event) => {
  router.push(`/termine/${event.id}`)
}

onMounted(async () => {
  await eventsStore.fetchEvents()
})
</script>

<style scoped>
.termine {
  max-width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.filter-section {
  margin-bottom: var(--spacing-2xl);
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-gray-200);
  background-color: var(--color-white);
  color: var(--color-gray-600);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-tab--active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* View Toggle Styles */
.view-toggle {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xs);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.view-toggle-background {
  position: absolute;
  top: var(--spacing-xs);
  left: var(--spacing-xs);
  width: calc(50% - var(--spacing-xs));
  height: calc(100% - calc(var(--spacing-xs) * 2));
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border-radius: var(--radius-lg);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(83, 98, 254, 0.3);
  z-index: 1;
}

.view-toggle-background--list {
  transform: translateX(100%);
}

.view-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-width: 80px;
  height: 44px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--color-gray-600);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  z-index: 2;
}

.view-button:hover:not(.view-button--active) {
  color: var(--color-primary);
  transform: translateY(-1px);
}

.view-button--active {
  color: var(--color-white);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.view-button-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.view-button svg {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.view-button:hover svg {
  transform: scale(1.1);
}

.view-button--active svg {
  transform: scale(1.05);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-state {
  flex-direction: column;
  gap: var(--spacing-lg);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-gray-200);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content,
.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  color: var(--color-gray-400);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.events-container {
  margin-bottom: var(--spacing-2xl);
}

.events-grid--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.events-grid--list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .view-toggle {
    display: none;
  }
  
  .events-grid--grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
  
  .filter-tabs {
    flex-direction: column;
  }
  
  .filter-tab {
    text-align: center;
  }
}
</style>
