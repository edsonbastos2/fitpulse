<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
          @click="handleBackdropClick"
        />

        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            :class="sizeClasses"
            class="relative bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="px-6 py-4 border-b border-dark-700">
              <slot name="header">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 v-if="title" class="text-xl font-bold text-white">{{ title }}</h2>
                    <p v-if="subtitle" class="text-sm text-slate-400 mt-1">{{ subtitle }}</p>
                  </div>
                  <button
                    v-if="closable"
                    class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                    @click="close"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </slot>
            </div>

            <!-- Body -->
            <div :class="bodyPadding ? 'p-6' : ''">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-dark-700 bg-dark-800/50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  bodyPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
  bodyPadding: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-full max-w-sm'
    case 'md':
      return 'w-full max-w-lg'
    case 'lg':
      return 'w-full max-w-2xl'
    case 'xl':
      return 'w-full max-w-4xl'
    case 'full':
      return 'w-full max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]'
    default:
      return 'w-full max-w-lg'
  }
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Handle escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue && props.closeOnEscape) {
      close()
    }
  }
  window.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})

// Lock body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>
