<template>
  <div
    class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-4"
    aria-label="Carregando exercícios"
    aria-busy="true"
  >
    <div
      v-for="i in count"
      :key="i"
      class="skeleton rounded-xl h-24"
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
