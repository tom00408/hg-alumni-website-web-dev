# Alumni-Website des Hainberg-Gymnasiums

Eine moderne Vue.js-basierte Website für den Alumni-Verein des Hainberg-Gymnasiums Göttingen.

## 🎯 Features

- **Vue 3 + TypeScript + Vite** - Moderne Entwicklungsumgebung
- **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobile
- **Firebase Integration** - Backend für Daten und Storage
- **Pinia State Management** - Zentrale Datenverwaltung
- **Vue Router** - Deutsche URLs und SPA-Navigation
- **Custom CSS** - Eigenes Design-System ohne externe UI-Frameworks

## 🚀 Projekt-Setup

### Voraussetzungen

- Node.js (Version 16 oder höher)
- npm oder yarn

### Installation

1. Repository klonen oder Code herunterladen
2. Dependencies installieren:

```bash
npm install
```

3. Umgebungsvariablen konfigurieren:

Kopieren Sie `env.template` zu `.env` und tragen Sie Ihre Firebase-Konfiguration ein:

```bash
cp env.template .env
```

Bearbeiten Sie die `.env` Datei mit Ihren Firebase-Credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Für Development mit Mock-Daten (ohne Firebase)
VITE_USE_MOCK_DATA=true
```

### Development Server starten

```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` verfügbar.

### Production Build

```bash
npm run build
```

### Preview der Production-Version

```bash
npm run preview
```

## 🏗️ Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── AppSidebar.vue   # Navigation
│   ├── AppHeader.vue    # Mobile Header
│   ├── HgCard.vue       # Standard Card-Komponente
│   ├── EventItem.vue    # Event-Anzeige
│   └── NewsCard.vue     # News-Artikel-Card
├── layouts/             # Layout-Komponenten
│   └── DefaultLayout.vue
├── pages/               # Seiten-Komponenten
│   ├── Startseite.vue
│   ├── Termine.vue
│   ├── News.vue
│   ├── Galerie.vue
│   ├── MitgliedWerden.vue
│   ├── Impressum.vue
│   └── NotFound.vue
├── stores/              # Pinia State Management
│   ├── events.ts
│   ├── news.ts
│   └── gallery.ts
├── services/            # Firebase Services
│   ├── events.ts
│   └── membership.ts
├── lib/                 # Utilities und Konfiguration
│   ├── firebase.ts      # Firebase Setup
│   ├── types.ts         # TypeScript Typen
│   └── mockData.ts      # Mock-Daten für Development
├── styles/              # Globale Styles
│   └── theme.css        # Design-System und CSS-Variablen
├── router/              # Vue Router Konfiguration
│   └── index.ts
└── main.ts              # App Entry Point
```

## 🎨 Design-System

Das Projekt verwendet ein eigenes CSS-basiertes Design-System mit:

- **CSS Custom Properties** für konsistente Farben und Abstände
- **Mobile-First** responsive Design
- **Accessibility** Features (Focus-Styles, ARIA-Labels)
- **Dark/Light Mode** vorbereitet (noch nicht implementiert)

### Farbpalette

- `--color-primary: #5362FE` (Hauptfarbe für Links und Buttons)
- `--color-secondary: #07488F` (Sidebar und Headlines)
- `--color-accent: #486DB9` (Hover-States)
- `--color-info: #0662BE` (Info-Elemente)
- `--color-bg: #AEB7FB` (Hintergrund-Gradient)

## 🔥 Firebase Setup

### Firestore Collections

Das Projekt nutzt folgende Firestore-Collections:

- `events` - Termine und Veranstaltungen
- `news` - Nachrichten und Artikel
- `gallery` - Galerie-Bilder
- `membershipApplications` - Mitgliedschaftsanträge

### Storage Structure

```
storage/
└── gallery/
    ├── original/     # Original-Bilder
    └── thumbnails/   # Thumbnail-Versionen
```

### Security Rules (Beispiel)

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Öffentlicher Lesezugriff für Events, News und Gallery
    match /{collection}/{document} {
      allow read: if collection in ['events', 'news', 'gallery'];
    }
    
    // Mitgliedschaftsanträge nur schreiben erlaubt
    match /membershipApplications/{document} {
      allow create: if true;
    }
  }
}
```

## 📱 Responsive Breakpoints

- **Desktop**: >= 1024px (Sidebar sichtbar)
- **Tablet**: 768px - 1023px (Sidebar als Drawer)
- **Mobile**: < 768px (Mobile Navigation)

## 🛠️ Development

### Mit Mock-Daten arbeiten

Setzen Sie `VITE_USE_MOCK_DATA=true` in Ihrer `.env` Datei, um ohne Firebase zu entwickeln.

### Neue Komponenten hinzufügen

1. Erstellen Sie die Komponente in `src/components/`
2. Verwenden Sie TypeScript und `<script setup>`
3. Nutzen Sie CSS Custom Properties für Styling
4. Exportieren Sie Types wenn nötig

### Neue Seiten hinzufügen

1. Erstellen Sie die Komponente in `src/pages/`
2. Fügen Sie die Route in `src/router/index.ts` hinzu
3. Aktualisieren Sie die Navigation in `AppSidebar.vue`

## 📋 TODO / Roadmap

- [ ] Admin-Panel für Content-Management
- [ ] Benutzer-Authentication
- [ ] Event-Detail-Ansichten
- [ ] Newsletter-Anmeldung
- [ ] Erweiterte Suche
- [ ] PWA-Features
- [ ] E-Mail-Benachrichtigungen
- [ ] SEO-Optimierung

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