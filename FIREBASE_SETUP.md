# Firebase Integration Setup

Diese Anleitung führt dich durch die komplette Einrichtung der Firebase-Integration für die Alumni-Website.

## 🚀 Schnellstart

### 1. Firebase-Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Folge dem Setup-Wizard:
   - Projektname: `alumni-website-hainberg`
   - Google Analytics: Optional
   - Region: `europe-west3` (Frankfurt)

### 2. Firestore Database einrichten

1. In der Firebase Console → "Firestore Database"
2. "Datenbank erstellen"
3. Wähle **Testmodus** (später auf Produktionsmodus umstellen)
4. Region: `europe-west3`

### 3. Storage einrichten

1. In der Firebase Console → "Storage"
2. "Jetzt starten"
3. Wähle **Testmodus**
4. Region: `europe-west3`

### 4. Web-App hinzufügen

1. Firebase Console → "Projekteinstellungen" (⚙️)
2. "Apps" → "Web-App hinzufügen"
3. App-Nickname: `alumni-website`
4. Firebase Hosting: **Ja**
5. Kopiere die Konfigurationsdaten

### 5. Umgebungsvariablen konfigurieren

1. Kopiere `env.template` zu `.env`:
   ```bash
   cp env.template .env
   ```

2. Fülle die `.env` Datei mit deinen Firebase-Daten:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=dein_api_key
   VITE_FIREBASE_AUTH_DOMAIN=dein-projekt.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=dein-projekt-id
   VITE_FIREBASE_STORAGE_BUCKET=dein-projekt.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

   ```

## 🧪 Integration testen

### Firebase-Verbindung testen
```bash
npm run firebase:test
```


## 📊 Datenstruktur

### Collections

#### `events`
```typescript
{
  id: string (auto-generated)
  title: string
  date: Timestamp
  location?: string
  description?: string
  isFeatured?: boolean
  createdAt: Timestamp
}
```

#### `news`
```typescript
{
  id: string (auto-generated)
  title: string
  slug: string
  date: Timestamp
  excerpt: string
  content: string
  coverUrl?: string
  tags?: string[]
  createdAt: Timestamp
}
```

#### `gallery`
```typescript
{
  id: string (auto-generated)
  title?: string
  imageUrl: string
  thumbnailUrl?: string
  createdAt: Timestamp
}
```

#### `membershipApplications`
```typescript
{
  id: string (auto-generated)
  name: string
  email: string
  graduationYear?: number
  relation?: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
}
```

## 🔒 Sicherheitsregeln

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - Öffentlich lesbar
    match /events/{document} {
      allow read: if true;
      allow write: if false; // Nur über Admin-Interface
    }
    
    // News - Öffentlich lesbar
    match /news/{document} {
      allow read: if true;
      allow write: if false; // Nur über Admin-Interface
    }
    
    // Gallery - Öffentlich lesbar
    match /gallery/{document} {
      allow read: if true;
      allow write: if false; // Nur über Admin-Interface
    }
    
    // Membership Applications - Nur schreibbar
    match /membershipApplications/{document} {
      allow read: if false; // Nur für Admins
      allow create: if true; // Jeder kann sich bewerben
      allow update, delete: if false;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery Images - Öffentlich lesbar
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Nur über Admin-Interface
    }
  }
}
```

## 🛠️ Entwicklung

### Firebase-Daten

Die Anwendung arbeitet ausschließlich mit echten Firebase-Daten und erfordert eine konfigurierte Firebase-Verbindung.

### Services

Alle Firebase-Services sind in `src/services/` implementiert:

- `events.ts` - Events-Management
- `news.ts` - News-Artikel-Management
- `gallery.ts` - Bildergalerie-Management
- `membership.ts` - Mitgliedschaftsanträge

### Stores

Pinia-Stores in `src/stores/` handhaben Zustand und Caching:

- `events.ts` - Events-State
- `news.ts` - News-State
- `gallery.ts` - Gallery-State

## 🚀 Produktionseinstellung

### 1. Sicherheitsregeln aktivieren

Stelle die oben genannten Firestore- und Storage-Regeln ein.

### 2. Produktionsumgebung

Die Anwendung arbeitet standardmäßig mit Firebase-Daten.

### 3. Backup-Strategie

- Regelmäßige Firestore-Backups einrichten
- Storage-Backup-Strategie definieren

## 🐛 Troubleshooting

### Häufige Probleme

1. **"Firebase App nicht initialisiert"**
   - Überprüfe deine `.env` Datei
   - Stelle sicher, dass alle Konfigurationswerte gesetzt sind

2. **"Permission denied"**
   - Überprüfe deine Firestore-Sicherheitsregeln
   - Stelle sicher, dass die Collection existiert

3. **"Storage upload failed"**
   - Überprüfe deine Storage-Sicherheitsregeln
   - Stelle sicher, dass der Storage-Bucket existiert

### Debug-Modus

Füge in deine `.env` hinzu:
```env
VITE_FIREBASE_DEBUG=true
```

### Support

Bei Problemen:
1. Überprüfe die Browser-Konsole auf Fehler
2. Führe `npm run firebase:test` aus
3. Überprüfe die Firebase Console auf Logs

## 📈 Monitoring

### Firebase Console

Überwache deine App in der Firebase Console:
- Firestore → Usage, Performance
- Storage → Usage
- Performance → Web Vitals
- Analytics → Benutzerverhalten

### Lokale Überwachung

```bash
# Test ausführen
npm run firebase:test

# Entwicklungsserver mit Debug-Logs
VITE_FIREBASE_DEBUG=true npm run dev
```

## 🔄 Wartung

### Regelmäßige Aufgaben

1. **Datenbereinigung**: Entferne alte Events/News
2. **Storage-Aufräumen**: Entferne ungenutzte Bilder
3. **Performance-Monitoring**: Überwache Ladezeiten
4. **Backup-Überprüfung**: Teste Backup-Wiederherstellung

### Updates

```bash
# Firebase SDK aktualisieren
npm update firebase

# Test nach Update
npm run firebase:test
```

