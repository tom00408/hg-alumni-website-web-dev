<template>
  <div class="mixed-gallery">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Galerie wird geladen...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn-secondary">
        Erneut versuchen
      </button>
    </div>

    <!-- Gallery Content -->
    <div v-else-if="folders.length > 0 || images.length > 0" class="gallery-container">
      <!-- Folders Section -->
      <div v-if="folders.length > 0" class="folders-section">
        <div class="folders-grid">
          <div 
            v-for="folder in folders" 
            :key="folder.id"
            class="folder-item"
            @click="handleFolderClick(folder)"
          >
            <div class="folder-cover">
              <img 
                v-if="folder.coverImage" 
                :src="folder.coverImage.thumbnailUrl || folder.coverImage.imageUrl" 
                :alt="folder.name"
                class="cover-image"
                loading="lazy"
              />
              <div v-else class="folder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                </svg>
              </div>
              <div class="folder-overlay">
                <div class="overlay-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="folder-info">
              <h3 class="folder-name">{{ folder.name }}</h3>
              <p v-if="folder.description" class="folder-description">
                {{ folder.description }}
              </p>
              <div class="folder-meta">
                <span class="image-count">
                  {{ folder.imageCount || 0 }} {{ folder.imageCount === 1 ? 'Bild' : 'Bilder' }}
                </span>
                <span class="item-type">Ordner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Images Section -->
      <div v-if="images.length > 0" class="images-section">
        <div class="images-grid">
          <div 
            v-for="(image, index) in images" 
            :key="image.id"
            class="image-item"
            @click="handleImageClick(image, index)"
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
            <h3 v-if="image.title" class="image-title">
              {{ image.title }}
            </h3>
          </div>
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
      <h3>Keine Galerie-Items vorhanden</h3>
      <p>Es wurden noch keine Ordner oder Bilder zur Galerie hinzugefügt.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GalleryFolder, GalleryImage } from '../lib/types'

interface MixedGalleryItem {
  type: 'folder' | 'image'
  id: string
  date: any
  data: GalleryFolder | GalleryImage
  imageCount?: number
  coverImage?: GalleryImage | null
}

const props = defineProps<{
  items: MixedGalleryItem[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'folder-selected': [folder: GalleryFolder]
  'image-clicked': [{ image: GalleryImage, index: number }]
  'retry': []
}>()

// Separate folders and images
const folders = computed(() => 
  props.items
    .filter(item => item.type === 'folder')
    .map(item => ({
      ...(item.data as GalleryFolder),
      imageCount: item.imageCount,
      coverImage: item.coverImage
    }))
)

const images = computed(() => 
  props.items
    .filter(item => item.type === 'image')
    .map(item => item.data as GalleryImage)
)

const handleFolderClick = (folder: GalleryFolder) => {
  emit('folder-selected', folder)
}

const handleImageClick = (image: GalleryImage, index: number) => {
  emit('image-clicked', { image, index })
}
</script>

<style scoped>
.mixed-gallery {
  width: 100%;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
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

.gallery-container {
  width: 100%;
}


.folders-section {
  margin-bottom: var(--spacing-3xl);
}

.images-section {
  margin-top: var(--spacing-3xl);
}

.folders-grid,
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
}

.folder-item,
.image-item {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-gray-200);
}

.folder-item:hover,
.image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.folder-item {
  border-color: var(--color-primary);
}

.folder-item:hover {
  border-color: var(--color-accent);
}

/* Folder Styles */
.folder-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-gray-100), var(--color-gray-200));
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.folder-item:hover .cover-image {
  transform: scale(1.05);
}

.folder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-gray-400);
}

.folder-overlay {
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

.folder-item:hover .folder-overlay {
  opacity: 1;
}

.overlay-content {
  color: var(--color-white);
  text-align: center;
}

.folder-info {
  padding: var(--spacing-lg);
}

.folder-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--line-height-tight);
}

.folder-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.folder-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.image-count {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.item-type {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  background: var(--color-gray-100);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  font-weight: var(--font-weight-medium);
}

/* Image Styles */
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
  .folders-grid,
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .folder-cover,
  .image-wrapper {
    height: 180px;
  }
  
  .folder-info {
    padding: var(--spacing-md);
  }
  
  .folder-name {
    font-size: var(--font-size-base);
  }
  
}

@media (max-width: 480px) {
  .folders-grid,
  .images-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .folder-cover,
  .image-wrapper {
    height: 160px;
  }
}
</style>
