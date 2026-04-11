# Tarefa 11.0: Componentes de detalhes (Header, Media, MuscleMap, Instructions, Meta, RelatedList)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar 6 componentes que compõem a página de detalhes de um exercício. Cada componente é responsável por uma seção específica da interface de detalhes.

## Conformidade com Skills Padrões

- `frontend-design` — Design de componentes de detalhes, layout de página de exercício, consistência com design system
- `ui-ux-pro-max` — Padrões de página de detalhes de item de catálogo, hierarquia de informação visual
- `atomic-design-fundamentals` — Organismos que compõem a página de detalhes
- `web-design-guidelines` — Acessibilidade: headings hierárquicos, alt text em imagens, listas semânticas

## Requisitos

Todos os componentes devem:
- Ser consistentes com o design system (cores, espaçamento, tipografia)
- Suportar estado de loading (skeletons ou null)
- Ser responsivos (mobile-first)

### ExerciseDetailHeader
- Título do exercício (name_pt)
- Badges: dificuldade, tipo, músculo primário
- Botão "Voltar" com ícone de seta (navega para `/exercises`)

### ExerciseDetailMedia
- Área de imagem/vídeo do exercício
- Fallback: ícone Heroicons representativo quando `image_url` e `video_url` estão vazios
- Placeholder com gradiente do design system

### ExerciseMuscleMap
- Badges visuais de músculos primários (preenchidos/sólidos) e secundários (outline)
- Usar `name_pt` dos músculos
- Separar visualmente primários de secundários

### ExerciseInstructions
- Lista numerada (`<ol>`) de instruções em pt-BR
- Fallback para `instructions` (inglês) se `instructions_pt` estiver vazio
- Cada passo com espaçamento adequado

### ExerciseMeta
- Cards de metadados: equipamento, calorias, dificuldade, séries sugeridas
- Layout em grid de 2 colunas

### ExerciseRelatedList
- Scroll horizontal de cards de exercícios relacionados
- Usar `ExerciseCard` para cada exercício relacionado
- Título "Exercícios Relacionados"

## Subtarefas

- [ ] 11.1 Criar arquivo `components/catalog/ExerciseDetailHeader.vue`
- [ ] 11.2 Props: `exercise` (Exercise), emits: `goBack`
- [ ] 11.3 Template: botão voltar + `h1` com name_pt + badges de dificuldade/tipo/músculo
- [ ] 11.4 Criar arquivo `components/catalog/ExerciseDetailMedia.vue`
- [ ] 11.5 Props: `exercise` (Exercise)
- [ ] 11.6 Se `image_url` existe → exibir `<img>`; se `video_url` existe → exibir player; senão → ícone + gradiente fallback
- [ ] 11.7 Ícone fallback: usar ícone de músculo ou equipamento de Heroicons (ex: `BoltIcon` para cardio)
- [ ] 11.8 Criar arquivo `components/catalog/ExerciseMuscleMap.vue`
- [ ] 11.9 Props: `primaryMuscles` (array de MuscleGroup), `secondaryMuscles` (array de MuscleGroup)
- [ ] 11.10 Seção "Músculos Primários": badges sólidos (`badge badge-primary`)
- [ ] 11.11 Seção "Músculos Secundários": badges outline (`badge` sem fill)
- [ ] 11.12 Criar arquivo `components/catalog/ExerciseInstructions.vue`
- [ ] 11.13 Props: `instructions` (array de string ou string com newlines)
- [ ] 11.14 Template: `<ol>` com `<li>` para cada passo, numerado automaticamente
- [ ] 11.15 Fallback: se `instructions_pt` vazio, usar `instructions` (inglês) com aviso
- [ ] 11.16 Criar arquivo `components/catalog/ExerciseMeta.vue`
- [ ] 11.17 Props: `exercise` (Exercise)
- [ ] 11.18 Grid de cards: equipamento, dificuldade, calorias (se disponível), tipo
- [ ] 11.19 Criar arquivo `components/catalog/ExerciseRelatedList.vue`
- [ ] 11.20 Props: `relatedExercises` (array de Exercise)
- [ ] 11.21 Título `h2` "Exercícios Relacionados" + scroll horizontal de `ExerciseCard`
- [ ] 11.22 Scroll horizontal: `flex gap-4 overflow-x-auto hide-scrollbar`
- [ ] 11.23 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.3 do PRD para o wireframe completo da página de detalhes. A techspec.md lista os componentes `ExerciseDetail*` na seção "Componentes novos". Cada componente deve ser independente e reutilizável. Badges de músculos primários usam `badge-primary` (indigo); secundários usam `badge` simples com border.

## Critérios de Sucesso

### ExerciseDetailHeader
- Exibe título, badges e botão voltar corretamente
- Botão voltar emite `goBack` (ou navega diretamente)

### ExerciseDetailMedia
- Exibe imagem quando disponível
- Exibe fallback com ícone + gradiente quando sem mídia

### ExerciseMuscleMap
- Músculos primários exibidos com badges sólidos
- Músculos secundários exibidos com badges outline
- Seções claramente separadas visualmente

### ExerciseInstructions
- Instruções exibidas como lista numerada
- Fallback para inglês quando pt-BR não disponível

### ExerciseMeta
- Metadados exibidos em grid de cards

### ExerciseRelatedList
- Scroll horizontal funciona (scroll com mouse/touch)
- Cards de relacionados são clicáveis (navegam para `/exercises/:id`)

- `pnpm lint` passa sem erros para todos os 6 componentes

## Testes da Tarefa

- [ ] Testes de unidade (Header): Passar exercício mock — título, badges e botão voltar devem aparecer
- [ ] Testes de unidade (Media): Exercício sem imagem — fallback com ícone deve aparecer
- [ ] Testes de unidade (MuscleMap): Passar 2 músculos primários e 1 secundário — badges corretos com estilos diferentes
- [ ] Testes de unidade (Instructions): Passar array de 4 instruções — lista `<ol>` com 4 `<li>` deve aparecer
- [ ] Testes de unidade (Instructions): Passar `instructions_pt` vazio — fallback em inglês deve aparecer
- [ ] Testes de unidade (Meta): Exercício com equipamento — card de equipamento deve exibir nome pt-BR
- [ ] Testes de unidade (RelatedList): Passar 3 exercícios relacionados — 3 cards em scroll horizontal
- [ ] Testes de integração: Clicar no botão voltar — deve navegar para `/exercises`
- [ ] Testes de integração: Clicar em card de exercício relacionado — deve navegar para `/exercises/:id` do relacionado
- [ ] Testes de acessibilidade: Instructions deve usar `<ol>` semântico com `<li>`
- [ ] Testes de acessibilidade: MuscleMap deve ter headings `h2` ou `h3` para seções de primários/secundários

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseDetailHeader.vue` — novo arquivo
- `components/catalog/ExerciseDetailMedia.vue` — novo arquivo
- `components/catalog/ExerciseMuscleMap.vue` — novo arquivo
- `components/catalog/ExerciseInstructions.vue` — novo arquivo
- `components/catalog/ExerciseMeta.vue` — novo arquivo
- `components/catalog/ExerciseRelatedList.vue` — novo arquivo
- `components/ui/ExerciseCard.vue` — usado em ExerciseRelatedList
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.3 para wireframe de detalhes
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Componentes novos" para ExerciseDetail*
