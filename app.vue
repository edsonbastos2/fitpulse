<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UiToast />
</template>

<script setup lang="ts">
// PWA Install prompt
const deferredPrompt = ref<Event | null>(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

provide('deferredPrompt', deferredPrompt)
</script>
