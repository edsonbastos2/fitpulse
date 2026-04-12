# Tech Spec - Melhorias de Responsividade na Tela de Exercícios

## Resumo Executivo

A melhoria de responsividade será implementada através de 4 mudanças principais: (1) novo componente `ExerciseFilterChips` para filtros horizontais no mobile, (2) componente `ExerciseCardCompact` com layout horizontal, (3) atualização do `ExerciseGrid` para grid de 2 colunas no mobile, e (4) reposicionamento da `ExerciseSearchBar`. A abordagem mantém backward compatibility com desktop, usando breakpoints Tailwind (`lg:`) para alternar entre layouts. Não há mudanças na lógica de filtros/composable `useExercises` — apenas adaptações de UI.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Status | Responsabilidade |
|------------|--------|-----------------|
| `ExerciseFilterChips` | **Novo** | Exibe filtros ativos como chips horizontais + botão para abrir drawer de filtros |
| `ExerciseCardCompact` | **Novo** | Card horizontal compacto com thumbnail/ícone à esquerda e conteúdo à direita |
| `ExerciseFilters` | **Modificado** | Integra `ExerciseFilterChips` no mobile, mantém sidebar no desktop |
| `ExerciseGrid` | **Modificado** | Muda grid de `1 col sm:2 lg:3` para `2 col lg:3 xl:4` |
| `ExerciseSearchBar` | **Modificado** | Reposiciona para row acima dos chips, ajusta largura responsiva |
| `ExerciseSortSelect` | **Modificado** | Compacta para shared row com search no desktop |
| `pages/exercises/index.vue` | **Modificado** | Reorganiza layout: search → chips → grid |

### Fluxo de Dados

```
User Action → ExerciseFilterChips → emit('update:filters') → filters ref → URL sync
                                                                    ↓
                                                          fetchExercisesPaginated()
                                                                    ↓
                                                          ExerciseGrid → ExerciseCardCompact
```

## Design de Implementação

### Componentes Novos

#### ExerciseFilterChips.vue

Responsável por renderizar filtros ativos como chips removíveis e botão para abrir filtros completos.

```typescript
interface FilterChip {
  key: keyof ExerciseFilters
  label: string
  value: string
}

interface Props {
  filters: ExerciseFilters
  muscleGroupMap: Record<string, string>
  equipmentMap: Record<string, string>
  mobileOpen: boolean
}

interface Emits {
  'update:filters': [filters: ExerciseFilters]
  'update:mobileOpen': [open: boolean]
  'clear': []
}
```

**Estrutura HTML:**
```html
<div class="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
  <!-- Botão Filtros -->
  <button @click="$emit('update:mobileOpen', true)">
    <FunnelIcon /> Filtros
  </button>
  
  <!-- Chips ativos -->
  <button v-for="chip in activeChips" :key="chip.key" @click="removeFilter(chip.key)">
    {{ chip.label }}
    <XMarkIcon />
  </button>
</div>
```

#### ExerciseCardCompact.vue

Card horizontal com proporção fixa, otimizado para grid de 2 colunas.

```typescript
interface Props {
  exercise: Exercise
  muscleGroupNames: string[]
  equipmentName: string | undefined
}
```

**Estrutura HTML:**
```html
<NuxtLink :to="`/exercises/${exercise.id}`">
  <div class="flex items-center gap-3 h-24">
    <!-- Thumbnail/Icon -->
    <div class="w-16 h-16 rounded-lg flex-shrink-0">
      <!-- Ícone de músculo ou placeholder -->
    </div>
    
    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-semibold line-clamp-2">{{ exercise.name_pt }}</h3>
      <div class="flex flex-wrap gap-1 mt-1">
        <UiBadge>{{ difficulty }}</UiBadge>
        <UiBadge v-for="muscle in muscles.slice(0, 1)">{{ muscle }}</UiBadge>
      </div>
    </div>
  </div>
</NuxtLink>
```

### Modelos de Dados

**Sem mudanças nos tipos.** Reutiliza `ExerciseFilters`, `Exercise`, `MuscleGroup`, `Equipment` de `~/types`.

### Breakpoints

| Breakpoint | Tailwind | Colunas | Layout Filtros |
|------------|----------|---------|----------------|
| Mobile | <640px | 2 | Chips horizontais |
| Tablet | 640-1023px | 2 | Chips horizontais |
| Desktop | ≥1024px | 3 | Sidebar lateral |
| Desktop XL | ≥1280px | 4 | Sidebar lateral |

## Pontos de Integração

- **Nenhuma integração externa.** Todos os componentes são internos.
- **useExercises composable:** Nenhuma mudança necessária — lógica de filtros permanece inalterada.
- **URL sync:** Nenhuma mudança — `watch(route.query)` continua funcionando com os mesmos params.

## Abordagem de Testes

### Testes de Unidade

| Componente | Cenários |
|------------|----------|
| `ExerciseFilterChips` | Renderiza chips corretamente; Remove chip ao clicar; Abre drawer ao clicar em "Filtros"; Oculta no desktop |
| `ExerciseCardCompact` | Renderiza nome truncado; Exibe badges corretamente; Link navega para detalhes; Ícone de dificuldade correto |
| `ExerciseGrid` | Grid de 2 colunas no mobile; Grid de 3 colunas no desktop; Renderiza cards com props corretos |

### Testes de Integração

- **Filtro → Grid:** Selecionar filtro no drawer atualiza chips e grid
- **Busca → Grid:** Digitar na search atualiza grid com debounce
- **URL Sync:** Compartilhar URL com filtros preserva estado ao recarregar

### Testes de E2E (Playwright)

1. **Mobile responsive:** Acessar `/exercises` em viewport 375x812 (iPhone 14) → verificar 2 colunas
2. **Filter chips:** Tocar em chip de filtro → verificar remoção do chip e atualização do grid
3. **Desktop sidebar:** Acessar em viewport 1440x900 → verificar sidebar lateral visível
4. **Search + Filter:** Buscar "supino" + filtrar por "Peito" → verificar resultados

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **ExerciseCardCompact** — componente isolado, sem dependências, fácil de testar visualmente
2. **ExerciseFilterChips** — depende apenas de `ExerciseFilterContent` existente, pode ser desenvolvido em paralelo
3. **ExerciseGrid** — integração do `ExerciseCardCompact`, muda apenas classes de grid
4. **pages/exercises/index.vue** — integração final: reorganiza search, chips, grid
5. **Testes E2E + Responsividade** — validação em múltiplos breakpoints

### Dependências Técnicas

- **Nenhuma dependência externa.** Todas as classes Tailwind já estão configuradas.
- **Ícones:** `@heroicons/vue` já instalado (`FunnelIcon`, `XMarkIcon`, `MagnifyingGlassIcon`).

## Monitoramento e Observabilidade

- **Sem métricas novas** — monitoramento via Lighthouse CI existente
- **Logs:** Manter `console.error` existentes para erros de fetch
- **Analytics futuro:** Pode adicionar eventos de tracking nos chips de filtro (fora de escopo)

## Considerações Técnicas

### Decisões Principais

| Decisão | Justificativa | Alternativa Rejeitada |
|---------|--------------|----------------------|
| Card horizontal ao invés de vertical | Permite 2 colunas no mobile sem comprometer legibilidade | Cards verticais menores (texto ficaria ilegível) |
| Chips horizontais com scroll | Padrão mobile nativo (Hevy, Strava), não esconde filtros | Bottom sheet apenas (filtros ativos invisíveis) |
| Manter sidebar no desktop | Usuários desktop preferem filtros sempre visíveis | Chips em desktop também (desperdício de espaço) |
| Grid 2 colunas no mobile | Dobra densidade sem comprometer touch targets | 1 coluna (atual, scroll excessivo) |

### Riscos Conhecidos

| Risco | Mitigação |
|-------|-----------|
| Texto truncado em cards pequenos | Usar `line-clamp-2` e `min-w-0` para truncamento correto |
| Chips overflow em telas muito pequenas | `overflow-x-auto` + `hide-scrollbar` para scroll horizontal |
| Regressão no desktop | Testes visuais em viewport 1440px+ a cada mudança |
| Acessibilidade de chips | `aria-label` em cada chip, `role="button"`, suporte a Enter/Space |

### Conformidade com Skills Padrões

- **ui-ux-pro-max:** Aplicar guidelines de touch targets (44x44px), contraste WCAG AA, tipografia legível em mobile
- **web-design-guidelines:** Revisar UI final para compliance com acessibilidade e responsividade
- **frontend-design:** Design system consistente com tokens Tailwind existentes

### Arquivos Relevantes e Dependentes

| Arquivo | Tipo | Ação |
|---------|------|------|
| `components/catalog/ExerciseFilterChips.vue` | Novo | Criar |
| `components/ui/ExerciseCardCompact.vue` | Novo | Criar |
| `components/catalog/ExerciseFilters.vue` | Existente | Modificar (integrar chips) |
| `components/catalog/ExerciseGrid.vue` | Existente | Modificar (grid classes) |
| `components/catalog/ExerciseSearchBar.vue` | Existente | Modificar (position/size) |
| `components/catalog/ExerciseSortSelect.vue` | Existente | Modificar (compact) |
| `pages/exercises/index.vue` | Existente | Modificar (layout restructure) |
| `assets/css/tailwind.css` | Existente | Adicionar `.hide-scrollbar` se não existir |
| `types/index.ts` | Existente | Nenhuma mudança |
