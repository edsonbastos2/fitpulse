# Tarefa 4.0: Componente ExerciseSearchBar (busca com debounce)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o componente `components/catalog/ExerciseSearchBar.vue` — um campo de busca com ícone de lupa, debounce de 300ms e emissão de evento quando o termo de busca muda. Este componente será usado na página de listagem para filtrar exercícios por nome e descrição.

## Conformidade com Skills Padrões

- `frontend-design` — Design de input de busca com ícone, consistente com o design system Tailwind/ dark theme
- `ui-ux-pro-max` — Padrões de barra de busca, feedback visual de loading, debounce para performance
- `web-design-guidelines` — Acessibilidade: label associado ao input, placeholder descritivo

## Requisitos

- Input de texto com ícone de lupa (Heroicons: `MagnifyingGlassIcon`)
- Debounce de 300ms usando `useDebounceFn` do VueUse
- Emitir evento `update:modelValue` com o termo de busca após o debounce
- Suportar `v-model` (definir `modelValue` como prop)
- Usar a classe `input` do design system para estilização consistente
- Limpar busca com botão X quando houver texto (opcional, mas recomendado)

## Subtarefas

- [x] 4.1 Criar arquivo `components/catalog/ExerciseSearchBar.vue`
- [x] 4.2 Definir props: `modelValue` (string, default ''), `placeholder` (string, default 'Buscar exercício...'), `disabled` (boolean, default false)
- [x] 4.3 Definir emits: `update:modelValue` (string)
- [x] 4.4 Importar `MagnifyingGlassIcon` e `XMarkIcon` de `@heroicons/vue`
- [x] 4.5 Criar estado interno `internalValue` como `ref(modelValue)`
- [x] 4.6 Criar função debounce com `useDebounceFn` (300ms) que emite `update:modelValue`
- [x] 4.7 Criar watcher em `modelValue` para sincronizar prop → estado interno (caso mude externamente)
- [x] 4.8 Montar template: wrapper `div` com input + ícone de lupa à esquerda + botão X à direita (condicional)
- [x] 4.9 Aplicar classe `input` do design system no input
- [x] 4.10 Adicionar label acessível (`<label>` escondido visualmente mas presente para screen readers)
- [x] 4.11 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 6.6 do PRD para a estratégia de debounce. O componente deve ser um wrapper estilizado com ícone integrado, similar aos inputs de busca de apps modernos. Usar `useDebounceFn` do VueUse (já instalado). O evento `update:modelValue` permite uso com `v-model` na página pai.

## Critérios de Sucesso

- [x] Digitar no campo → após 300ms, evento `update:modelValue` é emitido
- [x] Digitar rapidamente várias letras → apenas um evento é emitido após a pausa
- [x] Botão X limpa o campo imediatamente (sem debounce)
- [x] Ícone de lupa aparece à esquerda do input
- [x] Componente funciona com `v-model` na página pai
- [x] `pnpm lint` passa sem erros
- [x] Input possui label acessível (mesmo que visualmente oculto)

## Testes da Tarefa

- [x] Testes de unidade: Digitar "supino" no campo — após 300ms, `update:modelValue` deve ser emitido com "supino"
- [x] Testes de unidade: Digitar e apagar rapidamente várias letras — apenas o valor final após 300ms de pausa deve ser emitido
- [x] Testes de unidade: Clicar no botão X — campo deve limpar e emitir string vazia imediatamente
- [x] Testes de integração: Usar componente com `v-model` na página pai — valor deve sincronizar bidirecionalmente
- [x] Testes de integração: Verificar que o input é focável via Tab e que o label está associado corretamente (inspecionar elemento)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseSearchBar.vue` — novo arquivo
- `components/ui/UiInput.vue` — referência de estilo (classe `input` do design system)
- `tasks/prd-catalogo-exercicios/prd.md` — seção 6.6 para debounce
- `tasks/prd-catalogo-exercicios/techspec.md` — menção a `useDebounceFn` do VueUse
