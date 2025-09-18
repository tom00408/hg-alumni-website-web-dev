<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import DefaultLayout from './layouts/DefaultLayout.vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Auth Store initialisieren
  await authStore.initialize()
})
</script>

<template>
  <DefaultLayout />
</template>
