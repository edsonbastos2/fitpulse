# Tarefa 12.0: Página /exercises/:id detalhes

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar a página `pages/exercises/[id].vue` — a página de detalhes de um exercício específico. Esta página faz fetch do exercício pelo ID, resolve os dados relacionados (músculos, equipamento, exercícios similares) e orquestra todos os componentes `ExerciseDetail*` criados na Tarefa 11.0.

## Conformidade com Skills Padrões

- `frontend-design` — Layout de página de detalhes, orquestração de componentes, design system
- `ui-ux-pro-max` — Padrões de página de detalhes de item de catálogo
- `atomic-design-fundamentals` — Page que compõe organismos de detalhes
- `web-design-guidelines` — Acessibilidade: heading hierarchy, breadcrumb navigation, skip links

## Requisitos

- Buscar exercício pelo ID via `useExercises.fetchExerciseById(id)`
- Buscar exercícios relacionados via `useExercises.fetchRelatedExercises(id, options)`
- Resolver nomes de músculos e equipamento para exibição
- Exibir loading state enquanto busca dados
- Se exercício não encontrado → redirect para `/exercises` com toast informativo
- Tratar erros de fetch com `useToast.error()`

## Subtarefas

- [ ] 12.1 Criar arquivo `pages/exercises/[id].vue`
- [ ] 12.2 Importar `useRoute`, `useRouter`, `useExercises`, `useToast` e todos os componentes `ExerciseDetail*`
- [ ] 12.3 Obter `id` via `useRoute().params.id`
- [ ] 12.4 Criar estados reativos: `exercise` (Exercise | null), `relatedExercises` (Exercise[]), `loading` (boolean)
- [ ] 12.5 No `onMounted`:
  - Chamar `fetchExerciseById(id)` e armazenar em `exercise`
  - Se exercício é null/undefined → `useToast.error('Exercício não encontrado')` + `router.replace('/exercises')`
  - Se encontrado → chamar `fetchRelatedExercises(id, { muscleGroup: exercício.primary_muscles?.[0], limit: 4 })`
- [ ] 12.6 Tratar erros de fetch com `try/catch`, logar via `console.error` e exibir `useToast.error()`
- [ ] 12.7 Montar template com estrutura:
  - Botão voltar (pode ser parte do ExerciseDetailHeader)
  - `ExerciseDetailHeader`
  - Grid 2 colunas: `ExerciseDetailMedia` (esquerda) + `ExerciseMeta` (direita)
  - `ExerciseMuscleMap`
  - `ExerciseInstructions`
  - `ExerciseRelatedList` (se houver relacionados)
- [ ] 12.8 Loading state: exibir skeletons enquanto `loading === true`
- [ ] 12.9 Resolver nomes de músculos: buscar dados de `muscleGroups` do composable e mapear UUIDs → nomes pt-BR
- [ ] 12.10 Resolver nome de equipamento: buscar dados de `equipment` do composable e mapear UUID → nome pt-BR
- [ ] 12.11 Adicionar `<NuxtLink>` para voltar: `<NuxtLink to="/exercises" class="btn-ghost">← Voltar</NuxtLink>`
- [ ] 12.12 Adicionar meta tags dinâmicas (título da página com name do exercício) via `useHead`
- [ ] 12.13 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.3 do PRD para o wireframe da página de detalhes. A techspec.md descreve o fluxo de dados e os componentes `ExerciseDetail*`. Usar `useHead` do Nuxt para definir o `<title>` dinâmico da página. Os dados de músculos e equipamento devem ser resolvidos a partir dos UUIDs armazenados no exercício, fazendo join com os dados carregados por `fetchMuscleGroups()` e `fetchEquipment()`.

## Critérios de Sucesso

- Acessar `/exercises/:id` com ID válido → detalhes do exercício são exibidos
- Acessar `/exercises/:id` com ID inexistente → redirect para `/exercises` com toast
- Dados de músculos e equipamento são resolvidos (UUIDs → nomes pt-BR)
- Exercícios relacionados são exibidos (3-4 exercícios similares)
- Loading state aparece durante o fetch
- Instruções em pt-BR são exibidas (com fallback para inglês)
- Botão voltar navega para `/exercises`
- Título da página é dinâmico (nome do exercício)
- `pnpm lint` passa sem erros

## Testes da Tarefa

- [ ] Testes de unidade: Com ID válido — `fetchExerciseById` deve ser chamado e exercício carregado
- [ ] Testes de unidade: Com ID inexistente — `fetchExerciseById` retorna null → toast de erro + redirect para `/exercises`
- [ ] Testes de unidade: Após carregar exercício — `fetchRelatedExercises` deve ser chamado com músculo primário
- [ ] Testes de integração: Acessar `/exercises/<id-existente>` — página deve exibir todos os componentes de detalhes
- [ ] Testes de integração: Verificar que título da página (`document.title`) contém o nome do exercício
- [ ] Testes de integração: Verificar que músculos primários e secundários têm nomes resolvidos (não UUIDs)
- [ ] Testes de integração: Seção "Exercícios Relacionados" deve exibir 1-4 cards de exercícios
- [ ] Testes de integração: Clicar em "Voltar" — deve navegar para `/exercises`
- [ ] Testes de acessibilidade: Verificar hierarquia de headings (h1 para título, h2 para seções)
- [ ] Testes de acessibilidade: Navegar por Tab — todos os elementos interativos devem ser focáveis

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `pages/exercises/[id].vue` — novo arquivo
- `components/catalog/ExerciseDetailHeader.vue` — criado na Tarefa 11.0
- `components/catalog/ExerciseDetailMedia.vue` — criado na Tarefa 11.0
- `components/catalog/ExerciseMuscleMap.vue` — criado na Tarefa 11.0
- `components/catalog/ExerciseInstructions.vue` — criado na Tarefa 11.0
- `components/catalog/ExerciseMeta.vue` — criado na Tarefa 11.0
- `components/catalog/ExerciseRelatedList.vue` — criado na Tarefa 11.0
- `composables/useExercises.ts` — estendido na Tarefa 2.0
- `composables/useToast.ts` — existente para feedback de erro
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.3 para wireframe de detalhes
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Rotas" e fluxo de dados
