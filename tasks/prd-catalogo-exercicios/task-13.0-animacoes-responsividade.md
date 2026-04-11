# Tarefa 13.0: Animações e responsividade

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar animações de transição e garantir responsividade completa em todos os componentes do catálogo de exercícios. Esta tarefa cobre a aplicação de classes de animação do design system e a verificação de breakpoints responsivos em todos os componentes.

## Conformidade com Skills Padrões

- `frontend-design` — Animações CSS, transições, responsividade mobile-first, design system
- `ui-ux-pro-max` — Diretrizes de animação (timing, easing), responsividade, breakpoints padrão
- `web-design-guidelines` — Acessibilidade: respeitar `prefers-reduced-motion`

## Requisitos

### Animações
- Cards do grid: `animate-fade-in-up` com stagger delay
- Página de listagem: fade-in ao carregar
- Página de detalhes: fade-in ao carregar
- Drawer de filtros mobile: slide-up ao abrir
- Transições entre estados (loading → content): fade suave

### Responsividade
- Mobile (≤ 640px): 1 coluna, filtros em drawer, texto adaptado
- Tablet (640px - 1024px): 2 colunas, sidebar parcial
- Desktop (≥ 1024px): 3 colunas, sidebar completa visível
- Todos os componentes devem ser testados em 320px, 768px, 1024px, 1440px

### Acessibilidade
- Respeitar `prefers-reduced-motion`: desabilitar animações para usuários que preferem movimento reduzido

## Subtarefas

- [ ] 13.1 Adicionar `animate-fade-in-up` aos cards no `ExerciseGrid`
- [ ] 13.2 Adicionar stagger delays nos cards: calcular `animation-delay-{100-500}` baseado no índice `v-for` (usar `:style` com `animationDelay`)
- [ ] 13.3 Adicionar `animate-fade-in` no container principal da página de listagem
- [ ] 13.4 Adicionar transição de `animate-slide-in-up` ou `animate-fade-in` no drawer mobile de filtros
- [ ] 13.5 Adicionar overlay escuro com `animate-fade-in` no drawer de filtros
- [ ] 13.6 Adicionar `animate-fade-in` na página de detalhes `[id].vue`
- [ ] 13.7 Adicionar transição suave nos skeletons → content: quando `isLoading` muda de true para false, usar `transition-opacity duration-300`
- [ ] 13.8 Verificar responsividade do `ExerciseGrid` em 320px, 640px, 768px, 1024px, 1440px
- [ ] 13.9 Verificar responsividade do `ExerciseFilters` (sidebar → drawer)
- [ ] 13.10 Verificar responsividade da página de detalhes: grid 2 colunas → 1 coluna no mobile
- [ ] 13.11 Verificar responsividade do `ExerciseRelatedList`: scroll horizontal funciona em todos os tamanhos
- [ ] 13.12 Verificar responsividade do `ExerciseDetailMedia`: imagem/placeholder escala proporcionalmente
- [ ] 13.13 Adicionar media query `@media (prefers-reduced-motion: reduce)` no CSS global ou inline para desabilitar animações
- [ ] 13.14 Adicionar `transition-all duration-200` nos cards para hover suave
- [ ] 13.15 Testar manualmente em todos os breakpoints e ajustar espaçamentos/fontes se necessário

## Detalhes de Implementação

Consultar a seção de "Animações" do QWEN.md para as classes disponíveis: `animate-fade-in`, `animate-fade-in-up`, `animate-slide-in-right`, `animate-scale-in`, `animation-delay-100` a `animation-delay-500`. Para stagger delays nos cards, usar `:style="{ animationDelay: `${index * 50}ms` }"` no template. Para `prefers-reduced-motion`, adicionar no `assets/css/tailwind.css` ou em um bloco `<style>` global.

## Critérios de Sucesso

- Cards do grid aparecem com animação de fade-in-up sequencial (stagger)
- Drawer de filtros anima ao abrir/fechar no mobile
- Páginas de listagem e detalhes têm fade-in ao carregar
- Transição de loading → content é suave (fade, não corte brusco)
- Grid responsivo: 1 col (≤ 640px), 2 col (640-1024px), 3 col (≥ 1024px)
- Filtros: sidebar no desktop, drawer no mobile
- Detalhes: layout 2 colunas no desktop, 1 coluna no mobile
- `prefers-reduced-motion` desabilita animações para quem precisa
- Nenhum overflow horizontal indesejado em nenhum breakpoint
- Texto legível em todos os tamanhos de tela

## Testes da Tarefa

- [ ] Testes visuais: Acessar `/exercises` em viewport 320px — tudo deve caber sem scroll horizontal
- [ ] Testes visuais: Acessar `/exercises` em viewport 768px — grid com 2 colunas
- [ ] Testes visuais: Acessar `/exercises` em viewport 1024px — grid com 3 colunas + sidebar visível
- [ ] Testes visuais: Acessar `/exercises/<id>` em viewport 320px — layout 1 coluna, tudo empilhado
- [ ] Testes visuais: Acessar `/exercises/<id>` em viewport 1024px — mídia + meta lado a lado
- [ ] Testes de animação: Recarregar `/exercises` — cards devem aparecer com fade-in-up sequencial
- [ ] Testes de animação: Abrir drawer de filtros no mobile — slide-up deve ser visível
- [ ] Testes de acessibilidade: Ativar `prefers-reduced-motion` no browser — animações devem ser desabilitadas
- [ ] Testes de responsividade: Verificar que nenhum texto é cortado ou ilegível em 320px
- [ ] Testes de responsividade: Verificar que `ExerciseRelatedList` scroll horizontal funciona em mobile (touch)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseGrid.vue` — animações de stagger nos cards
- `components/catalog/ExerciseFilters.vue` — animação de drawer mobile
- `pages/exercises/index.vue` — animação de fade-in da página
- `pages/exercises/[id].vue` — animação de fade-in da página
- `assets/css/tailwind.css` — possível adição de `prefers-reduced-motion`
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 e 5.3 para wireframes responsivos
- `QWEN.md` — seção de Animações para classes disponíveis
