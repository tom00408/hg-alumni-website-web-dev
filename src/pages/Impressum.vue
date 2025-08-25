<template>
  <div class="impressum">
    <div class="content-container">
      <HgCard class="impressum-card">
        <h1 class="page-title">Impressum</h1>
        
        <div class="impressum-content">
          <section class="impressum-section">
            <h2>Verantwortlich für den Inhalt</h2>
            <div class="contact-info">
              <p><strong>Alumni-Verein des Hainberg-Gymnasiums e.V.</strong></p>
              <p>Musterstraße 123<br>
                 37081 Göttingen<br>
                 Deutschland
              </p>
            </div>
          </section>

          <section class="impressum-section">
            <h2>Kontakt</h2>
            <div class="contact-info">
              <p><strong>E-Mail:</strong> <a href="mailto:info@hg-alumni.de">info@hg-alumni.de</a></p>
              <p><strong>Telefon:</strong> <a href="tel:+4955112345678">+49 (0) 551 123 456 78</a></p>
              <p><strong>Website:</strong> <a href="https://hg-alumni.de">www.hg-alumni.de</a></p>
            </div>
          </section>

          <section class="impressum-section">
            <h2>Vereinsregister</h2>
            <div class="contact-info">
              <p><strong>Registergericht:</strong> Amtsgericht Göttingen</p>
              <p><strong>Registernummer:</strong> VR 12345</p>
              <p><strong>Vereinsnummer:</strong> 123456789</p>
            </div>
          </section>

          <section class="impressum-section">
            <h2>Vorstand</h2>
            <div class="contact-info">
              <p><strong>1. Vorsitzende:</strong> Dr. Maria Mustermann</p>
              <p><strong>2. Vorsitzender:</strong> Prof. Dr. Max Musterland</p>
              <p><strong>Schatzmeister:</strong> Diplom-Ing. Anna Beispiel</p>
              <p><strong>Schriftführerin:</strong> M.A. Lisa Demo</p>
            </div>
          </section>

          <section class="impressum-section">
            <h2>Haftungsausschluss</h2>
            <div class="legal-text">
              <h3>Haftung für Inhalte</h3>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>

              <h3>Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
                Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht 
                zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>

              <h3>Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte 
                Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem 
                auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. 
                Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </section>

          <section class="impressum-section">
            <h2>Datenschutz</h2>
            <div class="legal-text">
              <p>
                Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. 
                Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) 
                erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis.
              </p>
              <p>
                Weitere Informationen zum Datenschutz finden Sie in unserer 
                <router-link to="/datenschutz">Datenschutzerklärung</router-link>.
              </p>
            </div>
          </section>

          <section class="impressum-section">
            <h2>Technische Umsetzung</h2>
            <div class="contact-info">
              <p><strong>Webentwicklung:</strong> HG Alumni IT-Team</p>
              <p><strong>Hosting:</strong> [Hosting-Provider Name]</p>
              <p><strong>Framework:</strong> Vue.js mit TypeScript</p>
              <p><strong>Letzte Aktualisierung:</strong> {{ lastUpdated }}</p>
            </div>
          </section>
        </div>
      </HgCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HgCard from '../components/HgCard.vue'

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
.impressum {
  max-width: 100%;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.impressum-card {
  background-color: var(--color-white);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-gray-100);
}

.impressum-content {
  line-height: var(--line-height-relaxed);
}

.impressum-section {
  margin-bottom: var(--spacing-2xl);
}

.impressum-section:last-child {
  margin-bottom: 0;
}

.impressum-section h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-gray-200);
}

.impressum-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: var(--spacing-lg) 0 var(--spacing-md) 0;
}

.contact-info p {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.contact-info strong {
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
}

.contact-info a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-info a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.legal-text {
  color: var(--color-text);
}

.legal-text p {
  margin-bottom: var(--spacing-md);
  text-align: justify;
}

.legal-text p:last-child {
  margin-bottom: 0;
}

.legal-text a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.legal-text a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .impressum-section h2 {
    font-size: var(--font-size-lg);
  }
  
  .impressum-section h3 {
    font-size: var(--font-size-base);
  }
  
  .legal-text p {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }
  
  .impressum-section {
    margin-bottom: var(--spacing-xl);
  }
}

/* Print Styles */
@media print {
  .impressum {
    background: white;
  }
  
  .impressum-card {
    box-shadow: none;
    border: none;
  }
  
  .contact-info a {
    color: var(--color-text);
    text-decoration: underline;
  }
  
  .legal-text a {
    color: var(--color-text);
  }
}
</style>
