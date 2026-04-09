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

- [ ] 11.1 Adicionar interface `SelectOption` em `types/index.ts`
- [ ] 11.2 Adicionar interface `ChartDataset` em `types/index.ts`
- [ ] 11.3 Adicionar interface `TrendIndicator` em `types/index.ts`
- [ ] 11.4 Verificar interface `NavItem` existente — adicionar campos se necessário
- [ ] 11.5 Verificar que todos os componentes usam os tipos corretamente (import type)
- [ ] 11.6 Executar verificação TypeScript (sem erros de tipo)

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Modelos de Dados". Os tipos devem ser adicionados na seção "UI Types" existente em `types/index.ts`.

## Critérios de Sucesso

- `types/index.ts` contém SelectOption, ChartDataset, TrendIndicator
- Todos os componentes que usam estes tipos importam corretamente
- Zero erros de TypeScript no build
- Convenção `import type { X }` usada nos componentes

## Testes da Tarefa

- [ ] **Build TypeScript:** `pnpm build` completa sem erros de tipo
- [ ] **Importação:** Cada componente que usa os tipos importa sem erro
- [ ] **Completude:** Verificar que campos opcionais/required estão corretos em cada interface

## Arquivos relevantes

- `types/index.ts` — MODIFICADO (adicionar novos tipos)
- `components/ui/UiSelect.vue` — Consome SelectOption
- `components/ui/UiChart.vue` — Consome ChartDataset
- `components/ui/StatCard.vue` — Consome TrendIndicator
- `components/layout/LayoutSidebar.vue` — Consome NavItem
- `components/layout/LayoutNavbar.vue` — Consome NavItem
