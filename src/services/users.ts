import { 
  doc, 
  setDoc, 
  getDoc, 
  Timestamp 
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions, auth } from '../lib/firebase'
import type { User, MembershipApplication, SubmitEmailData } from '../lib/types'

const COLLECTION_NAME = 'users'

/**
 * Mitgliedsantrag für einen User erstellen
 */
export const submitMembershipApplication = async (
  uid: string,
  applicationData: Omit<MembershipApplication, 'id' | 'createdAt' | 'applicationStatus' | 'userId'>
): Promise<User> => {
  try {
    console.log('Submitting application for UID:', uid)
    console.log('Current auth user:', auth.currentUser?.uid)
    
    const userDocRef = doc(db, COLLECTION_NAME, uid)
    
    // Prüfen ob User bereits existiert
    const userDoc = await getDoc(userDocRef)
    console.log('User doc exists:', userDoc.exists())
    
    const applicationWithMetadata = {
      ...applicationData,
      uid,
      applicationStatus: 'new' as const,
      applicationCreatedAt: Timestamp.now(),
      membershipStatus: 'pending' as const,
      role: 'member' as const,
      updatedAt: Timestamp.now()
    }
    
    let userData: User
    
    if (userDoc.exists()) {
      // User existiert bereits - Merge mit bestehenden Daten und verwende setDoc
      console.log('User exists, merging data...')
      const existingData = userDoc.data()
      userData = {
        ...existingData,
        ...applicationWithMetadata,
        // createdAt beibehalten, aber updatedAt aktualisieren
        createdAt: existingData?.createdAt || Timestamp.now()
      } as User
      
      console.log('Attempting setDoc with merge for existing user...')
      // Verwende setDoc mit merge: true für bessere Security Rules Kompatibilität
      await setDoc(userDocRef, userData, { merge: true })
    } else {
      // Neuer User - vollständiges Dokument erstellen
      console.log('Creating new user document...')
      userData = {
        ...applicationWithMetadata,
        createdAt: Timestamp.now()
      } as User
      
      console.log('Attempting setDoc for new user...')
      await setDoc(userDocRef, userData)
    }
    
    // E-Mail-Benachrichtigung senden
    await sendApplicationNotification(userData)
    
    return userData
  } catch (error) {
    console.error('Error submitting membership application:', error)
    throw new Error('Fehler beim Einreichen der Mitgliedschaftsanfrage')
  }
}

/**
 * User-Dokument abrufen
 */
export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTION_NAME, uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    }
    return null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

/**
 * User-Dokument aktualisieren (verwendet setDoc mit merge für Security Rules)
 */
export const updateUser = async (uid: string, updates: Partial<User>): Promise<void> => {
  try {
    const userDocRef = doc(db, COLLECTION_NAME, uid)
    
    // Verwende setDoc mit merge: true statt updateDoc
    await setDoc(userDocRef, {
      ...updates,
      updatedAt: Timestamp.now()
    }, { merge: true })
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Fehler beim Aktualisieren der Benutzerdaten')
  }
}


/**
 * E-Mail-Benachrichtigung für neue Anträge senden
 */
const sendApplicationNotification = async (user: User): Promise<void> => {

  const data: SubmitEmailData = {
    salutation: user.salutation,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
    postalCode: user.postalCode,
    city: user.city,
    birthDate: user.birthDate
  }

  const eingangsBestaetigung = httpsCallable(functions, "eingangsBestaetigung");

  try {
    await eingangsBestaetigung({ submitEmailData: data });
    //console.log("✅✅✅✅✅✅Mail gesendet:", result.data);
  } catch (err) {
    //console.error("❌❌❌❌❌❌Fehler beim Senden:", err);
    throw err;
  }

}

/**
 * Prüfen ob User einen vollständigen Mitgliedsantrag hat
 */
export const hasCompleteApplication = (user: User): boolean => {
  const requiredFields = [
    'address', 'postalCode', 'city', 'birthDate', 'iban', 'bic', 
    'placeDate', 'signature'
  ]
  
  return requiredFields.every(field => {
    const value = user[field as keyof User]
    return value !== undefined && value !== null && value !== ''
  })
}

/**
 * Prüfen ob User ein aktives Mitglied ist
 */
export const isActiveMember = (user: User): boolean => {
  return user.applicationStatus === 'approved' && user.membershipStatus === 'active'
}
