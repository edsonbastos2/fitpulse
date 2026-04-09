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

- [ ] 12.1 Criar página de demonstração (`/ui-demo` ou similar) que renderiza todos os componentes juntos
- [ ] 12.2 Verificar responsividade em 4 breakpoints: 320px, 768px, 1024px, 1440px
- [ ] 12.3 Testar navegação por teclado completa: Tab ordem lógica, Enter/Espaço ativa, Escape fecha overlays, Arrow keys em selects/sliders
- [ ] 12.4 Verificar contraste de todos os componentes (WCAG AA: 4.5:1 body, 3:1 large text)
- [ ] 12.5 Verificar focus ring visível em todos elementos interativos
- [ ] 12.6 Verificar zero erros de console em dashboard e páginas existentes
- [ ] 12.7 Executar `pnpm build` e `pnpm lint` — ambos devem passar
- [ ] 12.8 Documentar qualquer gap restante como issue futura

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

- [ ] **Integração — Todos componentes:** Página demo com UiButton, UiIconButton, UiCard, UiInput, UiSelect, UiToggle, UiDatePicker, UiRangeSlider, UiChart, ExerciseCard, WorkoutCard, StatCard, LayoutSidebar, LayoutNavbar, LayoutFooter — todos renderizam juntos
- [ ] **Responsividade:** Testar em 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide) — layout adapta sem overflow ou quebra
- [ ] **Keyboard E2E:** Tab de início ao fim da página demo; Enter ativa botões; Escape fecha dropdowns/modals; Arrow keys em select e range slider
- [ ] **Contraste:** Verificar com ferramenta (Lighthouse ou axe DevTools) que todos textos passam WCAG AA
- [ ] **Build final:** `pnpm build` e `pnpm lint` sem erros

## Arquivos relevantes

- Todos os componentes criados nas tarefas 1-11
- `pages/dashboard/index.vue` — Verificar que funciona com novo layout e componentes
- `pages/ui-demo.vue` — NOVO (temporário, para validação)
- `docs/DESIGN_SYSTEM.md` — Referência de contraste e cores
- `.nuxt/` — Verificar build sem erros
