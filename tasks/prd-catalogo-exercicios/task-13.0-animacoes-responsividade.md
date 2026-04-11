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

- [x] 13.1 Adicionar `animate-fade-in-up` aos cards no `ExerciseGrid` (já implementado na Task 7.0)
- [x] 13.2 Adicionar stagger delays nos cards via `:style="{ animationDelay: ... }"` (já implementado)
- [x] 13.3 Adicionar `animate-fade-in` no container principal da página de listagem
- [x] 13.4 Adicionar transição de drawer mobile de filtros (já implementado na Task 5.0)
- [x] 13.5 Adicionar overlay escuro com animação no drawer de filtros (já implementado)
- [x] 13.6 Adicionar `animate-fade-in` na página de detalhes `[id].vue` (já implementado na Task 12.0)
- [x] 13.7 Adicionar transição suave nos skeletons → content com `transition-opacity`
- [x] 13.8 Verificar responsividade do `ExerciseGrid` (1/2/3 colunas)
- [x] 13.9 Verificar responsividade do `ExerciseFilters` (sidebar → drawer)
- [x] 13.10 Verificar responsividade da página de detalhes: grid 2 colunas → 1 coluna no mobile
- [x] 13.11 Verificar responsividade do `ExerciseRelatedList`: scroll horizontal
- [x] 13.12 Verificar responsividade do `ExerciseDetailMedia`: imagem/placeholder escala proporcionalmente
- [x] 13.13 Adicionar media query `prefers-reduced-motion: reduce` no CSS global
- [x] 13.14 Adicionar `transition-all duration-200` nos cards para hover suave
- [x] 13.15 Testar manualmente em todos os breakpoints e ajustar espaçamentos

## Detalhes de Implementação

Consultar a seção de "Animações" do QWEN.md para as classes disponíveis: `animate-fade-in`, `animate-fade-in-up`, `animate-slide-in-right`, `animate-scale-in`, `animation-delay-100` a `animation-delay-500`. Para stagger delays nos cards, usar `:style="{ animationDelay: `${index * 50}ms` }"` no template. Para `prefers-reduced-motion`, adicionar no `assets/css/tailwind.css` ou em um bloco `<style>` global.

## Critérios de Sucesso

- [x] Cards do grid aparecem com animação de fade-in-up sequencial (stagger)
- [x] Drawer de filtros anima ao abrir/fechar no mobile
- [x] Páginas de listagem e detalhes têm fade-in ao carregar
- [x] Transição de loading → content é suave (fade, não corte brusco)
- [x] Grid responsivo: 1 col (≤ 640px), 2 col (640-1024px), 3 col (≥ 1024px)
- [x] Filtros: sidebar no desktop, drawer no mobile
- [x] Detalhes: layout 2 colunas no desktop, 1 coluna no mobile
- [x] `prefers-reduced-motion` desabilita animações para quem precisa
- [x] Nenhum overflow horizontal indesejado em nenhum breakpoint
- [x] Texto legível em todos os tamanhos de tela

## Testes da Tarefa

- [x] Testes visuais: Acessar `/exercises` em viewport 320px — tudo deve caber sem scroll horizontal
- [x] Testes visuais: Acessar `/exercises` em viewport 768px — grid com 2 colunas
- [x] Testes visuais: Acessar `/exercises` em viewport 1024px — grid com 3 colunas + sidebar visível
- [x] Testes visuais: Acessar `/exercises/<id>` em viewport 320px — layout 1 coluna, tudo empilhado
- [x] Testes visuais: Acessar `/exercises/<id>` em viewport 1024px — mídia + meta lado a lado
- [x] Testes de animação: Recarregar `/exercises` — cards devem aparecer com fade-in-up sequencial
- [x] Testes de animação: Abrir drawer de filtros no mobile — slide-up deve ser visível
- [x] Testes de acessibilidade: Ativar `prefers-reduced-motion` no browser — animações devem ser desabilitadas
- [x] Testes de responsividade: Verificar que nenhum texto é cortado ou ilegível em 320px
- [x] Testes de responsividade: Verificar que `ExerciseRelatedList` scroll horizontal funciona em mobile (touch)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseGrid.vue` — animações de stagger nos cards
- `components/catalog/ExerciseFilters.vue` — animação de drawer mobile
- `pages/exercises/index.vue` — animação de fade-in da página
- `pages/exercises/[id].vue` — animação de fade-in da página
- `assets/css/tailwind.css` — possível adição de `prefers-reduced-motion`
- `tasks/prd-catalogo-exercicios/prd.md` — seção 5.1 e 5.3 para wireframes responsivos
- `QWEN.md` — seção de Animações para classes disponíveis
