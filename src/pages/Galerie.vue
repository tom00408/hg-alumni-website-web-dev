<template>
  <div class="galerie">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Galerie</h1>
      <p class="page-subtitle">
        Bilder von Veranstaltungen, Treffen und besonderen Momenten unserer Alumni-Gemeinschaft
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="galleryStore.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Bilder werden geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="galleryStore.error" class="error-state">
      <HgCard variant="secondary">
        <div class="error-content">
          <h3>Fehler beim Laden der Galerie</h3>
          <p>{{ galleryStore.error }}</p>
          <button class="btn-primary" @click="galleryStore.fetchImages()">
            Erneut versuchen
          </button>
        </div>
      </HgCard>
    </div>

    <!-- Gallery Grid -->
    <div v-else-if="galleryStore.images.length" class="gallery-container">
      <div class="gallery-grid">
        <div 
          v-for="(image, index) in galleryStore.images" 
          :key="image.id"
          class="gallery-item"
          @click="openLightbox(index)"
        >
          <div class="image-wrapper">
            <img 
              :src="image.thumbnailUrl || image.imageUrl" 
              :alt="image.title || 'Galerie Bild'"
              loading="lazy"
              class="gallery-image"
            />
            <div class="image-overlay">
              <div class="overlay-content">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
            </div>
          </div>
          <h3 v-if="image.title" class="image-title">{{ image.title }}</h3>
        </div>
      </div>
      
      <!-- Load More Button -->
      <div v-if="galleryStore.hasMore" class="load-more-section">
        <button 
          class="btn-secondary btn-large"
          @click="loadMore"
          :disabled="galleryStore.loading"
        >
          <span v-if="galleryStore.loading">Lädt...</span>
          <span v-else>Weitere Bilder laden</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <HgCard>
        <div class="empty-content">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <h3>Noch keine Bilder vorhanden</h3>
          <p>
            Die Galerie wird bald mit Bildern von unseren Veranstaltungen und Treffen gefüllt. 
            Schauen Sie bald wieder vorbei!
          </p>
        </div>
      </HgCard>
    </div>

    <!-- Lightbox -->
    <div 
      v-if="lightboxOpen" 
      class="lightbox"
      @click="closeLightbox"
    >
      <div class="lightbox-content" @click.stop>
        <button 
          class="lightbox-close"
          @click="closeLightbox"
          aria-label="Schließen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <img 
          :src="currentImage?.imageUrl" 
          :alt="currentImage?.title || 'Galerie Bild'"
          class="lightbox-image"
        />
        
        <div v-if="currentImage?.title" class="lightbox-title">
          {{ currentImage.title }}
        </div>
        
        <!-- Navigation -->
        <button 
          v-if="images.length > 1"
          class="lightbox-nav lightbox-prev"
          @click="previousImage"
          aria-label="Vorheriges Bild"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        
        <button 
          v-if="images.length > 1"
          class="lightbox-nav lightbox-next"
          @click="nextImage"
          aria-label="Nächstes Bild"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGalleryStore } from '../stores/gallery'
import HgCard from '../components/HgCard.vue'
import type { GalleryImage } from '../lib/types'

const galleryStore = useGalleryStore()

const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  return galleryStore.images[currentImageIndex.value]
})

const loadMore = async () => {
  await galleryStore.loadMore()
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % galleryStore.images.length
}

const previousImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? galleryStore.images.length - 1 
    : currentImageIndex.value - 1
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  
  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'ArrowLeft':
      previousImage()
      break
  }
}

onMounted(async () => {
  await galleryStore.fetchImages()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.galerie {
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

.gallery-container {
  margin-bottom: var(--spacing-2xl);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.gallery-item {
  cursor: pointer;
  transition: transform var(--transition-normal);
}

.gallery-item:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-gray-100);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.overlay-content {
  color: var(--color-white);
}

.image-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin: var(--spacing-sm) 0 0 0;
  text-align: center;
  line-height: var(--line-height-tight);
}

.load-more-section {
  text-align: center;
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-lg);
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-title {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  color: var(--color-white);
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-prev {
  left: -80px;
}

.lightbox-next {
  right: -80px;
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
  
  .image-wrapper {
    height: 150px;
  }
  
  .lightbox {
    padding: var(--spacing-md);
  }
  
  .lightbox-nav {
    width: 40px;
    height: 40px;
  }
  
  .lightbox-prev {
    left: -60px;
  }
  
  .lightbox-next {
    right: -60px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
  
  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }
  
  .lightbox-nav {
    position: fixed;
    top: auto;
    bottom: 20px;
    transform: none;
  }
  
  .lightbox-prev {
    left: 20px;
  }
  
  .lightbox-next {
    right: 20px;
  }
  
  .lightbox-close {
    top: 20px;
    right: 20px;
  }
  
  .lightbox-title {
    bottom: 80px;
  }
}
</style>
