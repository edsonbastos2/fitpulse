# Tarefa 7.0: Componente ExerciseGrid (grid responsivo 1/2/3 colunas)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o componente `components/catalog/ExerciseGrid.vue` — um grid responsivo que renderiza cards de exercício usando o componente `ExerciseCard` estendido. O grid deve adaptar-se: 1 coluna no mobile, 2 no tablet, 3 no desktop.

## Conformidade com Skills Padrões

- `frontend-design` — Grid responsivo com Tailwind, layout consistente com design system
- `ui-ux-pro-max` — Padrões de grid de catálogo, responsividade mobile-first
- `atomic-design-fundamentals` — Organismo que combina múltiplos ExerciseCard (organismos)
- `web-design-guidelines` — Acessibilidade: grid semântico, espaçamento consistente

## Requisitos

- Receber array de `exercises` como prop
- Renderizar um `ExerciseCard` para cada exercício
- Grid responsivo: 1 coluna (mobile), 2 colunas (tablet ≥ 640px), 3 colunas (desktop ≥ 1024px)
- Espaçamento consistente entre cards (`gap-4` ou `gap-6`)
- Animação de fade-in nos cards ao aparecerem

## Subtarefas

- [x] 7.1 Criar arquivo `components/catalog/ExerciseGrid.vue`
- [x] 7.2 Definir props: `exercises` (array de `Exercise`, default []), `muscleGroupMap` (Record<string, string>, default {}), `equipmentMap` (Record<string, string>, default {})
- [x] 7.3 Importar `ExerciseCard` de `components/ui/ExerciseCard.vue`
- [x] 7.4 Criar função helper para resolver nomes de músculos e equipamentos a partir dos maps
- [x] 7.5 Montar grid com `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6`
- [x] 7.6 Renderizar `ExerciseCard` com `v-for` passando `exercise`, `muscleGroupNames` e `equipmentName`
- [x] 7.7 Adicionar `:key="exercise.id"` para performance de renderização
- [x] 7.8 Adicionar classe `animate-fade-in-up` nos cards para animação de entrada
- [x] 7.9 Adicionar `stagger` de animação usando `animationDelay` inline baseado no índice
- [x] 7.10 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.1 do PRD para o wireframe do grid. A techspec.md descreve que `ExerciseGrid` renderiza múltiplos `ExerciseCard`. O grid usa Tailwind CSS grid com breakpoints responsivos. Para os maps de músculos e equipamento, o componente pai (página de listagem) deve resolver os UUIDs para nomes antes de passar ao grid.

## Critérios de Sucesso

- [x] Grid exibe exercícios em 1 coluna no mobile (< 640px)
- [x] Grid exibe exercícios em 2 colunas no tablet (640px - 1024px)
- [x] Grid exibe exercícios em 3 colunas no desktop (≥ 1024px)
- [x] Cada card exibe nome, dificuldade, tipo e equipamento corretamente
- [x] Cards têm animação de fade-in-up ao aparecerem
- [x] Espaçamento entre cards é consistente e visualmente agradável
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de unidade: Passar array com 6 exercícios mock — 6 cards devem ser renderizados
- [x] Testes de unidade: Passar array vazio — nenhum card deve ser renderizado (grid vazio)
- [x] Testes de unidade: Cada card deve receber `exercise`, `muscleGroupNames` e `equipmentName` como props
- [x] Testes de integração: Redimensionar browser para 320px — grid deve ter 1 coluna
- [x] Testes de integração: Redimensionar browser para 768px — grid deve ter 2 colunas
- [x] Testes de integração: Redimensionar browser para 1200px — grid deve ter 3 colunas
- [x] Testes de integração: Verificar que cards têm animação `animate-fade-in-up` aplicada

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseGrid.vue` — novo arquivo
- `components/ui/ExerciseCard.vue` — componente estendido na Tarefa 3.0
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 para wireframe do grid
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Componentes novos"
