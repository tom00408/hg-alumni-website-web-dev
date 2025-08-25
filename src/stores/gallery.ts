import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GalleryImage } from '../lib/types'
import { useMockData } from '../lib/firebase'

export const useGalleryStore = defineStore('gallery', () => {
  // State
  const images = ref<GalleryImage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const hasMore = ref(true)
  const pageSize = 12

  // Getters
  const latestImages = computed(() => {
    return images.value
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
      .slice(0, 8)
  })

  const imagesByYear = computed(() => {
    const yearMap = new Map<number, GalleryImage[]>()
    
    images.value.forEach(image => {
      const year = image.createdAt?.toDate().getFullYear() || new Date().getFullYear()
      if (!yearMap.has(year)) {
        yearMap.set(year, [])
      }
      yearMap.get(year)!.push(image)
    })
    
    // Nach Jahr sortiert (neueste zuerst)
    return new Map([...yearMap.entries()].sort((a, b) => b[0] - a[0]))
  })

  const totalImages = computed(() => images.value.length)

  // Actions
  const fetchImages = async (page = 1, reset = false) => {
    if (page === 1) {
      loading.value = true
    }
    error.value = null

    try {
      if (useMockData) {
        // Mock-Daten verwenden
        const { getMockGallery } = await import('../lib/mockData')
        const mockImages = getMockGallery()
        
        if (reset || page === 1) {
          images.value = mockImages
          currentPage.value = 1
        } else {
          // Simuliere Paginierung
          images.value.push(...mockImages)
        }
        
        // Mock: Keine weitere Paginierung
        hasMore.value = false
      } else {
        // TODO: Echte Firebase-Daten laden mit Paginierung
        const { getImages } = await import('../services/gallery')
        const { images: newImages, hasMore: moreAvailable } = await getImages(page, pageSize)
        
        if (reset || page === 1) {
          images.value = newImages
        } else {
          images.value.push(...newImages)
        }
        
        hasMore.value = moreAvailable
        currentPage.value = page
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Laden der Galerie'
      console.error('Error fetching images:', err)
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    
    const nextPage = currentPage.value + 1
    await fetchImages(nextPage, false)
  }

  const uploadImage = async (file: File, title?: string) => {
    try {
      if (useMockData) {
        // Mock: Simuliere Upload
        const mockImageUrl = URL.createObjectURL(file)
        const newImage: GalleryImage = {
          id: `mock-${Date.now()}`,
          title: title || file.name,
          imageUrl: mockImageUrl,
          thumbnailUrl: mockImageUrl,
          createdAt: { toDate: () => new Date(), toMillis: () => Date.now() } as any
        }
        images.value.unshift(newImage) // Am Anfang hinzufügen
        return newImage
      } else {
        // TODO: Echtes File-Upload zu Firebase Storage
        const { uploadImage: uploadToFirebase } = await import('../services/gallery')
        const newImage = await uploadToFirebase(file, title)
        images.value.unshift(newImage)
        return newImage
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Hochladen des Bildes'
      throw err
    }
  }

  const uploadMultipleImages = async (files: File[]) => {
    const uploadPromises = files.map(file => uploadImage(file))
    
    try {
      const results = await Promise.all(uploadPromises)
      return results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Hochladen der Bilder'
      throw err
    }
  }

  const updateImage = async (id: string, data: Partial<GalleryImage>) => {
    try {
      if (useMockData) {
        // Mock: Bild in lokaler Liste aktualisieren
        const index = images.value.findIndex(image => image.id === id)
        if (index !== -1) {
          images.value[index] = { ...images.value[index], ...data }
        }
      } else {
        // TODO: Bild in Firebase aktualisieren
        const { updateImage: updateFirebaseImage } = await import('../services/gallery')
        await updateFirebaseImage(id, data)
        
        const index = images.value.findIndex(image => image.id === id)
        if (index !== -1) {
          images.value[index] = { ...images.value[index], ...data }
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Aktualisieren des Bildes'
      throw err
    }
  }

  const deleteImage = async (id: string) => {
    try {
      if (useMockData) {
        // Mock: Bild aus lokaler Liste entfernen
        const image = images.value.find(img => img.id === id)
        if (image && image.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(image.imageUrl) // Blob URL aufräumen
        }
        images.value = images.value.filter(image => image.id !== id)
      } else {
        // TODO: Bild aus Firebase löschen (sowohl Firestore als auch Storage)
        const { deleteImage: deleteFirebaseImage } = await import('../services/gallery')
        await deleteFirebaseImage(id)
        images.value = images.value.filter(image => image.id !== id)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Löschen des Bildes'
      throw err
    }
  }

  const getImageById = (id: string) => {
    return images.value.find(image => image.id === id)
  }

  const getImagesByYear = (year: number) => {
    return images.value
      .filter(image => image.createdAt?.toDate().getFullYear() === year)
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
  }

  const searchImages = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return images.value.filter(image => 
      image.title?.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    // Blob URLs aufräumen
    images.value.forEach(image => {
      if (image.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(image.imageUrl)
      }
      if (image.thumbnailUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(image.thumbnailUrl)
      }
    })
    
    images.value = []
    currentPage.value = 1
    hasMore.value = true
    error.value = null
  }

  return {
    // State
    images,
    loading,
    error,
    currentPage,
    hasMore,
    pageSize,
    
    // Getters
    latestImages,
    imagesByYear,
    totalImages,
    
    // Actions
    fetchImages,
    loadMore,
    uploadImage,
    uploadMultipleImages,
    updateImage,
    deleteImage,
    getImageById,
    getImagesByYear,
    searchImages,
    clearError,
    reset
  }
})
