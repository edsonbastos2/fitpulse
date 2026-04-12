# PRD - Melhorias de Responsividade na Tela de Exercícios

## Visão Geral

A tela de catálogo de exercícios do FitPulse apresenta problemas de responsividade em dispositivos móveis (< 640px), especialmente na adaptação do grid de exercícios e na experiência de filtragem. Inspirado no app Hevy, esta melhoria visa transformar a experiência mobile com um layout mais compacto, filtros horizontais em formato de chips e cards otimizados para telas pequenas.

O problema atual é que a sidebar lateral de filtros não se adapta bem ao mobile, os cards verticais ocupam muito espaço vertical e o grid de 1 coluna no mobile resulta em scroll excessivo. A solução proposta adota o padrão de UI do Hevy: filtros como chips horizontais scrolláveis no topo, cards horizontais compactos e grid de 2 colunas no mobile.

## Objetivos

- Melhorar a experiência mobile na tela de exercícios, reduzindo o scroll vertical em **40%** (medido por número de pixels de scroll para visualizar 10 exercícios)
- Aumentar a taxa de interação com filtros em **25%** (filtros mais visíveis e acessíveis)
- Reduzir o tempo para encontrar um exercício específico em **20%** (busca + filtros mais eficientes)
- Alcançar score de **90+ no Lighthouse Mobile** para acessibilidade e performance visual
- Manter 100% de compatibilidade com desktop e tablet

## Histórias de Usuário

- **Como usuário mobile**, eu quero ver mais exercícios na tela sem scroll excessivo, para que eu encontre rapidamente o exercício que preciso
- **Como usuário mobile**, eu quero filtros visíveis e fáceis de tocar, para que eu refine minha busca sem abrir menus escondidos
- **Como usuário**, eu quero que os cards se adaptem ao tamanho da tela, para que a informação seja legível em qualquer dispositivo
- **Como usuário desktop**, eu quero manter a sidebar lateral de filtros, para que eu tenha acesso rápido a todos os filtros sem perder espaço
- **Como usuário**, eu quero que a transição entre breakpoints seja fluida, para que a experiência seja consistente em todos os dispositivos

## Funcionalidades Principais

### 1. Filtros Horizontais em Chips

**O que faz:** Substitui a sidebar lateral (no mobile) por uma row horizontal de filtros em formato de chips/badges clicáveis, com scroll horizontal quando necessário.

**Por que é importante:** No mobile, a sidebar ocupa espaço precioso. Chips horizontais são mais compactos, visíveis e seguem o padrão de apps nativos como Hevy.

**Como funciona:**
- Filtros ativos aparecem como chips removíveis (ex: "Difícil ✕", "Peito ✕")
- Botão "Filtros" abre bottom sheet/drawer com opções completas
- Row de chips é scrollável horizontalmente
- No desktop (≥1024px), mantém a sidebar lateral

**Requisitos funcionais:**
1. Exibir filtros ativos como chips horizontais no topo da lista de exercícios (mobile e tablet)
2. Cada chip deve ter ícone de remoção (X) para limpar o filtro individual
3. Botão "Filtros" com ícone de funil deve abrir drawer/bottom sheet com filtros completos
4. No desktop (≥1024px), exibir sidebar lateral de filtros como atualmente
5. Chips devem ser scrolláveis horizontalmente quando excederem a largura da tela
6. Manter compatibilidade com filtros existentes: dificuldade, grupo muscular, equipamento, tipo

### 2. Cards Horizontais Compactos

**O que faz:** Transforma o card vertical atual (ícone + conteúdo empilhado) em card horizontal compacto com thumbnail/imagem à esquerda e conteúdo à direita.

**Por que é importante:** Cards horizontais permitem exibir 2 colunas no mobile, dobrando a densidade de informação na tela.

**Como funciona:**
- Card com proporção ~16:9 ou 4:3
- Thumbnail/imagem do exercício à esquerda (ou ícone de músculo se não houver imagem)
- Nome do exercício, badges (dificuldade, tipo) e grupos musculares à direita
- Altura fixa reduzida (~80-100px no mobile)

**Requisitos funcionais:**
1. Card horizontal com thumbnail/imagem à esquerda e conteúdo textual à direita
2. Altura máxima de 96px no mobile, 112px no desktop
3. Exibir nome do exercício em até 2 linhas com truncamento
4. Exibir badges de dificuldade e tipo (composto/cardio) em row compacta
5. Exibir grupos musculares como tags pequenas (máx 2 visíveis)
6. Manter link clicável em todo o card para página de detalhes
7. Suportar estado de hover no desktop (elevação/sombra)

### 3. Grid Responsivo Otimizado

**O que faz:** Ajusta o número de colunas do grid de exercícios para cada breakpoint, priorizando densidade no mobile.

**Por que é importante:** Grid de 1 coluna no mobile desperdiça espaço horizontal. 2 colunas dobram a visibilidade sem comprometer legibilidade.

**Como funciona:**
- Mobile (<640px): 2 colunas
- Tablet (640px - 1023px): 2 colunas
- Desktop (≥1024px): 3 colunas
- Desktop grande (≥1280px): 4 colunas (opcional)

**Requisitos funcionais:**
1. Grid de 2 colunas para telas < 1024px
2. Grid de 3 colunas para telas ≥ 1024px
3. Gap entre cards de 8px no mobile, 16px no desktop
4. Manter paginação "Load More" funcional em todos os breakpoints

### 4. Barra de Busca Integrada

**O que faz:** Reposiciona a barra de busca para integrar-se visualmente à row de filtros/chips.

**Por que é importante:** Unifica controle de busca e filtros em uma única área, reduzindo clutter visual e melhorando fluxo de interação.

**Como funciona:**
- Search bar em row separada, acima dos chips de filtros
- No mobile: ocupa largura total
- Placeholder: "Buscar exercício..."
- Ícone de busca à esquerda

**Requisitos funcionais:**
1. Barra de busca posicionada acima da row de filtros
2. Input com ícone de lupa à esquerda e botão de limpar (X) à direita quando há texto
3. Debounce de 300ms na busca (manter comportamento atual)
4. No mobile: largura total, no desktop: pode compartilhar row com sort select

## Experiência do Usuário

### Personas de Usuário

| Persona | Necessidade Principal |
|---------|----------------------|
| Usuário mobile iniciante | Encontrar exercícios rapidamente sem navegar por menus complexos |
| Usuário mobile avançado | Filtrar por múltiplos critérios (músculo + equipamento + dificuldade) |
| Usuário desktop | Manter produtividade com sidebar de filtros sempre visível |

### Fluxos Principais

1. **Acessar catálogo → Ver grid de exercícios → Tocar em filtro → Selecionar músculo → Ver resultados filtrados**
2. **Acessar catálogo → Buscar exercício por nome → Ver resultados → Selecionar exercício**
3. **Acessar catálogo (desktop) → Usar sidebar de filtros → Combinar múltiplos filtros → Ver resultados**

### Considerações de UI/UX

- **Touch targets:** Mínimo de 44x44px para todos os elementos interativos (chips, botões, cards)
- **Tipografia:** Nome do exercício deve ser legível em cards de 2 colunas (mínimo 14px)
- **Contraste:** Manter contraste WCAG AA em todos os estados (active, hover, disabled)
- **Animações:** Transições suaves (200-300ms) ao abrir/fechar drawer de filtros
- **Feedback visual:** Chips ativos devem ter destaque visual claro (cor primária)

### Requisitos de Acessibilidade

1. Todos os chips de filtro devem ter `aria-label` descritivo
2. Drawer de filtros deve ter foco trap e suporte a Escape para fechar
3. Cards devem ter `role="listitem"` e `aria-label` com nome do exercício
4. Search bar deve ter `aria-label` e suporte a navegação por teclado
5. Manter ordem lógica de tabulação no mobile e desktop

## Restrições Técnicas de Alto Nível

- **Framework:** Nuxt 3 + Vue 3 (manter stack atual)
- **Estilização:** Tailwind CSS (usar breakpoints padrão: sm:640px, md:768px, lg:1024px, xl:1280px)
- **Componentes existentes:** Reutilizar `ExerciseFilterContent`, `ExerciseSearchBar`, `ExerciseSortSelect` com adaptações
- **Estado:** Manter sincronização com URL query params (comportamento atual)
- **Performance:** Lazy loading de imagens se adicionadas aos cards
- **Sem dependências externas:** Não adicionar novas bibliotecas de UI

## Fora de Escopo

- **Página de detalhes do exercício** (`/exercises/[id]`) - escopo limitado à listagem
- **Imagens de exercícios** - se não houver imagens no banco, usar ícones/ilustrações placeholder
- **Redesign do sistema de filtros** - apenas adaptar UI, lógica permanece a mesma
- **Paginação infinita (infinite scroll)** - manter botão "Load More" atual
- **Suporte a orientação landscape no mobile** - foco em portrait
- **Modo offline/PWA** - não faz parte deste escopo
