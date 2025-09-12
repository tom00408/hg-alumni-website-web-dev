<template>
  <div class="news">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Neues im Verein</h1>
      <p class="page-subtitle">
        Aktuelle Nachrichten, Berichte und Updates aus unserem Alumni-Netzwerk
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="newsStore.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Nachrichten werden geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="newsStore.error" class="error-state">
      <HgCard variant="secondary">
        <div class="error-content">
          <h3>Fehler beim Laden der Nachrichten</h3>
          <p>{{ newsStore.error }}</p>
          <button class="btn-primary" @click="newsStore.fetchArticles()">
            Erneut versuchen
          </button>
        </div>
      </HgCard>
    </div>

    <!-- News Grid -->
    <div v-else-if="newsStore.articles.length" class="news-container">
      <div class="news-grid">
        <NewsCard 
          v-for="article in newsStore.articles" 
          :key="article.id"
          :article="article"
          @read-more="readNewsArticle"
          @share="shareArticle"
        />
      </div>
      
      <!-- Load More Button -->
      <div v-if="newsStore.hasMore" class="load-more-section">
        <button 
          class="btn-secondary btn-large"
          @click="loadMore"
          :disabled="newsStore.loading"
        >
          <span v-if="newsStore.loading">Lädt...</span>
          <span v-else>Weitere Artikel laden</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <HgCard>
        <div class="empty-content">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3>Noch keine Nachrichten vorhanden</h3>
          <p>
            Es sind noch keine Artikel veröffentlicht worden. 
            Schauen Sie bald wieder vorbei für neue Updates!
          </p>
        </div>
      </HgCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'
import HgCard from '../components/HgCard.vue'
import NewsCard from '../components/NewsCard.vue'
import type { NewsArticle } from '../lib/types'

const router = useRouter()

const newsStore = useNewsStore()

const loadMore = async () => {
  await newsStore.loadMore()
}

const readNewsArticle = (article: NewsArticle) => {
  router.push(`/news/${article.slug}`)
}

const shareArticle = (article: NewsArticle) => {
  const url = `${window.location.origin}/news/${article.slug}`
  
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.excerpt,
      url: url
    }).catch(err => {
      console.log('Error sharing:', err)
      // Fallback
      copyToClipboard(url)
    })
  } else {
    copyToClipboard(url)
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // TODO: Zeige Toast-Nachricht
    console.log('Link copied to clipboard')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

onMounted(async () => {
  await newsStore.fetchArticles()
})
</script>

<style scoped>
.news {
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

.news-container {
  margin-bottom: var(--spacing-2xl);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.load-more-section {
  text-align: center;
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

/* Featured Article (falls später implementiert) */



/* Mobile Anpassungen */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .news-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  

}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
  
  .page-subtitle {
    font-size: var(--font-size-base);
  }
}

/* Smooth Loading Animation */


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
