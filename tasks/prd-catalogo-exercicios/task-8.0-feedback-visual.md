# Tarefa 8.0: Componentes feedback visual (Pagination, EmptyState, SkeletonGrid)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar três componentes de feedback visual para a página de listagem:
- **ExercisePagination**: Botão "Carregar Mais" + contador total de exercícios
- **ExerciseEmptyState**: Mensagem amigável quando busca/filtros não retornam resultados
- **ExerciseSkeletonGrid**: Skeletons de carregamento que simulam o grid antes dos dados chegarem

## Conformidade com Skills Padrões

- `frontend-design` — Design de skeletons, empty states e paginação consistentes com o design system
- `ui-ux-pro-max` — Padrões de feedback visual de loading, empty states com sugestões, paginação "load more"
- `web-design-guidelines` — Acessibilidade: aria-live para atualizações de estado, texto descritivo

## Requisitos

### ExercisePagination
- Botão "Carregar Mais" estilizado com `btn-ghost`
- Exibir texto "Mostrando X de Y exercícios"
- Desabilitar botão quando todos os exercícios foram carregados
- Emitir evento `loadMore` ao clicar

### ExerciseEmptyState
- Exibir ícone ilustrativo (Heroicons: `MagnifyingGlassIcon` ou `ExclamationTriangleIcon`)
- Mensagem principal: "Nenhum exercício encontrado"
- Mensagem secundária com sugestões: "Tente ajustar seus filtros ou termos de busca"
- Botão "Limpar filtros" opcional

### ExerciseSkeletonGrid
- Grid com mesma estrutura do `ExerciseGrid` (1/2/3 colunas)
- Cada skeleton deve usar a classe `skeleton` do design system
- Exibir 6-9 skeletons (simulando um carregamento parcial)
- Animação de pulse nos skeletons

## Subtarefas

- [x] 8.1 Criar arquivo `components/catalog/ExercisePagination.vue`
- [x] 8.2 Definir props: `currentPage`, `totalExercises`, `perPage` (default 12)
- [x] 8.3 Definir emits: `loadMore`
- [x] 8.4 Calcular `shown = currentPage * perPage` e exibir "Mostrando X de Y exercícios"
- [x] 8.5 Botão "Carregar Mais" com `btn-ghost`, desabilitado se `shown >= total`
- [x] 8.6 Criar arquivo `components/catalog/ExerciseEmptyState.vue`
- [x] 8.7 Definir props: `message`, `suggestion`, `showClearButton`
- [x] 8.8 Definir emits: `clearFilters`
- [x] 8.9 Montar template: ícone centralizado + mensagem + sugestão + botão opcional
- [x] 8.10 Criar arquivo `components/catalog/ExerciseSkeletonGrid.vue`
- [x] 8.11 Definir props: `count` (default 6)
- [x] 8.12 Montar grid igual ao ExerciseGrid com placeholders `skeleton`
- [x] 8.13 Cada skeleton: `div` com `class="skeleton rounded-xl h-48"`
- [x] 8.14 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.1 do PRD para os wireframes de empty state e paginação. A techspec.md menciona o uso da classe `skeleton` do design system. Os skeletons devem ter a mesma estrutura de grid do ExerciseGrid para que a transição skeleton → conteúdo seja suave. O empty state deve ser centralizado e amigável.

## Critérios de Sucesso

### ExercisePagination
- [x] Botão "Carregar Mais" exibe corretamente e emite `loadMore` ao clicar
- [x] Texto "Mostrando X de Y" está correto
- [x] Botão fica desabilitado quando não há mais exercícios para carregar

### ExerciseEmptyState
- [x] Ícone, mensagem e sugestão são exibidos centralizados
- [x] Botão "Limpar filtros" emite `clearFilters` ao clicar
- [x] Visual consistente com o design system (cores, espaçamento)

### ExerciseSkeletonGrid
- [x] Grid de skeletons tem a mesma estrutura responsiva do ExerciseGrid
- [x] Skeletons têm animação de pulse
- [x] Transição visual suave quando dados carregam

- [x] `pnpm lint` passa sem erros para todos os 3 componentes

## Testes da Tarefa

- [x] Testes de unidade (Pagination): Com `currentPage=1`, `totalExercises=48`, `perPage=12` — texto deve exibir "Mostrando 12 de 48 exercícios"
- [x] Testes de unidade (Pagination): Com `currentPage=4`, `totalExercises=48` — botão "Carregar Mais" deve estar desabilitado
- [x] Testes de unidade (Pagination): Clicar no botão — evento `loadMore` deve ser emitido
- [x] Testes de unidade (EmptyState): Mensagem padrão deve ser "Nenhum exercício encontrado"
- [x] Testes de unidade (EmptyState): Passar props customizadas — mensagem e sugestão devem ser as customizadas
- [x] Testes de unidade (SkeletonGrid): Com `count=9` — 9 skeletons devem ser renderizados
- [x] Testes de integração (SkeletonGrid): Redimensionar para mobile — skeletons devem ficar em 1 coluna
- [x] Testes de integração (EmptyState): Clicar em "Limpar filtros" — evento `clearFilters` deve ser emitido
- [x] Testes de acessibilidade: EmptyState deve ter texto descritivo legível por screen readers

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExercisePagination.vue` — novo arquivo
- `components/catalog/ExerciseEmptyState.vue` — novo arquivo
- `components/catalog/ExerciseSkeletonGrid.vue` — novo arquivo
- `components/catalog/ExerciseGrid.vue` — referência de estrutura de grid
- `assets/css/tailwind.css` — classe `skeleton` do design system
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 para wireframes
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Componentes novos"
