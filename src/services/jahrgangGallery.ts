import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import type { JahrgangGalleryImage, JahrgangFolder } from '../lib/types'

const IMAGES_COLLECTION = 'jahrgang_gallery'
const FOLDERS_COLLECTION = 'jahrgang_folders'
const STORAGE_PATH = 'jahrgaenge'

/**
 * Bilder eines Jahrgangs laden
 */
export const getJahrgangImages = async (jahrgang: number, folderId?: string): Promise<JahrgangGalleryImage[]> => {
  try {
    const imagesCollection = collection(db, IMAGES_COLLECTION)
    let q
    
    if (folderId) {
      // Bilder in einem bestimmten Ordner
      q = query(
        imagesCollection,
        where('jahrgang', '==', jahrgang),
        where('folderId', '==', folderId),
        orderBy('createdAt', 'desc')
      )
    } else {
      // Alle Bilder des Jahrgangs (ohne Ordner oder mit Ordner)
      q = query(
        imagesCollection,
        where('jahrgang', '==', jahrgang),
        orderBy('createdAt', 'desc')
      )
    }
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as JahrgangGalleryImage[]
  } catch (error) {
    console.error('Error fetching jahrgang images:', error)
    throw new Error('Fehler beim Laden der Jahrgangs-Bilder')
  }
}

/**
 * Bild zu Jahrgang hochladen
 */
export const uploadJahrgangImage = async (
  file: File,
  jahrgang: number,
  uploadedBy: string,
  uploadedByName: string,
  title?: string,
  folderId?: string
): Promise<JahrgangGalleryImage> => {
  try {
    // Validierung
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Nur JPEG, PNG und WebP Bilder sind erlaubt')
    }
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Bild ist zu groß. Maximum: 5MB')
    }
    
    // Dateiname generieren
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name}`
    const fullPath = `${STORAGE_PATH}/${jahrgang}/${filename}`
    
    // Upload zu Firebase Storage
    const fileRef = storageRef(storage, fullPath)
    const snapshot = await uploadBytes(fileRef, file)
    const imageUrl = await getDownloadURL(snapshot.ref)
    
    // Thumbnail URL (zunächst gleich dem Original - kann später optimiert werden)
    const thumbnailUrl = imageUrl
    
    // Bild-Metadaten in Firestore speichern
    const imageData: Omit<JahrgangGalleryImage, 'id'> = {
      title: title || file.name,
      imageUrl,
      thumbnailUrl,
      jahrgang,
      folderId: folderId || null,
      uploadedBy,
      uploadedByName,
      createdAt: Timestamp.now()
    }
    
    const imagesCollection = collection(db, IMAGES_COLLECTION)
    const docRef = await addDoc(imagesCollection, imageData)
    
    return {
      id: docRef.id,
      ...imageData
    } as JahrgangGalleryImage
  } catch (error) {
    console.error('Error uploading jahrgang image:', error)
    throw new Error(`Fehler beim Hochladen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`)
  }
}

/**
 * Ordner eines Jahrgangs laden
 */
export const getJahrgangFolders = async (jahrgang: number): Promise<JahrgangFolder[]> => {
  try {
    const foldersCollection = collection(db, FOLDERS_COLLECTION)
    const q = query(
      foldersCollection,
      where('jahrgang', '==', jahrgang),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as JahrgangFolder[]
  } catch (error) {
    console.error('Error fetching jahrgang folders:', error)
    // Wenn die Collection nicht existiert, leeres Array zurückgeben
    if (error instanceof Error && error.message.includes('not found')) {
      return []
    }
    throw new Error('Fehler beim Laden der Jahrgangs-Ordner')
  }
}

/**
 * Ordner by ID laden
 */
export const getJahrgangFolderById = async (id: string): Promise<JahrgangFolder | null> => {
  try {
    const folderDoc = doc(db, FOLDERS_COLLECTION, id)
    const docSnap = await getDoc(folderDoc)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as JahrgangFolder
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching jahrgang folder by ID:', error)
    throw new Error('Fehler beim Laden des Ordners')
  }
}
