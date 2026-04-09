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

- [ ] 4.1 Auditoria do UiButton: verificar cada requisito RF-2.1 a RF-2.8 contra implementação atual; corrigir gaps
- [ ] 4.2 Auditoria do UiCard: verificar RF-3.1 a RF-3.4 e RF-3.8; corrigir gaps
- [ ] 4.3 Auditoria do UiInput: verificar RF-4.1, RF-4.13, RF-4.14; corrigir gaps (especialmente role="alert" em erros)
- [ ] 4.4 Verificar contraste de texto/fundo em dark mode para todos os 3 componentes (WCAG AA: 4.5:1 body, 3:1 large text)
- [ ] 4.5 Executar `pnpm lint` e corrigir warnings

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

- [ ] **Unit — UiButton:** Renderiza com cada variant (primary, secondary, ghost, danger, success); loading desabilita clique e exibe spinner; fullWidth aplica w-full; slot de conteúdo renderiza; keyboard Enter/Espaço ativa botão
- [ ] **Unit — UiCard:** Variantes renderizam corretamente; hoverable aplica classes de hover; slots header/footer renderizam condicionalmente; padding configurável funciona
- [ ] **Unit — UiInput:** Error exibe mensagem com role="alert"; clearable limpa valor; password toggle funciona; hint exibe sem error; label com asterisco obrigatório; focus ring visível
- [ ] **Acessibilidade:** Verificar focus-visible em todos componentes; aria-label em botões de ícone; aria-invalid="true" em inputs com erro

## Arquivos relevantes

- `components/ui/UiButton.vue` — MODIFICADO (auditoria)
- `components/ui/UiCard.vue` — MODIFICADO (auditoria)
- `components/ui/UiInput.vue` — MODIFICADO (auditoria)
- `docs/DESIGN_SYSTEM.md` — Referência visual
- `tailwind.config.ts` — Tokens de cor e sombras
- `assets/css/tailwind.css` — Classes utilitárias (glass, text-gradient, etc.)
