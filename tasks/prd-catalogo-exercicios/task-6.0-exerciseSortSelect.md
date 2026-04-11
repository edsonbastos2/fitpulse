# Tarefa 6.0: Componente ExerciseSortSelect (dropdown de ordenação)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o componente `components/catalog/ExerciseSortSelect.vue` — um dropdown de ordenação que permite ao usuário escolher como os exercícios serão ordenados: nome A-Z, nome Z-A, ou dificuldade crescente.

## Conformidade com Skills Padrões

- `frontend-design` — Design de select estilizado consistente com o design system
- `ui-ux-pro-max` — Padrões de dropdown de ordenação em catálogos
- `web-design-guidelines` — Acessibilidade: label associado ao select

## Requisitos

- Dropdown com 3 opções de ordenação: Nome (A-Z), Nome (Z-A), Dificuldade (crescente)
- Suportar `v-model` via `modelValue` prop e emit `update:modelValue`
- Usar classe `input` do design system
- Exibir ícone de ordenação (Heroicons: `ArrowsUpDownIcon`)
- Label acessível "Ordenar por"

## Subtarefas

- [x] 6.1 Criar arquivo `components/catalog/ExerciseSortSelect.vue`
- [x] 6.2 Definir props: `modelValue` (string, default 'name-asc')
- [x] 6.3 Definir emits: `update:modelValue` (string)
- [x] 6.4 Importar `ArrowsUpDownIcon` de `@heroicons/vue`
- [x] 6.5 Criar `<select>` com 3 opções: Nome A-Z, Nome Z-A, Dificuldade crescente
- [x] 6.6 Vincular `v-model` do select ao `modelValue` via `:value` e `@change`
- [x] 6.7 Aplicar classe `input` do design system ao select
- [x] 6.8 Adicionar label "Ordenar por" com ícone
- [x] 6.9 Adicionar ícone `ArrowsUpDownIcon` ao lado do label
- [x] 6.10 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.1 do PRD para a posição do seletor no header da página. O componente é simples — um `<select>` estilizado com opções de ordenação que correspondem aos valores esperados por `fetchExercisesPaginated` na techspec.md.

## Critérios de Sucesso

- [x] Dropdown exibe 3 opções de ordenação com labels em português
- [x] Selecionar uma opção emite `update:modelValue` com o valor correto
- [x] Componente funciona com `v-model` na página pai
- [x] Label "Ordenar por" é acessível para screen readers
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de unidade: Selecionar "Nome (Z-A)" — `update:modelValue` deve emitir `'name-desc'`
- [x] Testes de unidade: Selecionar "Dificuldade (crescente)" — `update:modelValue` deve emitir `'difficulty'`
- [x] Testes de integração: Usar com `v-model` na página pai — mudança no select deve atualizar a variável pai
- [x] Testes de acessibilidade: Verificar que o label está associado ao select via `for`/`id` ou `aria-label`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseSortSelect.vue` — novo arquivo
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 para posição no header
- `tasks/prd-catalogo-exercicios/techspec.md` — query params de ordenação
