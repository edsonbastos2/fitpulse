# Tarefa 3.0: Estender ExerciseCard (props, navegação, badges de tipo)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Estender o componente existente `components/ui/ExerciseCard.vue` para suportar as novas props necessárias ao catálogo, tornar o card clicável com navegação para `/exercises/:id` via `NuxtLink`, e exibir badges de dificuldade e tipo de exercício.

## Conformidade com Skills Padrões

- `frontend-design` — Estilização de card com design consistente com o design system do FitPulse
- `ui-ux-pro-max` — Diretrizes de design de cards, badges de dificuldade com semântica de cores
- `atomic-design-fundamentals` — ExerciseCard é um organismo que compõe moléculas (UiBadge, UiCard)

## Requisitos

- Adicionar props: `exercise` (obrigatório, tipo `Exercise`), `muscleGroupNames` (string[]), `equipmentName` (string | undefined)
- Envolver o conteúdo do card com `NuxtLink` apontando para `/exercises/:id`
- Exibir badge de dificuldade com cores semânticas: verde=fácil, amarelo=médio, vermelho=difícil
- Exibir badge de tipo quando `is_compound` ou `is_cardio` for true
- Manter compatibilidade com usos existentes do componente (se houver)

## Subtarefas

- [x] 3.1 Ler `components/ui/ExerciseCard.vue` para entender estrutura e props atuais
- [x] 3.2 Adicionar novas props com valores padrão adequados (`exercise` como obrigatória, demais com defaults vazios)
- [x] 3.3 Envolver o root do componente com `<NuxtLink>` apontando para `/exercises/:id`
- [x] 3.4 Adicionar badge de dificuldade com cores semânticas (verde/amarelo/vermelho)
- [x] 3.5 Adicionar badge de tipo: "Composto" quando `is_compound`, "Cardio" quando `is_cardio`
- [x] 3.6 Exibir `muscleGroupNames` como badges adicionais (máximo 2)
- [x] 3.7 Exibir `equipmentName` como texto secundário abaixo do nome do exercício
- [x] 3.8 Adicionar estilo `card-hover` para efeito de elevação no hover
- [x] 3.9 Garantir que o card funciona sem a prop `exercise` completa (fallback para valores vazios)
- [x] 3.10 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 5.2 do PRD para o design do card e as props necessárias. A techspec.md contém a decisão de passar o objeto `Exercise` completo como prop em vez de múltiplas props soltas. Usar classes do design system: `card`, `card-hover`, `badge`, `badge-secondary`, `badge-warning`, `badge-accent`. O `NuxtLink` deve envolver o card inteiro para que qualquer clique navegue para os detalhes.

## Critérios de Sucesso

- [x] Card exibe nome do exercício (pt-BR), dificuldade, tipo e equipamento
- [x] Badges de dificuldade têm cores corretas (verde/amarelo/vermelho)
- [x] Click no card navega para `/exercises/:id`
- [x] Hover aplica elevação visual (`card-hover`)
- [x] Componente não quebra se props opcionais não forem fornecidas
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de unidade: Renderizar card com um exercício mock completo — verificar que nome, badges e equipamento aparecem
- [x] Testes de unidade: Renderizar card com `difficulty: 'easy'` — badge deve ser verde (emerald)
- [x] Testes de unidade: Renderizar card com `difficulty: 'medium'` — badge deve ser amarelo (warning)
- [x] Testes de unidade: Renderizar card com `difficulty: 'hard'` — badge deve ser vermelho (rose)
- [x] Testes de unidade: Renderizar card com `is_compound: true` — badge "Composto" deve aparecer
- [x] Testes de integração: Clicar no card — deve navegar para `/exercises/{id}` (verificar no browser)
- [x] Testes de integração: Passar mouse sobre o card — deve haver efeito de elevação visual

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/ui/ExerciseCard.vue` — arquivo a ser modificado
- `types/index.ts` — tipo `Exercise` já deve existir
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.2 para especificação do card
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Props estendidos do ExerciseCard"
