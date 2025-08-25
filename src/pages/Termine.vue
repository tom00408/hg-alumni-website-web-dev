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
            <button 
              class="view-button"
              :class="{ 'view-button--active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              aria-label="Kachel-Ansicht"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
              </svg>
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
import { useEventsStore } from '../stores/events'
import HgCard from '../components/HgCard.vue'
import EventItem from '../components/EventItem.vue'
import type { Event } from '../lib/types'

const eventsStore = useEventsStore()
const activeFilter = ref<'all' | 'upcoming' | 'past'>('upcoming')
const viewMode = ref<'grid' | 'list'>('grid')

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
  // TODO: Implementiere Event-Details Modal oder Navigation
  console.log('View event details:', event)
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

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
}

.view-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--color-gray-500);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-button:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.view-button--active {
  background-color: var(--color-primary);
  color: var(--color-white);
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
    align-self: center;
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
