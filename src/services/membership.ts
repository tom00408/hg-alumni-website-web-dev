import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore'
import { db } from '../lib/firebase'
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
      status: 'pending' as const,
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
 * (Placeholder - würde normalerweise mit Firebase Functions implementiert)
 */
const sendApplicationNotification = async (application: MembershipApplication): Promise<void> => {
  try {
    // TODO: Implementiere E-Mail-Versendung mit Firebase Functions
    // Beispiel-Implementierung mit Cloud Functions:
    
    console.log('Sending notification for new membership application:', application.id)
    
    // Mock notification
    // In einer echten Implementierung würde hier eine Cloud Function aufgerufen
    // oder ein E-Mail-Service wie SendGrid/Mailgun verwendet werden
    
  } catch (error) {
    console.error('Error sending notification:', error)
    // Fehler beim E-Mail-Versand sollten die Antragsstellung nicht blockieren
  }
}

/**
 * Validierung der Antragsdaten
 */
export const validateMembershipApplication = (
  data: Omit<MembershipApplication, 'id' | 'createdAt' | 'status'>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Anrede validieren
  if (!data.salutation) {
    errors.push('Anrede ist erforderlich')
  }
  
  // Vorname validieren
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('Vorname muss mindestens 2 Zeichen lang sein')
  }
  
  // Name validieren
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push('Name muss mindestens 2 Zeichen lang sein')
  }
  
  // Adresse validieren
  if (!data.address || data.address.trim().length < 5) {
    errors.push('Adresse muss mindestens 5 Zeichen lang sein')
  }
  
  // PLZ validieren
  if (!data.postalCode || data.postalCode.trim().length === 5) {
    errors.push('PLZ ist erforderlich und muss gültig sein')
  }
  
  // Ort validieren
  if (!data.city || data.city.trim().length < 2) {
    errors.push('Ort ist erforderlich')
  }
  
  // Geburtsdatum validieren
  if (!data.birthDate) {
    errors.push('Geburtsdatum ist erforderlich')
  }
  
  // E-Mail validieren
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein')
  }
  
  // IBAN validieren
  if (!data.iban || data.iban.trim().length === 22) {
    errors.push('IBAN ist erforderlich und muss gültig sein')
  }
  
  // BIC validieren
  if (!data.bic || data.bic.trim().length < 8) {
    errors.push('BIC ist erforderlich und muss gültig sein')
  }
  
  // Ort und Datum validieren
  if (!data.placeDate || data.placeDate.trim().length < 3) {
    errors.push('Ort und Datum sind erforderlich')
  }
  
  // Unterschrift validieren
  if (!data.signature || data.signature.trim().length < 2) {
    errors.push('Unterschrift ist erforderlich')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Hilfsfunktion zum Formatieren der Anwendungsdaten für E-Mails
 */
export const formatApplicationForEmail = (application: MembershipApplication): string => {
  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return 'Unbekannt'
  }
  
  return `
Neue Mitgliedschaftsanfrage

Anrede: ${application.salutation}
Name: ${application.lastName}
Vorname: ${application.firstName}
Adresse: ${application.address}
PLZ: ${application.postalCode}
Ort: ${application.city}
Geburtsdatum: ${application.birthDate}
Beruf: ${application.occupation || 'Nicht angegeben'}
E-Mail: ${application.email}
Schulbesuch von: ${application.schoolFrom || 'Nicht angegeben'}
Schulbesuch bis: ${application.schoolTo || 'Nicht angegeben'}
IBAN: ${application.iban}
BIC: ${application.bic}
Ort, Datum: ${application.placeDate}
Unterschrift: ${application.signature}

Eingereicht am: ${formatDate(application.createdAt)}
Status: ${application.status}
  `.trim()
}
