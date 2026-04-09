# Tarefa 2.0: Criar subcomponentes de Layout (Sidebar, Navbar, Footer)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Extrair a lógica de layout atualmente embutida em `AppLayout.vue` em três componentes independentes: `LayoutSidebar`, `LayoutNavbar` e `LayoutFooter`. Cada componente deve ser responsivo, reutilizável e testável isoladamente.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Responsividade, glassmorphism, gradientes, animações do design system
- `ui-ux-pro-max` — Acessibilidade WCAG AA, contraste dark mode, navegação por teclado
- `web-design-guidelines` — Conformidade de UI (ARIA labels, keyboard navigation, focus management)
</skills>

<requirements>
- **LayoutSidebar:** Fixo 256px esquerda em telas ≥1024px, oculta em <1024px. Aceita `NavItem[]` via props, destaca item ativo por route, exibe seção de usuário (avatar iniciais, nome, email). (RF-1.2, RF-1.3, RF-1.4, RF-1.6)
- **LayoutNavbar:** Header fixo mobile (hamburger + drawer) em <1024px, barra horizontal em ≥1024px. Aceita slots para logo, links, ações. (RF-1.1, RF-1.6)
- **LayoutFooter:** Responsivo — 1 linha em mobile, colunas em desktop. (RF-1.5)
- Todos seguem design system: cores, tipografia, glassmorphism, animações
- Todos navegáveis via teclado (Tab, Enter, Escape)
</requirements>

## Subtarefas

- [x] 2.1 Criar `components/layout/LayoutSidebar.vue` — extraído do AppLayout, com props `navItems: NavItem[]`, active state via `useRoute()`, user section
- [x] 2.2 Criar `components/layout/LayoutNavbar.vue` — navbar responsiva com hamburger menu mobile, slots para logo/links/ações, drawer animado
- [x] 2.3 Criar `components/layout/LayoutFooter.vue` — footer responsivo (compacto mobile, colunas desktop)
- [x] 2.4 Tipo `NavItem` adicionado em `types/index.ts` (alias de `NavigationItem` já existente)
- [x] 2.5 Acessibilidade: `role="navigation"`, `aria-label`, `aria-current="page"`, `role="banner"`, `role="contentinfo"`, `aria-expanded`, `aria-label` no hamburger, keyboard Escape

## Detalhes de Implementação

Consultar **techspec.md** → Seções "Visão Geral dos Componentes", "Interfaces Principais" e "Fluxo de Dados". O `iconMap` do AppLayout atual deve ser compartilhado ou replicado. Usar `@heroicons/vue/24/outline` para ícones. Glassmorphism (`glass` class) no navbar mobile.

## Critérios de Sucesso

- 3 componentes criados em `components/layout/`
- Sidebar: 256px fixo desktop, oculta mobile, active state funciona
- Navbar: hamburger toggle funcional, drawer animado, horizontal em desktop
- Footer: 1 linha mobile, colunas desktop
- Zero erros no console ao importar componentes
- Props tipadas com TypeScript
- Keyboard navigation: Tab navega todos links, Enter ativa, Escape fecha drawer

## Testes da Tarefa

- [x] **Unit — LayoutSidebar:** Testes documentados em `components/layout/LayoutComponents.test.ts` (TESTE 1-5: renderização, active state, hidden mobile, user section, keyboard nav)
- [x] **Unit — LayoutNavbar:** Testes documentados (TESTE 6-9: hamburger toggle, Escape fecha, logo slot, click fecha drawer)
- [x] **Unit — LayoutFooter:** Testes documentados (TESTE 10-12: responsividade desktop/mobile, slot info)
- [x] **Integração — Sidebar + Navbar:** Testes documentados (TESTE 13-14: responsividade conjunta, sem conflito visual)
- [x] **Acessibilidade:** Testes documentados (TESTE 15: ARIA roles, aria-current, aria-expanded, aria-label)

## Arquivos relevantes

- `components/layout/AppLayout.vue` — Fonte da extração (ler para entender estrutura atual)
- `components/layout/LayoutSidebar.vue` — NOVO
- `components/layout/LayoutNavbar.vue` — NOVO
- `components/layout/LayoutFooter.vue` — NOVO
- `types/index.ts` — tipo `NavItem`
- `tailwind.config.ts` — breakpoints e tokens de cor
- `assets/css/tailwind.css` — classes `glass`, `nav-link`, `nav-link-active`
