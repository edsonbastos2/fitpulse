<template>
  <div class="min-h-screen bg-dark-900">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"></div>
      </div>

      <!-- Nav -->
      <nav class="relative z-10 container-app py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span class="font-display font-bold text-xl text-white">FitPulse</span>
          </div>

          <div class="flex items-center gap-4">
            <NuxtLink to="/auth/login" class="btn-ghost px-6">
              Entrar
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary px-6">
              Começar Grátis
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative z-10 container-app py-20 lg:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clip-rule="evenodd"/>
            </svg>
            <span>100% Gratuito para começar</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Treinos <span class="text-gradient">Personalizados</span> para o Seu Objetivo
          </h1>

          <p class="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-100">
            Nossa IA analisa seu perfil, objetivos e histórico para criar planos de treino que realmente funcionam. Sem clichês, só resultados.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
            <NuxtLink to="/auth/register" class="btn-primary px-8 py-4 text-lg shadow-glow hover:shadow-glow-lg">
              <span>Começar Agora</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="#features" class="btn-ghost px-8 py-4 text-lg">
              Saiba Mais
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-dark-700 animate-fade-in-up animation-delay-300">
            <div>
              <p class="text-3xl sm:text-4xl font-bold text-white">10k+</p>
              <p class="text-slate-400 text-sm mt-1">Usuários Ativos</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-bold text-white">500+</p>
              <p class="text-slate-400 text-sm mt-1">Exercícios</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-bold text-white">98%</p>
              <p class="text-slate-400 text-sm mt-1">Satisfação</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 lg:py-32 relative">
      <div class="container-app">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Tudo que você precisa para <span class="text-gradient">treinar melhor</span>
          </h2>
          <p class="text-slate-400 text-lg max-w-2xl mx-auto">
            Ferramentas profissionais de treino, simplificadas para você.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="card card-hover p-8 group">
            <div class="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">IA Personalizada</h3>
            <p class="text-slate-400">
              Nossa inteligência artificial analisa seu perfil e cria treinos sob medida para seus objetivos únicos.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card card-hover p-8 group">
            <div class="w-14 h-14 rounded-2xl bg-gradient-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Acompanhamento Total</h3>
            <p class="text-slate-400">
              Gráficos detalhados, métricas de evolução e streak de motivação para você nunca parar.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card card-hover p-8 group">
            <div class="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">100% Mobile</h3>
            <p class="text-slate-400">
              PWA instalável no celular. Treine em qualquer lugar, mesmo offline, sem precisar de internet.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card card-hover p-8 group">
            <div class="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Banco de Exercícios</h3>
            <p class="text-slate-400">
              Centenas de exercícios com vídeos, instruções detalhadas e músculos envolvidos.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card card-hover p-8 group">
            <div class="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Agenda Inteligente</h3>
            <p class="text-slate-400">
              Programe seus treinos e receba lembretes no momento certo para não perder nenhuma sessão.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card card-hover p-8 group">
            <div class="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Comunidade</h3>
            <p class="text-slate-400">
              Conecte-se com outros atletas, compartilhe progresso e motivem-se mutuamente.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 lg:py-32 relative">
      <div class="container-app">
        <div class="card-gradient rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden">
          <!-- Background Effects -->
          <div class="absolute inset-0 opacity-30">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-mesh animate-gradient"></div>
          </div>

          <div class="relative z-10">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Pronto para transformar seu treino?
            </h2>
            <p class="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Junte-se a milhares de pessoas que já estão treinando de forma mais inteligente com o FitPulse.
            </p>
            <NuxtLink to="/auth/register" class="btn-secondary px-10 py-5 text-lg shadow-glow-secondary">
              Criar Conta Grátis
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-dark-800">
      <div class="container-app">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span class="font-display font-bold text-white">FitPulse</span>
          </div>

          <p class="text-slate-500 text-sm">
            © 2024 FitPulse. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
