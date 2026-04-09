# Tarefa 6.0: Criar UiDatePicker

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar `UiDatePicker` como wrapper do `@vuepic/vue-datepicker` (instalado na tarefa 1.0), aplicando o tema dark do design system e expondo uma API consistente com os demais inputs (label, error, hint, disabled, placeholder).

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Customização de tema dark do datepicker via CSS variables, consistência visual
- `ui-ux-pro-max` — Acessibilidade, keyboard navigation no calendário
- `web-design-guidelines` — ARIA labels no calendário, focus management
</skills>

<requirements>
- Calendarário visual com navegação entre meses e anos (RF-4.7)
- Destaca dia atual e data selecionada (RF-4.8)
- Emite data em formato ISO YYYY-MM-DD (RF-4.9)
- Label, error, hint, disabled consistentes com UiInput
- Tema dark: fundo dark-800, texto branco, highlight primary-500
- Keyboard nav: Tab navega, Enter seleciona, Arrow keys navegam dias
</requirements>

## Subtarefas

- [x] 6.1 Criar `components/ui/UiDatePicker.vue` como wrapper de `@vuepic/vue-datepicker` com prop `dark=true`
- [x] 6.2 Aplicar tema dark via CSS custom properties em `.ui-datepicker-menu.dp__theme_dark` (background #1e293b, text #f8fafc, primary #6366f1)
- [x] 6.3 Implementar label, error, hint, disabled wrapper consistentes com UiInput (mesmo padrão visual)
- [x] 6.4 Converter Date ↔ ISO YYYY-MM-DD via computed setter (`formatDate`)
- [x] 6.5 Prop `range` implementada — aceita/emit `[string, string]` para intervalo de datas
- [x] 6.6 Responsivo: `@vuepic/vue-datepicker` é mobile-friendly nativamente; `teleport=true` garante posicionamento correto

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Decisões Principais" (@vuepic/vue-datepicker) e "Tratamento de Erros". Usar CSS variables do datepicker (`--dp-background-color`, `--dp-text-color`, `--dp-primary-color`, etc.) sobrescrevendo com `:deep()` para match do tema dark. Cores: `--dp-background-color: #1e293b`, `--dp-text-color: #f8fafc`, `--dp-primary-color: #6366f1`.

## Critérios de Sucesso

- UiDatePicker renderiza calendário com tema dark consistente
- Selecionar data emite string ISO YYYY-MM-DD
- Label, error, hint funcionam como UiInput
- Responsivo em mobile (touch-friendly)
- Keyboard navigation funcional
- `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] **Unit — UiDatePicker:** Renderiza label e input; `dark=true` aplica tema escuro; clicar no input abre calendário; selecionar data emite `update:modelValue` em formato ISO YYYY-MM-DD (`formatDate`); dia atual destacado pelo datepicker nativo; prop `disabled` impede interação; error exibe `role="alert"` + borda vermelha via `.dp__input_invalid`; hint exibe sem error; `range` mode emite `[start, end]`
- [x] **Unit — Formato de data:** `formatDate(Date)` retorna `"YYYY-MM-DD"` com zero-padding; `formatFn` exibe `"DD/MM/YYYY"` no input
- [x] **Tema dark:** CSS variables sobrescritas em `.ui-datepicker-menu.dp__theme_dark` — background `#1e293b` (dark-800), text `#f8fafc`, primary `#6366f1` (primary-500), border `#475569` (dark-600)
- [x] **Acessibilidade:** `aria-invalid` no input; `aria-describedby` liga a erro/hint; keyboard navigation nativa do datepicker (Arrow keys, Enter, Escape)

## Arquivos relevantes

- `components/ui/UiDatePicker.vue` — NOVO
- `components/ui/UiInput.vue` — Referência visual para consistência
- `assets/css/tailwind.css` — Possível adição de CSS custom para sobrescrever datepicker
- `package.json` — @vuepic/vue-datepicker (tarefa 1.0)
- `types/index.ts` — Possível tipo DatePickerProps
