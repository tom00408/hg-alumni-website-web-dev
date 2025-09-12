<template>
  <div class="galerie">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Unsere Galerie</h1>
    </div>

    <!-- Mixed Gallery View -->
    <MixedGallery
      :items="foldersStore.mixedGalleryItems"
      :loading="foldersStore.loading"
      :error="foldersStore.error"
      @folder-selected="selectFolder"
      @image-clicked="openLightboxFromMixed"
      @retry="retryMixedGallery"
    />

    <!-- Folder Detail View (Overlay) -->
    <div v-if="currentFolder" class="folder-detail-overlay">
      <FolderDetail
        :folder="currentFolder"
        :images="currentFolderImages"
        :loading="foldersStore.loading"
        :error="foldersStore.error"
        @back-to-folders="backToFolders"
        @image-clicked="openLightboxFromFolder"
        @retry="retryFolder"
      />
    </div>

    <!-- Lightbox Modal -->
    <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <div class="lightbox-navigation">
          <button 
            v-if="currentImageIndex > 0"
            class="lightbox-nav lightbox-prev"
            @click="previousImage"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button 
            v-if="currentImageIndex < allImages.length - 1"
            class="lightbox-nav lightbox-next"
            @click="nextImage"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>

        <div class="lightbox-image-container">
          <img 
            :src="currentImage?.imageUrl" 
            :alt="currentImage?.title || 'Galerie Bild'"
            class="lightbox-image"
          />
        </div>

        <div v-if="currentImage?.title" class="lightbox-caption">
          <h3>{{ currentImage.title }}</h3>
        </div>

        <div class="lightbox-counter">
          {{ currentImageIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFoldersStore } from '../stores/folders'
import FolderDetail from '../components/FolderDetail.vue'
import MixedGallery from '../components/MixedGallery.vue'
import type { GalleryImage, GalleryFolder } from '../lib/types'

// Stores
const foldersStore = useFoldersStore()

// Folder State
const currentFolder = ref<GalleryFolder | null>(null)
const currentFolderImages = ref<GalleryImage[]>([])

// Lightbox State
const lightboxVisible = ref(false)
const currentImageIndex = ref(0)
const allImages = ref<GalleryImage[]>([])

// Computed
const currentImage = computed(() => allImages.value[currentImageIndex.value])

// Methods

const selectFolder = async (folder: GalleryFolder) => {
  currentFolder.value = folder
  await foldersStore.fetchFolderById(folder.id!)
  currentFolderImages.value = foldersStore.currentFolderImages
}

const backToFolders = () => {
  currentFolder.value = null
  currentFolderImages.value = []
  foldersStore.clearCurrentFolder()
}


const openLightboxFromFolder = ({ image, index }: { image: GalleryImage, index: number }) => {
  currentImageIndex.value = index
  allImages.value = currentFolderImages.value
  lightboxVisible.value = true
}

const openLightboxFromMixed = ({ image, index }: { image: GalleryImage, index: number }) => {
  // Finde alle unorganisierten Bilder für die Lightbox
  const unorganizedImages = foldersStore.mixedGalleryItems
    .filter(item => item.type === 'image')
    .map(item => item.data as GalleryImage)
  
  const imageIndex = unorganizedImages.findIndex(img => img.id === image.id)
  currentImageIndex.value = imageIndex >= 0 ? imageIndex : 0
  allImages.value = unorganizedImages
  lightboxVisible.value = true
}

const closeLightbox = () => {
  lightboxVisible.value = false
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < allImages.value.length - 1) {
    currentImageIndex.value++
  }
}


const retryFolder = () => {
  if (currentFolder.value) {
    foldersStore.fetchFolderById(currentFolder.value.id!)
  }
}

const retryMixedGallery = () => {
  foldersStore.fetchMixedGallery()
}


// Lifecycle
onMounted(async () => {
  try {
    // Lade die gemischte Ansicht als Standard
    await foldersStore.fetchMixedGallery()
  } catch (error) {
    console.error('Error loading mixed gallery:', error)
  }
})

</script>

<style scoped>
.galerie {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-tight);
}


/* Folder Detail Overlay */
.folder-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-white);
  z-index: 1000;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

/* Lightbox Styles */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-white);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-normal);
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.lightbox-nav {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-white);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-normal);
  pointer-events: all;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-prev {
  margin-left: -25px;
}

.lightbox-next {
  margin-right: -25px;
}

.lightbox-image-container {
  max-width: 100%;
  max-height: 70vh;
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

.lightbox-caption {
  margin-top: var(--spacing-lg);
  text-align: center;
  color: var(--color-white);
}

.lightbox-caption h3 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.lightbox-counter {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  background: rgba(0, 0, 0, 0.5);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
}


/* Mobile Anpassungen */
@media (max-width: 768px) {
  .galerie {
    padding: var(--spacing-md);
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .folder-detail-overlay {
    padding: var(--spacing-md);
  }
  
  .lightbox {
    padding: var(--spacing-sm);
  }
  
  .lightbox-nav {
    width: 40px;
    height: 40px;
  }
  
  .lightbox-prev {
    margin-left: -20px;
  }
  
  .lightbox-next {
    margin-right: -20px;
  }


 
}
</style>