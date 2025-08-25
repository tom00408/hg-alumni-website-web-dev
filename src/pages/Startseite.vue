<template>
  <div class="startseite">
    <!-- Hero Section -->
    <section class="hero">
      <HgCard variant="primary" class="hero__card">
        <div class="hero__content">
          <div class="hero__logo">
            <div class="logo-circle">
              <span class="logo-text">HG</span>
            </div>
          </div>
          <h1 class="hero__title">Alumni-Verein des Hainberg-Gymnasiums</h1>
          <p class="hero__subtitle">
            Willkommen in unserer Gemeinschaft ehemaliger Schülerinnen und Schüler. 
            Bleiben Sie mit Ihrer Schule und Ihren Mitschülern in Verbindung.
          </p>
          <div class="hero__actions">
            <router-link to="/mitglied-werden" class="btn-primary btn-large">
              Mitglied werden
            </router-link>
            <router-link to="/news" class="btn-secondary">
              Neuigkeiten
            </router-link>
          </div>
        </div>
      </HgCard>
    </section>

    <!-- Quick Navigation -->
    <section class="quick-nav">
      <h2 class="section-title">Entdecken Sie</h2>
      <div class="quick-nav__grid">
        <router-link 
          v-for="item in quickNavItems" 
          :key="item.id"
          :to="item.route"
          class="quick-nav__item"
        >
          <HgCard hover class="quick-nav__card">
            <div class="quick-nav__icon" v-html="item.icon"></div>
            <h3 class="quick-nav__title">{{ item.title }}</h3>
            <p class="quick-nav__description">{{ item.description }}</p>
          </HgCard>
        </router-link>
      </div>
    </section>

    <!-- Kommende Termine -->
    <section v-if="upcomingEvents.length" class="upcoming-events">
      <h2 class="section-title">Kommende Termine</h2>
      <div class="events-grid">
        <EventItem 
          v-for="event in upcomingEvents" 
          :key="event.id"
          :event="event"
          @view-details="viewEventDetails"
        />
      </div>
      <div class="section-footer">
        <router-link to="/termine" class="btn-secondary">
          Alle Termine ansehen
        </router-link>
      </div>
    </section>

    <!-- Neueste News -->
    <section v-if="latestNews.length" class="latest-news">
      <h2 class="section-title">Neues im Verein</h2>
      <div class="news-grid">
        <NewsCard 
          v-for="article in latestNews" 
          :key="article.id"
          :article="article"
          @read-more="readNewsArticle"
          @share="shareArticle"
        />
      </div>
      <div class="section-footer">
        <router-link to="/news" class="btn-secondary">
          Alle Neuigkeiten
        </router-link>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <HgCard variant="accent" class="cta-card">
        <div class="cta-content">
          <h2 class="cta-title">Werden Sie Teil unserer Gemeinschaft</h2>
          <p class="cta-description">
            Vernetzen Sie sich mit anderen Alumni, bleiben Sie über Schulereignisse informiert 
            und unterstützen Sie die nächste Generation von Schülern.
          </p>
          <router-link to="/mitglied-werden" class="btn-primary btn-large">
            Jetzt beitreten
          </router-link>
        </div>
      </HgCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEventsStore } from '../stores/events'
import { useNewsStore } from '../stores/news'
import HgCard from '../components/HgCard.vue'
import EventItem from '../components/EventItem.vue'
import NewsCard from '../components/NewsCard.vue'
import type { Event, NewsArticle } from '../lib/types'

// Stores verwenden
const eventsStore = useEventsStore()
const newsStore = useNewsStore()

// Daten aus den Stores
const upcomingEvents = eventsStore.nextUpcomingEvents
const latestNews = newsStore.latestArticles

const quickNavItems = [
  {
    id: 'termine',
    title: 'Termine',
    description: 'Kommende Veranstaltungen und wichtige Termine',
    route: '/termine',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>`
  },
  {
    id: 'news',
    title: 'Neues im Verein',
    description: 'Aktuelle Nachrichten und Berichte',
    route: '/news',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`
  },
  {
    id: 'galerie',
    title: 'Galerie',
    description: 'Bilder von Veranstaltungen und Erinnerungen',
    route: '/galerie',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>`
  },
  {
    id: 'mitglied-werden',
    title: 'Mitglied werden',
    description: 'Treten Sie unserem Alumni-Netzwerk bei',
    route: '/mitglied-werden',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>`
  }
]

const viewEventDetails = (event: Event) => {
  // TODO: Implementiere Event-Details Modal oder Navigation
  console.log('View event details:', event)
}

const readNewsArticle = (article: NewsArticle) => {
  // TODO: Implementiere News-Detail-Ansicht
  console.log('Read article:', article)
}

const shareArticle = (article: NewsArticle) => {
  // TODO: Implementiere Share-Funktionalität
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.excerpt,
      url: window.location.origin + '/news/' + article.slug
    })
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(window.location.origin + '/news/' + article.slug)
  }
}

onMounted(async () => {
  // Lade Daten von den Stores
  try {
    await Promise.all([
      eventsStore.fetchEvents(),
      newsStore.fetchArticles()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<style scoped>
.startseite {
  max-width: 100%;
  margin: 0 auto;
}

.hero {
  margin-bottom: var(--spacing-2xl);
}

.hero__card {
  text-align: center;
  background: linear-gradient(135deg, var(--color-white) 0%, rgba(83, 98, 254, 0.05) 100%);
}

.hero__content {
  max-width: 600px;
  margin: 0 auto;
}

.hero__logo {
  margin-bottom: var(--spacing-xl);
}

.hero__logo .logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.hero__logo .logo-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
}

.hero__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-tight);
}

.hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-2xl);
}

.hero__actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.quick-nav {
  margin-bottom: var(--spacing-2xl);
}

.quick-nav__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.quick-nav__item {
  text-decoration: none;
  color: inherit;
}

.quick-nav__card {
  text-align: center;
  height: 100%;
  padding: var(--spacing-2xl);
}

.quick-nav__icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.quick-nav__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.quick-nav__description {
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.upcoming-events,
.latest-news {
  margin-bottom: var(--spacing-2xl);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.section-footer {
  text-align: center;
}

.cta-section {
  margin-bottom: var(--spacing-2xl);
}

.cta-card {
  text-align: center;
  background: linear-gradient(135deg, var(--color-white) 0%, rgba(72, 109, 185, 0.05) 100%);
}

.cta-content {
  max-width: 500px;
  margin: 0 auto;
}

.cta-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
}

.cta-description {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-2xl);
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .hero__title {
    font-size: var(--font-size-3xl);
  }
  
  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .quick-nav__grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .events-grid,
  .news-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .cta-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .hero__logo .logo-circle {
    width: 60px;
    height: 60px;
  }
  
  .hero__logo .logo-text {
    font-size: var(--font-size-xl);
  }
  
  .hero__title {
    font-size: var(--font-size-2xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-base);
  }
  
  .section-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
