# Tarefa 9.0: Criar cards especializados (ExerciseCard, WorkoutCard, StatCard)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar três cards especializados que compõem `UiCard` internamente: `ExerciseCard` (exercícios), `WorkoutCard` (treinos) e `StatCard` (métricas de dashboard). Cada um exibe dados contextuais específicos com consistência visual.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Composição com UiCard, consistência visual, responsividade
- `ui-ux-pro-max` — Acessibilidade de cards clicáveis, hierarquia visual de dados
</skills>

<requirements>
- **ExerciseCard:** Nome do exercício, grupo muscular, equipamento (se aplicável), badge de dificuldade, slot para ações (RF-3.5)
- **WorkoutCard:** Título, descrição opcional, contagem de exercícios, duração estimada, status visual (badge), ação de clique (RF-3.6)
- **StatCard:** Valor numérico em destaque, label descritivo, ícone decorativo, indicador de tendência opcional (RF-3.7)
- Todos responsivos e legíveis em viewports de 320px (RF-3.8)
- Todos compoem UiCard internamente (herdam hoverable, variants)
</requirements>

## Subtarefas

- [ ] 9.1 Criar `components/ui/ExerciseCard.vue` — compõe UiCard, recebe dados de exercício via props, exibe nome + músculo + equipamento + badge dificuldade + slot ações
- [ ] 9.2 Criar `components/ui/WorkoutCard.vue` — compõe UiCard, recebe dados de treino via props, exibe título + descrição + exercício count + duração + status badge + click handler
- [ ] 9.3 Criar `components/ui/StatCard.vue` — compõe UiCard, recebe valor + label + ícone + trend, exibe métrica em destaque
- [ ] 9.4 Adicionar tipo `TrendIndicator` em `types/index.ts`
- [ ] 9.5 Garantir responsividade: cards adaptam layout em 320px (stack vertical)
- [ ] 9.6 Usar `@heroicons/vue` para ícones decorativos

## Detalhes de Implementação

Consultar **techspec.md** → Seções "Interfaces Principais" (ExerciseCardProps, WorkoutCardProps) e "Decisões Principais" (Cards especializados compoem UiCard). ExerciseCard usa `UiBadge` para dificuldade. WorkoutCard status mapeia para cores: planned→primary, in_progress→accent, completed→secondary, scheduled→dark. StatCard usa ícone com bg colorido (primary-500/20, secondary-500/20, accent-500/20).

## Critérios de Sucesso

- 3 componentes criados e funcionais
- ExerciseCard exibe todos os dados de exercício corretamente
- WorkoutCard status badge muda cor conforme estado
- StatCard exibe valor grande + label + ícone + tendência
- Todos responsivos em 320px
- Todos usam UiCard como base
- `pnpm lint` passa sem erros

## Testes da Tarefa

- [ ] **Unit — ExerciseCard:** Renderiza nome, grupo muscular, equipamento, badge dificuldade; slot ações renderiza; dados mínimos (sem equipamento) funciona; responsivo em viewport pequena
- [ ] **Unit — WorkoutCard:** Renderiza título, descrição, exercício count, duração, status badge; status muda cor do badge; click handler emite evento; sem descrição funciona
- [ ] **Unit — StatCard:** Renderiza valor grande, label, ícone, tendência; trend up/down/neutral muda cor e ícone; sem tendência funciona; ícone com cor de fundo
- [ ] **Integração — Cards em grid:** Renderizar múltiplos StatCards em grid; verificar layout responsivo
- [ ] **Composição:** Verificar que cada card usa UiCard internamente (herda hoverable, padding)

## Arquivos relevantes

- `components/ui/ExerciseCard.vue` — NOVO
- `components/ui/WorkoutCard.vue` — NOVO
- `components/ui/StatCard.vue` — NOVO
- `components/ui/UiCard.vue` — Base de composição
- `components/ui/UiBadge.vue` — Usado em ExerciseCard e WorkoutCard
- `types/index.ts` — tipo TrendIndicator
- `pages/dashboard/index.vue` — Futuro consumidor de StatCard
