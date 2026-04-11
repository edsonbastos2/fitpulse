# Especificação Técnica — Catálogo de Exercícios

## Resumo Executivo

O módulo Catálogo de Exercícios adiciona uma interface de navegação, busca e filtragem aos exercícios já existentes no banco de dados do FitPulse. A abordagem consiste em estender o composable `useExercises` com suporte a paginação e filtros combináveis, criar uma página de listagem (`/exercises`) com layout de sidebar + grid responsivo, e uma página de detalhes (`/exercises/:id`) com informações completas do exercício. Todas as decisões priorizam reutilização de componentes e composables existentes, mantendo consistência com o design system (tema escuro, glassmorphism, Tailwind CSS).

---

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Componentes novos (pasta `components/catalog/`):**

| Componente | Responsabilidade |
|---|---|
| `ExerciseSearchBar.vue` | Input de busca com ícone, debounce e sincronização com query params |
| `ExerciseFilters.vue` | Painel de filtros (dificuldade, músculo, equipamento, tipo) — sidebar desktop / drawer mobile |
| `ExerciseSortSelect.vue` | Dropdown de ordenação (nome A-Z/Z-A, dificuldade) |
| `ExerciseGrid.vue` | Grid responsivo (1/2/3 colunas) que renderiza `ExerciseCard` |
| `ExercisePagination.vue` | Botão "Carregar Mais" + contador total |
| `ExerciseEmptyState.vue` | Estado vazio com sugestões quando busca/filtros não retornam resultados |
| `ExerciseSkeletonGrid.vue` | Skeletons de carregamento usando a classe `skeleton` do design system |
| `ExerciseDetailHeader.vue` | Título, badges e botão voltar na página de detalhes |
| `ExerciseDetailMedia.vue` | Área de imagem/vídeo com fallback para ícone quando vazio |
| `ExerciseMuscleMap.vue` | Badges visuais de músculos primários (preenchidos) e secundários (outline) |
| `ExerciseInstructions.vue` | Lista numerada de instruções em pt-BR |
| `ExerciseMeta.vue` | Cards de metadados (equipamento, calorias, dificuldade) |
| `ExerciseRelatedList.vue` | Scroll horizontal de exercícios relacionados |

**Componentes modificados:**

| Componente | Modificação |
|---|---|
| `components/ui/ExerciseCard.vue` | Adicionar props para `primaryMuscles`, `equipmentObj`, `isCompound`, `isCardio`; envolver com `NuxtLink` para navegação |
| `composables/useExercises.ts` | Adicionar paginação, contagem total, filtros combináveis, fetch de relacionados |
| `types/index.ts` | Adicionar interfaces `ExerciseFilters` e `ExerciseQueryParams` |

**Relacionamentos:**
- `pages/exercises/index.vue` orquestra `ExerciseSearchBar`, `ExerciseFilters`, `ExerciseSortSelect`, `ExerciseGrid` e `ExercisePagination`
- `ExerciseGrid` renderiza múltiplos `ExerciseCard` (estendido)
- `ExerciseCard` usa `UiBadge`, `UiCard` (existentes)
- `pages/exercises/[id].vue` orquestra os componentes `ExerciseDetail*`
- Todos consomem `useExercises` (estendido) e `useToast` (existente) para feedback de erro

**Fluxo de dados:**
1. Query params da URL → filtros (watcher)
2. Filtros → `fetchExercisesPaginated()` no composable
3. Composable → query Supabase com filtros AND + paginação
4. Resultado → `exercises` (ref) + `totalExercises` (ref)
5. Grid renderiza cards → click navega para `/exercises/:id`

---

## Design de Implementação

### Interfaces Principais

```typescript
// Parâmetros de busca do catálogo
export interface ExerciseFilters {
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  muscleGroup?: string     // UUID do muscle_groups
  equipment?: string       // UUID do equipment
  type?: 'compound' | 'isolation' | 'cardio'
  sort?: 'name-asc' | 'name-desc' | 'difficulty-asc'
  page?: number
}

// Extensão do composable useExercises
export type UseExercisesReturn = {
  exercises: Ref<Exercise[]>
  muscleGroups: Ref<MuscleGroup[]>
  equipment: Ref<Equipment[]>
  totalExercises: Ref<number>
  currentPage: Ref<number>
  perPage: number
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchExercises: (filters?) => Promise<any>            // existente
  fetchExercise: (id: string) => Promise<Exercise | null>
  fetchExerciseById: (id: string) => Promise<Exercise | null>
  fetchExercisesPaginated: (params: ExerciseFilters) => Promise<void>
  fetchRelatedExercises: (exerciseId: string, options: {
    muscleGroup?: string
    equipment?: string
    limit?: number
  }) => Promise<Exercise[]>
  fetchMuscleGroups: () => Promise<any>                  // existente
  fetchEquipment: () => Promise<any>                     // existente
}
```

### Modelos de Dados

**Sem alterações no schema do banco.** Todas as tabelas (`exercises`, `muscle_groups`, `equipment`) já existem e estão populadas.

**Tipos novos em `types/index.ts`:**

```typescript
export interface ExerciseFilters {
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  muscleGroup?: string
  equipment?: string
  type?: 'compound' | 'isolation' | 'cardio'
  sort?: 'name-asc' | 'name-desc' | 'difficulty-asc'
  page?: number
}

export type ExerciseQueryParams = Partial<Record<keyof ExerciseFilters, string>>
```

**Props estendidos do `ExerciseCard`:**

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `exercise` | `Exercise` | (obrigatório) | Objeto completo do exercício |
| `muscleGroupNames` | `string[]` | `[]` | Nomes pt dos músculos primários (para exibição) |
| `equipmentName` | `string \| undefined` | `undefined` | Nome pt do equipamento |

> **Decisão:** em vez de múltiplas props soltas, passar o objeto `Exercise` completo + nomes resolvidos de músculos e equipamento. Isso simplifica a API do componente e evita resolução duplicada.

### Rotas

| Rota | Componente | Auth | Descrição |
|------|-----------|------|-----------|
| `/exercises` | `pages/exercises/index.vue` | Parcialmente protegida (excluída do redirect no middleware) | Listagem com busca e filtros |
| `/exercises/:id` | `pages/exercises/[id].vue` | Parcialmente protegida | Detalhes do exercício |

### Query Params

```
/exercises?search=supino&difficulty=medium&muscle=<UUID>&equipment=<UUID>&type=compound&sort=name-asc&page=1
```

Sincronização bidirecional via `watch` entre `route.query` e o estado de filtros, com debounce de 300ms na busca textual (`useDebounceFn` do VueUse).

---

## Pontos de Integração

### Supabase (existente)

- **Tabela `exercises`**: sem RLS habilitado — leitura pública já funciona
- **Tabela `muscle_groups`**: usada para popular selects de filtro
- **Tabela `equipment`**: usada para popular selects de filtro
- **Cliente**: `useSupabaseClient()` do `@nuxtjs/supabase` (já configurado)

### Tratamento de erros

- Erros de fetch → `useToast.error()` com mensagem genérica
- Exercício não encontrado na página de detalhes → redirect para `/exercises` com toast informativo
- Campo `instructions_pt` vazio → fallback para `instructions` (inglês)

---

## Abordagem de Testes

### Testes Manuais

O projeto não possui Vitest ou Playwright configurado. A validação seguirá o padrão existente de testes manuais documentados:

| Cenário | Como Validar |
|---------|-------------|
| Listagem carrega sem autenticação | Acessar `/exercises` em aba anônima |
| Busca textual funciona | Digitar "supino" → card do Supino Reto aparece |
| Filtros combináveis | Aplicar dificuldade=média + tipo=composto → resultados corretos |
| Ordenação | Trocar para nome Z-A → ordem alfabética reversa |
| Paginação "Carregar Mais" | Clicar → 12 novos itens; total atualizado |
| Filtros na URL | Copiar URL com params → abrir em nova aba → mesmo estado |
| Card navega para detalhes | Clicar em card → `/exercises/:id` abre |
| Detalhes exibem instruções pt-BR | Acessar `/exercises/:id` → instruções em português visíveis |
| Músculos primários vs secundários | Primários com badge sólido, secundários com outline |
| Exercícios relacionados | Seção "Relacionados" exibe 3-4 exercícios |
| Empty state | Buscar "xyz" → mensagem amigável |
| Skeletons | Limpar cache → recarregar → skeletons visíveis antes dos cards |
| Responsividade | Redimensionar: 1 col (mobile), 2 (tablet), 3 (desktop) |
| Filtros mobile | Botão de filtro abre drawer/bottom sheet com glassmorphism |
| Acessibilidade | Inputs com labels, Tab navegação funcional, Lighthouse a11y ≥ 90 |

---

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Tipos e composable** (`types/index.ts` + `composables/useExercises.ts`) — fundação necessária para todo o resto
2. **ExerciseCard estendido** (`components/ui/ExerciseCard.vue`) — componente base usado pelo grid
3. **Componentes de listagem** (`components/catalog/`) — SearchBar, Filters, SortSelect, Grid, Pagination, EmptyState, SkeletonGrid
4. **Página de listagem** (`pages/exercises/index.vue`) — orquestração de todos os componentes + sync URL
5. **Componentes de detalhes** (`components/catalog/ExerciseDetail*`) — Header, Media, MuscleMap, Instructions, Meta, RelatedList
6. **Página de detalhes** (`pages/exercises/[id].vue`) — fetch por ID + composição dos componentes
7. **Polimento** — animações, responsividade, estados de erro, acessibilidade

### Dependências Técnicas

| Dependência | Status | Observação |
|---|---|---|
| `@nuxtjs/supabase` | ✅ Instalado | Queries paginadas via `.range()` + `.select('*', { count: 'exact' })` |
| `@vueuse/core` | ✅ Instalado | `useDebounceFn` para busca |
| `@heroicons/vue` | ✅ Instalado | Ícones fallback para mídia e músculos |
| Componentes UI existentes | ✅ | `UiCard`, `UiBadge`, `UiButton`, `UiInput`, `UiSelect` |
| `useToast` | ✅ Instalado | Feedback de erro |
| Design system | ✅ | Classes `card`, `skeleton`, `glass`, `badge`, gradientes |
| `middleware/auth.ts` | ✅ | `/exercises` já excluído do redirect de auth |

**Nenhuma dependência bloqueante.**

---

## Monitoramento e Observabilidade

O projeto não possui infraestrutura de monitoramento (Prometheus/Grafana). Para este módulo:

- **Erros de fetch**: logados via `console.error` + toast visível ao usuário
- **Queries vazias**: podem ser rastreadas futuramente via analytics de página (ex: Plausible, Google Analytics)
- **Performance percebida**: skeletons + debounce já dão feedback visual adequado

---

## Considerações Técnicas

### Decisões Principais

| Decisão | Justificativa | Alternativas Rejeitadas |
|---|---|---|
| **Paginação "Carregar Mais" em vez de numérica** | Simplicidade de implementação e UX mais fluida em mobile | Paginação numérica tradicional (mais complexa, menos mobile-friendly) |
| **Rota dedicada para detalhes** (`/exercises/:id`) | Permite bookmarking, compartilhamento de URL e melhor SEO | Modal inline (perde URL, pior para deep linking) |
| **Passar `Exercise` completo como prop no card** | API mais limpa, evita resolução duplicada de dados | Múltiplas props soltas (mais verboso, mais acoplamento) |
| **Sincronização URL ↔ estado via `watch`** | Padrão Nuxt/Vue simples e eficaz; compartilhável | Zustand/Pinia (overkill para este caso) |
| **Filtros com lógica AND** | Comportamento esperado pelo usuário; query Supabase suporta nativamente | Lógica OR (resultados imprecisos) |
| **Badge warning já existe no UiBadge** | Verificado no código — variante `warning` com amarelo já implementada | Adicionar nova variante (desnecessário) |
| **Sem mapa muscular SVG na Fase 1** | Complexidade alta; badges resolvem o problema imediato | SVG interativo do corpo humano (vale para Fase 2) |

### Riscos Conhecidos

| Risco | Impacto | Mitigação |
|---|---|---|
| Apenas 10 exercícios seed | Médio | Suficiente para validar UI; expandir dados depois |
| Campos de imagem/vídeo vazios | Baixo | Fallback com ícones Heroicons + gradientes do design system |
| `primary_muscles` como UUID[] pode complicar filtros | Baixo | `.contains()` do Supabase funciona nativamente com arrays PostgreSQL |
| Performance com muitos filtros + busca simultâneos | Médio | Índices existentes em `difficulty` e `is_cardio`; adicionar índice composto se necessário |
| Drawer de filtros no mobile pode ser complexo | Baixo | Usar classe `glass` do design system + transition existente |

### Conformidade com Skills Padrões

Skills aplicáveis ao desenvolvimento deste módulo:

| Skill | Aplicação |
|---|---|
| `frontend-design` | Criação de interfaces frontend com alta qualidade de design (componentes catalog, layouts responsivos) |
| `ui-ux-pro-max` | Diretrizes de UI/UX, padrões de catálogo, responsividade, acessibilidade, sistemas de cores |
| `web-design-guidelines` | Review de acessibilidade, contraste de cores, navegação por teclado, labels em inputs |
| `atomic-design-fundamentals` | Organização de componentes seguindo hierarquia Atomic Design (quarks → atoms → molecules → organisms → templates → pages) |

### Arquivos Relevantes e Dependentes

| Arquivo | Relação |
|---|---|
| `types/index.ts` | Adicionar `ExerciseFilters`, `ExerciseQueryParams` |
| `composables/useExercises.ts` | Estender com paginação, filtros, relacionados |
| `components/ui/ExerciseCard.vue` | Estender com props e NuxtLink |
| `components/ui/UiBadge.vue` | Já suporta variante `warning` — sem alteração |
| `tailwind.config.ts` | Sem alteração necessária |
| `assets/css/tailwind.css` | Sem alteração necessária (classes já existem) |
| `middleware/auth.ts` | Confirmar `/exercises` excluído do redirect (já está) |
| `composables/useToast.ts` | Usado para feedback de erro |
| `composables/useRoles.ts` | Carregado pelo middleware em rotas protegidas |
| `components/layout/AppLayout.vue` | Layout base usado pelas páginas |
| `pages/exercises/index.vue` | **Novo** — página de listagem |
| `pages/exercises/[id].vue` | **Novo** — página de detalhes |
| `components/catalog/*.vue` | **Novos** — 13 componentes de catálogo |
