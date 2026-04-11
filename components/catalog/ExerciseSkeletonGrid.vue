<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
    aria-label="Carregando exercícios"
    aria-busy="true"
  >
    <div
      v-for="i in count"
      :key="i"
      class="skeleton rounded-xl h-48"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 6,
})
</script>
