import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  type User
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  salutation: string
}

// Login mit Email und Passwort
export const loginWithEmail = async (credentials: LoginCredentials): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    const user = userCredential.user
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

// Registrierung mit Email und Passwort
export const registerWithEmail = async (data: RegisterData): Promise<AuthUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
    const user = userCredential.user
    
    // Display Name setzen
    const displayName = `${data.firstName} ${data.lastName}`
    await updateProfile(user, { displayName })
    
    // Basis-Benutzer-Dokument in Firestore erstellen (ohne vollständige Daten)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      salutation: data.salutation,
      displayName: displayName,
      
      // Platzhalter für fehlende Pflichtfelder - werden beim Mitgliedsantrag ausgefüllt
      address: '',
      postalCode: '',
      city: '',
      birthDate: '',
      iban: '',
      bic: '',
      
      // Status-Felder
      applicationStatus: 'new',
      membershipStatus: 'pending',
      role: 'member',
      
      // Timestamps
      createdAt: new Date().toISOString(),
    })
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: displayName
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(getAuthErrorMessage(error.code))
  }
}

// Logout
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('Logout error:', error)
    throw new Error('Fehler beim Abmelden')
  }
}

// Auth State Observer
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      })
    } else {
      callback(null)
    }
  })
}

// Aktuellen Benutzer abrufen
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }
  }
  return null
}

// Benutzer-Dokument aus Firestore abrufen
export const getUserDocument = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error('Error fetching user document:', error)
    return null
  }
}

// Firebase Auth Error Messages auf Deutsch
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Benutzer nicht gefunden'
    case 'auth/wrong-password':
      return 'Falsches Passwort'
    case 'auth/email-already-in-use':
      return 'Diese E-Mail-Adresse wird bereits verwendet'
    case 'auth/weak-password':
      return 'Das Passwort ist zu schwach'
    case 'auth/invalid-email':
      return 'Ungültige E-Mail-Adresse'
    case 'auth/user-disabled':
      return 'Dieser Account wurde deaktiviert'
    case 'auth/too-many-requests':
      return 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut'
    case 'auth/network-request-failed':
      return 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung'
    default:
      return 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut'
  }
}
