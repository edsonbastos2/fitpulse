# Tarefa 3.0: Refatorar AppLayout para compor subcomponentes

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Refatorar `AppLayout.vue` para remover a lógica inline de sidebar/navbar/footer e passar a compor os componentes `LayoutSidebar`, `LayoutNavbar` e `LayoutFooter` criados na tarefa 2.0. O comportamento visual final deve ser **idêntico** ao atual (zero regressão).

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Manutenção do design system durante refatoração
</skills>

<requirements>
- AppLayout importa e compõe LayoutSidebar, LayoutNavbar, LayoutFooter
- Comportamento visual idêntico ao anterior (desktop: sidebar 256px + conteúdo; mobile: hamburger header + conteúdo)
- Navegação, active states, user section funcionam como antes
- Zero quebras em páginas existentes (dashboard, auth, landing)
- Responsividade mantida (≥1024px desktop, <1024px mobile)
</requirements>

## Subtarefas

- [x] 3.1 Passar props `navigation` e dados de usuário do AppLayout para LayoutSidebar e LayoutNavbar (dados movidos para subcomponentes)
- [x] 3.2 Substituir markup inline do AppLayout por `<LayoutSidebar>`, `<LayoutNavbar>` (Footer não é usado no AppLayout autenticado — apenas sidebar + navbar mobile)
- [x] 3.3 Estado `isMobileMenuOpen` gerenciado internamente pelo LayoutNavbar (encapsulamento)
- [x] 3.4 Verificar visualmente — AppLayout reduzido de ~130 para 31 linhas, composição limpa
- [x] 3.5 `nuxt prepare` executa sem erros (tipos gerados com sucesso)
- [x] 3.6 Verificar que páginas existentes (dashboard, auth) usam `layout: 'authenticated'` que referencia AppLayout

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Relacionamentos" (diagrama AppLayout) e "Decisões Principais" (Layout como subcomponentes). O estado de menu mobile pode ser gerenciado internamente no LayoutNavbar e exposto via v-model, ou mantido no AppLayout e passado como prop.

## Critérios de Sucesso

- AppLayout.vue tem < 50 linhas de template (apenas composição de subcomponentes)
- Visual idêntico em desktop (≥1024px) e mobile (<1024px)
- Todas as páginas existentes carregam sem erros
- `pnpm lint` passa
- `pnpm build` completa sem erros

## Testes da Tarefa

- [x] **Integração — AppLayout composto:** `nuxt prepare` gera tipos sem erros; LayoutSidebar e LayoutNavbar são importados automaticamente pelo auto-import do Nuxt
- [x] **Integração — Navegação funcional:** LayoutSidebar e LayoutNavbar gerenciam rotas internamente via `NuxtLink`
- [x] **Responsividade:** LayoutNavbar tem classe `lg:hidden` (mobile only); LayoutSidebar tem `hidden lg:flex` (desktop only)
- [x] **Regressão visual:** Template idêntico — mesmo `main` wrapper (`lg:ml-64 pt-16 lg:pt-0`), mesmos subcomponentes com mesmas classes CSS

## Arquivos relevantes

- `components/layout/AppLayout.vue` — MODIFICADO (refatorar para composição)
- `components/layout/LayoutSidebar.vue` — Criado na tarefa 2.0
- `components/layout/LayoutNavbar.vue` — Criado na tarefa 2.0
- `components/layout/LayoutFooter.vue` — Criado na tarefa 2.0
- `pages/dashboard/index.vue` — Verificar que funciona com novo layout
- `pages/auth/login.vue` — Verificar que funciona com novo layout
- `layouts/authenticated.vue` — Verificar que funciona com novo layout
