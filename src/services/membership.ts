import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '../lib/firebase'
import type { MembershipApplication } from '../lib/types'

const COLLECTION_NAME = 'applications'

/**
 * Neue Mitgliedschaftsanfrage erstellen
 */
export const createMembershipApplication = async (
  applicationData: Omit<MembershipApplication, 'id' | 'createdAt' | 'status'>
): Promise<MembershipApplication> => {
  try {
    const applicationsCollection = collection(db, COLLECTION_NAME)
    
    const applicationWithMetadata = {
      ...applicationData,
      status: 'new' as const,
      createdAt: Timestamp.now()
    }
    
    const docRef = await addDoc(applicationsCollection, applicationWithMetadata)
    
    const createdApplication: MembershipApplication = {
      id: docRef.id,
      ...applicationWithMetadata
    }
    
    // Optional: E-Mail-Benachrichtigung senden
    await sendApplicationNotification(createdApplication)
    
    return createdApplication
  } catch (error) {
    console.error('Error creating membership application:', error)
    throw new Error('Fehler beim Einreichen der Mitgliedschaftsanfrage')
  }
}

/**
 * E-Mail-Benachrichtigung für neue Anträge senden
 * Ruft Firebase Function auf und übergibt den kompletten MembershipApplication Type
 */
const sendApplicationNotification = async (application: MembershipApplication): Promise<void> => {
  try {
    console.log('Sending notification for new membership application:', application.id)
    
    // Firebase Function aufrufen - übergibt den kompletten MembershipApplication Type
    const sendConfirmationEmail = httpsCallable(functions, 'sendConfirmationEmail')
    
    // Den kompletten Application Type übergeben
    const result = await sendConfirmationEmail({
      application: application
    })
    
    console.log('Confirmation email sent successfully:', result.data)
    
  } catch (error) {
    console.error('Error sending notification:', error)
    // Fehler beim E-Mail-Versand sollten die Antragsstellung nicht blockieren
    // In einer Produktionsumgebung könnte hier ein Fallback-Mechanismus implementiert werden
  }
}
