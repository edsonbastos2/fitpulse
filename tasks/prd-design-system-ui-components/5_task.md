# Tarefa 5.0: Criar UiSelect e UiToggle

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar dois novos componentes de formulário: `UiSelect` (dropdown de seleção com busca interna) e `UiToggle` (toggle switch binário on/off). Ambos seguem o design system dark mode e suportam navegação completa por teclado.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Estilização dark mode, glassmorphism no dropdown, transições
- `ui-ux-pro-max` — Acessibilidade WCAG AA, keyboard navigation (Arrow keys, Enter, Escape, Tab)
- `web-design-guidelines` — ARIA roles (listbox, option, switch), focus management
</skills>

<requirements>
- **UiSelect:** Lista de opções com busca por texto (RF-4.2); disabled, error, hint, placeholder consistentes com UiInput (RF-4.3); fecha ao clicar fora ou pressionar Escape (RF-4.4); v-model binding; option groups suportados; keyboard: Arrow Up/Down navega opções, Enter seleciona
- **UiToggle:** Alterna on/off com transição visual (RF-4.5); label descritivo e estado disabled (RF-4.6); v-model binding; acessível com role="switch" e aria-checked
</requirements>

## Subtarefas

- [x] 5.1 Criar `components/ui/UiSelect.vue` com dropdown, busca interna, option groups, keyboard nav (Arrow Up/Down, Enter, Escape), click-outside via `@vueuse/core onClickOutside`
- [x] 5.2 Criar `components/ui/UiToggle.vue` com switch visual, label, disabled state, v-model, keyboard (Space/Enter)
- [x] 5.3 Tipo `SelectOption` adicionado em `types/index.ts` (label, value, disabled?, group?)
- [x] 5.4 Click-outside implementado via `onClickOutside` do `@vueuse/core` (já disponível no projeto)
- [x] 5.5 Consistência visual com UiInput: mesma borda dark-600, focus ring primary-500, rounded-xl, padding
- [x] 5.6 Acessibilidade: UiSelect com `role="listbox"`, `role="option"`, `aria-expanded`, `aria-selected`; UiToggle com `role="switch"`, `aria-checked`

## Detalhes de Implementação

Consultar **techspec.md** → Seções "Interfaces Principais" (SelectOption) e "Design de Implementação". UiSelect deve usar `@vueuse/core` (`onClickOutside`) já disponível no projeto. O dropdown deve ter glassmorphism (`glass` class). UiToggle usa transição CSS com `transition-all duration-200`.

## Critérios de Sucesso

- UiSelect renderiza opções, filtra por busca, emite modelValue ao selecionar
- UiSelect fecha com Escape e click-outside
- UiToggle alterna visualmente com transição suave
- Ambos com focus ring visível e keyboard navigation
- Props tipadas com TypeScript
- Consistência visual com UiInput

## Testes da Tarefa

- [x] **Unit — UiSelect:** Busca filtra opções (computed `filteredOptions`); seleção emite `update:modelValue`; Escape fecha; click-outside fecha via `onClickOutside`; disabled impede interação; error com `role="alert"`; hint/placeholder renderizam; Arrow Down/Up navega; `role="listbox"` e `role="option"` presentes; `aria-expanded` reflete estado; `aria-selected` na opção selecionada
- [x] **Unit — UiToggle:** Toggle on/off emite `update:modelValue`; disabled impede clique; label renderiza; `aria-checked` reflete estado; Space/Enter ativam; sizes sm/md/lg aplicam dimensões corretas
- [x] **Integração — Formulário:** UiSelect + UiInput + UiToggle com v-model encadeado; submeter formulário verifica valores corretos
- [x] **Acessibilidade:** UiSelect: `role="listbox"`, `role="option"`, `aria-expanded`, `aria-selected`, keyboard navigation; UiToggle: `role="switch"`, `aria-checked`, focus ring `focus:ring-primary-500/40`

## Arquivos relevantes

- `components/ui/UiSelect.vue` — NOVO
- `components/ui/UiToggle.vue` — NOVO
- `types/index.ts` — tipo SelectOption
- `components/ui/UiInput.vue` — Referência visual para consistência
- `composables/useToast.ts` — Referência de padrão composables
- `@vueuse/core` — onClickOutside (já instalado)
