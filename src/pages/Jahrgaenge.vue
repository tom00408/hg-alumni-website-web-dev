<template>
  <div class="jahrgaenge-page">
   

    <!-- Jahrgänge Grid -->
    <div class="jahrgaenge-container">
      <div
        v-for="jahrgang in jahrgaenge"
        :key="jahrgang.year"
        class="jahrgang-card"
        :class="{ 'jahrgang-card--active': selectedJahrgang === jahrgang.year }"
        @click="selectJahrgang(jahrgang.year)"
      >
        <div class="jahrgang-card-image">
          <img :src="jahrgang.coverImage" :alt="`Jahrgang ${jahrgang.year}`" />
          <div class="jahrgang-card-overlay">
            <div class="jahrgang-card-info">
              <h2 class="jahrgang-year">Jahrgang {{ jahrgang.year }}</h2>
              <p class="jahrgang-stats">
                <span class="stat-icon">📸</span>
                {{ jahrgang.imageCount }} Bilder
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jahrgang Detail View -->
    <div v-if="selectedJahrgang" class="jahrgang-detail">
      <div class="detail-header">
        <button @click="selectedJahrgang = null" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Zurück
        </button>
        <h2 class="detail-title">Jahrgang {{ selectedJahrgang }}</h2>
        <button @click="showUploadModal = true" class="upload-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Bild hochladen
        </button>
      </div>

      <!-- Image Grid -->
      <div class="image-grid">
        <div
          v-for="(image, index) in getJahrgangImages(selectedJahrgang)"
          :key="index"
          class="image-item"
          @click="openLightbox(index)"
        >
          <div class="image-wrapper">
            <img :src="image.url" :alt="image.title || 'Bild'" />
            <div class="image-overlay">
              <span class="image-title">{{ image.title || 'Ohne Titel' }}</span>
              <span class="image-author">{{ image.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay" @click="showUploadModal = false">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="showUploadModal = false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <h3 class="modal-title">Bild hochladen</h3>
        
        <div class="upload-area" @click="triggerFileInput" :class="{ 'upload-area--dragover': isDragging }">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            @dragenter.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @dragover.prevent
            @drop.prevent="handleDrop"
            style="display: none"
          />
          
          <div v-if="!selectedFile" class="upload-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <p>Bild hier ablegen oder klicken zum Auswählen</p>
            <span class="upload-hint">JPG, PNG oder WebP (max. 5MB)</span>
          </div>
          
          <div v-else class="upload-preview">
            <img :src="uploadPreviewUrl" alt="Vorschau" />
            <button @click.stop="cancelUpload" class="remove-preview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="upload-form">
          <div class="form-field">
            <label>Titel (optional)</label>
            <input v-model="uploadTitle" type="text" placeholder="z.B. Klassentreffen 2024" />
          </div>
          
          <div class="form-field">
            <label>Ihr Name</label>
            <input v-model="uploadAuthor" type="text" placeholder="Max Mustermann" />
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="showUploadModal = false" class="button button--secondary">
            Abbrechen
          </button>
          <button @click="handleUpload" class="button button--primary" :disabled="!selectedFile || !uploadAuthor">
            Hochladen
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
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
          v-if="currentImageIndex < currentImages.length - 1"
          class="lightbox-nav lightbox-next"
          @click="nextImage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>

        <div class="lightbox-image-container">
          <img :src="currentImage?.url" :alt="currentImage?.title" />
        </div>

        <div class="lightbox-info">
          <h3>{{ currentImage?.title || 'Ohne Titel' }}</h3>
          <p>von {{ currentImage?.author }}</p>
        </div>

        <div class="lightbox-counter">
          {{ currentImageIndex + 1 }} / {{ currentImages.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface JahrgangImage {
  url: string
  title?: string
  author: string
}

interface Jahrgang {
  year: number
  coverImage: string
  imageCount: number
  images: JahrgangImage[]
}

// State
const selectedJahrgang = ref<number | null>(null)
const showUploadModal = ref(false)
const lightboxVisible = ref(false)
const currentImageIndex = ref(0)
const isDragging = ref(false)

// Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploadPreviewUrl = ref('')
const uploadTitle = ref('')
const uploadAuthor = ref('')

// Dummy Daten - Jahrgänge mit Bildern
const jahrgaenge = ref<Jahrgang[]>([
  {
    year: 2024,
    coverImage: '/dummy1.png',
    imageCount: 12,
    images: [
      { url: '/dummy1.png', title: 'Klassentreffen 2024', author: 'Max Mustermann' },
      { url: '/dummy2.png', title: 'Schulhof Erinnerungen', author: 'Anna Schmidt' },
      { url: '/dummy3.png', title: 'Abschlussfeier', author: 'Tom Weber' },
      { url: '/dummy4.png', title: 'Jahrgangsfoto', author: 'Lisa Müller' },
    ]
  },
  {
    year: 2023,
    coverImage: '/dummy2.png',
    imageCount: 8,
    images: [
      { url: '/dummy2.png', title: 'Alumni-Treffen', author: 'Peter Klein' },
      { url: '/dummy3.png', title: 'Schulbesuch', author: 'Sarah Becker' },
      { url: '/dummy4.png', title: 'Weihnachtsfeier', author: 'Michael Groß' },
    ]
  },
  {
    year: 2022,
    coverImage: '/dummy3.png',
    imageCount: 15,
    images: [
      { url: '/dummy3.png', title: '10-Jahres-Treffen', author: 'Julia Fischer' },
      { url: '/dummy4.png', title: 'Schulgebäude', author: 'David Wagner' },
      { url: '/dummy1.png', title: 'Klassenfoto', author: 'Maria Hoffmann' },
    ]
  },
  {
    year: 2021,
    coverImage: '/dummy4.png',
    imageCount: 6,
    images: [
      { url: '/dummy4.png', title: 'Digitales Treffen', author: 'Stefan Bauer' },
      { url: '/dummy1.png', title: 'Erinnerungen', author: 'Nina Schulz' },
    ]
  },
  {
    year: 2020,
    coverImage: '/dummy1.png',
    imageCount: 10,
    images: [
      { url: '/dummy1.png', title: 'Abschlussjahr', author: 'Christian Koch' },
      { url: '/dummy2.png', title: 'Jahrgangsfeier', author: 'Laura Meyer' },
    ]
  },
])

// Computed
const currentImages = computed(() => {
  if (!selectedJahrgang.value) return []
  return getJahrgangImages(selectedJahrgang.value)
})

const currentImage = computed(() => {
  return currentImages.value[currentImageIndex.value]
})

// Methods
const selectJahrgang = (year: number) => {
  selectedJahrgang.value = year
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getJahrgangImages = (year: number): JahrgangImage[] => {
  const jahrgang = jahrgaenge.value.find(j => j.year === year)
  return jahrgang?.images || []
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadPreviewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadPreviewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const cancelUpload = () => {
  selectedFile.value = null
  uploadPreviewUrl.value = ''
  uploadTitle.value = ''
  uploadAuthor.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = () => {
  if (!selectedFile.value || !uploadAuthor.value || !selectedJahrgang.value) return
  
  // Dummy Upload - nur UI, keine echte Funktionalität
  const newImage: JahrgangImage = {
    url: uploadPreviewUrl.value,
    title: uploadTitle.value || undefined,
    author: uploadAuthor.value
  }
  
  const jahrgang = jahrgaenge.value.find(j => j.year === selectedJahrgang.value)
  if (jahrgang) {
    jahrgang.images.unshift(newImage)
    jahrgang.imageCount = jahrgang.images.length
    jahrgang.coverImage = jahrgang.images[0]?.url || jahrgang.coverImage
  }
  
  // Reset
  cancelUpload()
  showUploadModal.value = false
  
  // Show success message (optional)
  alert('Bild erfolgreich hochgeladen! (Demo)')
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
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
  if (currentImageIndex.value < currentImages.value.length - 1) {
    currentImageIndex.value++
  }
}
</script>

<style scoped>
.jahrgaenge-page {
  min-height: 100vh;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  padding-top: var(--spacing-xl);
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-md);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Jahrgänge Grid */
.jahrgaenge-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.jahrgang-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: var(--color-white);
}

.jahrgang-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.jahrgang-card-image {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.jahrgang-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.jahrgang-card:hover .jahrgang-card-image img {
  transform: scale(1.1);
}

.jahrgang-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: var(--spacing-xl);
  color: var(--color-white);
}

.jahrgang-year {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs) 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.jahrgang-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.stat-icon {
  font-size: 1.2em;
}

/* Jahrgang Detail */
.jahrgang-detail {
  max-width: 1400px;
  margin: 0 auto;
  background: var(--color-white);
  border-radius: 24px;
  padding: var(--spacing-2xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  margin-top: var(--spacing-2xl);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-border);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.back-button:hover {
  background: var(--color-border);
  transform: translateX(-4px);
}

.detail-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin: 0;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.image-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-item:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  padding: var(--spacing-md);
  color: var(--color-white);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-title {
  display: block;
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.image-author {
  display: block;
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

/* Upload Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: var(--color-white);
  border-radius: 24px;
  padding: var(--spacing-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.modal-close:hover {
  background: var(--color-border);
  transform: rotate(90deg);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  color: var(--color-secondary);
}

.upload-area {
  border: 3px dashed var(--color-border);
  border-radius: 16px;
  padding: var(--spacing-2xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-bottom: var(--spacing-xl);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-secondary);
}

.upload-area--dragover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.02);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
}

.upload-placeholder svg {
  opacity: 0.5;
}

.upload-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.upload-preview {
  position: relative;
  max-width: 100%;
  max-height: 400px;
}

.upload-preview img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.remove-preview {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.7);
  color: var(--color-white);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.remove-preview:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: rotate(90deg);
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-field label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.form-field input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
}

.form-field input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--color-white);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.button--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.button--secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

.button--secondary:hover {
  background: var(--color-border);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
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
  top: -60px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-white);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--color-white);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  z-index: 10;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-prev {
  left: -80px;
}

.lightbox-next {
  right: -80px;
}

.lightbox-image-container {
  max-width: 100%;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image-container img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
}

.lightbox-info {
  margin-top: var(--spacing-xl);
  text-align: center;
  color: var(--color-white);
}

.lightbox-info h3 {
  font-size: 1.5rem;
  margin: 0 0 var(--spacing-xs) 0;
}

.lightbox-info p {
  opacity: 0.8;
  margin: 0;
}

.lightbox-counter {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-white);
  background: rgba(0, 0, 0, 0.5);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .jahrgaenge-container {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
  
  .lightbox-prev {
    left: var(--spacing-sm);
  }
  
  .lightbox-next {
    right: var(--spacing-sm);
  }
}
</style>
