import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { GalleryFolder, GalleryImage } from '../lib/types'

const FOLDERS_COLLECTION = 'gallery_folders'
const IMAGES_COLLECTION = 'gallery'

/**
 * Alle Ordner laden
 */
export const getAllFolders = async (): Promise<GalleryFolder[]> => {
  try {
    const foldersCollection = collection(db, FOLDERS_COLLECTION)
    const q = query(foldersCollection, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GalleryFolder[]
  } catch (error) {
    console.error('Error fetching folders:', error)
    // Wenn die Collection nicht existiert, leeres Array zurückgeben
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn('Gallery folders collection does not exist yet, returning empty array')
      return []
    }
    throw new Error('Fehler beim Laden der Ordner')
  }
}

/**
 * Ordner by ID laden
 */
export const getFolderById = async (id: string): Promise<GalleryFolder | null> => {
  try {
    const folderDoc = doc(db, FOLDERS_COLLECTION, id)
    const docSnap = await getDoc(folderDoc)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as GalleryFolder
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching folder by ID:', error)
    throw new Error('Fehler beim Laden des Ordners')
  }
}

/**
 * Bilder in einem Ordner laden
 */
export const getImagesInFolder = async (folderId: string): Promise<GalleryImage[]> => {
  try {
    const imagesCollection = collection(db, IMAGES_COLLECTION)
    const q = query(
      imagesCollection, 
      where('folderId', '==', folderId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GalleryImage[]
  } catch (error) {
    console.error('Error fetching images in folder:', error)
    // Wenn die Collection nicht existiert oder der Ordner leer ist, leeres Array zurückgeben
    if (error instanceof Error && (error.message.includes('not found') || error.message.includes('permission'))) {
      console.warn(`No images found in folder ${folderId} or collection does not exist`)
      return []
    }
    throw new Error('Fehler beim Laden der Bilder im Ordner')
  }
}

/**
 * Unorganisierte Bilder laden (ohne Ordner)
 */
export const getImagesWithoutFolder = async (): Promise<GalleryImage[]> => {
  try {
    const imagesCollection = collection(db, IMAGES_COLLECTION)
    
    // Erst versuchen mit null
    let q = query(
      imagesCollection, 
      where('folderId', '==', null),
      orderBy('createdAt', 'desc')
    )
    
    try {
      const querySnapshot = await getDocs(q)
      const images = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[]
      
      if (images.length > 0) {
        return images
      }
    } catch (nullError) {
      console.log('No images with folderId=null found, trying different approach')
    }
    
    // Falls keine mit null gefunden, alle Bilder laden und filtern
    const allImagesQuery = query(imagesCollection, orderBy('createdAt', 'desc'))
    const allImagesSnapshot = await getDocs(allImagesQuery)
    
    const allImages = allImagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GalleryImage[]
    
    // Filtere Bilder ohne folderId oder mit leerem folderId
    const unorganizedImages = allImages.filter(image => 
      !image.folderId || image.folderId === '' || image.folderId === null
    )
    
    console.log(`Found ${unorganizedImages.length} unorganized images out of ${allImages.length} total images`)
    return unorganizedImages
    
  } catch (error) {
    console.error('Error fetching images without folder:', error)
    // Wenn die Collection nicht existiert oder keine unorganisierten Bilder vorhanden sind
    if (error instanceof Error && (error.message.includes('not found') || error.message.includes('permission'))) {
      console.warn('No unorganized images found or collection does not exist')
      return []
    }
    throw new Error('Fehler beim Laden der unorganisierten Bilder')
  }
}

/**
 * Cover-Bild für Ordner setzen
 */
export const setFolderCoverImage = async (folderId: string, imageId: string): Promise<void> => {
  try {
    const folderDoc = doc(db, FOLDERS_COLLECTION, folderId)
    await updateDoc(folderDoc, {
      coverImageId: imageId,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error setting folder cover image:', error)
    throw new Error('Fehler beim Setzen des Cover-Bildes')
  }
}

/**
 * Anzahl Bilder in einem Ordner ermitteln
 */
export const getImageCountInFolder = async (folderId: string): Promise<number> => {
  try {
    const images = await getImagesInFolder(folderId)
    return images.length
  } catch (error) {
    console.error('Error getting image count in folder:', error)
    return 0
  }
}

/**
 * Cover-Bild für Ordner laden
 */
export const getFolderCoverImage = async (folderId: string): Promise<GalleryImage | null> => {
  try {
    const folder = await getFolderById(folderId)
    if (!folder?.coverImageId) {
      return null
    }
    
    const imageDoc = doc(db, IMAGES_COLLECTION, folder.coverImageId)
    const docSnap = await getDoc(imageDoc)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as GalleryImage
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching folder cover image:', error)
    return null
  }
}

/**
 * Gemischte Ansicht: Ordner und unorganisierte Bilder chronologisch sortiert
 */
export const getMixedGalleryItems = async (): Promise<Array<{
  type: 'folder' | 'image'
  id: string
  date: Timestamp
  data: GalleryFolder | GalleryImage
  imageCount?: number
  coverImage?: GalleryImage | null
}>> => {
  try {
    console.log('Loading mixed gallery items...')
    
    // Alle Ordner laden
    const folders = await getAllFolders()
    console.log(`Found ${folders.length} folders`)
    
    // Alle Bilder laden (nur unorganisierte)
    const unorganizedImages = await getImagesWithoutFolder()
    console.log(`Found ${unorganizedImages.length} unorganized images`)
    
    // Ordner mit Bildanzahl und Cover-Bild erweitern
    const foldersWithMeta = await Promise.all(
      folders.map(async (folder) => {
        const imageCount = await getImageCountInFolder(folder.id!)
        const coverImage = await getFolderCoverImage(folder.id!)
        
        return {
          type: 'folder' as const,
          id: folder.id!,
          date: folder.createdAt || folder.updatedAt || Timestamp.now(),
          data: folder,
          imageCount,
          coverImage
        }
      })
    )
    
    // Unorganisierte Bilder zu Mixed-Items konvertieren
    const imageItems = unorganizedImages.map(image => ({
      type: 'image' as const,
      id: image.id!,
      date: image.createdAt || Timestamp.now(),
      data: image
    }))
    
    // Alle Items zusammenführen und nach Datum sortieren (neueste zuerst)
    const allItems = [...foldersWithMeta, ...imageItems]
    allItems.sort((a, b) => b.date.toMillis() - a.date.toMillis())
    
    console.log(`Mixed gallery: ${foldersWithMeta.length} folders + ${imageItems.length} images = ${allItems.length} total items`)
    
    return allItems
  } catch (error) {
    console.error('Error fetching mixed gallery items:', error)
    throw new Error('Fehler beim Laden der Galerie-Items')
  }
}
