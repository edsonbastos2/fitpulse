# PRD — Catálogo de Exercícios

**Produto:** FitPulse  
**Módulo:** Catálogo de Exercícios  
**Data:** 11 de abril de 2026  
**Status:** Rascunho  
**Autor:** Qwen Code

---

## 1. Visão Geral

O módulo **Catálogo de Exercícios** oferece uma interface completa para que usuários do FitPulse possam navegar, buscar, filtrar e visualizar detalhes de exercícios físicos. O catálogo serve como a fonte de verdade de todos os exercícios disponíveis na plataforma, integrando-se com o sistema de criação de treinos e com o motor de recomendações.

### Problema a Resolver

Atualmente, o FitPulse possui a tabela `exercises` populada com seed data e um composable `useExercises` funcional, mas **não existe uma interface de usuário** para explorar esses exercícios. Usuários não conseguem:
- Descobrir quais exercícios estão disponíveis
- Buscar exercícios por nome, músculo alvo ou equipamento
- Visualizar instruções detalhadas de execução
- Filtrar por dificuldade, tipo de equipamento ou grupo muscular

### Oportunidade

Um catálogo rico e bem organizado aumenta o engolvimento, ajuda iniciantes a aprender exercícios corretamente e serve como base para a seleção de exercícios na criação de treinos.

---

## 2. Escopo

### 2.1 Incluso (In-Scope)

| # | Funcionalidade | Descrição |
|---|---------------|-----------|
| F1 | **Página de listagem** (`/exercises`) | Grid/lista de exercícios com paginação ou scroll infinito |
| F2 | **Busca textual** | Campo de busca com pesquisa por nome (pt/en), descrição e instruções |
| F3 | **Filtros avançados** | Dificuldade, grupo muscular primário, equipamento, tipo (composto/cardio/isolado) |
| F4 | **Ordenação** | Por nome (A-Z, Z-A), dificuldade, popularidade |
| F5 | **Cards de exercício** | Componente visual com nome, músculo alvo, equipamento, dificuldade |
| F6 | **Página de detalhes** (`/exercises/:id`) | Modal ou página dedicada com instruções passo a passo, músculos envolvidos (visual), equipamento, vídeo/ imagem |
| F7 | **Mapa muscular visual** | Indicador visual dos músculos primários e secundários trabalhados |
| F8 | **Filtros persistidos na URL** | Estado dos filtros compartilhável via query params |
| F9 | **Loading states e skeletons** | Feedback visual durante carregamento |
| F10 | **Empty states** | Mensagem amigável quando busca/filtros não retornam resultados |
| F11 | **Responsividade** | Layout adaptável para mobile (1 coluna), tablet (2 colunas), desktop (3 colunas) |
| F12 | **Tradução pt-BR** | Interface totalmente em português, usando campos `name_pt`, `description_pt`, `instructions_pt` |

### 2.2 Excluído (Out-of-Scope) — Fase Futura

- CRUD de exercícios personalizados (criar/editar/excluir)
- Favoritar exercícios
- Histórico pessoal de uso do exercício
- Comentários ou avaliações da comunidade
- Upload de vídeos personalizados
- Integração com IA para recomendações de exercícios individuais

---

## 3. Perguntas de Clarificação

> **Nota:** As perguntas abaixo foram respondidas com base no contexto existente do projeto. Se houver discordância, ajuste antes de prosseguir.

| # | Pergunta | Resposta (Assunção) | Impacto |
|---|----------|-------------------|---------|
| P1 | O catálogo deve ser acessível sem autenticação? | **Sim.** A rota `/exercises` será parcialmente protegida — o middleware já exclui `/exercises` do redirect de autenticação. Usuários não logados podem navegar, mas sem funcionalidades de favoritar (futuro). | Permite descoberta antes do registro |
| P2 | Quantos exercícios existem atualmente? | **~10 exercícios seed** na migration, mas o schema suporta centenas. O design deve escalar com paginação/infinite scroll. | Grid com paginação de 12 itens |
| P3 | As imagens/vídeos dos exercícios estão populados? | **Não.** Os campos `image_url`, `thumbnail_url`, `video_url` estão vazios no seed. Usar ícones/ilustrações como fallback. | Fallback com ícones Heroicons baseados no músculo/equipamento |
| P4 | O mapa muscular visual requer uma imagem SVG do corpo? | **Sim, idealmente.** Na ausência, usar lista de badges com destaque visual para primários vs secundários. | Fase 1: badges. Fase 2: SVG interativo |
| P5 | Os filtros devem ser combináveis (AND logic)? | **Sim.** Todos os filtros são combináveis com lógica AND. | Query Supabase composta |
| P6 | Existe ordenação por "popularidade"? | **Não há campo de popularidade no schema.** Usar ordem alfabética por padrão. Futuramente adicionar campo `usage_count`. | Ordenação: nome A-Z/Z-A, dificuldade |
| P7 | Deve haver paginação ou infinite scroll? | **Paginação com "Carregar mais"** (load more) para simplicidade e controle de custo de queries. | Botão "Carregar mais" após 12 itens |
| P8 | O layout do catálogo deve seguir qual padrão de navegação? | **Sidebar de filtros à esquerda + grid à direita** no desktop; **filtros em drawer/bottom sheet** no mobile. | Consistente com apps de e-commerce/ catálogo |
| P9 | O composable `useExercises` precisa ser estendido? | **Sim.** Adicionar suporte a paginação (`range`), contagem total, filtros por músculos primários (`primary_muscles`), e flag `is_compound`. | Ver seção 6 |
| P10 | A página de detalhes deve ser modal ou rota dedicada? | **Rota dedicada** (`/exercises/:id`) para permitir compartilhamento de URL e bookmarking. | Melhor para SEO e deep linking |

---

## 4. Arquitetura de Informação

### 4.1 Mapa de Rotas

| Rota | Componente | Auth | Descrição |
|------|-----------|------|-----------|
| `/exercises` | `pages/exercises/index.vue` | Não (parcialmente protegida) | Listagem com busca e filtros |
| `/exercises/:id` | `pages/exercises/[id].vue` | Não | Detalhes do exercício |

### 4.2 Hierarquia de Componentes

```
pages/exercises/index.vue          ← Página de listagem
├── components/catalog/
│   ├── ExerciseSearchBar.vue      ← Barra de busca
│   ├── ExerciseFilters.vue        ← Painel lateral de filtros (desktop) / Drawer (mobile)
│   ├── ExerciseGrid.vue           ← Grid responsivo de cards
│   ├── ExerciseCard.vue           ← Card individual (já existe em components/ui/)
│   ├── ExerciseSortSelect.vue     ← Seletor de ordenação
│   ├── ExercisePagination.vue     ← Paginação / Load More
│   ├── ExerciseEmptyState.vue     ← Estado vazio
│   └── ExerciseSkeletonGrid.vue   ← Skeletons de carregamento
│
pages/exercises/[id].vue           ← Página de detalhes
├── components/catalog/
│   ├── ExerciseDetailHeader.vue   ← Título, badges, ações
│   ├── ExerciseDetailMedia.vue    ← Imagem/vídeo placeholder
│   ├── ExerciseMuscleMap.vue      ← Mapa muscular (badges ou SVG)
│   ├── ExerciseInstructions.vue   ← Passo a passo numerado
│   ├── ExerciseMeta.vue           ← Equipamento, dificuldade, calorias
│   └── ExerciseRelatedList.vue    ← Exercícios relacionados
```

### 4.3 Estado dos Filtros (Query Params)

```
/exercises?search=supino&difficulty=medium&muscle=UUID&equipment=UUID&type=compound&sort=name-asc&page=1
```

| Param | Tipo | Descrição |
|-------|------|-----------|
| `search` | string | Termo de busca |
| `difficulty` | `easy\|medium\|hard` | Nível de dificuldade |
| `muscle` | UUID | ID do grupo muscular primário |
| `equipment` | UUID | ID do equipamento |
| `type` | `compound\|isolation\|cardio` | Tipo do exercício |
| `sort` | `name-asc\|name-desc\|difficulty-asc` | Ordenação |
| `page` | number | Página atual |

---

## 5. Especificação de UI/UX

### 5.1 Página de Listagem (`/exercises`)

#### Header da Página
```
┌─────────────────────────────────────────────────────┐
│  📚 Catálogo de Exercícios                          │
│  Explore exercícios para montar seu treino perfeito  │
├─────────────────────────────────────────────────────┤
│  [🔍 Buscar exercício...                    ] [Sort ▼]│
└─────────────────────────────────────────────────────┘
```

#### Layout Desktop (≥1024px)
```
┌──────────────┬──────────────────────────────────────┐
│  FILTROS     │  Grid de Exercícios (3 colunas)       │
│              │                                       │
│ Dificuldade  │  ┌────┐  ┌────┐  ┌────┐              │
│ ○ Todos      │  │Ex 1│  │Ex 2│  │Ex 3│              │
│ ○ Fácil      │  └────┘  └────┘  └────┘              │
│ ○ Médio      │                                       │
│ ○ Difícil    │  ┌────┐  ┌────┐  ┌────┐              │
│              │  │Ex 4│  │Ex 5│  │Ex 6│              │
│ Músculo      │  └────┘  └────┘  └────┘              │
│ [Select    ▼]│                                       │
│              │  ┌────┐  ┌────┐  ┌────┐              │
│ Equipamento  │  │Ex 7│  │Ex 8│  │Ex 9│              │
│ [Select    ▼]│  └────┘  └────┘  └────┘              │
│              │                                       │
│ Tipo         │  [ Carregar Mais ]                    │
│ ○ Todos      │                                       │
│ ○ Composto   │  Total: 48 exercícios                 │
│ ○ Isolado    │                                       │
│ ○ Cardio     │                                       │
│              │                                       │
│ [Limpar Filtros]                                     │
└──────────────┴──────────────────────────────────────┘
```

#### Layout Mobile (<1024px)
```
┌────────────────────────┐
│  📚 Catálogo           │
│  [🔍 Buscar...    ] [⚙]│ ← ⚙ abre drawer de filtros
├────────────────────────┤
│  ┌──────┐ ┌──────┐     │
│  │ Ex 1 │ │ Ex 2 │     │  ← 2 colunas
│  └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐     │
│  │ Ex 3 │ │ Ex 4 │     │
│  └──────┘ └──────┘     │
│                          │
│  [ Carregar Mais ]       │
└────────────────────────┘
```

### 5.2 ExerciseCard (Extensão do existente)

O componente `components/ui/ExerciseCard.vue` já existe e deve ser estendido:

**Props adicionais necessárias:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `primaryMuscles` | `MuscleGroup[]` | `[]` | Grupos musculares primários |
| `equipment` | `Equipment \| null` | `null` | Equipamento associado |
| `isCompound` | `boolean` | `false` | Se é exercício composto |
| `isCardio` | `boolean` | `false` | Se é exercício cardio |

**Comportamento:**
- Click no card navega para `/exercises/:id`
- Exibe badges para: dificuldade (cores: verde=fácil, amarelo=médio, vermelho=difícil), tipo (composto/cardio)
- Exibe ícone do músculo primário (primeiro da lista) como fallback visual
- Hover: elevação com `card-hover` do design system

### 5.3 Página de Detalhes (`/exercises/:id`)

```
┌──────────────────────────────────────────────────────────────┐
│  ← Voltar                                                    │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  Supino Reto                           │
│  │                  │  [Fácil] [Composto] [Peito]             │
│  │  [Imagem/Vídeo]  │                                        │
│  │                  │  Descrição do exercício em português    │
│  │  Placeholder com │  ...                                   │
│  │  ícone se vazio  │  ┌───────────────────────────────┐     │
│  │                  │  │  Equipamento: Barra            │     │
│  └──────────────────┘  │  Calorias: ~8 kcal/min         │     │
│                          └───────────────────────────────┘     │
├──────────────────────────────────────────────────────────────┤
│  💪 Músculos Trabalhados                                     │
│  Primários:   [████ Peito ████] [ Ombros ]                   │
│  Secundários: [ Tríceps ]                                    │
├──────────────────────────────────────────────────────────────┤
│  📋 Instruções                                               │
│  1. Deite no banco                                           │
│  2. Segure a barra levemente mais larga que os ombros        │
│  3. Desça até o peito                                        │
│  4. Pressione para cima                                      │
├──────────────────────────────────────────────────────────────┤
│  🔗 Exercícios Relacionados                                  │
│  [Card: Supino Inclinado] [Card: Crucifixo] [Card: Flexão]   │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 Design Tokens Aplicados

| Elemento | Classes Tailwind |
|----------|-----------------|
| Container principal | `container-app max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8` |
| Cards | `card card-hover` (do design system) |
| Títulos | `text-2xl font-display font-bold text-white` |
| Subtítulos | `text-lg font-semibold text-white` |
| Texto secundário | `text-slate-400` |
| Badges dificuldade fácil | `badge badge-secondary` (emerald) |
| Badges dificuldade média | `badge badge-warning` (amarelo — adicionar ao design system) |
| Badges dificuldade difícil | `badge badge-accent` (rose) |
| Botão carregar mais | `btn-ghost` |
| Inputs de busca | `input` com ícone |
| Selects de filtro | `ui-select` component |
| Skeletons | `skeleton` class do design system |
| Glassmorphism (filtros mobile) | `glass` |

---

## 6. Especificação Técnica

### 6.1 Extensão do Composable `useExercises`

O composable `composables/useExercises.ts` precisa das seguintes adições:

```typescript
// Novos estados
const totalExercises = ref(0)
const currentPage = ref(1)
const perPage = 12

// Nova função: fetch paginado com todos os filtros
const fetchExercisesPaginated = async (params: {
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  muscleGroup?: string        // UUID
  equipment?: string          // UUID
  type?: 'compound' | 'isolation' | 'cardio'
  sort?: 'name-asc' | 'name-desc' | 'difficulty-asc'
  page?: number
}) => {
  // 1. Monta query com filtros combináveis (AND)
  // 2. Aplica order conforme sort
  // 3. Aplica range para paginação: from = (page-1)*perPage, to = page*perPage-1
  // 4. Para obter total: fazer query count separada ou usar .select('*', { count: 'exact', head: false })
  // 5. Atualiza exercises, totalExercises, currentPage
}

// Nova função: buscar exercícios relacionados
const fetchRelatedExercises = async (exerciseId: string, options: {
  muscleGroup?: string
  equipment?: string
  difficulty?: string
  limit?: number
}) => {
  // 1. Query com or/and para encontrar exercícios que compartilham músculos ou equipamento
  // 2. Excluir o exercício atual
  // 3. Limitar resultados
}
```

### 6.2 Query Supabase (Exemplo de Filtros Combináveis)

```typescript
let query = supabase
  .from('exercises')
  .select('*', { count: 'exact' })

if (search) {
  query = query.or(`name_pt.ilike.%${search}%,description_pt.ilike.%${search}%`)
}
if (difficulty) query = query.eq('difficulty', difficulty)
if (equipment) query = query.eq('equipment_id', equipment)
if (muscleGroup) {
  // primary_muscles é array UUID[] — usar contains
  query = query.contains('primary_muscles', [muscleGroup])
}
if (type === 'compound') query = query.eq('is_compound', true)
if (type === 'isolation') query = query.and('is_compound.eq.false,is_cardio.eq.false')
if (type === 'cardio') query = query.eq('is_cardio', true)

// Ordenação
if (sort === 'name-asc') query = query.order('name_pt', { ascending: true })
if (sort === 'name-desc') query = query.order('name_pt', { ascending: false })
if (sort === 'difficulty-asc') {
  // Mapear dificuldade para numérico: easy=1, medium=2, hard=3
  query = query.order('difficulty', { ascending: true })
}

// Paginação
const from = (page - 1) * perPage
const to = from + perPage - 1
query = query.range(from, to)
```

### 6.3 RLS Policies

As políticas existentes na migration `001_initial_schema.sql` já permitem leitura pública da tabela `exercises`:
- Não há RLS habilitado na tabela `exercises` (não aparece no `ENABLE ROW LEVEL SECURITY`)
- Isso significa que **qualquer usuário (logado ou não) pode ler exercícios** — comportamento desejado

**Nova policy necessária** (se quisermos restringir exercícios customizados):
```sql
-- Se habilitar RLS no futuro:
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises"
    ON exercises FOR SELECT
    USING (true);

CREATE POLICY "Users can view custom exercises"
    ON exercises FOR SELECT
    USING (is_custom = false OR created_by = auth.uid());
```

### 6.4 Tipos TypeScript

Adicionar ao `types/index.ts`:

```typescript
// Parâmetros de busca do catálogo
export interface ExerciseFilters {
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  muscleGroup?: string
  equipment?: string
  type?: 'compound' | 'isolation' | 'cardio'
  sort?: 'name-asc' | 'name-desc' | 'difficulty-asc'
  page?: number
}

// Query params da URL
export type ExerciseQueryParams = Record<keyof ExerciseFilters, string | undefined>
```

### 6.5 Watchers e Sincronização URL ↔ Estado

```typescript
// Sincronizar query params → filtros
const route = useRoute()
const router = useRouter()

watch(() => route.query, (newQuery) => {
  filters.search = newQuery.search as string | undefined
  filters.difficulty = newQuery.difficulty as ExerciseFilters['difficulty']
  // ... demais filtros
  fetchExercises()
}, { deep: true, immediate: true })

// Sincronizar filtros → query params
watch(filters, (newFilters) => {
  router.replace({
    query: Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== undefined && v !== '')
    )
  })
}, { deep: true })
```

### 6.6 Performance

| Aspecto | Estratégia |
|---------|-----------|
| Busca inicial | `onMounted` ou `watch immediate` com query params |
| Debounce na busca | 300ms via `useDebounceFn` do VueUse |
| Cache de dados | `useState` do Nuxt (já implementado no composable) |
| Lazy loading de imagens | `loading="lazy"` nas tags `<img>` |
| Prefetch de detalhes | `useFetch` com `lazy: true` no hover do card |

---

## 7. Tasks de Implementação

### Fase 1 — Fundação (Estimativa: 2-3h)

| # | Task | Arquivo(s) | Descrição |
|---|------|-----------|-----------|
| T1 | Estender tipos TypeScript | `types/index.ts` | Adicionar `ExerciseFilters` e `ExerciseQueryParams` |
| T2 | Estender composable `useExercises` | `composables/useExercises.ts` | Adicionar `fetchExercisesPaginated`, `fetchRelatedExercises`, `totalExercises`, paginação |
| T3 | Estender `ExerciseCard` | `components/ui/ExerciseCard.vue` | Adicionar props para músculos, equipamento, tipo; tornar clicável com `NuxtLink` |
| T4 | Adicionar badge `warning` ao design system | `components/ui/UiBadge.vue`, `tailwind.config.ts` | Adicionar variante `warning` (amarelo) se não existir |

### Fase 2 — Página de Listagem (Estimativa: 3-4h)

| # | Task | Arquivo(s) | Descrição |
|---|------|-----------|-----------|
| T5 | Criar `pages/exercises/index.vue` | `pages/exercises/index.vue` | Página principal com layout, header, grid |
| T6 | Criar `ExerciseSearchBar` | `components/catalog/ExerciseSearchBar.vue` | Input de busca com debounce e ícone |
| T7 | Criar `ExerciseFilters` | `components/catalog/ExerciseFilters.vue` | Painel de filtros com selects para dificuldade, músculo, equipamento, tipo |
| T8 | Criar `ExerciseSortSelect` | `components/catalog/ExerciseSortSelect.vue` | Dropdown de ordenação |
| T9 | Criar `ExerciseGrid` | `components/catalog/ExerciseGrid.vue` | Grid responsivo (1/2/3 colunas) |
| T10 | Criar `ExercisePagination` | `components/catalog/ExercisePagination.vue` | Botão "Carregar Mais" + contador total |
| T11 | Criar `ExerciseEmptyState` | `components/catalog/ExerciseEmptyState.vue` | Estado vazio com sugestões |
| T12 | Criar `ExerciseSkeletonGrid` | `components/catalog/ExerciseSkeletonGrid.vue` | Skeletons durante loading |
| T13 | Implementar sync URL ↔ estado | `pages/exercises/index.vue` | Watchers de query params e filtros |

### Fase 3 — Página de Detalhes (Estimativa: 2-3h)

| # | Task | Arquivo(s) | Descrição |
|---|------|-----------|-----------|
| T14 | Criar `pages/exercises/[id].vue` | `pages/exercises/[id].vue` | Página de detalhes com fetch por ID |
| T15 | Criar `ExerciseDetailHeader` | `components/catalog/ExerciseDetailHeader.vue` | Título, badges, botão voltar |
| T16 | Criar `ExerciseDetailMedia` | `components/catalog/ExerciseDetailMedia.vue` | Imagem/vídeo com fallback para ícone |
| T17 | Criar `ExerciseMuscleMap` | `components/catalog/ExerciseMuscleMap.vue` | Badges visuais de músculos primários/secundários |
| T18 | Criar `ExerciseInstructions` | `components/catalog/ExerciseInstructions.vue` | Lista numerada de instruções em pt-BR |
| T19 | Criar `ExerciseMeta` | `components/catalog/ExerciseMeta.vue` | Cards de equipamento, calorias, dificuldade |
| T20 | Criar `ExerciseRelatedList` | `components/catalog/ExerciseRelatedList.vue` | Exercícios relacionados (horizontal scroll) |

### Fase 4 — Polimento (Estimativa: 1-2h)

| # | Task | Arquivo(s) | Descrição |
|---|------|-----------|-----------|
| T21 | Adicionar animações de transição | Múltiplos | `animate-fade-in`, `animate-fade-in-up` nos cards e página |
| T22 | Testar responsividade | Múltiplos | Mobile-first, testar em 320px, 768px, 1024px, 1440px |
| T23 | Testar estados de erro | Múltiplos | Toast de erro via `useToast` quando fetch falhar |
| T24 | Atualizar middleware | `middleware/auth.ts` | Confirmar que `/exercises` está excluído do redirect (já está) |
| T25 | Testar acessibilidade | Múltiplos | Labels em inputs, contrastes, navegação por teclado |

---

## 8. Critérios de Aceite

| # | Critério | Como Validar |
|---|----------|-------------|
| CA1 | Usuário pode acessar `/exercises` sem login | Acessar URL incógnita → página carrega |
| CA2 | Busca retorna resultados em ≤1s com debounce | Digitar "supino" → resultados aparecem |
| CA3 | Filtros são combináveis e funcionam juntos | Aplicar dificuldade + músculo + equipamento → resultados corretos |
| CA4 | Filtros persistem na URL e são compartilháveis | Copiar URL com params → abrir em nova aba → mesmo estado |
| CA5 | Grid responsivo: 1 col (mobile), 2 (tablet), 3 (desktop) | Redimensionar browser → grid adapta |
| CA6 | "Carregar Mais" funciona e mostra total correto | Clicar → 12 novos itens; total exibido |
| CA7 | Card de exercício navega para detalhes | Clicar → abre `/exercises/:id` |
| CA8 | Página de detalhes mostra instruções em pt-BR | Acessar `/exercises/:id` → instruções em português |
| CA9 | Músculos primários e secundários são distinguíveis | Visual: primários com badge preenchido, secundários com outline |
| CA10 | Exercícios relacionados são exibidos | Seção "Relacionados" mostra 3-4 exercícios similares |
| CA11 | Empty state amigável quando sem resultados | Busca por "xyz" → mensagem "Nenhum exercício encontrado" |
| CA12 | Skeletons exibidos durante carregamento | Limpar cache → recarregar → skeletons visíveis |
| CA13 | Acessibilidade: inputs com labels, contrastes OK | Lighthouse accessibility score ≥ 90 |
| CA14 | Navegação por teclado funcional | Tab, Enter, Escape funcionam corretamente |

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|:-------------:|:-------:|-----------|
| Poucos exercícios seed (apenas 10) | Alta | Médio | Seed inicial é suficiente para validar UI; expandir depois com mais dados |
| Campos de imagem/vídeo vazios | Alta | Baixo | Fallback com ícones SVG e gradientes do design system |
| Performance com muitos filtros + busca | Média | Médio | Índices no banco (já existem para `difficulty`, `is_cardio`); adicionar índice composto se necessário |
| `primary_muscles` como array UUID[] complica filtro | Média | Baixo | Usar `.contains()` do Supabase (funciona com arrays PostgreSQL) |
| Mapa muscular SVG complexo | Alta | Baixo | Fase 1 usa badges simples; SVG interativo fica para Fase 2 |

---

## 10. Métricas de Sucesso (Pós-lançamento)

| Métrica | Target | Como Medir |
|---------|--------|-----------|
| % de usuários que visitam catálogo | >40% | Analytics de página |
| Tempo médio na página de catálogo | >60s | Analytics |
| Taxa de clique em exercícios (card → detalhes) | >25% | Event tracking |
| Busas sem resultado | <15% | Log de queries vazias |
| Lighthouse Performance score | >80 | CI/CD pipeline |

---

## 11. Dependências e Pré-requisitos

| Item | Status | Observação |
|------|:------:|-----------|
| Tabela `exercises` populada | ✅ | 10 exercícios seed |
| Tabela `muscle_groups` populada | ✅ | 15 grupos musculares |
| Tabela `equipment` populada | ✅ | 14 equipamentos |
| Composable `useExercises` básico | ✅ | Com `fetchExercises`, `fetchMuscleGroups`, `fetchEquipment` |
| Componente `ExerciseCard` | ✅ | Precisa extensão |
| Design system (cores, cards, badges) | ✅ | Verificar badge `warning` |
| Composable `useToast` | ✅ | Para mensagens de erro |
| Middleware auth com exclusão de `/exercises` | ✅ | Já configurado |
| Layout `authenticated` | ✅ | Para consistência visual |
| `@heroicons/vue` instalado | ✅ | Para ícones |

---

## 12. Glossário

| Termo | Definição |
|-------|-----------|
| **Exercício composto** | Exercício que trabalha múltiplos grupos musculares simultaneamente (ex: Agachamento, Terra) |
| **Exercício isolado** | Exercício focado em um único grupo muscular (ex: Rosca direta) |
| **RLS** | Row Level Security — políticas de segurança em nível de linha no Supabase |
| **Glassmorphism** | Efeito visual de vidro fosco (`backdrop-blur`) usado no design system |
| **Load More** | Padrão de paginação incremental (vs paginação numérica tradicional) |

---

## 13. Apêndice — Referências

- **Design System:** `docs/DESIGN_SYSTEM.md`
- **Migration do schema:** `supabase/migrations/001_initial_schema.sql`
- **Composable atual:** `composables/useExercises.ts`
- **Tipos:** `types/index.ts`
- **Componente ExerciseCard:** `components/ui/ExerciseCard.vue`
- **Tailwind config:** `tailwind.config.ts`
- **Middleware auth:** `middleware/auth.ts`
