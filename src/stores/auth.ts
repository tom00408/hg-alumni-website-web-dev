import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials, RegisterData } from '../services/auth'
import { 
  loginWithEmail, 
  registerWithEmail, 
  logout, 
  onAuthStateChange,
  getCurrentUser,
  getUserDocument
} from '../services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const userDocument = ref<any>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const isMember = computed(() => userDocument.value?.membershipStatus === 'active')
  const userRole = computed(() => userDocument.value?.role || 'guest')  // Immer 'member' oder 'guest'
  const hasCompleteApplication = computed(() => {
    if (!userDocument.value) return false
    const requiredFields = ['address', 'postalCode', 'city', 'birthDate', 'iban', 'bic', 'placeDate', 'signature']
    return requiredFields.every(field => {
      const value = userDocument.value[field as keyof typeof userDocument.value]
      return value !== undefined && value !== null && value !== ''
    })
  })

  // Actions
  const login = async (credentials: LoginCredentials) => {
    try {
      error.value = null
      isLoading.value = true
      
      const authUser = await loginWithEmail(credentials)
      user.value = authUser
      
      // Benutzer-Dokument laden
      await loadUserDocument()
      
      return authUser
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    try {
      error.value = null
      isLoading.value = true
      
      const authUser = await registerWithEmail(data)
      user.value = authUser
      
      // Benutzer-Dokument laden
      await loadUserDocument()
      
      return authUser
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      error.value = null
      await logout()
      user.value = null
      userDocument.value = null
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const loadUserDocument = async () => {
    if (user.value) {
      try {
        // Verwende den neuen User Service
        const { getUser } = await import('../services/users')
        const doc = await getUser(user.value.uid)
        userDocument.value = doc
      } catch (err) {
        console.error('Error loading user document:', err)
      }
    }
  }

  const initializeAuth = () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChange(async (authUser) => {
        user.value = authUser
        
        if (authUser) {
          await loadUserDocument()
        } else {
          userDocument.value = null
        }
        
        isLoading.value = false
        resolve()
      })

      // Cleanup function zurückgeben für später
      return unsubscribe
    })
  }

  const clearError = () => {
    error.value = null
  }

  // Store initialisieren
  const initialize = async () => {
    // Prüfe ob bereits ein Benutzer angemeldet ist
    const currentUser = getCurrentUser()
    if (currentUser) {
      user.value = currentUser
      await loadUserDocument()
    }
    
    // Auth State Listener einrichten
    await initializeAuth()
  }

  return {
    // State
    user,
    userDocument,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isMember,
    userRole,
    hasCompleteApplication,
    
    // Actions
    login,
    register,
    signOut,
    loadUserDocument,
    initialize,
    clearError
  }
})
