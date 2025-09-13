// Beispiel für deine Firebase Function (in deinem separaten Functions-Projekt)
// Diese Datei zeigt dir, wie du die sendConfirmationEmail Function implementieren kannst

import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as nodemailer from 'nodemailer'

// Type Definition (kannst du aus deinem Hauptprojekt importieren)
interface MembershipApplication {
  id?: string
  salutation: string
  firstName: string
  lastName: string
  address: string
  postalCode: string
  city: string
  birthDate: string
  occupation?: string
  email: string
  schoolFrom?: string
  schoolTo?: string
  iban: string
  bic: string
  placeDate: string
  signature: string
  createdAt?: any
  status?: 'pending' | 'approved' | 'rejected'
}

// E-Mail-Transporter konfigurieren (z.B. mit Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // oder dein bevorzugter E-Mail-Service
  auth: {
    user: process.env.EMAIL_USER, // Deine E-Mail-Adresse
    pass: process.env.EMAIL_PASS  // Dein App-Passwort
  }
})

// Firebase Function - empfängt den kompletten MembershipApplication Type
export const sendConfirmationEmail = onCall(async (request) => {
  try {
    // Den kompletten Application Type aus dem Request extrahieren
    const { application }: { application: MembershipApplication } = request.data
    
    if (!application) {
      throw new HttpsError('invalid-argument', 'Application data is required')
    }

    // E-Mail-Template erstellen
    const emailTemplate = createEmailTemplate(application)
    
    // E-Mail an den Antragsteller senden
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: 'Bestätigung Ihres Mitgliedsantrags - Alumniverein Hainberg-Gymnasium',
      html: emailTemplate,
      text: createTextEmail(application)
    })

    // Optional: E-Mail an die Verwaltung senden
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'verwaltung@alumniverein-hainberg.de', // Deine Verwaltungs-E-Mail
      subject: `Neuer Mitgliedsantrag von ${application.firstName} ${application.lastName}`,
      html: createAdminEmailTemplate(application),
      text: createAdminTextEmail(application)
    })

    return {
      success: true,
      message: 'Confirmation email sent successfully',
      applicationId: application.id
    }

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    throw new HttpsError('internal', 'Failed to send confirmation email')
  }
})

// E-Mail-Template für den Antragsteller
function createEmailTemplate(application: MembershipApplication): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Mitgliedsantrag Bestätigung</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2c5aa0; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .highlight { background-color: #e8f4fd; padding: 15px; border-left: 4px solid #2c5aa0; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Alumniverein Hainberg-Gymnasium Göttingen e.V.</h1>
        </div>
        
        <div class="content">
          <h2>Vielen Dank für Ihren Mitgliedsantrag!</h2>
          
          <p>Liebe/r ${application.salutation === 'herr' ? 'Herr' : application.salutation === 'frau' ? 'Frau' : ''} ${application.lastName},</p>
          
          <p>wir haben Ihren Mitgliedsantrag erfolgreich erhalten und werden uns in Kürze bei Ihnen melden.</p>
          
          <div class="highlight">
            <h3>Ihre Antragsdaten:</h3>
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>E-Mail:</strong> ${application.email}</p>
            <p><strong>Antragsdatum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
            <p><strong>Antrags-ID:</strong> ${application.id}</p>
          </div>
          
          <p>Wir prüfen Ihren Antrag und werden Ihnen eine Bestätigung per E-Mail zusenden, sobald die Bearbeitung abgeschlossen ist.</p>
          
          <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          
          <p>Mit freundlichen Grüßen<br>
          Ihr Alumniverein Hainberg-Gymnasium Göttingen e.V.</p>
        </div>
        
        <div class="footer">
          <p>Alumniverein Hainberg-Gymnasium Göttingen e.V.<br>
          Friedländer Weg 19, 37085 Göttingen<br>
          E-Mail: info@alumniverein-hainberg.de</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Text-Version der E-Mail
function createTextEmail(application: MembershipApplication): string {
  return `
Alumniverein Hainberg-Gymnasium Göttingen e.V.

Vielen Dank für Ihren Mitgliedsantrag!

Liebe/r ${application.salutation === 'herr' ? 'Herr' : application.salutation === 'frau' ? 'Frau' : ''} ${application.lastName},

wir haben Ihren Mitgliedsantrag erfolgreich erhalten und werden uns in Kürze bei Ihnen melden.

Ihre Antragsdaten:
- Name: ${application.firstName} ${application.lastName}
- E-Mail: ${application.email}
- Antragsdatum: ${new Date().toLocaleDateString('de-DE')}
- Antrags-ID: ${application.id}

Wir prüfen Ihren Antrag und werden Ihnen eine Bestätigung per E-Mail zusenden, sobald die Bearbeitung abgeschlossen ist.

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr Alumniverein Hainberg-Gymnasium Göttingen e.V.

---
Alumniverein Hainberg-Gymnasium Göttingen e.V.
Friedländer Weg 19, 37085 Göttingen
E-Mail: info@alumniverein-hainberg.de
  `
}

// E-Mail-Template für die Verwaltung
function createAdminEmailTemplate(application: MembershipApplication): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Neuer Mitgliedsantrag</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .data-table th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Neuer Mitgliedsantrag eingegangen</h1>
        </div>
        
        <div class="content">
          <h2>Antragsdaten:</h2>
          
          <table class="data-table">
            <tr><th>Feld</th><th>Wert</th></tr>
            <tr><td>Anrede</td><td>${application.salutation}</td></tr>
            <tr><td>Vorname</td><td>${application.firstName}</td></tr>
            <tr><td>Nachname</td><td>${application.lastName}</td></tr>
            <tr><td>Adresse</td><td>${application.address}</td></tr>
            <tr><td>PLZ</td><td>${application.postalCode}</td></tr>
            <tr><td>Ort</td><td>${application.city}</td></tr>
            <tr><td>Geburtsdatum</td><td>${application.birthDate}</td></tr>
            <tr><td>Beruf</td><td>${application.occupation || 'Nicht angegeben'}</td></tr>
            <tr><td>E-Mail</td><td>${application.email}</td></tr>
            <tr><td>Schulzeit von</td><td>${application.schoolFrom || 'Nicht angegeben'}</td></tr>
            <tr><td>Schulzeit bis</td><td>${application.schoolTo || 'Nicht angegeben'}</td></tr>
            <tr><td>IBAN</td><td>${application.iban}</td></tr>
            <tr><td>BIC</td><td>${application.bic}</td></tr>
            <tr><td>Ort, Datum</td><td>${application.placeDate}</td></tr>
            <tr><td>Unterschrift</td><td>${application.signature}</td></tr>
            <tr><td>Antrags-ID</td><td>${application.id}</td></tr>
            <tr><td>Eingegangen am</td><td>${new Date().toLocaleString('de-DE')}</td></tr>
          </table>
          
          <p><strong>Nächste Schritte:</strong></p>
          <ul>
            <li>Antrag in der Datenbank prüfen</li>
            <li>Bei Bedarf weitere Informationen anfordern</li>
            <li>Antrag genehmigen oder ablehnen</li>
            <li>Bestätigungs-E-Mail an Antragsteller senden</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `
}

// Text-Version für die Verwaltung
function createAdminTextEmail(application: MembershipApplication): string {
  return `
Neuer Mitgliedsantrag eingegangen

Antragsdaten:
- Anrede: ${application.salutation}
- Vorname: ${application.firstName}
- Nachname: ${application.lastName}
- Adresse: ${application.address}
- PLZ: ${application.postalCode}
- Ort: ${application.city}
- Geburtsdatum: ${application.birthDate}
- Beruf: ${application.occupation || 'Nicht angegeben'}
- E-Mail: ${application.email}
- Schulzeit von: ${application.schoolFrom || 'Nicht angegeben'}
- Schulzeit bis: ${application.schoolTo || 'Nicht angegeben'}
- IBAN: ${application.iban}
- BIC: ${application.bic}
- Ort, Datum: ${application.placeDate}
- Unterschrift: ${application.signature}
- Antrags-ID: ${application.id}
- Eingegangen am: ${new Date().toLocaleString('de-DE')}

Nächste Schritte:
- Antrag in der Datenbank prüfen
- Bei Bedarf weitere Informationen anfordern
- Antrag genehmigen oder ablehnen
- Bestätigungs-E-Mail an Antragsteller senden
  `
}
