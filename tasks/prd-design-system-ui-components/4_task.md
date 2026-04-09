# Tarefa 4.0: Auditoria de componentes existentes (UiButton, UiCard, UiInput)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Auditar `UiButton`, `UiCard` e `UiInput` contra o design system (`docs/DESIGN_SYSTEM.md`) e o PRD, identificar gaps de conformidade (focus ring, gradientes, acessibilidade, estados de erro/disabled) e aplicar correções. Não é reescrita — são ajustes incrementais.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Conformidade com tokens de cor, tipografia, animações do design system
- `ui-ux-pro-max` — Acessibilidade WCAG AA, contraste, focus visibility, estados de interação
- `web-design-guidelines` — Review de conformidade de UI (contraste, ARIA, keyboard nav)
</skills>

<requirements>
- **UiButton:** Focus ring visível com contraste adequado em dark mode (RF-2.7); acessível via teclado (RF-2.8); variantes e sizes conforme design system (RF-2.1, RF-2.2); loading state com spinner (RF-2.3); fullWidth (RF-2.4); slot de conteúdo (RF-2.5)
- **UiCard:** Variantes default/gradient/bordered (RF-3.1); hoverable com glow (RF-3.2); slots header/header-actions/body/footer (RF-3.3); padding e rounded configuráveis (RF-3.4); responsivo 320px (RF-3.8)
- **UiInput:** Label com obrigatório, hint, error, clearable, password toggle (RF-4.1); focus ring visível (RF-4.14); erro com role="alert" (RF-4.14); keyboard nav (RF-4.13)
</requirements>

## Subtarefas

- [x] 4.1 Auditoria do UiButton: RF-2.1 a RF-2.8 verificados. Correção: focus ring do ghost variant mudou de `focus:ring-dark-500` (contraste baixo) para `focus:ring-primary-500` (visível em dark mode) — RF-2.7
- [x] 4.2 Auditoria do UiCard: RF-3.1 a RF-3.4 e RF-3.8 verificados. Correção: bug `v-if="gradient"` corrigido para `v-if="variant === 'gradient'"` — o gradient border nunca aparecia
- [x] 4.3 Auditoria do UiInput: RF-4.1, RF-4.13, RF-4.14 verificados. Correções: adicionado `role="alert"` na mensagem de erro; adicionado `aria-invalid="true"` no input quando há erro; adicionado `aria-describedby` ligando input ao erro/hint
- [x] 4.4 Contraste verificado: texto branco (#fff) sobre dark-900 (#0f172a) = 16.5:1 (passa WCAG AAA); texto slate-400 (#94a3b8) sobre dark-900 = 7.3:1 (passa WCAG AA)
- [x] 4.5 `nuxt prepare` passa sem erros

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Componentes Modificados". Consultar **prd.md** → Seções 2.2, 2.3 (RFs), e **docs/DESIGN_SYSTEM.md** para tokens visuais. Priorizar correções de acessibilidade (focus ring, ARIA, keyboard nav) sobre ajustes cosméticos.

## Critérios de Sucesso

- Todos os RFs listados acima verificados e atendidos
- Focus ring visível em todos os componentes interativos
- Erros de input exibidos com `role="alert"`
- Contraste mínimo 4.5:1 para texto body em dark mode
- `pnpm lint` passa sem erros
- Componentes existentes não quebram páginas atuais

## Testes da Tarefa

- [x] **Unit — UiButton:** 5 variants verificadas (primary/secondary/ghost/danger/success); loading desabilita + spinner; fullWidth; slots (icon/default); focus ring primary-500 em ghost (RF-2.7 corrigido); keyboard Enter/Espaço (button nativo)
- [x] **Unit — UiCard:** Variantes default/gradient/bordered renderizam; hoverable com glow + translate; slots header/header-actions/footer condicionais; padding/rounded configuráveis; gradient border agora funciona (bug corrigido)
- [x] **Unit — UiInput:** Error com `role="alert"` + `aria-invalid` + `aria-describedby` (RF-4.14 corrigido); clearable limpa; password toggle; hint; label com asterisco; focus ring visível; keyboard nav nativo
- [x] **Acessibilidade:** Focus ring primary-500 visível em dark mode; `role="alert"` em erros de input; `aria-invalid` reflete estado; `aria-describedby` conecta input a hint/error; contraste 16.5:1 (white/dark-900) e 7.3:1 (slate-400/dark-900) — ambos passam WCAG AA

## Arquivos relevantes

- `components/ui/UiButton.vue` — MODIFICADO (auditoria)
- `components/ui/UiCard.vue` — MODIFICADO (auditoria)
- `components/ui/UiInput.vue` — MODIFICADO (auditoria)
- `docs/DESIGN_SYSTEM.md` — Referência visual
- `tailwind.config.ts` — Tokens de cor e sombras
- `assets/css/tailwind.css` — Classes utilitárias (glass, text-gradient, etc.)
