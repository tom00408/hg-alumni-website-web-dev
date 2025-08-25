<template>
  <div class="mitglied-werden">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Mitglied werden</h1>
      <p class="page-subtitle">
        Werden Sie Teil unserer Alumni-Gemeinschaft und bleiben Sie mit dem Hainberg-Gymnasium verbunden
      </p>
    </div>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <h2 class="section-title">Ihre Vorteile als Mitglied</h2>
      <div class="benefits-grid">
        <HgCard v-for="benefit in benefits" :key="benefit.id" compact class="benefit-card">
          <div class="benefit-icon" v-html="benefit.icon"></div>
          <h3 class="benefit-title">{{ benefit.title }}</h3>
          <p class="benefit-description">{{ benefit.description }}</p>
        </HgCard>
      </div>
    </section>

    <!-- Application Form -->
    <section class="form-section">
      <h2 class="section-title">Mitgliedsantrag</h2>
      <div class="form-container">
        <HgCard variant="primary" class="form-card">
          <form @submit.prevent="submitApplication" class="membership-form">
            <!-- Persönliche Daten -->
            <div class="form-section-header">
              <h3>Persönliche Daten</h3>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">Vorname *</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.firstName }"
                  required
                />
                <span v-if="errors.firstName" class="form-error">{{ errors.firstName }}</span>
              </div>
              
              <div class="form-group">
                <label for="lastName" class="form-label">Nachname *</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.lastName }"
                  required
                />
                <span v-if="errors.lastName" class="form-error">{{ errors.lastName }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">E-Mail-Adresse *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'form-input--error': errors.email }"
                required
              />
              <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
            </div>

            <!-- Bezug zur Schule -->
            <div class="form-section-header">
              <h3>Ihr Bezug zum Hainberg-Gymnasium</h3>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="graduationYear" class="form-label">Abschlussjahr</label>
                <input
                  id="graduationYear"
                  v-model.number="form.graduationYear"
                  type="number"
                  min="1950"
                  :max="new Date().getFullYear() + 10"
                  class="form-input"
                  placeholder="z.B. 2010"
                />
              </div>
              
              <div class="form-group">
                <label for="relation" class="form-label">Beziehung zur Schule</label>
                <select
                  id="relation"
                  v-model="form.relation"
                  class="form-input"
                >
                  <option value="">Bitte wählen</option>
                  <option value="schueler">Ehemaliger Schüler</option>
                  <option value="lehrer">Ehemaliger Lehrer</option>
                  <option value="eltern">Eltern</option>
                  <option value="foerderer">Förderer</option>
                  <option value="sonstige">Sonstige</option>
                </select>
              </div>
            </div>

            <!-- Nachricht -->
            <div class="form-group">
              <label for="message" class="form-label">Nachricht oder Fragen (optional)</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                rows="4"
                placeholder="Erzählen Sie uns etwas über sich oder stellen Sie Fragen..."
              ></textarea>
            </div>

            <!-- Einwilligung -->
            <div class="form-group">
              <label class="form-checkbox">
                <input
                  v-model="form.consent"
                  type="checkbox"
                  class="checkbox-input"
                  required
                />
                <span class="checkbox-mark"></span>
                <span class="checkbox-text">
                  Ich stimme der Verarbeitung meiner Daten gemäß der 
                  <router-link to="/datenschutz" target="_blank">Datenschutzerklärung</router-link> zu. *
                </span>
              </label>
              <span v-if="errors.consent" class="form-error">{{ errors.consent }}</span>
            </div>

            <!-- Submit Button -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-primary btn-large"
                :disabled="submitting"
              >
                <span v-if="submitting">Wird gesendet...</span>
                <span v-else>Antrag senden</span>
              </button>
            </div>
          </form>
        </HgCard>

        <!-- Success Message -->
        <div v-if="submitted" class="success-message">
          <HgCard variant="secondary">
            <div class="success-content">
              <div class="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h3>Vielen Dank für Ihre Anmeldung!</h3>
              <p>
                Wir haben Ihren Mitgliedsantrag erhalten und werden uns in Kürze bei Ihnen melden. 
                Sie erhalten auch eine Bestätigungs-E-Mail an die angegebene Adresse.
              </p>
            </div>
          </HgCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import HgCard from '../components/HgCard.vue'
import type { MembershipApplication } from '../lib/types'

const submitting = ref(false)
const submitted = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  graduationYear: null as number | null,
  relation: '',
  message: '',
  consent: false
})

const errors = ref<Record<string, string>>({})

const benefits = [
  {
    id: 1,
    title: 'Netzwerk',
    description: 'Vernetzen Sie sich mit anderen Alumni und erweitern Sie Ihr berufliches Netzwerk',
    icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.004 3.004 0 0 0 17.07 7c-.8 0-1.54.46-1.88 1.18L12.5 12 9.81 8.18A2.996 2.996 0 0 0 7.93 7c-1.24 0-2.38.77-2.82 1.93L2.5 16H5v6h2v-6h1.5l2.28-5.71 2.1 3.21c.37.56 1.01.9 1.68.9s1.31-.34 1.68-.9L18.5 10H20v12h-2z"/>
    </svg>`
  },
  {
    id: 2,
    title: 'Veranstaltungen',
    description: 'Exklusiver Zugang zu Alumni-Treffen, Vorträgen und Schulveranstaltungen',
    icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>`
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Regelmäßige Updates über Schulneuigkeiten und Alumni-Aktivitäten',
    icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>`
  },
  {
    id: 4,
    title: 'Unterstützung',
    description: 'Helfen Sie dabei, die Zukunft der Schule und der Schüler zu gestalten',
    icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`
  }
]

const validateForm = () => {
  errors.value = {}
  
  if (!form.firstName.trim()) {
    errors.value.firstName = 'Vorname ist erforderlich'
  }
  
  if (!form.lastName.trim()) {
    errors.value.lastName = 'Nachname ist erforderlich'
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'E-Mail-Adresse ist erforderlich'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
  }
  
  if (!form.consent) {
    errors.value.consent = 'Bitte stimmen Sie der Datenverarbeitung zu'
  }
  
  return Object.keys(errors.value).length === 0
}

const submitApplication = async () => {
  if (!validateForm()) {
    return
  }
  
  submitting.value = true
  
  try {
    const { createMembershipApplication } = await import('../services/membership')
    
    const application = {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      graduationYear: form.graduationYear || undefined,
      relation: form.relation || undefined,
      message: form.message || undefined
    }
    
    console.log('Submitting application:', application)
    
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      // Simuliere API-Call für Mock-Daten
      await new Promise(resolve => setTimeout(resolve, 2000))
    } else {
      await createMembershipApplication(application)
    }
    
    submitted.value = true
    
    // Form zurücksetzen
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      graduationYear: null,
      relation: '',
      message: '',
      consent: false
    })
    
  } catch (error) {
    console.error('Error submitting application:', error)
    // TODO: Zeige Fehlermeldung
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.mitglied-werden {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.benefits-section {
  margin-bottom: var(--spacing-2xl);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.benefit-card {
  text-align: center;
  height: 100%;
}

.benefit-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.benefit-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.benefit-description {
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.form-section {
  margin-bottom: var(--spacing-2xl);
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.membership-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-section-header {
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-gray-100);
  margin-bottom: var(--spacing-md);
}

.form-section-header h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.form-input,
.form-textarea {
  padding: var(--spacing-md);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
  background-color: var(--color-white);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-input--error {
  border-color: var(--color-error);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
}

.checkbox-mark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.checkbox-input:checked + .checkbox-mark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-mark::after {
  content: '✓';
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
}

.checkbox-text {
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-sm);
}

.checkbox-text a {
  color: var(--color-primary);
  text-decoration: underline;
}

.form-actions {
  text-align: center;
  padding-top: var(--spacing-lg);
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

.success-message {
  margin-top: var(--spacing-xl);
}

.success-content {
  text-align: center;
}

.success-icon {
  color: var(--color-success);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

.success-content h3 {
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.success-content p {
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
  
  .page-subtitle {
    font-size: var(--font-size-base);
  }
  
  .section-title {
    font-size: var(--font-size-xl);
  }
}
</style>
