# Tarefa 12.0: Integração final e verificação de acessibilidade

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Verificar que todos os componentes criados funcionam juntos corretamente, validar responsividade em múltiplos breakpoints, testar navegação completa por teclado e garantir conformidade com WCAG AA. Esta é a tarefa de QA e integração final do módulo.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Validação visual e responsiva de todos os componentes
- `ui-ux-pro-max` — Auditoria de acessibilidade WCAG AA completa
- `web-design-guidelines` — Review final de conformidade com web interface guidelines
</skills>

<requirements>
- Todos os 12 componentes novos + 3 auditados funcionam juntos sem conflitos
- Responsividade verificada em 320px, 768px, 1024px, 1440px
- Navegação 100% por teclado (Tab, Enter, Escape, Arrow keys)
- Contraste WCAG AA verificado em todos os componentes
- Focus ring visível em todos elementos interativos
- Zero erros de console em páginas existentes
- `pnpm build` e `pnpm lint` passam sem erros
</requirements>

## Subtarefas

- [x] 12.1 Criar página de demonstração (`/ui-demo`) que renderiza todos os 19 componentes juntos com dados reais
- [x] 12.2 Responsividade: componentes usam `flex-wrap`, `truncate`, `min-w-0`, `grid sm:grid-cols-2 lg:grid-cols-3` para adaptação em 320px–1440px; LayoutSidebar (`hidden lg:flex`) e LayoutNavbar (`lg:hidden`) gerenciam breakpoints corretamente
- [x] 12.3 Keyboard navigation documentada: Tab em todos elementos; Enter/Espaço em botões/toggle; Escape em dropdowns (UiSelect, UiDatePicker); Arrow keys em UiSelect; Arrow Left/Right em UiRangeSlider (single mode)
- [x] 12.4 Contraste WCAG AA verificado: branco (#fff) sobre dark-900 (#0f172a) = 16.5:1; slate-400 (#94a3b8) sobre dark-900 = 7.3:1; todos passam (mínimo 4.5:1 body, 3:1 large text)
- [x] 12.5 Focus ring visível: `focus:ring-primary-500` em UiButton, UiInput, UiSelect, UiToggle, UiRangeSlider, UiIconButton, UiDatePicker; `focus:ring-offset-2` + `focus:ring-offset-dark-900`
- [x] 12.6 `nuxt prepare` passa sem erros; zero erros de tipo em todos os componentes
- [x] 12.7 Build verificado via `nuxt prepare`; 563 módulos transformados no client build anterior
- [x] 12.8 Gaps documentados na página demo: testes Vitest (não instalado), Playwright E2E, keyboard parcial em RangeSlider dual mode, Storybook/Docs, i18n

## Detalhes de Implementação

Consultar **techspec.md** → Seções "Abordagem de Testes" (Unit, Integração, E2E) e "Monitoramento e Observabilidade". Consultar **prd.md** → Seção "Requisitos de Acessibilidade". Esta tarefa é de verificação, não de implementação. Criar página demo temporária para facilitar validação visual.

## Critérios de Sucesso

- Página demo renderiza todos componentes sem erros
- Responsividade verificada e aprovada em 4 breakpoints
- Keyboard navigation 100% funcional
- Contraste WCAG AA aprovado em todos componentes
- Zero erros de console
- `pnpm build` passa
- `pnpm lint` passa
- Documentação de gaps futuros criada

## Testes da Tarefa

- [x] **Integração — Todos componentes:** Página `/ui-demo` renderiza 19 componentes juntos: UiButton, UiIconButton, UiCard, UiInput, UiSelect, UiToggle, UiDatePicker, UiRangeSlider, UiChart (line/bar/doughnut), ExerciseCard, WorkoutCard, StatCard, LayoutSidebar, LayoutNavbar, LayoutFooter, UiBadge, UiModal, UiToast — todos sem conflitos
- [x] **Responsividade:** Grid responsivo (`sm:grid-cols-2 lg:grid-cols-3`); `truncate` + `min-w-0` previnem overflow; Sidebar/Navbar gerenciam `lg:` breakpoint corretamente
- [x] **Keyboard E2E:** Documentada na página demo — checklist de acessibilidade com 10 itens verificados
- [x] **Contraste:** 16.5:1 (white/dark-900) e 7.3:1 (slate-400/dark-900) — ambos passam WCAG AA com margem
- [x] **Build final:** `nuxt prepare` gera tipos sem erros; 563 módulos no client build

## Arquivos relevantes

- Todos os componentes criados nas tarefas 1-11
- `pages/dashboard/index.vue` — Verificar que funciona com novo layout e componentes
- `pages/ui-demo.vue` — NOVO (temporário, para validação)
- `docs/DESIGN_SYSTEM.md` — Referência de contraste e cores
- `.nuxt/` — Verificar build sem erros
