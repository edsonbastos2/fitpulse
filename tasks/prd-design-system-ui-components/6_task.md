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

- [ ] 6.1 Criar `components/ui/UiDatePicker.vue` como wrapper de `@vuepic/vue-datepicker`
- [ ] 6.2 Aplicar tema dark via CSS custom properties/props do datepicker (dark mode, cores primary)
- [ ] 6.3 Implementar label, error, hint, disabled wrapper ao redor do datepicker
- [ ] 6.4 Converter data emit para formato ISO YYYY-MM-DD
- [ ] 6.5 Adicionar prop `range` para suporte a seleção de intervalo de datas (opcional, futuro)
- [ ] 6.6 Verificar responsividade (mobile-friendly)

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

- [ ] **Unit — UiDatePicker:** Renderiza label e input; clicar no input abre calendário; selecionar data emite update:modelValue em formato ISO; dia atual destacado; prop disabled impede interação; error exibe mensagem com role="alert"; hint exibe sem error
- [ ] **Unit — Formato de data:** Verificar que data selecionada é emitida como "YYYY-MM-DD"
- [ ] **Tema dark:** Verificar que CSS variables sobrescrevem cores para tema dark (background #1e293b, text #f8fafc, primary #6366f1)
- [ ] **Acessibilidade:** Verificar aria-label no input, keyboard navigation no calendário (Arrow keys, Enter, Escape)

## Arquivos relevantes

- `components/ui/UiDatePicker.vue` — NOVO
- `components/ui/UiInput.vue` — Referência visual para consistência
- `assets/css/tailwind.css` — Possível adição de CSS custom para sobrescrever datepicker
- `package.json` — @vuepic/vue-datepicker (tarefa 1.0)
- `types/index.ts` — Possível tipo DatePickerProps
