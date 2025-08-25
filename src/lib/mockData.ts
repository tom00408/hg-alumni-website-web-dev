import { Timestamp } from 'firebase/firestore'
import type { Event, NewsArticle, GalleryImage } from './types'

// Hilfsfunktion zum Erstellen von Timestamps
const createTimestamp = (date: Date) => {
  return {
    toDate: () => date,
    toMillis: () => date.getTime()
  } as Timestamp
}

// Mock Events
export const getMockEvents = (): Event[] => [
  {
    id: 'event-1',
    title: 'Alumni-Treffen 2024',
    date: createTimestamp(new Date('2024-06-15T18:00:00')),
    location: 'Aula des Hainberg-Gymnasiums',
    description: 'Unser jährliches Alumni-Treffen mit Buffet, Führungen durch die renovierten Räume und einem Vortrag des Schulleiters über aktuelle Entwicklungen. Eine perfekte Gelegenheit, alte Freunde wiederzusehen und neue Kontakte zu knüpfen.',
    isFeatured: true,
    createdAt: createTimestamp(new Date('2024-01-15T10:00:00'))
  },
  {
    id: 'event-2',
    title: 'Berufsinformationstag',
    date: createTimestamp(new Date('2024-04-20T09:00:00')),
    location: 'Forum der Schule',
    description: 'Alumni stellen ihre Berufe vor und geben Schülern wertvolle Tipps für die Berufswahl. Verschiedene Branchen werden vertreten sein: IT, Medizin, Jura, Ingenieurswesen und mehr.',
    isFeatured: false,
    createdAt: createTimestamp(new Date('2024-01-10T14:30:00'))
  },
  {
    id: 'event-3',
    title: 'Weihnachtskonzert',
    date: createTimestamp(new Date('2024-12-18T19:30:00')),
    location: 'Stadthalle Göttingen',
    description: 'Traditionelles Weihnachtskonzert der Schule mit Unterstützung des Alumni-Vereins. Verschiedene Ensembles und Chöre werden auftreten.',
    isFeatured: true,
    createdAt: createTimestamp(new Date('2024-01-20T11:15:00'))
  },
  {
    id: 'event-4',
    title: 'Ehemaligentreffen Abitur 2010',
    date: createTimestamp(new Date('2024-09-14T17:00:00')),
    location: 'Restaurant Zum Schwarzen Bären',
    description: '15-jähriges Abitreffen des Jahrgangs 2010. Gemeinsames Essen und Erinnerungen austauschen.',
    isFeatured: false,
    createdAt: createTimestamp(new Date('2024-02-01T16:45:00'))
  },
  {
    id: 'event-5',
    title: 'Tag der offenen Tür',
    date: createTimestamp(new Date('2024-03-16T10:00:00')),
    location: 'Hainberg-Gymnasium',
    description: 'Alumni helfen bei der Präsentation der Schule für interessierte Familien und Viertklässler.',
    isFeatured: false,
    createdAt: createTimestamp(new Date('2024-01-25T09:20:00'))
  }
]

// Mock News Articles
export const getMockNews = (): NewsArticle[] => [
  {
    id: 'news-1',
    title: 'Neuer Vorstand gewählt',
    slug: 'neuer-vorstand-gewaehlt',
    date: createTimestamp(new Date('2024-02-15T14:00:00')),
    excerpt: 'Bei der Jahreshauptversammlung wurde ein neuer Vorstand gewählt. Dr. Maria Mustermann übernimmt den Vorsitz.',
    content: `Bei der diesjährigen Jahreshauptversammlung des Alumni-Vereins wurde ein neuer Vorstand gewählt. Dr. Maria Mustermann (Abitur 1998) übernimmt den Vorsitz von Prof. Dr. Klaus Beispiel, der nach sechs Jahren im Amt nicht mehr kandidierte.

Als stellvertretender Vorsitzender wurde Prof. Dr. Max Musterland (Abitur 2001) gewählt. Die Position der Schatzmeisterin übernimmt Diplom-Ing. Anna Beispiel (Abitur 2005), und als Schriftführerin wurde M.A. Lisa Demo (Abitur 2008) bestätigt.

Der neue Vorstand hat sich vorgenommen, die Aktivitäten des Vereins weiter auszubauen und insbesondere die Vernetzung zwischen den verschiedenen Jahrgängen zu stärken. "Wir möchten eine Plattform schaffen, die sowohl den frischen Absolventen als auch den langjährigen Alumni zugutekommt", erklärte Dr. Mustermann in ihrer Antrittsrede.

Geplant sind unter anderem regelmäßige Networking-Events, ein Mentoring-Programm für aktuelle Schüler und die Einrichtung eines Online-Portals für den Austausch zwischen den Mitgliedern.`,
    coverUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    tags: ['Vorstand', 'Wahl', 'Verein'],
    createdAt: createTimestamp(new Date('2024-02-15T14:00:00'))
  },
  {
    id: 'news-2',
    title: 'Stipendium für bedürftige Schüler eingerichtet',
    slug: 'stipendium-fuer-beduerftige-schueler',
    date: createTimestamp(new Date('2024-01-30T11:30:00')),
    excerpt: 'Der Alumni-Verein richtet ein Stipendium für bedürftige Schüler des Hainberg-Gymnasiums ein.',
    content: `Der Alumni-Verein des Hainberg-Gymnasiums hat beschlossen, ein Stipendienprogramm für bedürftige Schüler zu starten. Mit jährlich 5.000 Euro sollen Schülerinnen und Schüler unterstützt werden, die aus finanziellen Gründen nicht an Klassenfahrten oder anderen schulischen Aktivitäten teilnehmen können.

"Bildung darf nicht vom Geldbeutel der Eltern abhängen", betont Schatzmeisterin Anna Beispiel. "Mit diesem Stipendium möchten wir sicherstellen, dass alle Schüler die gleichen Chancen haben."

Das Stipendium wird in Zusammenarbeit mit der Schulleitung vergeben. Bewerbungen können ab sofort über das Sekretariat eingereicht werden. Die Vergabekriterien und weitere Informationen sind auf der Schulwebsite verfügbar.

Der Verein finanziert das Stipendium aus den Mitgliedsbeiträgen und Spenden. "Es ist schön zu sehen, wie unsere Gemeinschaft auch den aktuellen Schülern hilft", freut sich Vorsitzende Dr. Maria Mustermann.`,
    coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop',
    tags: ['Stipendium', 'Unterstützung', 'Schüler'],
    createdAt: createTimestamp(new Date('2024-01-30T11:30:00'))
  },
  {
    id: 'news-3',
    title: '50-jähriges Jubiläum des Abiturjahrgangs 1974',
    slug: '50-jaehriges-jubilaeum-jahrgang-1974',
    date: createTimestamp(new Date('2024-01-15T16:45:00')),
    excerpt: 'Der Abiturjahrgang 1974 feierte sein 50-jähriges Jubiläum mit einer großen Feier in der Schule.',
    content: `Mit einer emotionalen Feier hat der Abiturjahrgang 1974 sein 50-jähriges Jubiläum begangen. 28 der damals 35 Absolventen fanden sich in der alten Schule ein, um gemeinsam zu feiern und Erinnerungen auszutauschen.

Schulleiter Dr. Thomas Weber begrüßte die ehemaligen Schüler herzlich: "Es ist immer wieder beeindruckend zu sehen, wie stark die Verbindung zur Schule auch nach Jahrzehnten noch ist."

Höhepunkt des Abends war eine Führung durch die Schule, bei der viele Veränderungen, aber auch viele vertraute Ecken entdeckt wurden. "Unser alter Klassenraum sieht noch genauso aus wie damals", lachte Hans Müller, der extra aus München angereist war.

Die Jubilare nutzten die Gelegenheit auch, um der Schule etwas zurückzugeben: Sie spendeten 2.500 Euro für die Renovierung der Schulbibliothek.

"Solche Treffen zeigen, was Schule ausmacht: eine Gemeinschaft, die ein Leben lang hält", resümierte Dr. Weber.`,
    tags: ['Jubiläum', 'Jahrgang 1974', 'Feier'],
    createdAt: createTimestamp(new Date('2024-01-15T16:45:00'))
  },
  {
    id: 'news-4',
    title: 'Digitalisierung der Schulchronik',
    slug: 'digitalisierung-schulchronik',
    date: createTimestamp(new Date('2024-01-08T10:15:00')),
    excerpt: 'Ein Team von Alumni digitalisiert die historischen Dokumente der Schule für zukünftige Generationen.',
    content: `Ein engagiertes Team aus Alumni-Mitgliedern hat sich der Aufgabe angenommen, die historischen Dokumente und Chroniken der Schule zu digitalisieren. Das Projekt unter der Leitung von Dr. Peter Historiker (Abitur 1985) will das kulturelle Erbe der Schule für kommende Generationen bewahren.

"Wir haben Dokumente aus über 100 Jahren Schulgeschichte", erklärt Dr. Historiker. "Von handschriftlichen Protokollen bis hin zu alten Fotografien - alles soll digital archiviert werden."

Das Team arbeitet ehrenamtlich an Wochenenden und hat bereits über 1.000 Dokumente erfasst. Besonders wertvoll sind die Berichte aus der Nachkriegszeit und die Dokumentation des Wiederaufbaus der Schule.

Die digitalisierten Archivalien sollen später auch online zugänglich gemacht werden, sodass alle Alumni und Interessierte in der Schulgeschichte stöbern können.

"Es ist faszinierend zu sehen, wie sich die Schule über die Jahrzehnte entwickelt hat", berichtet Teammitglied Sarah Digital (Abitur 2010). "Viele Traditionen bestehen noch heute."`,
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    tags: ['Digitalisierung', 'Geschichte', 'Archiv'],
    createdAt: createTimestamp(new Date('2024-01-08T10:15:00'))
  }
]

// Mock Gallery Images
export const getMockGallery = (): GalleryImage[] => [
  {
    id: 'gallery-1',
    title: 'Alumni-Treffen 2023 - Gruppenfoto',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2023-06-20T19:30:00'))
  },
  {
    id: 'gallery-2',
    title: 'Berufsinformationstag 2023',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2023-04-15T10:00:00'))
  },
  {
    id: 'gallery-3',
    title: 'Renovierte Aula',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2023-09-01T14:00:00'))
  },
  {
    id: 'gallery-4',
    title: 'Weihnachtskonzert 2023',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2023-12-18T20:00:00'))
  },
  {
    id: 'gallery-5',
    title: 'Jahreshauptversammlung 2024',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2024-02-15T18:00:00'))
  },
  {
    id: 'gallery-6',
    title: 'Neue Bibliothek',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2024-01-10T12:00:00'))
  },
  {
    id: 'gallery-7',
    title: 'Schulhof im Frühjahr',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2024-03-25T11:30:00'))
  },
  {
    id: 'gallery-8',
    title: 'Alumni beim Networking',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop',
    createdAt: createTimestamp(new Date('2023-10-05T17:45:00'))
  }
]
