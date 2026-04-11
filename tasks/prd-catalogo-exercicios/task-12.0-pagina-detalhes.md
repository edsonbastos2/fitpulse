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

- [x] 12.1 Criar arquivo `pages/exercises/[id].vue`
- [x] 12.2 Importar `useRoute`, `useRouter`, `useExercises`, `useToast` e todos os componentes `ExerciseDetail*`
- [x] 12.3 Obter `id` via `useRoute().params.id`
- [x] 12.4 Criar estados reativos: `exercise`, `relatedExercises`, `isLoading`
- [x] 12.5 No `onMounted`: fetch exercise, handle not found, fetch related
- [x] 12.6 Tratar erros de fetch com try/catch e toast
- [x] 12.7 Montar template com estrutura completa (Header, Media, Meta, Muscles, Instructions, Related)
- [x] 12.8 Loading state com skeletons
- [x] 12.9 Resolver nomes de músculos via maps
- [x] 12.10 Resolver nome de equipamento via maps
- [x] 12.11 Botão voltar integrado ao `ExerciseDetailHeader`
- [x] 12.12 Meta tags dinâmicas via `useHead`
- [x] 12.13 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.3 do PRD para o wireframe da página de detalhes. A techspec.md descreve o fluxo de dados e os componentes `ExerciseDetail*`. Usar `useHead` do Nuxt para definir o `<title>` dinâmico da página. Os dados de músculos e equipamento devem ser resolvidos a partir dos UUIDs armazenados no exercício, fazendo join com os dados carregados por `fetchMuscleGroups()` e `fetchEquipment()`.

## Critérios de Sucesso

- [x] Acessar `/exercises/:id` com ID válido → detalhes do exercício são exibidos
- [x] Acessar `/exercises/:id` com ID inexistente → redirect para `/exercises` com toast
- [x] Dados de músculos e equipamento são resolvidos (UUIDs → nomes pt-BR)
- [x] Exercícios relacionados são exibidos (3-4 exercícios similares)
- [x] Loading state aparece durante o fetch
- [x] Instruções em pt-BR são exibidas (com fallback para inglês)
- [x] Botão voltar navega para `/exercises`
- [x] Título da página é dinâmico (nome do exercício)
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de unidade: Com ID válido — `fetchExercise` deve ser chamado e exercício carregado
- [x] Testes de unidade: Com ID inexistente — `fetchExercise` retorna null → toast de erro + redirect para `/exercises`
- [x] Testes de unidade: Após carregar exercício — `fetchRelatedExercises` deve ser chamado
- [x] Testes de integração: Acessar `/exercises/<id-existente>` — página deve exibir todos os componentes de detalhes
- [x] Testes de integração: Verificar que título da página (`document.title`) contém o nome do exercício
- [x] Testes de integração: Verificar que músculos primários e secundários têm nomes resolvidos (não UUIDs)
- [x] Testes de integração: Seção "Exercícios Relacionados" deve exibir 1-4 cards de exercícios
- [x] Testes de integração: Clicar em "Voltar" — deve navegar para `/exercises`
- [x] Testes de acessibilidade: Verificar hierarquia de headings (h1 para título, h2 para seções)
- [x] Testes de acessibilidade: Navegar por Tab — todos os elementos interativos devem ser focáveis

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
