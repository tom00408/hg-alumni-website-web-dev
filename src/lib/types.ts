import { Timestamp } from 'firebase/firestore';

// Event Types
export interface Event {
	id?: string;
	title: string;
	date: Timestamp;
	location?: string;
	description?: string;
	isFeatured?: boolean;
	createdAt?: Timestamp;
}

// News Types
export interface NewsArticle {
	id?: string;
	title: string;
	slug: string;
	date: Timestamp;
	excerpt: string;
	content: string;
	coverUrl?: string;
	tags?: string[];
	createdAt?: Timestamp;
}

// Gallery Types
export interface GalleryImage {
	id?: string;
	title?: string;
	imageUrl: string;
	thumbnailUrl?: string;
	folderId?: string | null; // null = unorganisierte Bilder
	createdAt?: Timestamp;
}

export interface GalleryFolder {
	id?: string;
	name: string;
	description?: string;
	coverImageId?: string; // ID des Cover-Bildes
	createdAt?: Timestamp;
	updatedAt?: Timestamp;
}

// User Types - Vereint Membership Application und Member Data
export interface User {
	// Firebase Auth ID als Document ID
	uid: string;

	// Persönliche Daten
	salutation: string;
	firstName: string;
	lastName: string;
	displayName?: string;
	email: string;

	// Adressdaten
	address: string;
	postalCode: string;
	city: string;
	birthDate: string;
	occupation?: string;

	// Schulzeit (optional)
	schoolFrom?: string;
	schoolTo?: string;

	// Bankdaten
	iban: string;
	bic: string;

	// Application-spezifische Felder
	placeDate?: string; // Nur bei Antrag
	signature?: string; // Nur bei Antrag
	applicationCreatedAt?: Timestamp;
	applicationStatus: 'new' | 'in_progress' | 'approved' | 'rejected';

	// Member-spezifische Felder
	memberSince?: Timestamp; // Wird gesetzt wenn approved
	membershipNumber?: string; // Wird bei Approval generiert
	membershipStatus: 'pending' | 'active' | 'inactive' | 'suspended';

	// System-Felder
	role: 'member'; // Admin-Rolle entfernt - wird in separater Admin-Website verwaltet
	createdAt: Timestamp;
	updatedAt?: Timestamp;
}

// Legacy Types für Kompatibilität
export interface MembershipApplication
	extends Omit<
		User,
		'uid' | 'memberSince' | 'membershipNumber' | 'membershipStatus' | 'role'
	> {
	id?: string;
	userId?: string;
}

export interface Member
	extends Omit<
		User,
		'placeDate' | 'signature' | 'applicationCreatedAt' | 'applicationStatus'
	> {
	id?: string;
	status: 'active' | 'inactive' | 'suspended'; // Alias für membershipStatus
	applicationId?: string;
}

//Submit Email Data
export interface SubmitEmailData {
	salutation: string;
	firstName: string;
	lastName: string;
	email: string;

	address: string;
	postalCode: string;
	city: string;
	birthDate: string;
}

// Navigation Types
export interface NavItem {
	id: string;
	label: string;
	route: string;
	icon: string;
	external?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
	data: T;
	success: boolean;
	error?: string;
}

// Loading States
export interface LoadingState {
	loading: boolean;
	error: string | null;
}

// Form Validation
export interface ValidationError {
	field: string;
	message: string;
}

// Navigation Visibility Types
export type NavVisibility = 'always' | 'authenticated' | 'unauthenticated';

// Navigation Item Types
export interface NavigationItem {
	id: string;
	label: string;
	route: string;
	icon: string;
	visibility: NavVisibility;
}
