<template>
  <div class="folder-detail">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <button @click="$emit('back-to-folders')" class="breadcrumb-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Zurück zu Ordnern
      </button>
      <div class="breadcrumb-separator">/</div>
      <span class="breadcrumb-current">{{ folder?.name }}</span>
    </nav>

    <!-- Folder Header -->
    <div v-if="folder" class="folder-header">
      <div class="folder-title-section">
        <h1 class="folder-title">{{ folder.name }}</h1>
        <p v-if="folder.description" class="folder-description">
          {{ folder.description }}
        </p>
        <div class="folder-meta">
          <span class="image-count">
            {{ images.length }} {{ images.length === 1 ? 'Bild' : 'Bilder' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Bilder werden geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn-secondary">
        Erneut versuchen
      </button>
    </div>

    <!-- Images Grid -->
    <div v-else-if="images.length" class="images-container">
      <div class="images-grid">
        <div 
          v-for="(image, index) in images" 
          :key="image.id"
          class="image-item"
          @click="$emit('image-clicked', { image, index })"
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
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
      <h3>Keine Bilder in diesem Ordner</h3>
      <p>Dieser Ordner enthält noch keine Bilder.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GalleryFolder, GalleryImage } from '../lib/types'

defineProps<{
  folder: GalleryFolder | null
  images: GalleryImage[]
  loading: boolean
  error: string | null
}>()

defineEmits<{
  'back-to-folders': []
  'image-clicked': [{ image: GalleryImage, index: number }]
  'retry': []
}>()
</script>

<style scoped>
.folder-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.breadcrumb-back {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
}

.breadcrumb-back:hover {
  background: var(--color-primary-light);
  color: var(--color-white);
}

.breadcrumb-separator {
  color: var(--color-gray-400);
  font-weight: var(--font-weight-medium);
}

.breadcrumb-current {
  color: var(--color-gray-700);
  font-weight: var(--font-weight-medium);
}

.folder-header {
  margin-bottom: var(--spacing-2xl);
}

.folder-title-section {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.folder-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-tight);
}

.folder-description {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: var(--line-height-relaxed);
}

.folder-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
}

.image-count {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--color-gray-600);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state p {
  color: var(--color-error);
  margin-bottom: var(--spacing-md);
}

.images-container {
  width: 100%;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
}

.image-item {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-gray-200);
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.image-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  color: var(--color-white);
  text-align: center;
}

.image-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  margin: 0;
  padding: var(--spacing-md);
  text-align: center;
  line-height: var(--line-height-tight);
}

.empty-state {
  padding: var(--spacing-3xl) var(--spacing-lg);
}

.empty-icon {
  color: var(--color-gray-300);
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
  color: var(--color-gray-500);
  margin: 0;
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .folder-detail {
    padding: var(--spacing-md);
  }
  
  .folder-title {
    font-size: var(--font-size-2xl);
  }
  
  .folder-description {
    font-size: var(--font-size-base);
  }
  
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .image-wrapper {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .image-wrapper {
    height: 180px;
  }
  
  .breadcrumb {
    flex-wrap: wrap;
  }
  
  .breadcrumb-back {
    font-size: var(--font-size-xs);
  }
}
</style>
