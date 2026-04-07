<template>
  <LayoutAppLayout>
    <slot />
  </LayoutAppLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>
