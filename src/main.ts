import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import './styles/style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// VueUse Head für SEO
const head = createHead()
app.use(head)

// Pinia für State Management
app.use(createPinia())

// Vue Router
app.use(router)

app.mount('#app')
