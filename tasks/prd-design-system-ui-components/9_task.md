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

- [x] 9.1 Criar `components/ui/ExerciseCard.vue` — compõe UiCard, exibe nome + músculo + equipamento + badge dificuldade + slot ações; ícone com cor por dificuldade
- [x] 9.2 Criar `components/ui/WorkoutCard.vue` — compõe UiCard, exibe título + descrição + exercício count + duração + status badge + progress bar + slot ações + click handler
- [x] 9.3 Criar `components/ui/StatCard.vue` — compõe UiCard, exibe valor grande + label + ícone colorido + trend indicator (up/down/neutral com cor e ícone)
- [x] 9.4 Tipo `TrendIndicator` adicionado em `types/index.ts` (direction, value?, label?)
- [x] 9.5 Responsividade: cards com `truncate`, `line-clamp-2`, `min-w-0`, `flex-wrap` para adaptação em 320px
- [x] 9.6 Ícones de `@heroicons/vue/24/outline`: FireIcon, BoltIcon, SparklesIcon, WrenchScrewdriverIcon, QueueListIcon, ClockIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon, ChartBarIcon

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

- [x] **Unit — ExerciseCard:** Renderiza nome, grupo muscular, equipamento, badge dificuldade (Fácil/Médio/Difícil com cores); slot ações renderiza; sem equipamento funciona (condicional); ícone muda por dificuldade (Sparkles/Bolt/Fire); compõe UiCard com hoverable/padding/rounded
- [x] **Unit — WorkoutCard:** Renderiza título, descrição, exercício count, duração, status badge; status muda cor (planned→primary, in_progress→accent, completed→secondary, scheduled→default); click handler emite evento; progress bar com porcentagem; sem descrição funciona; compõe UiCard com `cursor-pointer`
- [x] **Unit — StatCard:** Renderiza valor grande, label, ícone colorido, trend indicator; trend up (ArrowTrendingUp + secondary-400), down (ArrowTrendingDown + accent-400), neutral (Minus + slate-400); sem tendência funciona; ícone com bg colorido (primary-500/20, secondary-500/20, accent-500/20); compõe UiCard
- [x] **Integração — Cards em grid:** Múltiplos StatCards em grid responsivo; flex-wrap e truncate previnem overflow em 320px
- [x] **Composição:** Todos usam `<UiCard>` internamente — herdam `hoverable`, `padding`, `rounded`

## Arquivos relevantes

- `components/ui/ExerciseCard.vue` — NOVO
- `components/ui/WorkoutCard.vue` — NOVO
- `components/ui/StatCard.vue` — NOVO
- `components/ui/UiCard.vue` — Base de composição
- `components/ui/UiBadge.vue` — Usado em ExerciseCard e WorkoutCard
- `types/index.ts` — tipo TrendIndicator
- `pages/dashboard/index.vue` — Futuro consumidor de StatCard
