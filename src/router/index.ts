import { createRouter, createWebHistory } from 'vue-router'
import { useHead } from '@vueuse/head'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'startseite',
      component: () => import('../pages/Startseite.vue'),
      meta: {
        title: 'HG Alumni - Startseite',
        description: 'HG Alumni Verein - Willkommen beim Alumni-Verein des Hainberg-Gymnasiums Göttingen. Verbinden Sie sich mit ehemaligen Schülern des Hainberg Gymnasiums und bleiben Sie in Kontakt.',
        keywords: ['HG Alumni', 'Hainberg Gymnasium Alumni', 'Hainberg-Gymnasium Alumni', 'HG Göttingen Alumni', 'Alumni HG', 'Alumni Hainberg', 'Hainberg Gymnasium', 'Hainberg-Gymnasium', 'HG Göttingen', 'Alumni-Verein', 'Ehemalige Schüler Hainberg', 'Göttingen Alumni']
      }
    },
    {
      path: '/termine',
      name: 'termine',
      component: () => import('../pages/Termine.vue'),
      meta: {
        title: 'Termine - HG Alumni',
        description: 'Alle Termine und Veranstaltungen des HG Alumni Vereins - Alumni-Verein des Hainberg-Gymnasiums Göttingen.',
        keywords: ['HG Alumni Termine', 'Hainberg Gymnasium Termine', 'Alumni Veranstaltungen', 'HG Events', 'Hainberg-Gymnasium Events']
      }
    },
    {
      path: '/termine/:id',
      name: 'event-detail',
      component: () => import('../pages/EventDetail.vue'),
      meta: {
        title: 'Event Details',
        description: 'Details zu einer Veranstaltung des Alumni-Vereins.'
      }
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../pages/News.vue'),
      meta: {
        title: 'News - HG Alumni',
        description: 'Aktuelle Neuigkeiten und Berichte vom HG Alumni Verein - Alumni-Verein des Hainberg-Gymnasiums Göttingen.',
        keywords: ['HG Alumni News', 'Hainberg Gymnasium News', 'Alumni Neuigkeiten', 'HG Berichte', 'Hainberg-Gymnasium Aktuelles']
      }
    },
    {
      path: '/news/:slug',
      name: 'news-detail',
      component: () => import('../pages/NewsDetail.vue'),
      meta: {
        title: 'Artikel',
        description: 'Artikel vom Alumni-Verein des Hainberg-Gymnasiums.'
      }
    },
    {
      path: '/galerie',
      name: 'galerie',
      component: () => import('../pages/Galerie.vue'),
      meta: {
        title: 'Galerie - HG Alumni',
        description: 'Bildergalerie des HG Alumni Vereins - Alumni-Verein des Hainberg-Gymnasiums Göttingen.',
        keywords: ['HG Alumni Galerie', 'Hainberg Gymnasium Galerie', 'Alumni Bilder', 'HG Fotos', 'Hainberg-Gymnasium Galerie']
      }
    },
    {
      path: '/jahrgaenge',
      name: 'jahrgaenge',
      component: () => import('../pages/Jahrgaenge.vue'),
      meta: {
        title: 'Jahrgaenge - HG Alumni',
        description: 'Jahrgaenge des HG Alumni Vereins - Alumni-Verein des Hainberg-Gymnasiums Göttingen.',
        keywords: ['HG Alumni Jahrgaenge', 'Hainberg Gymnasium Jahrgaenge', 'Alumni Jahrgaenge', 'HG Jahrgaenge', 'Hainberg-Gymnasium Jahrgaenge']
      }
    },
    {
      path: '/mitglied-werden',
      name: 'mitglied-werden',
      component: () => import('../pages/MitgliedWerden.vue'),
      meta: {
        title: 'Mitglied werden - HG Alumni',
        description: 'Werden Sie Mitglied im HG Alumni Verein - Alumni-Verein des Hainberg-Gymnasiums Göttingen und unterstützen Sie die Gemeinschaft ehemaliger Schüler.',
        keywords: ['HG Alumni Mitglied werden', 'Hainberg Gymnasium Mitgliedschaft', 'Alumni Beitritt', 'HG Mitglied werden', 'Hainberg-Gymnasium Mitgliedschaft']
      }
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: () => import('../pages/Impressum.vue'),
      meta: {
        title: 'Impressum',
        description: 'Impressum des Alumni-Vereins des Hainberg-Gymnasiums Göttingen.',
        robots: 'noindex, follow'
      }
    },
    {
      path: '/satzung',
      name: 'satzung',
      component: () => import('../pages/Satzung.vue'),
      meta: {
        title: 'Satzung',
        description: 'Satzung des Alumni-Vereins des Hainberg-Gymnasiums Göttingen e.V.'
      }
    },
    {
      path: '/datenschutz',
      name: 'datenschutz',
      component: () => import('../pages/Datenschutz.vue'),
      meta: {
        title: 'Datenschutzerklärung',
        description: 'Datenschutzerklärung des Alumni-Vereins des Hainberg-Gymnasiums Göttingen.',
        robots: 'noindex, follow'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/Login.vue'),
      meta: {
        title: 'Login',
        description: 'Anmelden beim Alumni-Verein des Hainberg-Gymnasiums.',
        robots: 'noindex, nofollow'
      }
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../pages/Profil.vue'),
      meta: {
        title: 'Mein Profil',
        description: 'Ihr Profil beim Alumni-Verein des Hainberg-Gymnasiums.',
        requiresAuth: true,
        robots: 'noindex, nofollow'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
      meta: {
        title: 'Seite nicht gefunden',
        description: 'Die angeforderte Seite konnte nicht gefunden werden.',
        robots: 'noindex, nofollow'
      }
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// SEO Meta-Tags setzen basierend auf Route-Meta
router.beforeEach((to) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://alumni-hg.de'
  const baseTitle = 'HG Alumni - Alumni-Verein des Hainberg-Gymnasiums Göttingen'
  const title = to.meta.title 
    ? (to.meta.title as string).includes('HG Alumni') || (to.meta.title as string).includes('Hainberg')
      ? to.meta.title as string
      : `${to.meta.title} | ${baseTitle}`
    : baseTitle
  const description = (to.meta.description as string) || 
    'HG Alumni Verein - Alumni-Verein des Hainberg-Gymnasiums Göttingen e.V. Verbinden Sie sich mit ehemaligen Schülern des Hainberg Gymnasiums und bleiben Sie in Kontakt.'
  const keywords = (to.meta.keywords as string[]) || 
    ['HG Alumni', 'Hainberg Gymnasium Alumni', 'Hainberg-Gymnasium Alumni', 'HG Göttingen Alumni', 'Alumni HG', 'Alumni Hainberg', 'Hainberg Gymnasium', 'Hainberg-Gymnasium', 'HG Göttingen', 'Alumni-Verein', 'Ehemalige Schüler Hainberg', 'Göttingen Alumni']
  const image = `${siteUrl}/images/hglogo.png`
  const url = `${siteUrl}${to.path}`
  const type = to.name === 'news-detail' ? 'article' : 'website'
  
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: baseTitle },
      { property: 'og:locale', content: 'de_DE' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      ...(to.meta.robots ? [{ name: 'robots', content: to.meta.robots as string }] : [])
    ],
    link: [
      { rel: 'canonical', href: url }
    ]
  })
})

export default router
