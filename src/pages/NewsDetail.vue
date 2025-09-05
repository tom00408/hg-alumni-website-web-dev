<template>
  <div class="news-detail">
    <!-- Back Button -->
    <div class="back-section">
      <button @click="goBack" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
        </svg>
        Zurück zu News
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <HgCard>
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>Artikel wird geladen...</p>
        </div>
      </HgCard>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <HgCard variant="error">
        <div class="error-content">
          <h2>Artikel nicht gefunden</h2>
          <p>{{ error }}</p>
          <router-link to="/news" class="btn-primary">
            Zurück zu News
          </router-link>
        </div>
      </HgCard>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="article-content">
      <!-- Article Header -->
      <HgCard class="article-hero">
        <div class="article-header">
          <div class="article-meta">
            <span class="article-date">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              {{ formatDate(article.date) }}
            </span>
            <div v-if="article.tags && article.tags.length" class="article-tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-excerpt">{{ article.excerpt }}</p>
        </div>
        
        <!-- Cover Image -->
        <div v-if="article.coverUrl" class="article-cover">
          <img 
            :src="article.coverUrl" 
            :alt="article.title"
            class="cover-image"
            @error="onImageError"
          />
        </div>
      </HgCard>

      <!-- Article Body -->
      <HgCard class="article-body">
        <div class="content" v-html="formatContent(article.content)"></div>
      </HgCard>

      <!-- Article Actions -->
      <HgCard class="article-actions">
        <div class="actions-content">
          <h3 class="actions-title">Artikel teilen</h3>
          <div class="action-buttons">
            <button @click="shareArticle" class="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              Teilen
            </button>
            <a :href="emailLink" class="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Per E-Mail senden
            </a>
          </div>
        </div>
      </HgCard>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length" class="related-articles">
        <h2 class="section-title">Weitere Artikel</h2>
        <div class="related-grid">
          <NewsCard 
            v-for="relatedArticle in relatedArticles" 
            :key="relatedArticle.id"
            :article="relatedArticle"
            @read-more="readNewsArticle"
            @share="shareArticle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '../stores/news'
import HgCard from '../components/HgCard.vue'
import NewsCard from '../components/NewsCard.vue'
import type { NewsArticle } from '../lib/types'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const loading = ref(true)
const error = ref<string | null>(null)
const article = ref<NewsArticle | null>(null)

const relatedArticles = computed(() => {
  if (!article.value) return []
  return newsStore.articles
    .filter(a => a.id !== article.value?.id)
    .slice(0, 3)
})

const emailLink = computed(() => {
  if (!article.value) return '#'
  const subject = encodeURIComponent(`Interessanter Artikel: ${article.value.title}`)
  const body = encodeURIComponent(`Ich dachte, dieser Artikel könnte Sie interessieren:\n\n${article.value.title}\n\n${window.location.href}`)
  return `mailto:?subject=${subject}&body=${body}`
})

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const formatContent = (content: string) => {
  // Enhanced content formatting
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><\/p>/g, '')
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const goBack = () => {
  router.push('/news')
}

const readNewsArticle = (articleData: NewsArticle) => {
  router.push(`/news/${articleData.slug}`)
}

const shareArticle = async () => {
  if (!article.value) return
  
  const shareData = {
    title: article.value.title,
    text: article.value.excerpt,
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
  const slug = route.params.slug as string
  
  try {
    await newsStore.fetchArticles()
    const foundArticle = newsStore.articles.find(a => a.slug === slug)
    
    if (foundArticle) {
      article.value = foundArticle
    } else {
      error.value = 'Der Artikel konnte nicht gefunden werden.'
    }
  } catch (err) {
    console.error('Error loading article:', err)
    error.value = 'Fehler beim Laden des Artikels.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.news-detail {
  max-width: 900px;
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

.article-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.article-hero {
  background: linear-gradient(135deg, var(--color-white) 0%, rgba(83, 98, 254, 0.05) 100%);
}

.article-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  color: var(--color-gray-600);
}

.article-date {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.article-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-tight);
}

.article-excerpt {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  font-style: italic;
}

.article-cover {
  margin-top: var(--spacing-xl);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.article-body {
  padding: var(--spacing-2xl);
}

.content {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
}

.content :deep(p) {
  margin-bottom: var(--spacing-lg);
}

.content :deep(p:last-child) {
  margin-bottom: 0;
}

.actions-content {
  text-align: center;
}

.actions-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.related-articles {
  margin-top: var(--spacing-2xl);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .news-detail {
    padding: var(--spacing-md);
  }
  
  .article-title {
    font-size: var(--font-size-3xl);
  }
  
  .article-excerpt {
    font-size: var(--font-size-lg);
  }
  
  .article-meta {
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
  .article-title {
    font-size: var(--font-size-2xl);
  }
  
  .article-excerpt {
    font-size: var(--font-size-base);
  }
  
  .content {
    font-size: var(--font-size-base);
  }
}
</style>
