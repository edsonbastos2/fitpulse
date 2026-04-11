# Tarefa 9.0: Página /exercises listagem

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a página `pages/exercises/index.vue` — a página principal de listagem de exercícios. Esta página orquestra todos os componentes criados nas tarefas anteriores: SearchBar, Filters, SortSelect, ExerciseGrid, Pagination, EmptyState e SkeletonGrid.

## Conformidade com Skills Padrões

- `frontend-design` — Layout de página de catálogo com sidebar + grid, responsividade, design system
- `ui-ux-pro-max` — Padrões de página de catálogo, hierarquia visual, espaçamento
- `atomic-design-fundamentals` — Template que combina organismos (SearchBar, Filters, Grid, Pagination)
- `web-design-guidelines` — Acessibilidade: headings hierárquicos, landmarks, skip links

## Requisitos

- Layout: sidebar de filtros à esquerda + grid à direita (desktop); filtros em drawer (mobile)
- Header da página com título "Catálogo de Exercícios" e subtítulo
- SearchBar no topo do grid
- SortSelect ao lado do SearchBar
- ExerciseGrid para exibir os exercícios
- SkeletonGrid durante o carregamento
- EmptyState quando não há resultados
- Pagination no final do grid
- Usar `useExercises.fetchExercisesPaginated` para buscar dados
- Chamar `fetchExercisesPaginated` no `onMounted` com filtros iniciais

## Subtarefas

- [x] 9.1 Criar arquivo `pages/exercises/index.vue`
- [x] 9.2 Definir `<script setup>` com imports de todos os componentes de `components/catalog/`
- [x] 9.3 Importar `useExercises` e chamar `fetchMuscleGroups()` e `fetchEquipment()` no `onMounted`
- [x] 9.4 Criar estado reativo `filters` do tipo `ExerciseFilters`
- [x] 9.5 Criar estado `isDrawerOpen` para controle do drawer mobile
- [x] 9.6 Criar função `applyFilters()` que chama `fetchExercisesPaginated(filters)`
- [x] 9.7 Montar template com layout desktop: sidebar (filters) + main (grid area)
- [x] 9.8 Header da página: título `h1` "Catálogo de Exercícios" + subtítulo
- [x] 9.9 Barra de controles: `ExerciseSearchBar` + `ExerciseSortSelect` lado a lado
- [x] 9.10 Botão toggle de filtros no mobile (integrado ao `ExerciseFilters`)
- [x] 9.11 Condicional: isLoading → SkeletonGrid; exercises.length === 0 → EmptyState; senão → ExerciseGrid
- [x] 9.12 Após o grid, exibir `ExercisePagination` se `totalExercises > perPage`
- [x] 9.13 Handler de `loadMore`: incrementar `page` no filtros e chamar `applyFilters()`
- [x] 9.14 Handler de `clearFilters`: resetar `filters` e chamar `applyFilters()`
- [x] 9.15 Usar layout `authenticated` com `container-app`
- [x] 9.16 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.1 do PRD para os wireframes completo da página de listagem. A techspec.md descreve o fluxo de dados: query params → filtros → fetchExercisesPaginated → exercises ref → grid. A página deve usar `useExercises()` para obter `exercises`, `totalExercises`, `currentPage`, `isLoading` e as funções de fetch.

## Critérios de Sucesso

- [x] Página carrega e exibe exercícios em grid ao acessar `/exercises`
- [x] SearchBar funciona e filtra exercícios ao digitar (debounce 300ms)
- [x] Filters funcionam e atualizam o grid
- [x] SortSelect muda a ordenação dos exercícios
- [x] SkeletonGrid aparece durante o carregamento inicial
- [x] EmptyState aparece quando filtros/busca não retornam resultados
- [x] Pagination funciona e carrega mais exercícios ao clicar
- [x] Mobile: drawer de filtros abre/fecha corretamente
- [x] Desktop: sidebar de filtros visível à esquerda
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de unidade: Acessar `/exercises` — `fetchExercisesPaginated` deve ser chamado no `onMounted`
- [x] Testes de integração: Digitar "supino" na busca — grid deve filtrar para mostrar apenas exercícios com "supino"
- [x] Testes de integração: Selecionar filtro de dificuldade "Fácil" — grid deve atualizar com exercícios fáceis
- [x] Testes de integração: Mudar ordenação para "Nome (Z-A)" — ordem do grid deve inverter
- [x] Testes de integração: Clicar "Carregar Mais" — 12 novos exercícios devem aparecer
- [x] Testes de integração: Buscar por "xyz" (inexistente) — EmptyState deve aparecer
- [x] Testes de integração (mobile): Clicar no botão de filtro — drawer deve abrir
- [x] Testes de integração (mobile): Fechar drawer — filtros selecionados devem ser aplicados ao grid
- [x] Testes de acessibilidade: Página deve ter `h1` "Catálogo de Exercícios" como heading principal
- [x] Testes de acessibilidade: Verificar que a estrutura de landmarks (aside, main) está correta

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `pages/exercises/index.vue` — novo arquivo
- `components/catalog/ExerciseSearchBar.vue` — criado na Tarefa 4.0
- `components/catalog/ExerciseFilters.vue` — criado na Tarefa 5.0
- `components/catalog/ExerciseSortSelect.vue` — criado na Tarefa 6.0
- `components/catalog/ExerciseGrid.vue` — criado na Tarefa 7.0
- `components/catalog/ExercisePagination.vue` — criado na Tarefa 8.0
- `components/catalog/ExerciseEmptyState.vue` — criado na Tarefa 8.0
- `components/catalog/ExerciseSkeletonGrid.vue` — criado na Tarefa 8.0
- `composables/useExercises.ts` — estendido na Tarefa 2.0
- `types/index.ts` — tipo `ExerciseFilters` da Tarefa 1.0
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 para wireframes
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Fluxo de dados"
