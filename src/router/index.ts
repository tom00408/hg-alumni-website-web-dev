import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'startseite',
      component: () => import('../pages/Startseite.vue'),
      meta: {
        title: 'Startseite'
      }
    },
    {
      path: '/termine',
      name: 'termine',
      component: () => import('../pages/Termine.vue'),
      meta: {
        title: 'Termine'
      }
    },
    {
      path: '/termine/:id',
      name: 'event-detail',
      component: () => import('../pages/EventDetail.vue'),
      meta: {
        title: 'Event Details'
      }
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../pages/News.vue'),
      meta: {
        title: 'Neues im Verein'
      }
    },
    {
      path: '/news/:slug',
      name: 'news-detail',
      component: () => import('../pages/NewsDetail.vue'),
      meta: {
        title: 'Artikel'
      }
    },
    {
      path: '/galerie',
      name: 'galerie',
      component: () => import('../pages/Galerie.vue'),
      meta: {
        title: 'Galerie'
      }
    },
    {
      path: '/mitglied-werden',
      name: 'mitglied-werden',
      component: () => import('../pages/MitgliedWerden.vue'),
      meta: {
        title: 'Mitglied werden'
      }
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: () => import('../pages/Impressum.vue'),
      meta: {
        title: 'Impressum'
      }
    },
    {
      path: '/satzung',
      name: 'satzung',
      component: () => import('../pages/Satzung.vue'),
      meta: {
        title: 'Satzung'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
      meta: {
        title: 'Seite nicht gefunden'
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

// Meta-Title setzen
router.beforeEach((to) => {
  const baseTitle = 'Alumni-Verein des Hainberg-Gymnasiums'
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
})

export default router
