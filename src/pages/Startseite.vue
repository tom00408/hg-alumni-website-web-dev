<template>
  <div class="startseite">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__background">
        <img 
          src="/images/innenhof.jpg" 
          alt="Hainberg-Gymnasium Gebäude" 
          class="hero__background-image"
        />
        <div class="hero__overlay"></div>
      </div>
      <HgCard variant="primary" class="hero__card">
        <div class="hero__content">
          <div class="hero__logo">
            <div class="logo-circle">
              <span class="logo-text">HG</span>
            </div>
          </div>
          <h1 class="hero__title">Alumni-Verein des Hainberg-Gymnasiums</h1>
          <p class="hero__subtitle">
            Willkommen in unserer Gemeinschaft ehemaliger Schüler:innen und Lehrer:innen. 
            Bleiben Sie mit Ihrer Schule, Ihren Mitschüler:innen und Kolleg:innen in Verbindung.
          </p> 
          <div class="hero__actions">
            <router-link to="/mitglied-werden" class="btn-secondary btn-large">
              Mitglied werden
            </router-link>
            <router-link to="/news" class="btn-secondary">
              Neuigkeiten
            </router-link>
          </div>
        </div>
      </HgCard>
    </section>



    <!-- Über den Alumni-Verein -->
    <section class="about-section">
      <HgCard class="about-card">
        <div class="about-content">
          <p class="about-subtitle">Ehemalige Schüler:innen engagieren sich für „ihre" Schule</p>
          
          <div class="about-text">
            <p>
              „Bildung, Kunst und Kultur zum Wohle des Hainberg-Gymnasiums" zu fördern benennt der 2014 gegründete „Alumni-Verein" des HG als ein Hauptziel seiner Arbeit. Zudem unterstützt der Verein die Mitglieder der Schule bei der beruflichen Orientierung der Schüler:innen der Oberstufe.
            </p>
            
            <p>
              Daneben will der Verein auch immer wieder Formate der Begegnung bereitstellen, in denen Ehemalige sich in freundlicher Atmosphäre treffen, nett beisammen sein und austauschen können – z.B. dass ehemalige Schüler:innen sich anlässlich ihres vor 10 oder 25 Jahren bestandenen Abiturs gemeinsam an „damals" erinnern möchten oder mit einem Besuch in ihrer ehemaligen Schule und einer Schulführung.
            </p>
            
            <p>
              Der Alumni-Verein möchte auch die ehemaligen Lehrer:innen ermutigen, die jährlich stattfindende große „Alumni-Party" im Spätsommer als Chance der Begegnung mit ihren ehemaligen Tutand:innen bzw. Schüler:innen, z.B. in den Prüfungskursen, zu nutzen. Beim Alumni-Konzert zeigen auch aktive Schüler:innen ihr Können auf der Bühne.
            </p>
            
            <div class="about-highlight">
              <p class="highlight-text">
                <strong>Die Mitgliedschaft im Verein ist für Schüler:innen in den ersten drei Jahren kostenfrei.</strong>
              </p>
              <p class="contact-info">
                Weitere Informationen bei: 
                <a href="mailto:g.bartelt@hg-gym.de" class="contact-link">g.bartelt@hg-gym.de</a>
              </p>
            </div>
            
            <p class="board-info">
              <em>Der Vorstand vom Alumni-Verein</em>
            </p>
          </div>
        </div>
      </HgCard>
    </section>

    
    <!-- Kommende Termine -->
    <section v-if="eventsStore.loading" class="upcoming-events">
      <h2 class="section-title">Kommende Termine</h2>
      <div class="loading-state">
        <p>Termine werden geladen...</p>
      </div>
    </section>
    
    <section v-else-if="upcomingEvents.length" class="upcoming-events">
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
    <section v-if="newsStore.loading" class="latest-news">
      <h2 class="section-title">Neues im Verein</h2>
      <div class="loading-state">
        <p>Neuigkeiten werden geladen...</p>
      </div>
    </section>
    
    <section v-else="latestNews.length" class="latest-news">
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
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import { useNewsStore } from '../stores/news'
import HgCard from '../components/HgCard.vue'
import EventItem from '../components/EventItem.vue'
import NewsCard from '../components/NewsCard.vue'
import type { Event, NewsArticle } from '../lib/types'

const router = useRouter()

// Stores verwenden
const eventsStore = useEventsStore()
const newsStore = useNewsStore()

// Daten aus den Stores
const upcomingEvents = eventsStore.nextUpcomingEvents
const latestNews = newsStore.latestArticles


const viewEventDetails = (event: Event) => {
  router.push(`/termine/${event.id}`)
}

const readNewsArticle = (article: NewsArticle) => {
  router.push(`/news/${article.slug}`)
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
    // Immer die neuesten Daten laden für die Startseite
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
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.hero__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--radius-xl);
}

.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(83, 98, 254, 0.8) 0%, 
    rgba(72, 109, 185, 0.7) 50%,
    rgba(83, 98, 254, 0.8) 100%
  );
  z-index: 2;
}

.hero__card {
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 3;
  box-shadow: 0 20px 40px rgba(83, 98, 254, 0.1);
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
  color: var(--color-gray-800);
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
  font-weight: var(--font-weight-bold);
  min-height: 56px;
  border-radius: var(--radius-xl);
}

.btn-large:hover,
.btn-large:focus {
  transform: translateY(-3px) scale(1.03);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
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

.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-gray-600);
  font-style: italic;
}

/* Über den Alumni-Verein Section */
.about-section {
  margin-bottom: var(--spacing-2xl);
}

.about-card {
  background: linear-gradient(135deg, var(--color-white) 0%, rgba(72, 109, 185, 0.03) 100%);
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
  line-height: var(--line-height-tight);
}

.about-subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  font-weight: var(--font-weight-medium);
  font-style: italic;
}

.about-text {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
}

.about-text p {
  margin-bottom: var(--spacing-lg);
  text-align: justify;
}

.about-highlight {
  background: linear-gradient(135deg, rgba(83, 98, 254, 0.1) 0%, rgba(72, 109, 185, 0.1) 100%);
  border-left: 4px solid var(--color-primary);
  padding: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.highlight-text {
  color: var(--color-secondary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md) !important;
}

.contact-info {
  margin-bottom: 0 !important;
  color: var(--color-gray-700);
}

.contact-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-normal);
}

.contact-link:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.board-info {
  text-align: center;
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
  margin-bottom: 0 !important;
  margin-top: var(--spacing-lg) !important;
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
  .hero {
    min-height: 500px;
  }
  
  .hero__title {
    font-size: var(--font-size-3xl);
  }
  
  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
  
  
  .events-grid,
  .news-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .about-title {
    font-size: var(--font-size-2xl);
  }
  
  .about-subtitle {
    font-size: var(--font-size-lg);
  }
  
  .about-text {
    font-size: var(--font-size-base);
  }
  
  .about-text p {
    text-align: left;
  }
  
  .about-highlight {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-md);
  }
  
  .cta-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .hero {
    min-height: 400px;
  }
  
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
