# 🎓 Alumni-Website des Hainberg-Gymnasiums

Eine moderne, responsive Vue.js-Anwendung für den Alumni-Verein des Hainberg-Gymnasiums Göttingen e.V. Die Website ermöglicht es ehemaligen Schülern, sich zu vernetzen, über Veranstaltungen zu informieren und mit der Schule in Kontakt zu bleiben.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-4FC08D?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?style=flat&logo=firebase)
![Pinia](https://img.shields.io/badge/Pinia-2.1.7-FFD859?style=flat&logo=pinia)

## 📋 Inhaltsverzeichnis

- [Entwicklungs-Setup](#-entwicklungs-setup)
- [Systemvoraussetzungen](#-systemvoraussetzungen)
- [Installation](#-installation)
- [Build-Anweisungen](#-build-anweisungen)
- [Entwicklung](#-entwicklung)
- [Projektstruktur](#-projektstruktur)
- [Verfügbare Scripts](#-verfügbare-scripts)
- [Deployment](#-deployment)
- [Technologie-Stack](#-technologie-stack)

## 🛠️ Entwicklungs-Setup

### 📋 Systemvoraussetzungen

Bevor Sie mit der Entwicklung beginnen, stellen Sie sicher, dass folgende systemweite Abhängigkeiten installiert sind:

#### **Erforderliche Software:**

1. **Node.js** (Version 18.x oder höher)
   ```bash
   # Überprüfen der installierten Version
   node --version
   
   # Download und Installation:
   # macOS: https://nodejs.org/en/download/ oder via Homebrew:
   brew install node
   
   # Windows: https://nodejs.org/en/download/
   # Linux (Ubuntu/Debian):
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **npm** (wird automatisch mit Node.js installiert)
   ```bash
   # Überprüfen der npm Version
   npm --version
   
   # Auf neueste Version aktualisieren
   npm install -g npm@latest
   ```

3. **Git** (für Versionskontrolle)
   ```bash
   # Installation überprüfen
   git --version
   
   # macOS: git ist vorinstalliert oder via Xcode Command Line Tools
   xcode-select --install
   
   # Windows: https://git-scm.com/download/win
   # Linux: sudo apt-get install git
   ```

## 📦 Installation

### 1. Repository klonen

```bash
# HTTPS
git clone https://github.com/your-username/AlumniWebsite.git
cd AlumniWebsite

# oder SSH (wenn SSH-Keys konfiguriert sind)
git clone git@github.com:your-username/AlumniWebsite.git
cd AlumniWebsite
```

### 2. Lokale Abhängigkeiten installieren

```bash
# Alle Dependencies aus package.json installieren
npm i
```

**Was wird installiert:**

**Dependencies (Laufzeit):**
- `vue@^3.5.18` - Vue.js Framework
- `vue-router@^4.2.5` - Client-side Routing
- `pinia@^2.1.7` - State Management
- `firebase@^12.2.1` - Backend-as-a-Service
- `@heroicons/vue@^2.2.0` - Icon-Bibliothek

**DevDependencies (Entwicklung):**
- `vite@^7.1.2` - Build-Tool und Dev-Server
- `typescript@~5.8.3` - TypeScript Compiler
- `vue-tsc@^3.0.5` - Vue TypeScript Compiler
- `@vitejs/plugin-vue@^6.0.1` - Vue Plugin für Vite
- `tsx@^4.20.5` - TypeScript Script Runner
- `ssh2-sftp-client` - Zum Deployn auf WebServer
- Weitere Tools für Linting, Testing und Deployment

### 3. Firebase Projekt erstellen

https://console.firebase.google.com/

- Projekt erstellen
- Firestore Database erstellen
- Storage Bucket erstellen
- Authentication aktivieren (Email/Password)

### 4. Firebase Security Rules konfigurieren

#### **Firestore Rules**
Navigieren Sie zu **Firestore Database > Rules** und ersetzen Sie die Standard-Rules mit:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
    // Admin-Benutzer Verwaltung
    match /admins/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if isAdmin();
    }
    
    // Admins dürfen alles
    match /{document=**} {
      allow read, write: if isAdmin();
    }
    
    // SENSITIVE COLLECTION - Benutzerdaten
    match /users/{id} {
      allow read, write: if true; // TEMPORÄR FÜR DEV
      allow read: if request.auth.uid == id || isAdmin();
      allow write: if request.auth.uid == id || isAdmin();
      allow create: if true;
    }
    
    // Events (nur lesen für alle, schreiben nur für Admins)
    match /events/{document} {
      allow read: if true;
      allow write: if false; 
    }
    
    // News (nur lesen für alle, schreiben nur für Admins)
    match /news/{document} {
      allow read: if true;
      allow write: if false; 
    }
    
    // Galerie (nur lesen für alle, schreiben nur für Admins)
    match /gallery/{document} {
      allow read: if true;
      allow write: if false; 
    }
    
    // Galerie-Ordner (nur lesen für alle, schreiben nur für Admins)
    match /gallery_folders/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    // Jahrgangs-Galerie (Lesen für alle, Schreiben nur für Jahrgangs-User)
    match /jahrgang_gallery/{document} {
      allow read: if true; // Öffentliche Preview
      allow create: if request.auth != null && 
                     isJahrgangUser() && 
                     request.resource.data.jahrgang == getUserJahrgang();
      allow update, delete: if request.auth != null && 
                             isJahrgangUser() && 
                             resource.data.uploadedBy == request.auth.uid;
    }
    
    // Jahrgangs-Ordner (Lesen für alle, Schreiben nur für Jahrgangs-User)
    match /jahrgang_folders/{document} {
      allow read: if true; // Öffentliche Preview
      allow write: if request.auth != null && isJahrgangUser();
    }
    
    // Hilfsfunktionen
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Prüft ob User ein Jahrgangs-User ist
    function isJahrgangUser() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'jahrgang';
    }
    
    // Holt den Jahrgang des aktuellen Users
    function getUserJahrgang() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.abiturjahrgang;
    }
  }
}
```

#### **Storage Rules**
Navigieren Sie zu **Storage > Rules** und ersetzen Sie die Standard-Rules mit:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
  }
}
```

**⚠️ Wichtige Sicherheitshinweise:**
- Die `users` Collection hat temporär `allow read, write: if true;` für Development
- **Vor Production-Deployment** müssen die Rules verschärft werden
- Admins werden über die `admins` Collection verwaltet
- Alle öffentlichen Inhalte (Events, News, Galerie) sind nur lesbar

### 5. Umgebungsvariablen konfigurieren & Firebase config

#### firebase.ts

```bash
# src/lib/firebase.ts
cd src/lib/
cp firebase-example.ts firebase.ts
```

```js
//Anpassen
const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
}
````

#### .env


```bash
# .env Datei aus Template erstellen
cp env.template .env


#Version
VITE_VERSION="v.0.5"
VITE_LAST_UPDATED_WEBSITE="20. September 2025"
VITE_LAST_UPDATED_BARRIEREFREI="20. September 2025" 


#NUR FÜR DAS DEPLOY SCRIPT

#Deploy auf Preview-Webspace
PREVIEW_SFTP_HOST="xxx"
PREVIEW_SFTP_USERNAME="xxx"
PREVIEW_SFTP_KEY="xxx"

```

### 6. Firebase Cloud Functions Integrieren (Optional)

#### Anleitung:

https://github.com/tom00408/alumni-cloud-functions

### 7. Admin Seite erstellen für Verwaltung (Optional aber sehr empfehlenswert)

#### Anleitung

https://github.com/tom00408/hg-alumni-admin-website

## 🔨 Build-Anweisungen

### Development Build
```bash
# Entwicklungsserver starten (mit Hot Module Replacement)
npm run dev

# Alternative mit spezifischem Port
npm run dev -- --port 3000
```

### Production Build
```bash
# Optimierten Production Build erstellen
npm run build

# Build-Output wird in /dist Ordner erstellt
# Zusätzlich wird .htaccess für Apache-Server kopiert
```

### Type Checking
```bash
# TypeScript-Typen überprüfen ohne Build
npm run check:types
```

### Preview Build
```bash
# Production Build lokal testen
npm run preview
```

## 🚀 Entwicklung

### Entwicklungsserver starten

```bash
# Standard-Entwicklungsserver (Port 5173)
npm run dev

# Server läuft auf: http://localhost:5173
# Hot Module Replacement (HMR) ist aktiviert
# Änderungen werden automatisch im Browser aktualisiert
```

**Entwicklungsfeatures:**
- ⚡ Vite Dev Server mit HMR
- 🔧 TypeScript-Unterstützung
- 🎨 CSS Hot Reload
- 🐛 Source Maps für Debugging
- 📱 Responsive Design Testing

### Entwicklungsworkflow

1. **Lokale Entwicklung:**
   ```bash
   npm run dev
   ```

2. **Typen überprüfen:**
   ```bash
   npm run check:types
   ```

3. **Build testen:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Deployment Preview:**
   ```bash
   npm run deploy:preview
    ```

## 📁 Projektstruktur

```
AlumniWebsite/
├── public/                 # Statische Assets
│   ├── images/            # Bilder und Icons
│   └── index.html         # HTML Template
├── src/                   # Quellcode
│   ├── components/        # Vue Komponenten
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── ...
│   ├── layouts/           # Layout-Komponenten
│   │   └── DefaultLayout.vue
│   ├── pages/             # Seiten-Komponenten
│   │   ├── Startseite.vue
│   │   ├── Termine.vue
│   │   └── ...
│   ├── services/          # API Services
│   │   ├── auth.ts
│   │   ├── events.ts
│   │   └── ...
│   ├── stores/            # Pinia Stores
│   │   ├── auth.ts
│   │   └── ...
│   ├── styles/            # Globale Styles
│   │   ├── style.css
│   │   └── theme.css
│   ├── lib/               # Utilities und Types
│   │   ├── firebase.ts
│   │   └── types.ts
│   ├── router/            # Vue Router Konfiguration
│   │   └── index.ts
│   ├── App.vue           # Root Komponente
│   └── main.ts           # Entry Point
├── scripts/               # Build und Deployment Scripts
├── dist/                  # Build Output (nach npm run build)
├── .env.template         # Umgebungsvariablen Template
├── package.json          # Dependencies und Scripts
├── tsconfig.json         # TypeScript Konfiguration
├── vite.config.ts        # Vite Konfiguration
└── README.md             # Diese Datei
```

## 📜 Verfügbare Scripts

```bash
# Entwicklung
npm run dev              # Entwicklungsserver starten
npm run build            # Production Build erstellen
npm run preview          # Build lokal testen

# Code-Qualität
npm run check:types      # TypeScript Typen prüfen
npm run check:css        # CSS Analyse
npm run check:file-sizes # Bundle-Größe analysieren

# Testing
npm run test:mem-app     # Mitgliedschaftsantrag testen
#Funktioniert nur wenn die Firebase Rules entsprechend angepasst sind


# Deployment
npm run deploy:preview   # Preview-Deployment
npm run deploy:main      # Production-Deployment (noch nicht konfiguriert)
```

## 🚀 Deployment

### Preview-Deployment
```bash
# Automatisches Deployment auf Preview-Server
npm run deploy:preview
```

### Production-Deployment
```bash
# Production Build erstellen
npm run build

# Build-Ordner (/dist) auf Server hochladen
# Enthält alle optimierten Assets und .htaccess für Apache
```

## 🛠️ Technologie-Stack

### **Frontend**
- **Vue.js 3** - Progressive JavaScript Framework
- **TypeScript** - Typisierte JavaScript-Superset
- **Vue Router** - Client-side Routing
- **Pinia** - State Management Store

### **Build & Development**
- **Vite** - Next-generation Frontend Build Tool
- **PostCSS** - CSS-Transformationen
- **ESLint** - Code-Linting
- **Prettier** - Code-Formatierung

### **Backend & Services**
- **Firebase Auth** - Benutzerauthentifizierung
- **Firestore** - NoSQL-Datenbank
- **Firebase Storage** - Datei-Upload
- **Firebase Hosting** - Static Site Hosting

### **Styling**
- **CSS Custom Properties** - Eigenes Design-System
- **CSS Grid & Flexbox** - Moderne Layouts
- **Responsive Design** - Mobile-first Ansatz

## 🔧 Entwicklungshinweise

### **Code-Standards:**
- TypeScript für alle neuen Dateien
- Vue 3 Composition API mit `<script setup>`
- Pinia für State Management
- Semantisches HTML für Barrierefreiheit

### **Naming Conventions:**
- Komponenten: PascalCase (`AppHeader.vue`)
- Variablen/Funktionen: camelCase (`getUserData`)
- CSS-Klassen: kebab-case (`nav-item`)
- Konstanten: UPPER_SNAKE_CASE (`API_BASE_URL`)

### **Git Workflow:**
```bash
# Feature Branch erstellen
git checkout -b feature/neue-funktion

# Änderungen committen
git add .
git commit -m "feat: neue Funktion hinzugefügt"

# Branch pushen
git push origin feature/neue-funktion

# Pull Request erstellen
```

## 🐛 Troubleshooting

### **Häufige Probleme:**

1. **Port bereits in Verwendung:**
   ```bash
   # Anderen Port verwenden
   npm run dev -- --port 3000
   ```

2. **Node-Module Probleme:**
   ```bash
   # Node-Modules neu installieren
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript Fehler:**
   ```bash
   # Typen überprüfen
   npm run check:types
   ```

4. **Build-Fehler:**
   ```bash
   # Cache leeren und neu builden
   rm -rf dist
   npm run build
   ```

## 📞 Support

Bei Fragen oder Problemen:
- **E-Mail:** tom00408@aol.com
- **Entwickler-Team:** HG Alumni IT-Team

