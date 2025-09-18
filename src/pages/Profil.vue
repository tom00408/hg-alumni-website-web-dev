<template>
  <div class="profile-page">
    <div class="profile-header">
      <h1>Mein Profil</h1>
      <p class="profile-subtitle">Verwalte deine persönlichen Informationen</p>
    </div>

    <div class="profile-content">
      <!-- Benutzer Informationen -->
      <div class="profile-section">
        <div class="section-header">
          <h2>Persönliche Daten</h2>
          <button 
            v-if="!isEditing"
            @click="startEditing"
            class="edit-btn"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Bearbeiten
          </button>
        </div>

        <div class="profile-info">
          <div class="user-avatar-large">
            <span class="avatar-text">{{ getUserInitials() }}</span>
          </div>
          
          <div class="user-details-grid">
            <div class="detail-item">
              <label>Name</label>
              <input 
                v-if="isEditing"
                v-model="editForm.displayName"
                type="text"
                class="form-input"
                placeholder="Vollständiger Name"
              />
              <p v-else class="detail-value">{{ authStore.user?.displayName || 'Nicht angegeben' }}</p>
            </div>

            <div class="detail-item">
              <label>E-Mail</label>
              <p class="detail-value">{{ authStore.user?.email }}</p>
              <small class="detail-note">E-Mail-Adresse kann nicht geändert werden</small>
            </div>

            <div v-if="userDocument" class="detail-item">
              <label>Mitgliedsstatus</label>
              <div class="status-badge" :class="getMembershipStatusClass()">
                {{ getMembershipStatusText() }}
              </div>
            </div>

            <div v-if="userDocument" class="detail-item">
              <label>Mitglied seit</label>
              <p class="detail-value">
                {{ userDocument.createdAt ? formatDate(userDocument.createdAt) : 'Nicht verfügbar' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bearbeitung Aktionen -->
        <div v-if="isEditing" class="edit-actions">
          <button 
            @click="saveChanges"
            class="save-btn"
            type="button"
            :disabled="isSaving"
          >
            <span v-if="isSaving">Speichere...</span>
            <span v-else>Änderungen speichern</span>
          </button>
          <button 
            @click="cancelEditing"
            class="cancel-btn"
            type="button"
          >
            Abbrechen
          </button>
        </div>
      </div>

      <!-- Mitgliedschaftsinformationen -->
      <div v-if="userDocument" class="profile-section">
        <div class="section-header">
          <h2>Mitgliedschaftsinformationen</h2>
        </div>

        <div class="membership-info">
          <div class="info-grid">
            <div class="info-item">
              <label>Adresse</label>
              <input 
                v-if="isEditing"
                v-model="editForm.address"
                type="text"
                class="form-input"
                placeholder="Straße und Hausnummer"
              />
              <p v-else class="info-value">{{ userDocument.address || 'Nicht angegeben' }}</p>
            </div>

            <div class="info-item">
              <label>PLZ / Ort</label>
              <div v-if="isEditing" class="form-row">
                <input 
                  v-model="editForm.postalCode"
                  type="text"
                  class="form-input form-input--small"
                  placeholder="PLZ"
                />
                <input 
                  v-model="editForm.city"
                  type="text"
                  class="form-input"
                  placeholder="Stadt"
                />
              </div>
              <p v-else class="info-value">
                {{ userDocument.postalCode && userDocument.city 
                    ? `${userDocument.postalCode} ${userDocument.city}` 
                    : 'Nicht angegeben' }}
              </p>
            </div>

            <div class="info-item">
              <label>Geburtsdatum</label>
              <input 
                v-if="isEditing"
                v-model="editForm.birthDate"
                type="date"
                class="form-input"
              />
              <p v-else class="info-value">
                {{ userDocument.birthDate ? formatDate(userDocument.birthDate) : 'Nicht angegeben' }}
              </p>
            </div>

            <div class="info-item">
              <label>IBAN</label>
              <input 
                v-if="isEditing"
                v-model="editForm.iban"
                type="text"
                class="form-input"
                placeholder="DE..."
              />
              <p v-else class="info-value">{{ userDocument.iban || 'Nicht angegeben' }}</p>
            </div>

            <div class="info-item">
              <label>BIC</label>
              <input 
                v-if="isEditing"
                v-model="editForm.bic"
                type="text"
                class="form-input"
                placeholder="BIC/SWIFT-Code"
              />
              <p v-else class="info-value">{{ userDocument.bic || 'Nicht angegeben' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Aktionen -->
      <div class="profile-section">
        <div class="section-header">
          <h2>Account-Einstellungen</h2>
        </div>

        <div class="account-actions">
          <button @click="showPasswordChangeDialog = true" class="action-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            Passwort ändern
          </button>

          <button @click="showDeleteDialog = true" class="action-btn action-btn--danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Account löschen
          </button>
        </div>
      </div>
    </div>

    <!-- Error/Success Messages -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- Password Change Dialog -->
    <div v-if="showPasswordChangeDialog" class="dialog-overlay" @click="showPasswordChangeDialog = false">
      <div class="dialog" @click.stop>
        <h3>Passwort ändern</h3>
        <p>Diese Funktion ist noch nicht implementiert.</p>
        <button @click="showPasswordChangeDialog = false" class="dialog-btn">
          Schließen
        </button>
      </div>
    </div>

    <!-- Delete Account Dialog -->
    <div v-if="showDeleteDialog" class="dialog-overlay" @click="showDeleteDialog = false">
      <div class="dialog" @click.stop>
        <h3>Account löschen</h3>
        <p>Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden permanent gelöscht.</p>
        <div class="dialog-actions">
          <button @click="showDeleteDialog = false" class="dialog-btn">
            Abbrechen
          </button>
          <button @click="deleteAccount" class="dialog-btn dialog-btn--danger">
            Account löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// State
const isEditing = ref(false)
const isSaving = ref(false)
const showPasswordChangeDialog = ref(false)
const showDeleteDialog = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// Form data for editing
const editForm = ref({
  displayName: '',
  address: '',
  postalCode: '',
  city: '',
  birthDate: '',
  iban: '',
  bic: ''
})

// Computed
const userDocument = computed(() => authStore.userDocument)

// Methods
const getUserInitials = () => {
  const user = authStore.user
  if (user?.displayName) {
    const names = user.displayName.split(' ')
    return names.map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2)
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase()
  }
  return 'U'
}

const getMembershipStatusClass = () => {
  if (!userDocument.value) return 'status-pending'
  
  switch (userDocument.value.membershipStatus) {
    case 'active': return 'status-active'
    case 'pending': return 'status-pending'
    case 'inactive': return 'status-inactive'
    default: return 'status-pending'
  }
}

const getMembershipStatusText = () => {
  if (!userDocument.value) return 'Ausstehend'
  
  switch (userDocument.value.membershipStatus) {
    case 'active': return 'Aktives Mitglied'
    case 'pending': return 'Antrag in Bearbeitung'
    case 'inactive': return 'Inaktiv'
    default: return 'Ausstehend'
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Ungültiges Datum'
  }
}

const startEditing = () => {
  // Form mit aktuellen Werten vorausfüllen
  editForm.value = {
    displayName: authStore.user?.displayName || '',
    address: userDocument.value?.address || '',
    postalCode: userDocument.value?.postalCode || '',
    city: userDocument.value?.city || '',
    birthDate: userDocument.value?.birthDate || '',
    iban: userDocument.value?.iban || '',
    bic: userDocument.value?.bic || ''
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = {
    displayName: '',
    address: '',
    postalCode: '',
    city: '',
    birthDate: '',
    iban: '',
    bic: ''
  }
}

const saveChanges = async () => {
  if (!authStore.user) return

  try {
    isSaving.value = true
    
    // Update user document mit neuen Werten
    const { updateUser } = await import('../services/users')
    
    const updateData = {
      displayName: editForm.value.displayName,
      address: editForm.value.address,
      postalCode: editForm.value.postalCode,
      city: editForm.value.city,
      birthDate: editForm.value.birthDate,
      iban: editForm.value.iban,
      bic: editForm.value.bic,
      updatedAt: new Date().toISOString()
    }

    await updateUser(authStore.user.uid, updateData)
    await authStore.loadUserDocument()
    
    message.value = 'Profil erfolgreich aktualisiert!'
    messageType.value = 'success'
    isEditing.value = false
    
    // Message nach 3 Sekunden ausblenden
    setTimeout(() => {
      message.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Error updating profile:', error)
    message.value = 'Fehler beim Speichern der Änderungen'
    messageType.value = 'error'
    
    setTimeout(() => {
      message.value = ''
    }, 5000)
  } finally {
    isSaving.value = false
  }
}

const deleteAccount = async () => {
  // Placeholder für Account-Löschung
  console.log('Delete account functionality not yet implemented')
  showDeleteDialog.value = false
  message.value = 'Account-Löschung ist noch nicht implementiert'
  messageType.value = 'error'
  
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  // Benutzer-Dokument laden falls noch nicht geladen
  if (authStore.isAuthenticated && !userDocument.value) {
    authStore.loadUserDocument()
  }
})
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.profile-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.profile-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin: 0 0 var(--spacing-sm) 0;
}

.profile-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.profile-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-gray-200);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin: 0;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.edit-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.profile-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  color: var(--color-white);
}

.user-details-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-item label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin: 0;
  word-break: break-word;
}

.detail-note {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.status-active {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.status-pending {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.status-inactive {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.membership-info {
  margin-top: var(--spacing-md);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin: 0;
  word-break: break-word;
}

.form-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background: var(--color-white);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.form-row {
  display: flex;
  gap: var(--spacing-sm);
}

.form-input--small {
  flex: 0 0 100px;
}

.edit-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
}

.save-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-success);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.save-btn:hover:not(:disabled) {
  background: var(--color-success-dark);
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-gray-100);
  color: var(--color-text);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.cancel-btn:hover {
  background: var(--color-gray-200);
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-white);
  color: var(--color-text);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  text-align: left;
}

.action-btn:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
  transform: translateY(-1px);
}

.action-btn--danger {
  color: var(--color-error);
  border-color: var(--color-error-light);
}

.action-btn--danger:hover {
  background: var(--color-error-light);
  color: var(--color-error-dark);
}

.message {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.message.success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
  border: 1px solid var(--color-success);
}

.message.error {
  background: var(--color-error-light);
  color: var(--color-error-dark);
  border: 1px solid var(--color-error);
}

.dialog-overlay {
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

.dialog {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-xl);
}

.dialog h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.dialog p {
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.dialog-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  background: var(--color-white);
  color: var(--color-text);
}

.dialog-btn:hover {
  background: var(--color-gray-50);
}

.dialog-btn--danger {
  background: var(--color-error);
  color: var(--color-white);
  border-color: var(--color-error);
}

.dialog-btn--danger:hover {
  background: var(--color-error-dark);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-page {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-details-grid,
  .info-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .form-row {
    flex-direction: column;
  }

  .form-input--small {
    flex: 1;
  }

  .edit-actions {
    flex-direction: column;
  }

  .message {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    left: var(--spacing-sm);
  }

  .dialog {
    margin: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .profile-header h1 {
    font-size: var(--font-size-2xl);
  }

  .profile-section {
    padding: var(--spacing-lg);
  }

  .dialog-actions {
    flex-direction: column;
  }
}
</style>
