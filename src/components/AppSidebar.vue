<template>
  <aside 
    class="sidebar"
    :class="{ 'sidebar--open': isOpen }"
  >
    <!-- Logo und Titel -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <div class="logo-circle">
          <span class="logo-text">HG</span>
        </div>
        <div class="sidebar__title">
          <h2>Alumni-Verein</h2>
          <p>Hainberg-Gymnasium</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <ul class="nav-list">
        <li 
          v-for="item in visibleNavigationItems" 
          :key="item.id"
          class="nav-item"
        >
          <router-link 
            :to="item.route"
            class="nav-link"
            :class="{ 'nav-link--active': $route.name === item.id }"
            @click="$emit('close')"
          >
            <span class="nav-icon" v-html="item.icon"></span>
            <span class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>

      <!-- Login Button (getrennt) -->
      <div v-if="!authStore.isAuthenticated" class="login-section">
        <div class="login-divider"></div>
        <router-link 
          to="/login"
          class="login-link"
          :class="{ 'login-link--active': $route.name === 'login' }"
          @click="$emit('close')"
        >
          <span class="login-icon" v-html="loginItem.icon"></span>
          <span class="login-label">{{ loginItem.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- User Info / Login -->
    <div v-if="authStore.isAuthenticated" class="sidebar__user">
      <router-link 
        to="/profil" 
        class="user-info user-info--clickable"
        @click="$emit('close')"
        title="Profil anzeigen"
      >
        <div class="user-avatar">
          <span class="avatar-text">{{ getUserInitials() }}</span>
        </div>
        <div class="user-details">
          <p class="user-name">Dein Profil</p>
          <p class="user-email">{{ authStore.user?.displayName }}</p>
        </div>
        <svg class="profile-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </router-link>
      <button @click="handleLogout" class="logout-btn" title="Abmelden">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
      </button>
    </div>

    <!-- Footer -->
    <div class="sidebar__footer">
      <p class="footer-text">© 2024 HG Alumni</p>
      <p class="footer-text">{{ version }}</p>
    </div>
  </aside>

  <!-- Overlay für mobile -->
  <div 
    v-if="isOpen" 
    class="sidebar-overlay"
    @click="$emit('close')"
  >
    <!-- Mobile Navigation im Overlay -->
    <div class="mobile-nav-overlay" @click.stop>
      <div class="mobile-nav-header">
        <div class="mobile-logo">
          <div class="logo-circle">
            <span class="logo-text">HG</span>
          </div>
          <span class="mobile-title">Alumni-Verein</span>
        </div>
        <TomButton 
        @click="closeSidebar"
        title="Menü schließen"
        icon="close"
        variant="action"
        />
      </div>
      
      <nav class="mobile-nav">
        <ul class="mobile-nav-list">
          <li 
            v-for="item in visibleNavigationItems" 
            :key="item.id"
            class="mobile-nav-item"
          >
            <router-link 
              :to="item.route"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link--active': $route.name === item.id }"
              @click="$emit('close')"
            >
              <span class="mobile-nav-icon" v-html="item.icon"></span>
              <span class="mobile-nav-label">{{ item.label }}</span>
              <svg class="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </router-link>
          </li>
        </ul>

        <!-- Mobile Login Button (getrennt) -->
        <div v-if="!authStore.isAuthenticated" class="mobile-login-section">
          <div class="mobile-login-divider"></div>
          <router-link 
            to="/login"
            class="mobile-login-link"
            :class="{ 'mobile-login-link--active': $route.name === 'login' }"
            @click="$emit('close')"
          >
            <span class="mobile-nav-icon" v-html="loginItem.icon"></span>
            <span class="mobile-nav-label">{{ loginItem.label }}</span>
            <svg class="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </router-link>
        </div>

        <!-- Mobile User Section (für angemeldete Benutzer) -->
        <div v-if="authStore.isAuthenticated" class="mobile-user-section">
          <div class="mobile-user-divider"></div>
          
          <!-- Mobile Profil Link -->
          <router-link 
            to="/profil"
            class="mobile-user-link"
            :class="{ 'mobile-user-link--active': $route.name === 'profil' }"
            @click="$emit('close')"
          >
            <div class="mobile-user-avatar">
              <span class="mobile-avatar-text">{{ getUserInitials() }}</span>
            </div>
            <div class="mobile-user-info">
              <span class="mobile-user-name">Dein Profil</span>
              <span class="mobile-user-email">{{ authStore.user?.displayName }}</span>
            </div>
            <svg class="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </router-link>

          <!-- Mobile Logout Button -->
          <button @click="handleMobileLogout" class="mobile-logout-btn">
            <svg class="mobile-logout-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span class="mobile-logout-label">Abmelden</span>
          </button>
        </div>
      </nav>
      
      <div class="mobile-nav-footer">
        <p>© 2024 HG Alumni • {{ version}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { NavigationItem } from '../lib/types'
import TomButton from '../tomponents/TomButton.vue'

interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const authStore = useAuthStore()
const version = import.meta.env.VITE_VERSION

const getUserInitials = () => {
  const user = authStore.user
  if (user?.displayName) {
    const names = user.displayName.split(' ')
    return names.map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2)
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase()
  }
  return 'U'
}

const handleLogout = async () => {
  try {
    await authStore.signOut()
    emit('close')
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const handleMobileLogout = async () => {
  try {
    await authStore.signOut()
    emit('close')
    router.push('/')
  } catch (error) {
    console.error('Mobile logout error:', error)
  }
}

const closeSidebar = () => {
  emit('close')
}



const allNavigationItems: NavigationItem[] = [
  {
    id: 'startseite',
    label: 'Startseite',
    route: '/',
    visibility: 'always',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>`
  },
  {
    id: 'termine',
    label: 'Termine',
    route: '/termine',
    visibility: 'always',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>`
  },
  {
    id: 'news',
    label: 'Neues im Verein',
    route: '/news',
    visibility: 'always',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`
  },
  {
    id: 'galerie',
    label: 'Galerie',
    route: '/galerie',
    visibility: 'always',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>`
  },
  {
    id: 'mitglied-werden',
    label: 'Mitglied werden',
    route: '/mitglied-werden',
    visibility: 'unauthenticated', 
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>`
  },
  {
    id: 'impressum',
    label: 'Impressum',
    route: '/impressum',
    visibility: 'always',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>`
  },
  {
    id: 'satzung',
    label: 'Satzung',
    route: '/satzung',
    visibility: 'always',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      <path d="M10 12h4v2h-4v-2z" opacity="0.7"/>
      <path d="M10 15h4v1h-4v-1z" opacity="0.7"/>
    </svg>`
  }
]

const loginItem = {
  id: 'login',
  label: 'Login',
  route: '/login',
  icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    <path d="M11 7h2v2h-2zm0 4h2v6h-2z" opacity="0.7"/>
  </svg>`
}

// Funktion zum Filtern der Navigation Items basierend auf Auth-Status
const shouldShowItem = (item: NavigationItem): boolean => {
  switch (item.visibility) {
    case 'always':
      return true
    case 'authenticated':
      return authStore.isAuthenticated
    case 'unauthenticated':
      return !authStore.isAuthenticated
    default:
      return true
  }
}

// Gefilterte Navigation Items
const visibleNavigationItems = computed(() => {
  return allNavigationItems.filter(shouldShowItem)
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--color-secondary);
  color: var(--color-white);
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform var(--transition-normal);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: var(--shadow-xl);
}

.sidebar--open {
  transform: translateX(0);
}

.sidebar__header {
  padding: var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-circle {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--color-white);
}

.sidebar__title h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  margin: 0;
  line-height: 1.2;
}

.sidebar__title p {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  margin-top: 2px;
}

.sidebar__nav {
  flex: 1;
  padding: var(--spacing-lg) 0;
  min-height: 200px;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.nav-item {
  margin-bottom: var(--spacing-xs);
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  margin-right: var(--spacing-lg);
  position: relative;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  transform: translateX(4px);
}

.nav-link--active {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
}

.nav-link--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-label {
  font-size: var(--font-size-base);
}

.login-section {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.login-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 var(--spacing-lg) var(--spacing-md) var(--spacing-lg);
}

.login-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  margin-right: var(--spacing-lg);
  position: relative;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.login-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.2);
}

.login-link--active {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  border-color: rgba(255, 255, 255, 0.3);
}

.login-link--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 0 2px 2px 0;
}

.login-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.login-label {
  font-size: var(--font-size-base);
}

.sidebar__user {
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-md);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.user-info--clickable {
  text-decoration: none;
  color: inherit;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
}

.user-info--clickable:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(2px);
}

.profile-arrow {
  color: rgba(255, 255, 255, 0.6);
  transition: all var(--transition-fast);
  margin-left: auto;
}

.user-info--clickable:hover .profile-arrow {
  color: rgba(255, 255, 255, 0.9);
  transform: translateX(2px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  color: var(--color-white);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-white);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 100%;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-white);
}

.sidebar__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin: 0;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  animation: fadeIn var(--transition-normal) forwards;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

/* Mobile Navigation Overlay */
.mobile-nav-overlay {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideInUp var(--transition-normal) ease-out;
  display: flex;
  flex-direction: column;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-gray-200);
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mobile-logo .logo-circle {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-logo .logo-text {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  color: var(--color-white);
}

.mobile-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
}

.mobile-close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--color-gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mobile-close-btn:hover {
  background: var(--color-gray-200);
  color: var(--color-gray-800);
}

.mobile-nav {
  flex: 1;
  padding: var(--spacing-md) 0;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  margin-bottom: var(--spacing-xs);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border-radius: var(--radius-lg);
  margin: 0 var(--spacing-md);
  position: relative;
}

.mobile-nav-link:hover {
  background-color: var(--color-gray-50);
  transform: translateX(4px);
}

.mobile-nav-link--active {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.mobile-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.mobile-nav-label {
  flex: 1;
  font-size: var(--font-size-base);
}

.mobile-nav-arrow {
  color: var(--color-gray-400);
  transition: transform var(--transition-fast);
}

.mobile-nav-link:hover .mobile-nav-arrow {
  transform: translateX(2px);
}

.mobile-login-section {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) 0;
}

.mobile-login-divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: 0 var(--spacing-md) var(--spacing-md) var(--spacing-md);
}

.mobile-login-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border-radius: var(--radius-lg);
  margin: 0 var(--spacing-md);
  position: relative;
  border: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
}

.mobile-login-link:hover {
  background-color: var(--color-gray-100);
  transform: translateX(4px);
  border-color: var(--color-gray-300);
}

.mobile-login-link--active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.mobile-nav-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
  text-align: center;
}

.mobile-nav-footer p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
}

/* Mobile User Section */
.mobile-user-section {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) 0;
}

.mobile-user-divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: 0 var(--spacing-md) var(--spacing-md) var(--spacing-md);
}

.mobile-user-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-radius: var(--radius-lg);
  margin: 0 var(--spacing-md) var(--spacing-sm) var(--spacing-md);
  position: relative;
  border: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
}

.mobile-user-link:hover {
  background-color: var(--color-gray-100);
  transform: translateX(4px);
  border-color: var(--color-gray-300);
}

.mobile-user-link--active {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.mobile-user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-avatar-text {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  color: var(--color-white);
}

.mobile-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.mobile-user-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-user-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-user-link--active .mobile-user-email {
  color: rgba(255, 255, 255, 0.8);
}

.mobile-logout-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-white);
  color: var(--color-error);
  border: 1px solid var(--color-error-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  margin: 0 var(--spacing-md);
  width: calc(100% - calc(var(--spacing-md) * 2));
}

.mobile-logout-btn:hover {
  background: var(--color-error-light);
  color: var(--color-error-dark);
  transform: translateX(4px);
  border-color: var(--color-error);
}

.mobile-logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-logout-label {
  flex: 1;
  text-align: left;
}

/* Slide-in Animation */
@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .sidebar {
    position: fixed;
    transform: translateX(0);
    height: 100vh;
    z-index: 100;
  }
  
  .sidebar--open {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    display: none;
  }
}

/* Tablet und Mobile */
@media (max-width: 1023px) {
  .sidebar {
    z-index: 1001;
    width: min(var(--sidebar-width), 80vw);
  }
  
  .sidebar-overlay {
    z-index: 1000;
  }
}

/* Sehr kleine Bildschirme */
@media (max-width: 480px) {
  .sidebar {
    width: min(var(--sidebar-width), 90vw);
  }
  
  .sidebar__header {
    padding: var(--spacing-lg);
  }
  
  .logo-circle {
    width: 40px;
    height: 40px;
  }
  
  .sidebar__title h2 {
    font-size: var(--font-size-base);
  }
  
  .sidebar__title p {
    font-size: var(--font-size-xs);
  }
  
  /* Mobile Nav Overlay Anpassungen */
  .mobile-nav-overlay {
    max-width: 95vw;
    max-height: 85vh;
    margin: var(--spacing-sm);
  }
  
  .mobile-nav-header {
    padding: var(--spacing-md);
  }
  
  .mobile-title {
    font-size: var(--font-size-base);
  }
  
  .mobile-nav-link {
    padding: var(--spacing-sm) var(--spacing-md);
    margin: 0 var(--spacing-sm);
  }
}

/* Scroll-Styling für Webkit-Browser */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
