# Tarefa 5.0: Componente ExerciseFilters (painel de filtros desktop/mobile)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o componente `components/catalog/ExerciseFilters.vue` — um painel de filtros que exibe opções de dificuldade, grupo muscular, equipamento e tipo de exercício. No desktop, é exibido como sidebar à esquerda; no mobile, como drawer/bottom sheet com glassmorphism.

## Conformidade com Skills Padrões

- `frontend-design` — Layout de sidebar de filtros, drawer mobile com glassmorphism, design responsivo
- `ui-ux-pro-max` — Padrões de filtros de catálogo, UX de drawer mobile, estados de seleção
- `atomic-design-fundamentals` — Organismo que combina átomos (radio buttons, selects, buttons)
- `web-design-guidelines` — Acessibilidade: labels em selects, navegação por teclado, focus trap no drawer

## Requisitos

- Exibir 4 grupos de filtros: dificuldade (radio), músculo (select), equipamento (select), tipo (radio)
- Carregar opções de músculos e equipamentos via `useExercises.fetchMuscleGroups()` e `fetchEquipment()`
- Todos os filtros são combináveis com lógica AND
- Botão "Limpar Filtros" que reseta todos os valores
- No desktop: painel lateral fixo à esquerda
- No mobile: drawer que abre a partir de um botão toggle (usar classe `glass`)
- Emitir evento `update:filters` com o objeto de filtros atualizado

## Subtarefas

- [x] 5.1 Criar arquivo `components/catalog/ExerciseFilters.vue`
- [x] 5.2 Definir props: `filters` (tipo `ExerciseFilters`), `mobileOpen` (boolean)
- [x] 5.3 Definir emits: `update:filters`, `update:mobileOpen`, `clear`
- [x] 5.4 Chamar `useExercises()` e executar `fetchMuscleGroups()` e `fetchEquipment()` no `onMounted`
- [x] 5.5 Criar seção de dificuldade: radio buttons para Todos, Fácil, Médio, Difícil
- [x] 5.6 Criar seção de músculo: `<select>` com opções carregadas de `muscleGroups`
- [x] 5.7 Criar seção de equipamento: `<select>` com opções carregadas de `equipment`
- [x] 5.8 Criar seção de tipo: radio buttons para Todos, Composto, Isolado, Cardio
- [x] 5.9 Adicionar botão "Limpar Filtros" que emite `clear`
- [x] 5.10 Wrapper desktop: `<aside>` com largura fixa (w-64), sticky
- [x] 5.11 Wrapper mobile: drawer com overlay escuro, glassmorphism, botão de fechar
- [x] 5.12 Usar classes `card-gradient` para seções e `btn-ghost` para botão de limpar
- [x] 5.13 Adicionar responsividade: `hidden lg:block` para sidebar, drawer para mobile
- [x] 5.14 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.1 do PRD para o wireframe do layout de filtros. A techspec.md descreve os componentes de filtro e a lógica AND. Para o drawer mobile, usar `glass` do design system + transição de slide-up. Os selects devem usar `UiSelect` se disponível, ou `<select>` nativo estilizado com classe `input`. Radio buttons podem ser estilizados com label + input hidden para melhor UX.

## Critérios de Sucesso

- [x] Filtros de dificuldade, músculo, equipamento e tipo são exibidos e funcionais
- [x] Opções de músculos e equipamentos são carregadas do banco
- [x] Selecionar um filtro emite `update:filters` com o valor correto
- [x] Botão "Limpar Filtros" reseta todos os valores para undefined
- [x] Desktop: sidebar visível e fixa à esquerda
- [x] Mobile: drawer abre/fecha corretamente com overlay e glassmorphism
- [x] `pnpm lint` passa sem erros
- [x] Todos os selects possuem labels acessíveis

## Testes da Tarefa

- [x] Testes de unidade: Selecionar radio "Fácil" — `update:filters` deve emitir `{ difficulty: 'easy' }`
- [x] Testes de unidade: Selecionar músculo no select — `update:filters` deve emitir `{ muscleGroup: '<UUID>' }`
- [x] Testes de unidade: Clicar "Limpar Filtros" — `clear` deve ser emitido
- [x] Testes de integração: Selecionar dificuldade + músculo simultaneamente — `update:filters` deve conter ambos os valores
- [x] Testes de integração: Verificar que `muscleGroups` e `equipment` são carregados no `onMounted`
- [x] Testes de integração (mobile): Clicar no botão toggle — drawer deve abrir com overlay escuro
- [x] Testes de integração (mobile): Clicar no X do drawer — drawer deve fechar
- [x] Testes de acessibilidade: Navegar por Tab entre todos os filtros — foco deve ser visível em cada elemento

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseFilters.vue` — novo arquivo
- `composables/useExercises.ts` — para `fetchMuscleGroups()` e `fetchEquipment()`
- `types/index.ts` — tipo `ExerciseFilters`
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 para wireframe de filtros
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Componentes novos"
