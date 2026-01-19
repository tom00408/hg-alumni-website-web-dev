<template>
  <div class="jahrgaenge">
    <!-- Login/Registrierung Button in der Ecke -->
    <div v-if="!isJahrgangUser" class="auth-corner">
      <button 
        @click="showAuthModal = true" 
        class="auth-button"
        :class="{ 'auth-button--active': showAuthModal }"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span>Anmelden</span>
      </button>

      <!-- Auth Modal -->
      <div v-if="showAuthModal" class="auth-modal-overlay" @click="showAuthModal = false">
        <div class="auth-modal" @click.stop>
          <button class="auth-modal-close" @click="showAuthModal = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>

          <!-- Tabs -->
          <div class="auth-tabs">
            <button 
              :class="['tab-button', { 'tab-button--active': activeTab === 'register' }]"
              @click="activeTab = 'register'"
            >
              Registrieren
            </button>
            <button 
              :class="['tab-button', { 'tab-button--active': activeTab === 'login' }]"
              @click="activeTab = 'login'"
            >
              Anmelden
            </button>
          </div>

          <!-- Registrierungs-Formular -->
          <div v-if="activeTab === 'register'" class="auth-form-container">
            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="form-field">
                <label for="reg-firstName" class="form-label">Vorname *</label>
                <input
                  id="reg-firstName"
                  v-model="registerForm.firstName"
                  type="text"
                  class="form-input"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div class="form-field">
                <label for="reg-lastName" class="form-label">Nachname *</label>
                <input
                  id="reg-lastName"
                  v-model="registerForm.lastName"
                  type="text"
                  class="form-input"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div class="form-field">
                <label for="reg-email" class="form-label">E-Mail-Adresse *</label>
                <input
                  id="reg-email"
                  v-model="registerForm.email"
                  type="email"
                  class="form-input"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div class="form-field">
                <label for="reg-jahrgang" class="form-label">Abiturjahrgang *</label>
                <input
                  id="reg-jahrgang"
                  v-model.number="registerForm.abiturjahrgang"
                  type="number"
                  min="1950"
                  :max="new Date().getFullYear() + 5"
                  class="form-input"
                  required
                  :disabled="isLoading"
                />
                <small class="form-hint">Jahr Ihres Abiturs (z.B. 2020)</small>
              </div>

              <div class="form-field">
                <label for="reg-password" class="form-label">Passwort *</label>
                <input
                  id="reg-password"
                  v-model="registerForm.password"
                  type="password"
                  class="form-input"
                  required
                  minlength="6"
                  :disabled="isLoading"
                />
                <small class="form-hint">Mindestens 6 Zeichen</small>
              </div>

              <div v-if="registerError" class="error-message">
                {{ registerError }}
              </div>

              <button type="submit" class="button button--primary" :disabled="isLoading">
                {{ isLoading ? 'Registrierung...' : 'Registrieren' }}
              </button>
            </form>
          </div>

          <!-- Login-Formular -->
          <div v-if="activeTab === 'login'" class="auth-form-container">
            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-field">
                <label for="login-email" class="form-label">E-Mail-Adresse *</label>
                <input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  class="form-input"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div class="form-field">
                <label for="login-password" class="form-label">Passwort *</label>
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  type="password"
                  class="form-input"
                  required
                  :disabled="isLoading"
                />
              </div>

              <div v-if="loginError" class="error-message">
                {{ loginError }}
              </div>

              <button type="submit" class="button button--primary" :disabled="isLoading">
                {{ isLoading ? 'Anmeldung...' : 'Anmelden' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- User-Info in Ecke wenn angemeldet -->
    <div v-else class="auth-corner">
      <div class="user-info">
        <span class="user-name">{{ jahrgangUser?.firstName }} {{ jahrgangUser?.lastName }}</span>
        <span class="user-jahrgang">Jahrgang {{ jahrgangUser?.abiturjahrgang }}</span>
        <button @click="handleLogout" class="logout-button">
          Abmelden
        </button>
      </div>
    </div>

    <!-- Hauptinhalt: Jahrgänge-Übersicht oder Galerie -->
    <div class="main-content">
      <div class="page-header">
        <h1 class="page-title">Jahrgänge</h1>
        <p class="page-subtitle">
          <span v-if="!isJahrgangUser">
            Melden Sie sich an, um Zugang zu den Jahrgangs-Galerien zu erhalten
          </span>
          <span v-else>
            Willkommen zurück! Hier ist Ihre Jahrgangs-Galerie
          </span>
        </p>
      </div>

      <!-- Wenn nicht angemeldet: Jahrgänge-Übersicht -->
      <div v-if="!isJahrgangUser" class="jahrgaenge-overview">
        <div v-if="loadingJahrgaenge" class="loading">Jahrgänge werden geladen...</div>
        <div v-else-if="jahrgaenge.length === 0" class="empty-state">
          <p>Noch keine Jahrgänge verfügbar. Registrieren Sie sich als Erster für Ihren Jahrgang!</p>
        </div>
        <div v-else class="jahrgaenge-grid">
          <div
            v-for="jahrgang in jahrgaenge"
            :key="jahrgang"
            class="jahrgang-card"
          >
            <div class="jahrgang-card-header">
              <h2>Jahrgang {{ jahrgang }}</h2>
              <span class="image-count">{{ jahrgangImageCounts[jahrgang] || 0 }} Bilder</span>
            </div>
            <div class="jahrgang-card-preview">
              <img 
                v-if="jahrgangCoverImages[jahrgang]" 
                :src="jahrgangCoverImages[jahrgang]"
                :alt="`Jahrgang ${jahrgang}`"
              />
              <div v-else class="preview-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <p>Noch keine Bilder</p>
              </div>
            </div>
            <div class="jahrgang-card-footer">
              <button 
                @click="showAuthModal = true" 
                class="button button--primary button--small"
              >
                Anmelden für Zugang
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Wenn angemeldet: Eigene Jahrgangs-Galerie -->
      <div v-else class="gallery-section">
        <!-- Upload-Bereich -->
        <div class="upload-section">
          <h2>Bild hochladen</h2>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            style="display: none"
          />
          <button @click="fileInput?.click()" class="button button--primary">
            Bild auswählen
          </button>
          
          <div v-if="selectedFile" class="upload-preview">
            <img :src="uploadPreviewUrl" alt="Vorschau" class="preview-image" />
            <div class="preview-actions">
              <input
                v-model="uploadTitle"
                type="text"
                placeholder="Titel (optional)"
                class="form-input"
              />
              <button @click="handleUpload" class="button button--primary" :disabled="uploading">
                {{ uploading ? 'Hochladen...' : 'Hochladen' }}
              </button>
              <button @click="cancelUpload" class="button button--secondary">
                Abbrechen
              </button>
            </div>
          </div>
        </div>

        <!-- Bildergalerie -->
        <div v-if="loadingImages" class="loading">Bilder werden geladen...</div>
        <div v-else-if="images.length === 0" class="empty-state">
          <p>Noch keine Bilder vorhanden. Laden Sie das erste Bild hoch!</p>
        </div>
        <div v-else class="image-grid">
          <div
            v-for="(image, index) in images"
            :key="image.id"
            class="image-item"
            @click="openLightbox(index)"
          >
            <img :src="image.thumbnailUrl || image.imageUrl" :alt="image.title || 'Bild'" />
            <div v-if="image.title" class="image-title">{{ image.title }}</div>
          </div>
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
            v-if="currentImageIndex < images.length - 1"
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
          {{ currentImageIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { registerJahrgangUser, loginWithEmail, getJahrgangUser, isJahrgangUser as checkIsJahrgangUser } from '../services/auth'
import { getJahrgangImages, uploadJahrgangImage } from '../services/jahrgangGallery'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { JahrgangUser, JahrgangGalleryImage } from '../lib/types'

const authStore = useAuthStore()

// Auth Modal State
const showAuthModal = ref(false)
const activeTab = ref<'register' | 'login'>('register')
const isJahrgangUser = ref(false)
const jahrgangUser = ref<JahrgangUser | null>(null)

// Forms
const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  abiturjahrgang: new Date().getFullYear() - 3,
  password: ''
})

const loginForm = ref({
  email: '',
  password: ''
})

const registerError = ref('')
const loginError = ref('')

// Jahrgänge Overview State
const jahrgaenge = ref<number[]>([])
const jahrgangImageCounts = ref<Record<number, number>>({})
const jahrgangCoverImages = ref<Record<number, string>>({})
const loadingJahrgaenge = ref(false)

// Gallery State
const images = ref<JahrgangGalleryImage[]>([])
const loadingImages = ref(false)

// Upload State
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploadPreviewUrl = ref('')
const uploadTitle = ref('')
const uploading = ref(false)

// Lightbox State
const lightboxVisible = ref(false)
const currentImageIndex = ref(0)

const currentImage = computed(() => images.value[currentImageIndex.value])
const isLoading = computed(() => authStore.isLoading)

// Methods
const handleRegister = async () => {
  registerError.value = ''
  try {
    await registerJahrgangUser(registerForm.value)
    showAuthModal.value = false
    await checkUserType()
    if (jahrgangUser.value) {
      await loadImages()
    }
  } catch (error: any) {
    registerError.value = error.message || 'Registrierung fehlgeschlagen'
  }
}

const handleLogin = async () => {
  loginError.value = ''
  try {
    await loginWithEmail(loginForm.value)
    await checkUserType()
    if (jahrgangUser.value) {
      await loadImages()
      showAuthModal.value = false
    } else {
      loginError.value = 'Dieses Konto ist kein Jahrgangs-Konto. Bitte registrieren Sie sich im Jahrgangs-Bereich.'
    }
  } catch (error: any) {
    loginError.value = error.message || 'Anmeldung fehlgeschlagen'
  }
}

const handleLogout = async () => {
  await authStore.signOut()
  isJahrgangUser.value = false
  jahrgangUser.value = null
  images.value = []
}

const checkUserType = async () => {
  const user = authStore.user
  if (user) {
    const isJahrgang = await checkIsJahrgangUser(user.uid)
    isJahrgangUser.value = isJahrgang
    if (isJahrgang) {
      const userData = await getJahrgangUser(user.uid)
      jahrgangUser.value = userData
    }
  } else {
    isJahrgangUser.value = false
    jahrgangUser.value = null
  }
}

const loadJahrgaenge = async () => {
  loadingJahrgaenge.value = true
  try {
    // Lade alle Bilder und gruppiere nach Jahrgang
    const imagesCollection = collection(db, 'jahrgang_gallery')
    const querySnapshot = await getDocs(imagesCollection)
    
    const jahrgangMap = new Map<number, number>()
    const coverMap = new Map<number, string>()
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data()
      const jahrgang = data.jahrgang as number
      if (jahrgang) {
        jahrgangMap.set(jahrgang, (jahrgangMap.get(jahrgang) || 0) + 1)
        // Erste Bild als Cover verwenden
        if (!coverMap.has(jahrgang) && data.imageUrl) {
          coverMap.set(jahrgang, data.imageUrl)
        }
      }
    })
    
    jahrgaenge.value = Array.from(jahrgangMap.keys()).sort((a, b) => b - a)
    jahrgangImageCounts.value = Object.fromEntries(jahrgangMap)
    jahrgangCoverImages.value = Object.fromEntries(coverMap)
  } catch (error) {
    console.error('Error loading jahrgaenge:', error)
  } finally {
    loadingJahrgaenge.value = false
  }
}

const loadImages = async () => {
  if (!jahrgangUser.value) return
  
  loadingImages.value = true
  try {
    const loadedImages = await getJahrgangImages(jahrgangUser.value.abiturjahrgang)
    images.value = loadedImages
  } catch (error) {
    console.error('Error loading images:', error)
  } finally {
    loadingImages.value = false
  }
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

const handleUpload = async () => {
  if (!selectedFile.value || !jahrgangUser.value || !authStore.user) return
  
  uploading.value = true
  try {
    const uploadedImage = await uploadJahrgangImage(
      selectedFile.value,
      jahrgangUser.value.abiturjahrgang,
      authStore.user.uid,
      `${jahrgangUser.value.firstName} ${jahrgangUser.value.lastName}`,
      uploadTitle.value || undefined
    )
    
    images.value.unshift(uploadedImage)
    cancelUpload()
  } catch (error: any) {
    alert(error.message || 'Upload fehlgeschlagen')
  } finally {
    uploading.value = false
  }
}

const cancelUpload = () => {
  selectedFile.value = null
  uploadPreviewUrl.value = ''
  uploadTitle.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++
  }
}

// Lifecycle
onMounted(async () => {
  await checkUserType()
  if (jahrgangUser.value) {
    await loadImages()
  } else {
    await loadJahrgaenge()
  }
})
</script>

<style scoped>
.jahrgaenge {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* Auth Corner - Oben rechts */
.auth-corner {
  position: fixed;
  top: calc(var(--header-height) + var(--spacing-md));
  right: var(--spacing-lg);
  z-index: 999;
}

.auth-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-white);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all var(--transition-normal);
}

.auth-button:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 200px;
}

.user-name {
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.user-jahrgang {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.logout-button {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-secondary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

/* Auth Modal */
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.auth-modal {
  position: relative;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.auth-modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-tabs {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-sm);
  border: 2px solid var(--color-border);
  background: var(--color-white);
  color: var(--color-text);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.tab-button--active {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.auth-form-container {
  margin-top: var(--spacing-lg);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-weight: var(--font-weight-medium);
}

.form-input {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.form-hint {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.error-message {
  background: #fee;
  color: #c33;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
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
  background: var(--color-primary);
  color: var(--color-white);
}

.button--secondary {
  background: var(--color-secondary);
  color: var(--color-white);
}

.button--small {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Main Content */
.main-content {
  margin-top: calc(var(--header-height) + 60px);
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
  color: var(--color-text-secondary);
}

/* Jahrgänge Overview */
.jahrgaenge-overview {
  margin-top: var(--spacing-xl);
}

.jahrgaenge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.jahrgang-card {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.jahrgang-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.jahrgang-card-header {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jahrgang-card-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-secondary);
}

.image-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.jahrgang-card-preview {
  height: 200px;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.jahrgang-card-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.jahrgang-card-footer {
  padding: var(--spacing-md);
}

/* Gallery Section */
.upload-section {
  background: var(--color-bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.upload-preview {
  margin-top: var(--spacing-md);
}

.preview-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.preview-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.image-item {
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform var(--transition-normal);
}

.image-item:hover {
  transform: scale(1.05);
}

.image-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.image-title {
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  text-align: center;
}

.loading, .empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

/* Lightbox Styles - same as before */
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
  z-index: 1001;
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
  pointer-events: all;
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
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lightbox-caption {
  margin-top: var(--spacing-lg);
  text-align: center;
  color: var(--color-white);
}

.lightbox-counter {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-white);
  background: rgba(0, 0, 0, 0.5);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
}
</style>
