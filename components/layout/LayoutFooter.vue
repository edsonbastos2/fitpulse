<template>
  <footer
    class="border-t border-dark-800 bg-dark-900/50 backdrop-blur-sm"
    role="contentinfo"
  >
    <!-- Desktop: Multi-column -->
    <div class="hidden sm:block container-app py-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span class="font-display font-bold text-white">FitPulse</span>
          </div>
          <p class="text-sm text-slate-500">
            Seu app de treinos com recomendações personalizadas.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Links
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/dashboard" class="text-sm text-slate-400 hover:text-white transition-colors">
                Dashboard
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/workouts" class="text-sm text-slate-400 hover:text-white transition-colors">
                Treinos
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/exercises" class="text-sm text-slate-400 hover:text-white transition-colors">
                Exercícios
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/progress" class="text-sm text-slate-400 hover:text-white transition-colors">
                Progresso
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Informações
          </h3>
          <slot name="info">
            <p class="text-sm text-slate-500">
              FitPulse &copy; {{ currentYear }} — Todos os direitos reservados.
            </p>
          </slot>
        </div>
      </div>
    </div>

    <!-- Mobile: Single line -->
    <div class="sm:hidden flex items-center justify-center py-4">
      <p class="text-xs text-slate-500">
        FitPulse &copy; {{ currentYear }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = computed(() => new Date().getFullYear())
</script>
