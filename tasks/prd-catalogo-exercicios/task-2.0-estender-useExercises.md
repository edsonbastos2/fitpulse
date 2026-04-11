# Tarefa 2.0: Estender composable useExercises (paginação, filtros combináveis, fetchRelatedExercises)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Estender o composable `composables/useExercises.ts` adicionando suporte a paginação, filtros combináveis e busca de exercícios relacionados. Este composable é a camada de dados central do catálogo.

## Conformidade com Skills Padrões

- `supabase-postgres-postgres-best-practices` — Otimização de queries Supabase com `.range()`, `.contains()` para arrays, e `.select('*', { count: 'exact' })`

## Requisitos

- Adicionar estados reativos `totalExercises` e `currentPage`
- Criar função `fetchExercisesPaginated` que aceita `ExerciseFilters` e retorna dados paginados
- Criar função `fetchRelatedExercises` que encontra exercícios por músculo/equipamento compartilhados
- Todas as funções devem atualizar o estado compartilhado via `useState` do Nuxt
- Tratar erros com `console.error` (toast será chamado pela página consumidora)

## Subtarefas

- [x] 2.1 Ler `composables/useExercises.ts` para entender a estrutura atual (estados, funções existentes)
- [x] 2.2 Adicionar `totalExercises` como `useState('catalog-total', () => 0)` e `currentPage` como `useState('catalog-page', () => 1)`
- [x] 2.3 Definir constante `perPage = 12` no topo do composable
- [x] 2.4 Implementar `fetchExercisesPaginated(params: ExerciseFilters)` com todos os filtros combináveis
- [x] 2.5 Implementar `fetchRelatedExercises(exerciseId, options)` com `.overlaps()` em `primary_muscles`
- [x] 2.6 Atualizar o retorno do composable para incluir `totalExercises`, `currentPage`, `perPage`, `fetchExercisesPaginated`, `fetchRelatedExercises`
- [x] 2.7 Atualizar a interface `UseExercisesReturn` em `types/index.ts` (se existir) ou documentar o shape de retorno em comentário JSDoc
- [x] 2.8 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 6.2 do PRD para o exemplo completo de query Supabase com filtros combináveis. A techspec.md contém o shape completo de `UseExercisesReturn` na seção "Interfaces Principais". Usar `useSupabaseClient()` para obter o cliente Supabase. Usar `useDebounceFn` do VueUse para debounce na camada da página (não no composable).

## Critérios de Sucesso

- [x] `fetchExercisesPaginated` retorna exercícios filtrados e paginados corretamente
- [x] `totalExercises` reflete o total de resultados (sem paginação)
- [x] `currentPage` é atualizado após cada chamada
- [x] `fetchRelatedExercises` retorna 3-4 exercícios similares
- [x] Todos os filtros são combináveis com lógica AND
- [x] Erros de query são capturados e logados via `console.error`
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de unidade: Chamar `fetchExercisesPaginated({})` sem filtros — deve retornar até 12 exercícios e setar `totalExercises` corretamente
- [x] Testes de unidade: Chamar `fetchExercisesPaginated({ difficulty: 'easy' })` — todos os resultados devem ter `difficulty === 'easy'`
- [x] Testes de unidade: Chamar `fetchExercisesPaginated({ search: 'supino' })` — resultados devem conter "supino" em `name_pt` ou `description_pt`
- [x] Testes de integração: Chamar `fetchExercisesPaginated({ difficulty: 'medium', type: 'compound' })` — resultados devem satisfazer AMBOS os filtros
- [x] Testes de integração: Chamar `fetchExercisesPaginated({ page: 2 })` — deve retornar exercícios diferentes da página 1
- [x] Testes de integração: Chamar `fetchRelatedExercises(idDeUmExercicioExistente, { limit: 4 })` — deve retornar 1-4 exercícios, nenhum sendo o próprio exercício

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `composables/useExercises.ts` — arquivo principal a ser modificado
- `types/index.ts` — possível atualização de tipo de retorno
- `tasks/prd-catalogo-exercicios/prd.md` — seção 6.1 e 6.2 para queries
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Interfaces Principais" para shape de retorno
