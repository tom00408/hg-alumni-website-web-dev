# 🎓 Alumni-Website des Hainberg-Gymnasiums

Eine moderne, responsive Vue.js-Anwendung für den Alumni-Verein des Hainberg-Gymnasiums Göttingen. Die Website ermöglicht es ehemaligen Schülern, sich zu vernetzen, über Veranstaltungen zu informieren und mit der Schule in Kontakt zu bleiben.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=flat&logo=firebase)
![Pinia](https://img.shields.io/badge/Pinia-2.1.7-FFD859?style=flat&logo=pinia)

## ✨ Features

### 🏗️ **Technologie-Stack**
- **Vue 3** mit Composition API und `<script setup>`
- **TypeScript** für vollständige Typsicherheit
- **Vite** als Build-Tool für schnelle Entwicklung
- **Pinia** für modernes State Management
- **Vue Router** mit deutschen URLs
- **Firebase** für Backend und Hosting

### 🎨 **Design & UX**
- **Responsive Design** - Optimiert für Desktop, Tablet und Mobile
- **Eigenes Design-System** - Kein externes UI-Framework
- **Accessibility** - WCAG-konforme Implementierung
- **Smooth Animations** - Moderne Micro-Interactions
- **Progressive Enhancement** - Funktioniert auch ohne JavaScript

### 📱 **Funktionalitäten**
- **Startseite** mit Hero-Section und schneller Navigation
- **Termine** - Events mit Filter- und Sortieroptionen
- **Neues im Verein** - News-System mit Paginierung
- **Galerie** - Bildergalerie mit Lightbox-Funktion
- **Mitglied werden** - Anmeldeformular mit Validierung
- **Responsive Navigation** - Sidebar (Desktop) / Drawer (Mobile)

## 🚀 Schnellstart

### 📋 **Voraussetzungen**
- **Node.js** (Version 18+ empfohlen)
- **npm** oder **yarn**
- Moderne Browser (Chrome 90+, Firefox 88+, Safari 14+)

### ⚡ **Installation & Start**

```bash
# 1. Repository klonen
git clone <repository-url>
cd AlumniWebsite

# 2. Dependencies installieren
npm install

# 3. Development Server starten
npm run dev

# 4. Browser öffnen: http://localhost:5173
```

### 🔧 **Konfiguration**

#### **Für Development (mit Mock-Daten):**
```bash
# .env Datei erstellen
echo "VITE_USE_MOCK_DATA=true" > .env
```

#### **Für Production (mit Firebase):**
```bash
# env.template zu .env kopieren
cp env.template .env

# Firebase-Konfiguration eintragen
# VITE_FIREBASE_API_KEY=your_api_key_here
# VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
# VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 🏗️ **Build-Kommandos**

```bash
# Development Server
npm run dev

# Production Build
npm run build

# Build Preview
npm run preview

# Type Check
npm run type-check
```

## 📁 Projektstruktur

```
AlumniWebsite/
├── 📂 public/                  # Statische Assets
│   └── vite.svg
├── 📂 src/
│   ├── 📂 components/          # 🧩 Wiederverwendbare UI-Komponenten
│   │   ├── AppSidebar.vue      # 🧭 Haupt-Navigation (Desktop/Mobile)
│   │   ├── AppHeader.vue       # 📱 Mobile Header mit Hamburger-Menü
│   │   ├── HgCard.vue          # 🃏 Basis Card-Komponente
│   │   ├── EventItem.vue       # 📅 Event-Darstellung
│   │   └── NewsCard.vue        # 📰 News-Artikel-Card
│   ├── 📂 layouts/             # 🏗️ Layout-Templates
│   │   └── DefaultLayout.vue   # Standard-Layout mit Sidebar
│   ├── 📂 pages/               # 📄 Seiten-Komponenten (Routes)
│   │   ├── Startseite.vue      # 🏠 Homepage mit Hero-Section
│   │   ├── Termine.vue         # 📅 Events mit Filter/Suche
│   │   ├── News.vue            # 📰 News-Übersicht
│   │   ├── Galerie.vue         # 🖼️ Bildergalerie mit Lightbox
│   │   ├── MitgliedWerden.vue  # ➕ Mitgliedschaftsformular
│   │   ├── Impressum.vue       # ℹ️ Rechtliche Informationen
│   │   └── NotFound.vue        # ❌ 404-Fehlerseite
│   ├── 📂 stores/              # 🏪 Pinia State Management
│   │   ├── events.ts           # Events-Store (CRUD + Filter)
│   │   ├── news.ts             # News-Store (Artikel + Paginierung)
│   │   └── gallery.ts          # Gallery-Store (Bilder + Upload)
│   ├── 📂 services/            # 🔧 Backend-Services
│   │   ├── events.ts           # Firebase Events-CRUD
│   │   ├── news.ts             # Firebase News-CRUD
│   │   ├── gallery.ts          # Firebase Storage + Firestore
│   │   └── membership.ts       # Mitgliedschaftsanträge
│   ├── 📂 lib/                 # 🛠️ Utilities & Konfiguration
│   │   ├── firebase.ts         # Firebase SDK Setup
│   │   ├── types.ts            # TypeScript Interface-Definitionen
│   │   └── mockData.ts         # Entwicklungs-Mock-Daten
│   ├── 📂 styles/              # 🎨 Design-System
│   │   └── theme.css           # CSS Custom Properties & Utilities
│   ├── 📂 router/              # 🛣️ Vue Router Konfiguration
│   │   └── index.ts            # Route-Definitionen
│   ├── main.ts                 # 🚀 App Entry Point
│   ├── App.vue                 # 📱 Root-Komponente
│   └── style.css               # 🎨 Globale Styles
├── 📋 package.json             # Dependencies & Scripts
├── 🔧 vite.config.ts           # Vite-Konfiguration
├── 📝 tsconfig.json            # TypeScript-Konfiguration
├── 🔒 env.template             # Umgebungsvariablen-Template
└── 📖 README.md                # Diese Datei
```

## 🎨 Design-System

### 🌈 **Farbpalette**
```css
/* Hainberg-Gymnasium Markenfarben */
--color-primary: #5362FE     /* Hauptfarbe (Links, Buttons) */
--color-secondary: #07488F   /* Sidebar, Headlines */
--color-accent: #486DB9      /* Hover-States, Highlights */
--color-info: #0662BE        /* Info-Elemente */
--color-bg: #AEB7FB          /* Hintergrund-Gradient */
--color-text: #454443        /* Haupttext */
```

### 📐 **Layout-System**
- **CSS Grid & Flexbox** für moderne Layouts
- **Custom Properties** für konsistente Abstände
- **Mobile-First** Responsive Design
- **Fluid Typography** mit clamp()

### 📱 **Responsive Breakpoints**
- **Mobile**: `< 768px` (Hamburger-Menü)
- **Tablet**: `768px - 1023px` (Collapsible Sidebar)
- **Desktop**: `≥ 1024px` (Persistente Sidebar)

### ♿ **Accessibility Features**
- **WCAG 2.1 AA** konform
- **Keyboard Navigation** vollständig unterstützt
- **Screen Reader** optimiert
- **Focus Management** für SPA-Navigation
- **High Contrast** Support

## 🔥 Firebase Backend

### 📊 **Firestore Collections**
```typescript
// 📅 Events Collection
interface Event {
  id: string
  title: string
  date: Timestamp
  location?: string
  description?: string
  isFeatured?: boolean
  createdAt: Timestamp
}

// 📰 News Collection  
interface NewsArticle {
  id: string
  title: string
  slug: string
  date: Timestamp
  excerpt: string
  content: string
  coverUrl?: string
  tags?: string[]
  createdAt: Timestamp
}

// 🖼️ Gallery Collection
interface GalleryImage {
  id: string
  title?: string
  imageUrl: string
  thumbnailUrl?: string
  createdAt: Timestamp
}

// ➕ Membership Applications
interface MembershipApplication {
  id: string
  name: string
  email: string
  graduationYear?: number
  relation?: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
}
```

### 🗂️ **Storage Structure**
```
📁 Firebase Storage
└── 📁 gallery/
    ├── 📁 original/        # Hochauflösende Original-Bilder
    ├── 📁 thumbnails/      # Optimierte Thumbnail-Versionen
    └── 📁 compressed/      # Web-optimierte Versionen
```

### 🔒 **Security Rules**
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Öffentlicher Lesezugriff
    match /{collection}/{document} {
      allow read: if collection in ['events', 'news', 'gallery'];
    }
    
    // Mitgliedschaftsanträge (nur erstellen)
    match /membershipApplications/{document} {
      allow create: if isValidApplication();
    }
  }
}

// Storage Security Rules
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Nur für Admins
    }
  }
}
```

## 🛠️ Development Guide

### 🧪 **Mock-Daten für lokale Entwicklung**
```bash
# .env konfigurieren für Development ohne Firebase
echo "VITE_USE_MOCK_DATA=true" > .env

# Enthält 5 Demo-Events, 4 News-Artikel, 8 Galerie-Bilder
npm run dev
```

### 🧩 **Neue Komponenten erstellen**
```bash
# 1. Komponente erstellen
touch src/components/MyComponent.vue

# 2. TypeScript + Composition API verwenden
# 3. CSS Custom Properties nutzen  
# 4. Props/Emits typisieren
```

### 📄 **Neue Seiten hinzufügen**
```typescript
// 1. Seite erstellen: src/pages/NeueSeite.vue
// 2. Route registrieren: src/router/index.ts
{
  path: '/neue-seite',
  name: 'neue-seite', 
  component: () => import('../pages/NeueSeite.vue'),
  meta: { title: 'Neue Seite' }
}

// 3. Navigation erweitern: src/components/AppSidebar.vue
```

### 🏪 **Store hinzufügen**
```typescript
// src/stores/myStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('myStore', () => {
  // State
  const data = ref([])
  const loading = ref(false)
  
  // Getters  
  const filteredData = computed(() => data.value.filter(...))
  
  // Actions
  const fetchData = async () => { /* ... */ }
  
  return { data, loading, filteredData, fetchData }
})
```

## 🚀 Deployment

### 📦 **Production Build**
```bash
# Build für Production
npm run build

# Preview des Builds
npm run preview

# Type-Checking
npm run type-check
```

### 🌐 **Firebase Hosting**
```bash
# Firebase CLI installieren
npm install -g firebase-tools

# Login und Projekt initialisieren  
firebase login
firebase init hosting

# Deployment
npm run build
firebase deploy
```

### 🐳 **Docker (Optional)**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
```

## 🔮 Roadmap & Features

### ✅ **Implementiert**
- [x] **Responsive Design** (Desktop/Tablet/Mobile)
- [x] **Pinia State Management** mit TypeScript
- [x] **Firebase Integration** (Firestore + Storage)
- [x] **Mock-Daten System** für Development
- [x] **Vue Router** mit deutschen URLs
- [x] **Accessibility** (WCAG 2.1 AA)
- [x] **Form Validation** im Mitgliedsformular

### 🔄 **In Arbeit**
- [ ] **Admin-Dashboard** für Content-Management
- [ ] **User Authentication** (Google/Email)
- [ ] **Event-Detail-Seiten** mit RSVP
- [ ] **Newsletter-System** mit E-Mail-Templates

### 🎯 **Geplant**
- [ ] **Progressive Web App** (PWA) Features
- [ ] **Push-Benachrichtigungen** für Events
- [ ] **Erweiterte Suche** mit Elasticsearch
- [ ] **SEO-Optimierung** mit Nuxt/SSR
- [ ] **Multi-Language** Support (EN/DE)
- [ ] **Dark Mode** Theme
- [ ] **Analytics Dashboard** für Admins

## 🤝 Contributing

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/neues-feature`)
3. Committen Sie Ihre Änderungen (`git commit -am 'Neues Feature hinzugefügt'`)
4. Pushen Sie den Branch (`git push origin feature/neues-feature`)
5. Erstellen Sie einen Pull Request

## 📄 Lizenz

© 2024 Alumni-Verein des Hainberg-Gymnasiums. Alle Rechte vorbehalten.

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an:
- E-Mail: info@hg-alumni.de
- GitHub Issues für technische Probleme