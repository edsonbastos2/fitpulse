# PRD — Módulo 2: Design System & UI Components

## Visão Geral

O FitPulse possui componentes de UI básicos (UiButton, UiCard, UiInput, UiBadge, UiModal, UiToast) e um layout monolítico (AppLayout) que embute navbar, sidebar e estrutura de conteúdo. Este módulo visa **auditar, padronizar e expandir** o conjunto de componentes reutilizáveis da aplicação, extraindo layout em componentes independentes, criando componentes de input faltantes (Select, Toggle, DatePicker, RangeSlider), adicionando cards especializados (ExerciseCard, WorkoutCard, StatCard) e um componente de gráficos para visualização de progresso.

O resultado será uma biblioteca de componentes consistente, acessível e alinhada ao design system existente (dark mode, glassmorphism, gradientes vibrantes), pronta para ser consumida por todas as páginas e módulos do FitPulse.

## Objetivos

- **Consistência:** 100% dos componentes de UI seguem o design system documentado (`docs/DESIGN_SYSTEM.md`) em cores, tipografia, espaçamento, border-radius e animações
- **Reusabilidade:** Componentes desacoplados de lógica de negócio, utilizáveis em qualquer página via props e slots
- **Cobertura:** Atender às 5 áreas definidas — Layout Base (2.1), Botões (2.2), Cards (2.3), Inputs (2.4), Gráficos (2.5)
- **Acessibilidade:** Todos os componentes interativos com navegação por teclado, atributos ARIA e contraste mínimo WCAG AA para texto em dark mode
- **Performance:** Componentes com bundle leve; gráficos usando biblioteca com tree-shaking e lazy loading

### Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Componentes documentados com props e exemplos | 100% do catálogo |
| Componentes acessíveis via teclado | 100% dos interativos |
| Audit de componentes existentes concluído | Itens conformes com design system |
| Zero regressão visual em páginas existentes | Builds e páginas atuais sem quebras |

## Histórias de Usuário

### Personas

- **Desenvolvedor(a) FitPulse** — Consome componentes da biblioteca para construir páginas e funcionalidades. Precisa de API clara (props, slots, emits), tipagem TypeScript completa e comportamento previsível.
- **Usuário final (atleta)** — Interage com a UI do aplicativo. Espera navegação intuitiva, feedback visual imediato, acessibilidade e experiência consistente em desktop e mobile.

### Histórias

| # | História | Benefício |
|---|----------|-----------|
| H1 | Como desenvolvedor(a), quero componentes de layout (Navbar, Sidebar, Footer) independentes para que eu possa compor diferentes layouts sem duplicar código | Reduz duplicação e facilita manutenção |
| H2 | Como desenvolvedor(a), quero que UiButton suporte variant `icon` dedicado para que botões somente com ícone tenham sizing e padding consistentes | UI consistente em toolbars e actions |
| H3 | Como desenvolvedor(a), quero cards especializados (ExerciseCard, WorkoutCard, StatCard) para que eu exiba informações contextuais sem recriar layout em cada página | Acelera desenvolvimento de listagens e dashboards |
| H4 | Como usuário(a), quero navegar pelo app com navbar responsiva (sidebar desktop / hamburger mobile) para que eu tenha acesso consistente a todas as seções | Experiência unificada em todos os breakpoints |
| H5 | Como desenvolvedor(a), quero UiSelect, UiToggle, UiDatePicker e UiRangeSlider para que eu construa formulários completos sem dependências externas dispersas | Centraliza inputs no design system |
| H6 | Como usuário(a), quero visualizar meu progresso em treinos com gráficos claros para que eu acompanhe minha evolução | Feedback visual de progresso |
| H7 | Como desenvolvedor(a), quero UiChart com API simples (tipo de gráfico, dados, labels) para que eu renderize visualizações sem configurar biblioteca em cada página | Abstração reutilizável de gráficos |
| H8 | Como usuário(a) que navega por teclado, quero que todos os componentes interativos sejam acessíveis via Tab, Enter e Escape para que eu use o app sem mouse | Acessibilidade inclusiva |

## Funcionalidades Principais

### 2.1 — Layout Base

**O que faz:** Fornece componentes estruturais de layout — Navbar, Sidebar e Footer — como peças independentes, extraídas do AppLayout atual.

**Por que é importante:** O AppLayout monolítico impede reuso em contextos diferentes (ex: landing page com navbar simples, modal com layout próprio). Componentes independentes permitem composição flexível.

**Como funciona em alto nível:**
- **Navbar:** Barra de navegação responsiva; em desktop exibe links horizontais + logo; em mobile exibe menu hamburger com drawer. Aceita slots para logo, links e ações.
- **Sidebar:** Menu lateral para desktop (256px fixo) com navegação, indicador de item ativo e seção de usuário. Aceita lista de itens via props e slots para customização.
- **Footer:** Rodapé responsivo com links, copyright e informações opcionais. Simples em mobile, expandido em desktop.

**Requisitos Funcionais:**

| # | Requisito |
|---|-----------|
| RF-1.1 | A Navbar deve exibir layout horizontal em telas ≥ 1024px e menu hamburger em telas < 1024px |
| RF-1.2 | A Sidebar deve ser fixa à esquerda com 256px de largura em telas ≥ 1024px e oculta em telas menores |
| RF-1.3 | A Sidebar deve destacar visualmente o item de navegação ativo (matching route) |
| RF-1.4 | A Sidebar deve exibir informações do usuário logado (avatar com iniciais, nome, email) ou estado de não-autenticado |
| RF-1.5 | O Footer deve ser responsivo: compacto em mobile (1 linha) e expandido em desktop (colunas) |
| RF-1.6 | Navbar e Sidebar devem aceitar itens de navegação via props (array com label, ícone, rota, badge opcional) |
| RF-1.7 | O AppLayout existente deve ser refatorado para compor Navbar, Sidebar e Footer como subcomponentes, sem alterar comportamento visual atual |

### 2.2 — Botões

**O que faz:** Padroniza e expande a família de botões do design system.

**Por que é importante:** Botões são o componente interativo mais comum. Devem ser consistentes em aparência, acessibilidade e estados (hover, focus, disabled, loading).

**Como funciona em alto nível:**
- **Auditoria do UiButton existente:** Verificar conformidade com design system (gradientes, glow, sizes, focus rings), corrigir gaps
- **UiIconButton:** Botão dedicado para ícones (circular ou quadrado), com variants ghost e primary. Pode ser extraído do UiButton existente como variante especializada

**Requisitos Funcionais:**

| # | Requisito |
|---|-----------|
| RF-2.1 | UiButton deve suportar variants: `primary`, `secondary`, `ghost`, `danger`, `success` |
| RF-2.2 | UiButton deve suportar tamanhos: `sm`, `md`, `lg` com padding e font-size proporcionais |
| RF-2.3 | UiButton deve suportar estado `loading` com spinner animado e desabilitar clique |
| RF-2.4 | UiButton deve suportar `fullWidth` para ocupar largura total do container |
| RF-2.5 | UiButton deve suportar slot para conteúdo customizável (ícone + texto) |
| RF-2.6 | UiIconButton deve renderizar botão circular/quadrado contendo apenas ícone, com variants `ghost` e `primary` |
| RF-2.7 | Todos os botões devem ter focus ring visível com contraste adequado em dark mode |
| RF-2.8 | Todos os botões devem ser acessíveis via teclado (Tab para focar, Enter/Espaço para ativar) |

### 2.3 — Cards

**O que faz:** Fornece cards genéricos e especializados para exibição de conteúdo.

**Por que é importante:** Cards são a unidade visual principal do dashboard. Cards especializados garantem consistência na exibição de exercícios, treinos e estatísticas.

**Como funciona em alto nível:**
- **Auditoria do UiCard existente:** Verificar conformidade (variantes, hoverable, header/footer slots, padding, rounded)
- **ExerciseCard:** Card para exibir um exercício com nome, grupo muscular, ícone, equipamento e badge de dificuldade. Aceita slot para ações extras
- **WorkoutCard:** Card para exibir um treino com título, descrição, contagem de exercícios, duração estimada, status (ativo, completo, agendado) e badge de progresso. Aceita ações e clique para detalhes
- **StatCard:** Card compacto para métricas com valor numérico em destaque, label, ícone decorativo e indicador de tendência (up/down/neutral)

**Requisitos Funcionais:**

| # | Requisito |
|---|-----------|
| RF-3.1 | UiCard deve suportar variantes: `default`, `gradient`, `bordered` |
| RF-3.2 | UiCard deve suportar `hoverable` com efeito de elevação e glow no hover |
| RF-3.3 | UiCard deve suportar slots: `header`, `header-actions`, `default` (body), `footer` |
| RF-3.4 | UiCard deve suportar controle de padding (`none`, `sm`, `md`, `lg`) e border-radius (`none` a `2xl`) |
| RF-3.5 | ExerciseCard deve exibir: nome do exercício, grupo muscular, equipamento (se aplicável) e slot para ações |
| RF-3.6 | WorkoutCard deve exibir: título, descrição opcional, contagem de exercícios, duração estimada, status visual (badge) e ação de clique |
| RF-3.7 | StatCard deve exibir: valor numérico em destaque, label descritivo, ícone e indicador de tendência opcional |
| RF-3.8 | Todos os cards devem ser responsivos e manter legibilidade em viewports de 320px |

### 2.4 — Inputs

**O que faz:** Expande a família de componentes de formulário além do UiInput existente.

**Por que é importante:** Formulários de treino e perfil exigem tipos variados de input. Select, Toggle, DatePicker e RangeSlider são necessários para criação de treinos, agendamentos e configuração de metas.

**Como funciona em alto nível:**
- **Auditoria do UiInput existente:** Verificar conformidade (estados error/hint, clearable, password toggle, sizes, focus ring)
- **UiSelect:** Dropdown de seleção com suporte a busca/filtro interno, option groups, estado disabled e multi-seleção opcional
- **UiToggle:** Toggle switch binário (on/off) com label, estado disabled e suporte a v-model
- **UiDatePicker:** Seletor de data com calendário visual, navegação por mês/ano, destaque do dia atual e seleção de intervalo opcional
- **UiRangeSlider:** Slider de faixa com valor exibido, min/max configuráveis, step e suporte a duplo handle (range) opcional

**Requisitos Funcionais:**

| # | Requisito |
|---|-----------|
| RF-4.1 | UiInput existente deve suportar label com indicador de obrigatório, hint, error, clearable e toggle de visibilidade para password |
| RF-4.2 | UiSelect deve exibir lista de opções com suporte a busca por texto digitado |
| RF-4.3 | UiSelect deve suportar `disabled`, `error`, `hint` e `placeholder` consistentes com UiInput |
| RF-4.4 | UiSelect deve fechar o dropdown ao clicar fora ou pressionar Escape |
| RF-4.5 | UiToggle deve alternar entre estados on/off visualmente distintos com transição suave |
| RF-4.6 | UiToggle deve suportar label descritivo e estado `disabled` |
| RF-4.7 | UiDatePicker deve exibir calendário mensal com navegação entre meses e anos |
| RF-4.8 | UiDatePicker deve destacar o dia atual e a data selecionada |
| RF-4.9 | UiDatePicker deve emitir a data selecionada no formato ISO (YYYY-MM-DD) |
| RF-4.10 | UiRangeSlider deve exibir valor atual acima ou ao lado do handle |
| RF-4.11 | UiRangeSlider deve suportar `min`, `max`, `step` configuráveis via props |
| RF-4.12 | UiRangeSlider deve suportar modo duplo handle (range) para seleção de intervalo |
| RF-4.13 | Todos os inputs devem navegar via teclado (Tab, Enter, Escape, Arrow Keys onde aplicável) |
| RF-4.14 | Todos os inputs devem exibir focus ring visível e mensagem de erro com `role="alert"` |

### 2.5 — Gráficos

**O que faz:** Fornece componente de visualização de dados para progresso de treinos e estatísticas.

**Por que é importante:** Usuários precisam visualizar sua evolução ao longo do tempo (peso, volume de treino, frequência). Gráficos simples e performáticos são essenciais para o dashboard de progresso.

**Como funciona em alto nível:**
- **UiChart:** Wrapper em torno de uma biblioteca de gráficos leve (a definir na especificação técnica) que renderiza gráficos de linha, barra e rosca. Aceita tipo de gráfico, dados, labels e opções de estilização via props
- **Tipos suportados:** Line chart (progresso temporal), Bar chart (comparação de volumes), Doughnut chart (distribuição percentual)
- **Estilo:** Linhas e barras com gradiente primary/secondary, tooltip on hover, grid sutil em dark mode, legendas customizáveis

**Requisitos Funcionais:**

| # | Requisito |
|---|-----------|
| RF-5.1 | UiChart deve suportar tipos: `line`, `bar`, `doughnut` |
| RF-5.2 | UiChart deve aceitar dados via props (array de datasets com labels, valores e cores) |
| RF-5.3 | UiChart deve exibir tooltip com valores ao passar o mouse ou tocar em um ponto/barra |
| RF-5.4 | UiChart deve usar cores do design system (primary, secondary, accent) como paleta padrão |
| RF-5.5 | UiChart deve ser responsivo e redimensionar-se ao container |
| RF-5.6 | UiChart deve exibir estado de loading enquanto dados são carregados |
| RF-5.7 | UiChart deve suportar legenda configurável (posição, visibilidade) |
| RF-5.8 | UiChart deve ser acessível via `aria-label` e descrição textual dos dados |

## Experiência do Usuário

### Personas e Necessidades

| Persona | Necessidade Principal |
|---------|----------------------|
| Desenvolvedor(a) | API consistente com tipagem TS, props documentadas, slots flexíveis, emits padronizados |
| Atleta (mobile) | UI responsiva, toque confortável, navegação por gestos, performance |
| Atleta (desktop) | Sidebar informativa, atalhos de teclado, visualização ampla de dados |
| Usuário com deficiência visual | Contraste WCAG AA, navegação 100% por teclado, screen reader compatível |

### Fluxos Principais

1. **Navegação:** Usuário abre o app → vê sidebar (desktop) ou hamburger menu (mobile) → seleciona seção → conteúdo carrega no main area
2. **Criação de treino (uso de inputs):** Usuário abre formulário → preenche nome (UiInput) → seleciona tipo (UiSelect) → define data (UiDatePicker) → ajusta intensidade (UiRangeSlider) → ativa lembrete (UiToggle) → salva (UiButton)
3. **Visualização de progresso:** Usuário acessa dashboard → vê StatCards com métricas rápidas → expande gráfico UiChart para ver tendência temporal

### Requisitos de UI/UX

- Todos os componentes devem seguir o design system: dark mode, cores, tipografia (Inter + Plus Jakarta Sans), espaçamento, border-radius e animações documentados
- Transições de 200–300ms com easing `ease-out` para hover/focus
- Glassmorphism em superfícies sobrepostas (modais, dropdowns, menus)
- Feedback visual imediato em interações (glow em botões, elevação em cards, animação em toggles)
- Estados vazios e de erro devem ter mensagens claras e ações de recuperação

### Requisitos de Acessibilidade

- **Contraste:** Texto body mínimo 4.5:1, texto grande mínimo 3:1 (WCAG AA) sobre fundos dark
- **Teclado:** Navegação completa via Tab; ativação via Enter/Espaço; fechamento via Escape
- **ARIA:** `role`, `aria-label`, `aria-expanded`, `aria-selected`, `aria-disabled` aplicados conforme contexto
- **Focus management:** Focus trap em modals; focus restore ao fechar overlays
- **Screen readers:** Labels visíveis ou `aria-label` para ícones funcionais; `role="alert"` para erros
- **Motion:** Respeitar `prefers-reduced-motion` para reduzir ou desabilitar animações

## Restrições Técnicas de Alto Nível

| Restrição | Detalhe |
|-----------|---------|
| **Framework** | Vue 3 com `<script setup lang="ts">` — compatibilidade com Composition API obrigatória |
| **Build** | Nuxt 3 — componentes devem ser auto-importados via diretório `components/` |
| **Estilização** | Tailwind CSS v3 — tokens do design system já definidos em `tailwind.config.ts` |
| **TypeScript** | Strict mode — todos os componentes com tipagem completa de props e emits |
| **Bibliotecas externas** | Necessário selecionar 1 biblioteca de gráficos (leve, com tree-shaking) e 1 de date picker (Vue 3 nativo) — decisão na Tech Spec |
| **Tema** | Dark mode exclusivo — não é necessário suporte a light mode neste módulo |
| **Compatibilidade** | Componentes existentes não devem quebrar páginas atuais; auditoria deve manter comportamento visual |
| **Browser support** | Últimas 2 versões de Chrome, Firefox, Safari, Edge; mobile Safari e Chrome Android |

## Fora de Escopo

O que este módulo **NÃO** inclui:

| Item | Justificativa |
|------|---------------|
| Lógica de negócio de treinos, exercícios ou progresso | Pertence aos módulos de domínio (composables e páginas) |
| Páginas ou telas completas | Componentes são blocos de construção; montagem das páginas é escopo separado |
| Integração com dados reais de API/Supabase | Componentes consomem dados via props; integração é camada superior |
| Light mode ou sistema de temas múltiplos | Dark mode exclusivo conforme decisão do projeto |
| Testes unitários e E2E | Será abordado em módulo de qualidade de código separado |
| Documentação Storybook/Docs | Pode ser considerado em módulo futuro de DX |
| Animações avançadas ou micro-interações complexas | Apenas transições padrão do design system; animações customizadas são escopo futuro |
| Internacionalização (i18n) | Textos hard-coded em português; i18n será tratado em módulo separado |
