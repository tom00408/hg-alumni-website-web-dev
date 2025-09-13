<template>
  <div class="mitglied-werden">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Mitglied werden</h1>
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
            
            <div class="form-fields">
              <div class="form-field">
                <label for="salutation" class="form-label">Anrede *</label>
                <select
                  id="salutation"
                  v-model="form.salutation"
                  class="form-input"
                  :class="{ 'form-input--error': errors.salutation }"
                  required
                >
                  <option value="">Bitte wählen</option>
                  <option value="herr">Herr</option>
                  <option value="frau">Frau</option>
                  <option value="divers">Divers</option>
                </select>
                <span v-if="errors.salutation" class="form-error">{{ errors.salutation }}</span>
              </div>

              <div class="form-field">
                <label for="lastName" class="form-label">Name *</label>
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

              <div class="form-field">
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

              <div class="form-field">
                <label for="address" class="form-label">Straße, Hausnummer *</label>
                <input
                  id="address"
                  v-model="form.address"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.address }"
                  required
                />
                <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
              </div>

              <div class="form-field">
                <label for="postalCode" class="form-label">PLZ *</label>
                <input
                  id="postalCode"
                  v-model="form.postalCode"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.postalCode }"
                  placeholder="37073"
                  required
                />
                <span v-if="errors.postalCode" class="form-error">{{ errors.postalCode }}</span>
              </div>

              <div class="form-field">
                <label for="city" class="form-label">Ort *</label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.city }"
                  placeholder="Göttingen"
                  required
                />
                <span v-if="errors.city" class="form-error">{{ errors.city }}</span>
              </div>

              <div class="form-field">
                <label for="birthDate" class="form-label">Geburtsdatum *</label>
                <input
                  id="birthDate"
                  v-model="form.birthDate"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': errors.birthDate }"
                  required
                />
                <span v-if="errors.birthDate" class="form-error">{{ errors.birthDate }}</span>
              </div>

              <div class="form-field">
                <label for="occupation" class="form-label">Beruf (ggf. Studienrichtung)</label>
                <input
                  id="occupation"
                  v-model="form.occupation"
                  type="text"
                  class="form-input"
                  placeholder="z.B. Ingenieur, Medizin"
                />
              </div>

              <div class="form-field">
                <label for="email" class="form-label">Email-Adresse *</label>
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

              <div class="form-field">
                <label class="form-label">Besuch des Hainberg-Gymnasiums:</label>
                <div class="form-date-range">
                  <div class="form-date-input">
                    <label for="schoolFrom" class="form-label-small">von</label>
                    <input
                      id="schoolFrom"
                      v-model="form.schoolFrom"
                      type="date"
                      class="form-input"
                    />
                  </div>
                  <div class="form-date-input">
                    <label for="schoolTo" class="form-label-small">bis</label>
                    <input
                      id="schoolTo"
                      v-model="form.schoolTo"
                      type="date"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Mitgliedschaftserklärung -->
            <div class="form-section-header">
              <h3>Mitgliedschaftserklärung</h3>
            </div>

            <div class="membership-declaration">
              <p class="declaration-text">
                <strong>Ja, ich möchte Mitglied des Alumnivereins des Hainberg-Gymnasiums Göttingen e.V. werden.</strong>
              </p>
              <p class="declaration-text">
                Ich ermächtige den Verein außerdem widerruflich, den von mir zu entrichtenden Mitgliedsbeitrag bei Fälligkeit zu Lasten meines unten angegebenen Kontos durch Lastschrift einzuziehen. Der Mitgliedsbeitrag beträgt für Auszubildende und Studenten 10€ und für Berufstätige 20€ im Jahr.
              </p>
            </div>

            <!-- Bankdaten -->
            <div class="form-section-header">
              <h3>Bankdaten</h3>
            </div>

            <div class="form-fields">
              <div class="form-field">
                <label for="iban" class="form-label">IBAN *</label>
                <input
                  id="iban"
                  v-model="form.iban"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.iban }"
                  placeholder="DE89 3704 0044 0532 0130 00"
                  required
                />
                <span v-if="errors.iban" class="form-error">{{ errors.iban }}</span>
              </div>

              <div class="form-field">
                <label for="bic" class="form-label">BIC *</label>
                <input
                  id="bic"
                  v-model="form.bic"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.bic }"
                  placeholder="COBADEFFXXX"
                  required
                />
                <span v-if="errors.bic" class="form-error">{{ errors.bic }}</span>
              </div>
            </div>

            <!-- Unterschrift -->
            <div class="form-fields">
              <div class="form-field">
                <label for="placeDate" class="form-label">Ort, Datum *</label>
                <input
                  id="placeDate"
                  v-model="form.placeDate"
                  type="text"
                  class="form-input form-input-underline"
                  :class="{ 'form-input--error': errors.placeDate }"
                  placeholder="Göttingen, 01.01.2024"
                  required
                />
                <span v-if="errors.placeDate" class="form-error">{{ errors.placeDate }}</span>
              </div>

              <div class="form-field">
                <label for="signature" class="form-label">Unterschrift *</label>
                <input
                  id="signature"
                  v-model="form.signature"
                  type="text"
                  class="form-input form-input-underline"
                  :class="{ 'form-input--error': errors.signature }"
                  placeholder="Max Mustermann"
                  required
                />
                <span v-if="errors.signature" class="form-error">{{ errors.signature }}</span>
              </div>
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
// import type { MembershipApplication } from '../lib/types'

const submitting = ref(false)
const submitted = ref(false)

const form = reactive({
  salutation: '',
  firstName: '',
  lastName: '',
  address: '',
  postalCode: '',
  city: '',
  birthDate: '',
  occupation: '',
  email: '',
  schoolFrom: '',
  schoolTo: '',
  iban: '',
  bic: '',
  placeDate: '',
  signature: '',
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
  
  // Anrede validieren
  if (!form.salutation) {
    errors.value.salutation = 'Anrede ist erforderlich'
  }
  
  // Vorname validieren
  if (!form.firstName.trim()) {
    errors.value.firstName = 'Vorname ist erforderlich'
  } else if (form.firstName.trim().length < 2) {
    errors.value.firstName = 'Vorname muss mindestens 2 Zeichen lang sein'
  }
  
  // Name validieren
  if (!form.lastName.trim()) {
    errors.value.lastName = 'Name ist erforderlich'
  } else if (form.lastName.trim().length < 2) {
    errors.value.lastName = 'Name muss mindestens 2 Zeichen lang sein'
  }
  
  // Adresse validieren
  if (!form.address.trim()) {
    errors.value.address = 'Adresse ist erforderlich'
  } else if (form.address.trim().length < 5) {
    errors.value.address = 'Adresse muss mindestens 5 Zeichen lang sein'
  }
  
  // PLZ validieren - genau 5 Zeichen
  if (!form.postalCode.trim()) {
    errors.value.postalCode = 'PLZ ist erforderlich'
  } else if (!/^\d{5}$/.test(form.postalCode.trim())) {
    errors.value.postalCode = 'PLZ muss genau 5 Ziffern haben'
  }
  
  // Ort validieren
  if (!form.city.trim()) {
    errors.value.city = 'Ort ist erforderlich'
  } else if (form.city.trim().length < 2) {
    errors.value.city = 'Ort muss mindestens 2 Zeichen lang sein'
  }
  
  // Geburtsdatum validieren
  if (!form.birthDate) {
    errors.value.birthDate = 'Geburtsdatum ist erforderlich'
  } else {
    const birthDate = new Date(form.birthDate)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 16) {
      errors.value.birthDate = 'Sie müssen mindestens 16 Jahre alt sein'
    } else if (age > 120) {
      errors.value.birthDate = 'Bitte geben Sie ein gültiges Geburtsdatum ein'
    }
  }
  
  // E-Mail validieren
  if (!form.email.trim()) {
    errors.value.email = 'E-Mail-Adresse ist erforderlich'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
  }
  
  // IBAN validieren - genau 22 Zeichen
  if (!form.iban.trim()) {
    errors.value.iban = 'IBAN ist erforderlich'
  } else {
    const cleanIban = form.iban.replace(/\s/g, '') // Leerzeichen entfernen
    if (cleanIban.length !== 22) {
      errors.value.iban = 'IBAN muss genau 22 Zeichen haben'
    } else if (!/^[A-Z]{2}\d{2}[A-Z0-9]{18}$/.test(cleanIban)) {
      errors.value.iban = 'IBAN hat ein ungültiges Format'
    }
  }
  
  // BIC validieren - 8 oder 11 Zeichen
  if (!form.bic.trim()) {
    errors.value.bic = 'BIC ist erforderlich'
  } else {
    const cleanBic = form.bic.replace(/\s/g, '') // Leerzeichen entfernen
    if (cleanBic.length !== 8 && cleanBic.length !== 11) {
      errors.value.bic = 'BIC muss 8 oder 11 Zeichen haben'
    } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBic)) {
      errors.value.bic = 'BIC hat ein ungültiges Format'
    }
  }
  
  // Ort und Datum validieren
  if (!form.placeDate.trim()) {
    errors.value.placeDate = 'Ort und Datum sind erforderlich'
  } else if (form.placeDate.trim().length < 3) {
    errors.value.placeDate = 'Ort und Datum müssen mindestens 3 Zeichen haben'
  }
  
  // Unterschrift validieren
  if (!form.signature.trim()) {
    errors.value.signature = 'Unterschrift ist erforderlich'
  } else if (form.signature.trim().length < 2) {
    errors.value.signature = 'Unterschrift muss mindestens 2 Zeichen haben'
  }
  
  // Einwilligung validieren
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
      salutation: form.salutation,
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      postalCode: form.postalCode,
      city: form.city,
      birthDate: form.birthDate,
      occupation: form.occupation || undefined,
      email: form.email,
      schoolFrom: form.schoolFrom || undefined,
      schoolTo: form.schoolTo || undefined,
      iban: form.iban,
      bic: form.bic,
      placeDate: form.placeDate,
      signature: form.signature
    }
    
    console.log('Submitting application:', application)
    
    await createMembershipApplication(application)
    
    submitted.value = true
    
    // Form zurücksetzen
    Object.assign(form, {
      salutation: '',
      firstName: '',
      lastName: '',
      address: '',
      postalCode: '',
      city: '',
      birthDate: '',
      occupation: '',
      email: '',
      schoolFrom: '',
      schoolTo: '',
      iban: '',
      bic: '',
      placeDate: '',
      signature: '',
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
  width: 100%;
  margin: 0;
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
  width: 100%;
  margin: 0;
}

.membership-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-instruction {
  background-color: var(--color-gray-50);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.form-instruction p {
  margin: 0;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
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

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.form-date-range {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
}

.form-date-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label-small {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
}

.membership-declaration {
  background-color: var(--color-gray-50);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.declaration-text {
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-relaxed);
  color: var(--color-gray-700);
}

.declaration-text:last-child {
  margin-bottom: 0;
}

/* Signature-Styles entfernt - jetzt normale form-fields */

.form-input-underline {
  border: none;
  border-bottom: 2px solid var(--color-gray-300);
  border-radius: 0;
  background: transparent;
  padding: var(--spacing-sm) 0;
}

.form-input-underline:focus {
  border-bottom-color: var(--color-primary);
  outline: none;
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
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
  background-color: var(--color-white);
  box-sizing: border-box;
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

/* Tablet Anpassungen */
@media (max-width: 1024px) {
  .mitglied-werden {
    width: 100%;
    padding: 0 var(--spacing-lg);
  }
  
  .form-container {
    width: 100%;
  }
  
  .benefits-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .mitglied-werden {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-lg);
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .form-container {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  
  .form-card {
    width: 100%;
    margin: 0;
    border-radius: var(--radius-lg);
  }
  
  .membership-form {
    width: 100%;
    gap: var(--spacing-md);
  }
  
  .form-section-header {
    margin-bottom: var(--spacing-sm);
  }
  
  .form-section-header h3 {
    font-size: var(--font-size-base);
  }
  
  .form-fields {
    width: 100%;
    gap: var(--spacing-md);
  }
  
  .form-field {
    width: 100%;
  }
  
  .form-date-range {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  /* Signature-Row entfernt - jetzt normale form-fields */
  
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .form-input,
  .form-textarea {
    padding: var(--spacing-sm);
    font-size: var(--font-size-base);
  }
  
  .form-label {
    font-size: var(--font-size-xs);
    margin-bottom: var(--spacing-xs);
  }
  
  .membership-declaration {
    padding: var(--spacing-md);
  }
  
  .declaration-text {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
  }
  
  .btn-large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-base);
    width: 100%;
  }
}

@media (max-width: 480px) {
  .mitglied-werden {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  
  .page-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-md);
  }
  
  .page-subtitle {
    font-size: var(--font-size-base);
  }
  
  .section-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }
  
  .benefits-grid {
    gap: var(--spacing-sm);
  }
  
  .benefit-card {
    padding: var(--spacing-md);
  }
  
  .benefit-title {
    font-size: var(--font-size-base);
  }
  
  .benefit-description {
    font-size: var(--font-size-sm);
  }
  
  .form-container {
    width: 100%;
    margin: 0;
  }
  
  .form-card {
    width: 100%;
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    margin: 0;
  }
  
  .membership-form {
    width: 100%;
    gap: var(--spacing-sm);
  }
  
  .form-section-header h3 {
    font-size: var(--font-size-sm);
  }
  
  .form-fields {
    width: 100%;
    gap: var(--spacing-sm);
  }
  
  .form-field {
    width: 100%;
  }
  
  .form-input,
  .form-textarea {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
  
  .form-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
  }
  
  .form-label-small {
    font-size: var(--font-size-xs);
  }
  
  .membership-declaration {
    padding: var(--spacing-sm);
  }
  
  .declaration-text {
    font-size: var(--font-size-xs);
    line-height: var(--line-height-tight);
  }
  
  /* Signature-Section entfernt - jetzt normale form-fields */
  
  .form-input-underline {
    padding: var(--spacing-xs) 0;
  }
  
  .btn-large {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    width: 100%;
  }
  
  .form-checkbox {
    gap: var(--spacing-sm);
  }
  
  .checkbox-text {
    font-size: var(--font-size-xs);
  }
  
  .form-error {
    font-size: var(--font-size-xs);
  }
}
</style>
