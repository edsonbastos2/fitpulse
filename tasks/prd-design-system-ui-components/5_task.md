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

- [ ] 5.1 Criar `components/ui/UiSelect.vue` com dropdown, busca interna, option groups, keyboard nav, click-outside para fechar
- [ ] 5.2 Criar `components/ui/UiToggle.vue` com switch visual, label, disabled state, v-model
- [ ] 5.3 Adicionar tipo `SelectOption` em `types/index.ts` (label, value, disabled, group)
- [ ] 5.4 Implementar diretiva customizada `v-click-outside` (ou usar `@vueuse/core` useOnClickOutside) para fechar dropdown
- [ ] 5.5 Garantir consistência visual com UiInput (mesma borda, focus ring, rounded)
- [ ] 5.6 Verificar acessibilidade: role="listbox", role="option", aria-expanded, aria-selected, role="switch", aria-checked

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

- [ ] **Unit — UiSelect:** Renderiza opções; busca filtra opções (digitar texto reduz lista visível); seleção emite update:modelValue; Escape fecha dropdown; click-outside fecha; disabled state impede interação; error/hint/placeholder renderizam; Arrow Down/Up navega entre opções
- [ ] **Unit — UiToggle:** Toggle on/off emite update:modelValue; disabled state impede clique; label renderiza; aria-checked reflete estado; Space ativa toggle
- [ ] **Integração — Formulário:** UiSelect + UiInput + UiToggle em formulário; submeter verifica valores corretos
- [ ] **Acessibilidade:** Verificar role="listbox" no dropdown, role="option" nas opções, aria-expanded, role="switch" no toggle, aria-checked

## Arquivos relevantes

- `components/ui/UiSelect.vue` — NOVO
- `components/ui/UiToggle.vue` — NOVO
- `types/index.ts` — tipo SelectOption
- `components/ui/UiInput.vue` — Referência visual para consistência
- `composables/useToast.ts` — Referência de padrão composables
- `@vueuse/core` — onClickOutside (já instalado)
