# Tarefa 11.0: Adicionar tipos TypeScript compartilhados

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar os tipos TypeScript compartilhados necessários pelos novos componentes em `types/index.ts`. Esta tarefa garante tipagem forte e consistente em todos os componentes do módulo.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Tipagem consistente com padrões do projeto
</skills>

<requirements>
- Tipo `SelectOption` para UiSelect (label, value, disabled?, group?)
- Tipo `ChartDataset` para UiChart (label, data, borderColor?, backgroundColor?)
- Tipo `TrendIndicator` para StatCard (direction, value?, label?)
- Tipo `NavItem` já existe — verificar e atualizar se necessário
- Todos os tipos seguem convenção de nomenclatura do projeto
- TypeScript strict mode sem erros
</requirements>

## Subtarefas

- [x] 11.1 Tipo `SelectOption` já adicionado na tarefa 5.0 (`label`, `value`, `disabled?`, `group?`)
- [x] 11.2 Tipo `ChartDataset` já adicionado na tarefa 10.0 (`label`, `data`, `borderColor?`, `backgroundColor?`)
- [x] 11.3 Tipo `TrendIndicator` já adicionado na tarefa 9.0 (`direction`, `value?`, `label?`)
- [x] 11.4 Tipo `NavItem` alias já existente (tarefa 2.0) — aponta para `NavigationItem` com `label`, `icon`, `to`, `badge?`
- [x] 11.5 Todos os 7 componentes que usam tipos importam via `import type { X } from '~/types'` — UiSelect, StatCard, UiChart, LayoutSidebar, LayoutNavbar, AppLayout, UiToast
- [x] 11.6 `nuxt prepare` gera tipos sem erros

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Modelos de Dados". Os tipos devem ser adicionados na seção "UI Types" existente em `types/index.ts`.

## Critérios de Sucesso

- `types/index.ts` contém SelectOption, ChartDataset, TrendIndicator
- Todos os componentes que usam estes tipos importam corretamente
- Zero erros de TypeScript no build
- Convenção `import type { X }` usada nos componentes

## Testes da Tarefa

- [x] **Build TypeScript:** `nuxt prepare` gera tipos sem erros; zero falhas de compilação
- [x] **Importação:** 7 componentes importam tipos via `import type` — UiSelect (`SelectOption`), StatCard (`TrendIndicator`), UiChart (`ChartDataset`), LayoutSidebar/Navbar/AppLayout (`NavItem`), UiToast (`ToastMessage`)
- [x] **Completude:** Todos os campos opcionais/required estão corretos — `SelectOption.disabled?`, `ChartDataset.borderColor?`, `TrendIndicator.value?`, `NavItem.badge?`

## Arquivos relevantes

- `types/index.ts` — MODIFICADO (adicionar novos tipos)
- `components/ui/UiSelect.vue` — Consome SelectOption
- `components/ui/UiChart.vue` — Consome ChartDataset
- `components/ui/StatCard.vue` — Consome TrendIndicator
- `components/layout/LayoutSidebar.vue` — Consome NavItem
- `components/layout/LayoutNavbar.vue` — Consome NavItem
