<template>
  <div class="event-detail">
    <!-- Back Button -->
    <div class="back-section">
      <button @click="goBack" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
        </svg>
        Zurück zu Termine
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <HgCard>
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>Event wird geladen...</p>
        </div>
      </HgCard>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <HgCard variant="error">
        <div class="error-content">
          <h2>Event nicht gefunden</h2>
          <p>{{ error }}</p>
          <router-link to="/termine" class="btn-primary">
            Zurück zu Termine
          </router-link>
        </div>
      </HgCard>
    </div>

    <!-- Event Details -->
    <div v-else-if="event" class="event-content">
      <HgCard class="event-hero">
        <div class="event-header">
          <div class="event-meta">
            <span class="event-date">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              {{ formatDate(event.date) }}
            </span>
            <span v-if="event.location" class="event-location">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {{ event.location }}
            </span>
          </div>
          <h1 class="event-title">{{ event.title }}</h1>
          <div v-if="event.isFeatured" class="featured-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Hervorgehoben
          </div>
        </div>
      </HgCard>

      <!-- Event Description -->
      <HgCard v-if="event.description" class="event-description">
        <h2 class="section-title">Beschreibung</h2>
        <div class="description-content" v-html="formatDescription(event.description)"></div>
      </HgCard>

      <!-- Event Actions -->
      <HgCard class="event-actions">
        <h2 class="section-title">Teilnahme</h2>
        <div class="actions-content">
          <p class="actions-text">
            Möchten Sie an diesem Event teilnehmen? Kontaktieren Sie uns für weitere Informationen.
          </p>
          <div class="action-buttons">
            <a href="mailto:g.bartelt@hg-gym.de?subject=Anmeldung für {{ event.title }}" class="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Anmelden
            </a>
            <button @click="shareEvent" class="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              Teilen
            </button>
          </div>
        </div>
      </HgCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import HgCard from '../components/HgCard.vue'
import type { Event } from '../lib/types'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const loading = ref(true)
const error = ref<string | null>(null)
const event = ref<Event | null>(null)


const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatDescription = (description: string) => {
  // Simple line break conversion
  return description.replace(/\n/g, '<br>')
}

const goBack = () => {
  router.push('/termine')
}


const shareEvent = async () => {
  if (!event.value) return
  
  const shareData = {
    title: event.value.title,
    text: `${event.value.title} - ${formatDate(event.value.date)}`,
    url: window.location.href
  }
  
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else {
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link wurde in die Zwischenablage kopiert!')
    } catch (err) {
      console.log('Error copying to clipboard:', err)
    }
  }
}

onMounted(async () => {
  const eventId = route.params.id as string
  
  try {
    await eventsStore.fetchEvents()
    const foundEvent = eventsStore.events.find(e => e.id === eventId)
    
    if (foundEvent) {
      event.value = foundEvent
    } else {
      error.value = 'Das Event konnte nicht gefunden werden.'
    }
  } catch (err) {
    console.error('Error loading event:', err)
    error.value = 'Fehler beim Laden des Events.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.event-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.back-section {
  margin-bottom: var(--spacing-xl);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.back-button:hover {
  background: rgba(83, 98, 254, 0.1);
  color: var(--color-accent);
}

.loading-state,
.error-state {
  margin-bottom: var(--spacing-xl);
}

.loading-content,
.error-content {
  text-align: center;
  padding: var(--spacing-2xl);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.event-hero {
  background: linear-gradient(135deg, var(--color-white) 0%, rgba(83, 98, 254, 0.05) 100%);
}

.event-header {
  text-align: center;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  color: var(--color-gray-600);
}

.event-date,
.event-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
}

.event-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-tight);
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: var(--color-white);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
}

.description-content {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
}

.actions-content {
  text-align: center;
}

.actions-text {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-xl);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.related-events {
  margin-top: var(--spacing-2xl);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .event-detail {
    padding: var(--spacing-md);
  }
  
  .event-title {
    font-size: var(--font-size-3xl);
  }
  
  .event-meta {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .event-title {
    font-size: var(--font-size-2xl);
  }
  
  .section-title {
    font-size: var(--font-size-xl);
  }
}
</style>
