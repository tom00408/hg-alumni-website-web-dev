<template>
	<div class="login-container">
		<div class="login-form-section">
			<!-- Logo und Header -->
			<div class="login-header">
				<div class="logo-section">
					<div class="logo-circle">
						<span class="logo-text">HG</span>
					</div>
					<div class="brand-info">
						<h1 class="brand-title">Alumni-Verein</h1>
						<p class="brand-subtitle">Hainberg-Gymnasium</p>
					</div>
				</div>
				<div class="form-header">
					<h2 class="form-title">Willkommen zurück</h2>
					<p class="form-subtitle">
						Melden Sie sich mit Ihren Zugangsdaten an
					</p>
				</div>
			</div>

			<div class="login-card">
				<form @submit.prevent="handleLogin" class="login-form">
					<!-- Email -->
					<div class="form-field">
						<label for="email" class="form-label"
							>E-Mail-Adresse *</label
						>
						<input
							id="email"
							v-model="form.email"
							type="email"
							class="form-input"
							:class="{ 'form-input--error': errors.email }"
							placeholder="ihre.email@example.com"
							required
							:disabled="isLoading" />
						<span v-if="errors.email" class="form-error">{{
							errors.email
						}}</span>
					</div>

					<!-- Password -->
					<div class="form-field">
						<label for="password" class="form-label"
							>Passwort *</label
						>
						<div class="password-field">
							<input
								id="password"
								v-model="form.password"
								:type="showPassword ? 'text' : 'password'"
								class="form-input"
								:class="{
									'form-input--error': errors.password,
								}"
								placeholder="Ihr Passwort"
								required
								:disabled="isLoading" />
							<button
								type="button"
								class="password-toggle"
								@click="showPassword = !showPassword"
								:disabled="isLoading">
								<svg
									v-if="showPassword"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor">
									<path
										d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
								</svg>
								<svg
									v-else
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor">
									<path
										d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
								</svg>
							</button>
						</div>
						<span v-if="errors.password" class="form-error">{{
							errors.password
						}}</span>
					</div>

					<!-- Error Message -->
					<div
						v-if="loginError || authStore.error"
						class="error-message"
						:class="`error-message--${loginErrorType}`">
						<div class="error-icon">
							<svg
								v-if="loginErrorType === 'user-not-found'"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor">
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								<path
									d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1z" />
							</svg>
							<svg
								v-else-if="loginErrorType === 'wrong-password'"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor">
								<path
									d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1s3.1,1.39,3.1,3.1V8z" />
							</svg>
							<svg
								v-else-if="loginErrorType === 'network'"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor">
								<path
									d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M7.5,18l2.5-3.21L12.5,18h6.5V6H5v12H7.5z" />
							</svg>
							<svg
								v-else
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor">
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
							</svg>
						</div>
						<div class="error-content">
							<strong v-if="loginErrorType === 'user-not-found'"
								>Account nicht gefunden</strong
							>
							<strong
								v-else-if="loginErrorType === 'wrong-password'"
								>Falsches Passwort</strong
							>
							<strong v-else-if="loginErrorType === 'network'"
								>Verbindungsproblem</strong
							>
							<strong
								v-else-if="
									loginErrorType === 'too-many-requests'
								"
								>Zu viele Versuche</strong
							>
							<strong v-else>Anmeldung fehlgeschlagen</strong>
							<p>{{ loginError || authStore.error }}</p>
							<div
								v-if="loginErrorType === 'user-not-found'"
								class="error-actions">
								<router-link
									to="/mitglied-werden"
									class="btn-error-action">
									Jetzt registrieren
								</router-link>
							</div>
						</div>
						<button
							@click="clearError"
							class="error-close"
							type="button">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor">
								<path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
							</svg>
						</button>
					</div>

					<!-- Submit Button -->
					<div class="form-actions">
						<button
							type="submit"
							class="btn-primary btn-large"
							:disabled="isLoading">
							<span v-if="isLoading">Wird angemeldet...</span>
							<span v-else>Anmelden</span>
						</button>
					</div>

					<!-- Forgot Password -->
					<div class="form-links">
						<a href="#" class="link-secondary"
							>Passwort vergessen?</a
						>
					</div>
				</form>
			</div>

			<!-- Registration Link -->
			<div class="registration-link">
				<p class="register-text">
					Noch kein Mitglied?
					<router-link to="/mitglied-werden" class="register-link">
						Jetzt Mitglied werden
					</router-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const errors = ref<Record<string, string>>({});
const loginError = ref<string | null>(null);
const loginErrorType = ref<
	| 'validation'
	| 'user-not-found'
	| 'wrong-password'
	| 'invalid-email'
	| 'too-many-requests'
	| 'network'
	| 'unknown'
	| null
>(null);

const form = reactive({
	email: '',
	password: '',
});

const isLoading = computed(() => authStore.isLoading);

// Spezifische Fehlermeldungen basierend auf Fehlertyp
const getErrorMessage = (error: string): { message: string; type: string } => {
	if (
		error.includes('user-not-found') ||
		error.includes('Benutzer nicht gefunden')
	) {
		return {
			message:
				'Kein Account mit dieser E-Mail-Adresse gefunden. Möchten Sie sich registrieren?',
			type: 'user-not-found',
		};
	}

	if (
		error.includes('wrong-password') ||
		error.includes('Falsches Passwort')
	) {
		return {
			message:
				'Das eingegebene Passwort ist nicht korrekt. Bitte versuchen Sie es erneut.',
			type: 'wrong-password',
		};
	}

	if (
		error.includes('invalid-email') ||
		error.includes('Ungültige E-Mail-Adresse')
	) {
		return {
			message: 'Die E-Mail-Adresse hat ein ungültiges Format.',
			type: 'invalid-email',
		};
	}

	if (
		error.includes('too-many-requests') ||
		error.includes('Zu viele Anmeldeversuche')
	) {
		return {
			message:
				'Zu viele fehlgeschlagene Anmeldeversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
			type: 'too-many-requests',
		};
	}

	if (error.includes('network') || error.includes('Netzwerk')) {
		return {
			message:
				'Verbindungsproblem. Bitte überprüfen Sie Ihre Internetverbindung.',
			type: 'network',
		};
	}

	return {
		message:
			error ||
			'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
		type: 'unknown',
	};
};

const validateForm = () => {
	errors.value = {};

	// Email validieren
	if (!form.email.trim()) {
		errors.value.email = 'E-Mail-Adresse ist erforderlich';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
		errors.value.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
	}

	// Passwort validieren
	if (!form.password) {
		errors.value.password = 'Passwort ist erforderlich';
	} else if (form.password.length < 6) {
		errors.value.password = 'Passwort muss mindestens 6 Zeichen lang sein';
	}

	return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
	// Lokale Validierung zuerst
	if (!validateForm()) {
		loginError.value = null;
		loginErrorType.value = 'validation';
		return;
	}

	// Fehler zurücksetzen
	loginError.value = null;
	loginErrorType.value = null;

	try {
		authStore.clearError();

		await authStore.login({
			email: form.email,
			password: form.password,
		});

		// Nach erfolgreichem Login zur Startseite weiterleiten
		router.push('/');
	} catch (error) {
		console.error('Login failed:', error);

		// Spezifische Fehlerbehandlung
		const errorInfo = getErrorMessage(
			(error as Error).message || 'Unbekannter Fehler'
		);
		loginError.value = errorInfo.message;
		loginErrorType.value = errorInfo.type as any;
	}
};

const clearError = () => {
	loginError.value = null;
	loginErrorType.value = null;
	authStore.clearError();
};
</script>

<style scoped>
.login-container {
	width: 100%;
    max-width: 820px;
	padding: var(--spacing-lg);
    justify-self: center;
}

.login-form-section {
	background: var(--color-white);
	border-radius: var(--radius-xl);
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	overflow: hidden;
}

.login-header {
	background: linear-gradient(
		135deg,
		var(--color-secondary) 0%,
		var(--color-primary) 100%
	);
	padding: var(--spacing-2xl) var(--spacing-xl);
	color: var(--color-white);
	text-align: center;
}

.logo-section {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--spacing-md);
	margin-bottom: var(--spacing-lg);
}

.logo-circle {
	width: 60px;
	height: 60px;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(10px);
	border: 2px solid rgba(255, 255, 255, 0.3);
}

.logo-text {
	font-weight: var(--font-weight-bold);
	font-size: var(--font-size-xl);
	color: var(--color-white);
}

.brand-info {
	text-align: left;
}

.brand-title {
	font-size: var(--font-size-2xl);
	font-weight: var(--font-weight-bold);
	margin: 0 0 4px 0;
	color: var(--color-white);
}

.brand-subtitle {
	font-size: var(--font-size-base);
	margin: 0;
	opacity: 0.9;
	color: var(--color-white);
}

.form-header {
	margin-top: var(--spacing-lg);
}

.form-title {
	font-size: var(--font-size-2xl);
	font-weight: var(--font-weight-bold);
	color: var(--color-white);
	margin-bottom: var(--spacing-sm);
}

.form-subtitle {
	font-size: var(--font-size-base);
	color: rgba(255, 255, 255, 0.9);
	line-height: var(--line-height-relaxed);
	margin: 0;
}

.login-card {
	padding: var(--spacing-2xl);
}

/* Info-Sektion CSS entfernt */

.login-form {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-xl);
}

.form-field {
	position: relative;
}

.form-label {
	font-weight: var(--font-weight-medium);
	color: var(--color-gray-700);
	font-size: var(--font-size-sm);
	margin-bottom: var(--spacing-sm);
	display: block;
}

.form-input {
	width: 100%;
	padding: var(--spacing-lg) var(--spacing-md);
	border: 2px solid var(--color-gray-200);
	border-radius: var(--radius-lg);
	font-size: var(--font-size-base);
	transition: all var(--transition-fast);
	background-color: var(--color-gray-50);
	box-sizing: border-box;
}

.form-input:focus {
	outline: none;
	border-color: var(--color-primary);
	background-color: var(--color-white);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
	background-color: var(--color-gray-100);
	cursor: not-allowed;
	opacity: 0.6;
}

.form-input--error {
	border-color: var(--color-error);
	background-color: rgba(239, 68, 68, 0.05);
}

.form-input--error:focus {
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-field {
	position: relative;
}

.password-toggle {
	position: absolute;
	right: var(--spacing-md);
	top: 50%;
	transform: translateY(-50%);
	background: none;
	border: none;
	color: var(--color-gray-500);
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color var(--transition-fast);
}

.password-toggle:hover:not(:disabled) {
	color: var(--color-gray-700);
}

.password-toggle:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}

.form-error {
	color: var(--color-error);
	font-size: var(--font-size-sm);
	font-weight: var(--font-weight-medium);
}

.error-message {
	display: flex;
	align-items: flex-start;
	gap: var(--spacing-md);
	padding: var(--spacing-lg);
	background-color: rgba(239, 68, 68, 0.1);
	border: 1px solid rgba(239, 68, 68, 0.2);
	border-radius: var(--radius-md);
	margin-bottom: var(--spacing-lg);
	position: relative;
}

.error-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	color: var(--color-error);
}

.error-content {
	flex: 1;
	min-width: 0;
}

.error-content strong {
	display: block;
	color: var(--color-error);
	font-weight: var(--font-weight-semibold);
	margin-bottom: var(--spacing-xs);
}

.error-content p {
	color: var(--color-error);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-relaxed);
	margin: 0;
	word-break: break-word;
}

.error-close {
	position: absolute;
	top: var(--spacing-sm);
	right: var(--spacing-sm);
	background: none;
	border: none;
	color: var(--color-error);
	cursor: pointer;
	padding: var(--spacing-xs);
	border-radius: var(--radius-sm);
	transition: all var(--transition-fast);
	display: flex;
	align-items: center;
	justify-content: center;
}

.error-close:hover {
	background-color: rgba(239, 68, 68, 0.1);
	color: #dc2626;
}

.error-actions {
	margin-top: var(--spacing-md);
}

.btn-error-action {
	display: inline-block;
	padding: var(--spacing-sm) var(--spacing-md);
	background-color: var(--color-primary);
	color: var(--color-white);
	text-decoration: none;
	border-radius: var(--radius-md);
	font-size: var(--font-size-sm);
	font-weight: var(--font-weight-medium);
	transition: all var(--transition-fast);
}

.btn-error-action:hover {
	background-color: var(--color-primary-600, #2563eb);
	transform: translateY(-1px);
}

.error-message--user-not-found {
	background-color: rgba(59, 130, 246, 0.1);
	border-color: rgba(59, 130, 246, 0.2);
}

.error-message--user-not-found .error-icon {
	color: var(--color-primary);
}

.error-message--user-not-found .error-content strong {
	color: var(--color-primary);
}

.error-message--user-not-found .error-content p {
	color: var(--color-primary-700, #1d4ed8);
}

.error-message--wrong-password {
	background-color: rgba(245, 158, 11, 0.1);
	border-color: rgba(245, 158, 11, 0.2);
}

.error-message--wrong-password .error-icon {
	color: #f59e0b;
}

.error-message--wrong-password .error-content strong {
	color: #f59e0b;
}

.error-message--wrong-password .error-content p {
	color: #d97706;
}

.error-message--network {
	background-color: rgba(107, 114, 128, 0.1);
	border-color: rgba(107, 114, 128, 0.2);
}

.error-message--network .error-icon {
	color: #6b7280;
}

.error-message--network .error-content strong {
	color: #6b7280;
}

.error-message--network .error-content p {
	color: #4b5563;
}

.registration-link {
	text-align: center;
	margin-top: var(--spacing-xl);
	padding: var(--spacing-lg);
	background: var(--color-gray-50);
	border-radius: var(--radius-lg);
	border-top: 1px solid var(--color-gray-200);
}

.register-text {
	color: var(--color-gray-600);
	margin: 0;
	font-size: var(--font-size-sm);
}

.register-link {
	color: var(--color-primary);
	text-decoration: none;
	font-weight: var(--font-weight-semibold);
	transition: color var(--transition-fast);
}

.register-link:hover {
	color: var(--color-primary-600, #2563eb);
	text-decoration: underline;
}

.form-actions {
	margin-top: var(--spacing-md);
}

.btn-large {
	width: 100%;
	padding: var(--spacing-lg);
	background: linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 100%);
	border: none;
	border-radius: var(--radius-lg);
	color: var(--color-white);
	font-size: var(--font-size-base);
	font-weight: var(--font-weight-semibold);
	cursor: pointer;
	transition: all var(--transition-fast);
	box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.25);
}

.btn-large:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.35);
}

.btn-large:active {
	transform: translateY(0);
}

.btn-large:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: none;
	box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.15);
}

.form-links {
	text-align: center;
	margin-top: var(--spacing-lg);
}

.link-secondary {
	color: var(--color-gray-600);
	text-decoration: none;
	font-size: var(--font-size-sm);
	transition: color var(--transition-fast);
}

.link-secondary:hover {
	color: var(--color-primary);
	text-decoration: underline;
}

.registration-link {
	margin-top: var(--spacing-xl);
}

.info-card {
	text-align: center;
}

.info-content h3 {
	color: var(--color-secondary);
	margin-bottom: var(--spacing-md);
	font-size: var(--font-size-lg);
	font-weight: var(--font-weight-semibold);
}

.info-content p {
	color: var(--color-gray-600);
	line-height: var(--line-height-relaxed);
	margin-bottom: var(--spacing-lg);
}

.btn-secondary {
	display: inline-block;
	padding: var(--spacing-md) var(--spacing-xl);
	background-color: var(--color-gray-100);
	color: var(--color-secondary);
	text-decoration: none;
	border-radius: var(--radius-md);
	font-weight: var(--font-weight-medium);
	transition: all var(--transition-fast);
}

.btn-secondary:hover {
	background-color: var(--color-gray-200);
	transform: translateY(-2px);
}

/* Mobile Anpassungen */
@media (max-width: 768px) {
	.login-container {
		padding: var(--spacing-md);
		max-width: none;
	}

	.login-header {
		padding: var(--spacing-xl) var(--spacing-lg);
	}

	.logo-section {
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.brand-info {
		text-align: center;
	}

	.logo-circle {
		width: 50px;
		height: 50px;
	}

	.logo-text {
		font-size: var(--font-size-lg);
	}

	.brand-title {
		font-size: var(--font-size-xl);
	}

	.brand-subtitle {
		font-size: var(--font-size-sm);
	}

	.form-title {
		font-size: var(--font-size-xl);
	}

	.form-subtitle {
		font-size: var(--font-size-sm);
	}

	.login-card {
		padding: var(--spacing-xl);
	}

	.form-input {
		padding: var(--spacing-md);
	}

	.password-toggle {
		right: var(--spacing-sm);
	}
}

@media (max-width: 480px) {
	.login-container {
		padding: var(--spacing-sm);
	}

	.login-header {
		padding: var(--spacing-lg);
	}

	.logo-circle {
		width: 40px;
		height: 40px;
	}

	.logo-text {
		font-size: var(--font-size-base);
	}

	.brand-title {
		font-size: var(--font-size-lg);
	}

	.brand-subtitle {
		font-size: var(--font-size-xs);
	}

	.form-title {
		font-size: var(--font-size-lg);
	}

	.form-subtitle {
		font-size: var(--font-size-xs);
	}

	.login-card {
		padding: var(--spacing-lg);
	}

	.registration-link {
		padding: var(--spacing-md);
	}

	.error-message {
		padding: var(--spacing-md);
	}

	.error-content strong {
		font-size: var(--font-size-sm);
	}

	.error-content p {
		font-size: var(--font-size-xs);
	}
}
</style>
