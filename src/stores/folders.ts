import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GalleryFolder, GalleryImage } from '../lib/types'
import { 
  getAllFolders, 
  getFolderById, 
  getImagesInFolder, 
  getImagesWithoutFolder,
  getImageCountInFolder,
  getFolderCoverImage,
  getMixedGalleryItems
} from '../services/folders'

export const useFoldersStore = defineStore('folders', () => {
  // State
  const folders = ref<GalleryFolder[]>([])
  const currentFolder = ref<GalleryFolder | null>(null)
  const currentFolderImages = ref<GalleryImage[]>([])
  const unorganizedImages = ref<GalleryImage[]>([])
  const mixedGalleryItems = ref<Array<{
    type: 'folder' | 'image'
    id: string
    date: any
    data: GalleryFolder | GalleryImage
    imageCount?: number
    coverImage?: GalleryImage | null
  }>>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const foldersWithImageCounts = computed(async () => {
    const foldersWithCounts = await Promise.all(
      folders.value.map(async (folder) => {
        const imageCount = await getImageCountInFolder(folder.id!)
        const coverImage = await getFolderCoverImage(folder.id!)
        
        return {
          ...folder,
          imageCount,
          coverImage
        }
      })
    )
    return foldersWithCounts
  })

  const totalFolders = computed(() => folders.value.length)
  const totalImages = computed(() => 
    currentFolderImages.value.length + unorganizedImages.value.length
  )

  // Actions
  const fetchFolders = async () => {
    loading.value = true
    error.value = null

    try {
      const foldersData = await getAllFolders()
      folders.value = foldersData
      console.log(`Loaded ${foldersData.length} folders`)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Laden der Ordner'
      console.error('Error fetching folders:', err)
      // Fallback: Leeres Array setzen
      folders.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchFolderById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      currentFolder.value = await getFolderById(id)
      if (currentFolder.value) {
        currentFolderImages.value = await getImagesInFolder(id)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Laden des Ordners'
      console.error('Error fetching folder by ID:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUnorganizedImages = async () => {
    loading.value = true
    error.value = null

    try {
      unorganizedImages.value = await getImagesWithoutFolder()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Laden der unorganisierten Bilder'
      console.error('Error fetching unorganized images:', err)
    } finally {
      loading.value = false
    }
  }

  const clearCurrentFolder = () => {
    currentFolder.value = null
    currentFolderImages.value = []
  }

  const fetchMixedGallery = async () => {
    loading.value = true
    error.value = null

    try {
      const mixedItems = await getMixedGalleryItems()
      mixedGalleryItems.value = mixedItems
      console.log(`Loaded ${mixedItems.length} mixed gallery items`)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler beim Laden der Galerie-Items'
      console.error('Error fetching mixed gallery:', err)
      mixedGalleryItems.value = []
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    folders.value = []
    currentFolder.value = null
    currentFolderImages.value = []
    unorganizedImages.value = []
    mixedGalleryItems.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    folders,
    currentFolder,
    currentFolderImages,
    unorganizedImages,
    mixedGalleryItems,
    loading,
    error,
    
    // Getters
    foldersWithImageCounts,
    totalFolders,
    totalImages,
    
    // Actions
    fetchFolders,
    fetchFolderById,
    fetchUnorganizedImages,
    fetchMixedGallery,
    clearCurrentFolder,
    clearError,
    reset
  }
})
