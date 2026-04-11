# Tarefa 14.0: Acessibilidade e estados de erro

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler seus arquivos sua tarefa será invalidada</critical>

## Visão Geral

Garantir que todos os componentes do catálogo de exercícios sejam acessíveis e tratem estados de erro de forma amigável. Esta tarefa cobre labels de inputs, navegação por teclado, contraste de cores, tratamento de erros de fetch e feedback visual para estados de falha.

## Conformidade com Skills Padrões

- `web-design-guidelines` — Review de acessibilidade, labels em inputs, contrastes, navegação por teclado, ARIA attributes
- `ui-ux-pro-max` — Diretrizes de acessibilidade (WCAG 2.1 AA), estados de erro UX-friendly
- `frontend-design` — Contraste de cores em tema escuro, focus visible, skip links

## Requisitos

### Acessibilidade
- Todos os inputs, selects e campos de busca devem ter labels associados
- Navegação completa via teclado (Tab, Enter, Escape)
- Contraste de cores ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande (WCAG AA)
- Focus visible em todos os elementos interativos
- `aria-live` em regions que atualizam dinamicamente (grid de resultados)
- `role` attributes onde necessário (drawer = `dialog`, overlay = modal)
- Drawer de filtros: focus trap quando aberto, fecha com Escape

### Estados de Erro
- Erro de fetch na listagem → toast + empty state com mensagem de erro
- Erro de fetch nos detalhes → toast + redirect para `/exercises`
- Erro de rede → mensagem amigável "Não foi possível conectar ao servidor. Verifique sua conexão."
- Exercício não encontrado → toast + redirect
- Filtros com valores inválidos na URL → ignorar silenciosamente

## Subtarefas

- [ ] 14.1 Adicionar `<label>` em todos os `<select>` de filtros (usar `sr-only` se label não deve ser visível)
- [ ] 14.2 Adicionar `aria-label` no `ExerciseSearchBar` input
- [ ] 14.3 Adicionar `aria-label` no `ExerciseSortSelect`
- [ ] 14.4 Adicionar `role="dialog"` e `aria-modal="true"` no drawer de filtros mobile
- [ ] 14.5 Implementar focus trap no drawer: Tab não deve sair do drawer quando aberto
- [ ] 14.6 Fechar drawer com tecla Escape
- [ ] 14.7 Adicionar `aria-live="polite"` no container do `ExerciseGrid` para anunciar mudanças de resultados
- [ ] 14.8 Adicionar `aria-busy="true"` no grid durante loading
- [ ] 14.9 Verificar contraste de todos os badges (especialmente `badge-warning` amarelo sobre fundo escuro)
- [ ] 14.10 Garantir que todos os elementos interativos têm `:focus-visible` estilizado (outline ou ring)
- [ ] 14.11 Adicionar `tabindex="0"` em `ExerciseCard` para ser focável (além do NuxtLink)
- [ ] 14.12 Adicionar handler de erro global no `fetchExercisesPaginated` com `try/catch`
- [ ] 14.13 No catch de erro: chamar `useToast.error()` com mensagem amigável + definir estado `hasError` na página
- [ ] 14.14 Quando `hasError === true`: exibir empty state com mensagem de erro específica (diferente de "nenhum resultado")
- [ ] 14.15 No catch de erro na página de detalhes: toast + redirect imediato
- [ ] 14.16 Tratar erros de rede especificamente: detectar `ERR_NETWORK` ou similar e exibir mensagem sobre conexão
- [ ] 14.17 Executar `pnpm lint` para verificar erros
- [ ] 14.18 Testar navegação completa por teclado na página de listagem (Tab, Enter, Escape)
- [ ] 14.19 Testar navegação completa por teclado na página de detalhes
- [ ] 14.20 Verificar Lighthouse accessibility score ≥ 90 em ambas as páginas

## Detalhes de Implementação

Consultar a seção 8 (Critérios de Aceite) do PRD, itens CA13 e CA14. A techspec.md menciona tratamento de erros na seção "Tratamento de erros". Para o focus trap no drawer, implementar com watcher de `mobileOpen` que salva o elemento focado antes de abrir e restaura ao fechar. Para contraste, usar o Chrome DevTools Accessibility panel ou Lighthouse.

## Critérios de Sucesso

- Todos os inputs/selects têm labels associados (inspecionar elemento)
- Tab navega por todos os elementos interativos em ordem lógica
- Enter ativa botões e links focados
- Escape fecha drawer de filtros
- Focus visible é visível e estilizado em todos os elementos
- `aria-live` anuncia mudanças de resultados no grid
- Drawer mobile tem `role="dialog"` e focus trap
- Erros de fetch exibem toast + empty state com mensagem de erro
- Erros de rede exibem mensagem específica sobre conexão
- Exercício não encontrado → toast + redirect
- Contraste de cores passa verificação WCAG AA (≥ 4.5:1)
- Lighthouse accessibility score ≥ 90 em `/exercises` e `/exercises/:id`
- `pnpm lint` passa sem erros

## Testes da Tarefa

- [ ] Testes de acessibilidade: Navegar por Tab da busca até o último card — ordem deve ser lógica e sequencial
- [ ] Testes de acessibilidade: Verificar que cada select tem `<label for="...">` ou `aria-label`
- [ ] Testes de acessibilidade: Abrir drawer mobile → pressionar Tab repetidamente — foco não deve sair do drawer
- [ ] Testes de acessibilidade: Abrir drawer mobile → pressionar Escape — drawer deve fechar
- [ ] Testes de acessibilidade: Usar Lighthouse em `/exercises` — score de acessibilidade deve ser ≥ 90
- [ ] Testes de acessibilidade: Usar Lighthouse em `/exercises/<id>` — score de acessibilidade deve ser ≥ 90
- [ ] Testes de contraste: Verificar contraste de `badge-warning` (amarelo) sobre fundo escuro — deve ser ≥ 4.5:1
- [ ] Testes de contraste: Verificar contraste de texto `text-slate-400` sobre fundo `dark-900` — deve ser legível
- [ ] Testes de erro de fetch: Desabilitar rede do browser → recarregar `/exercises` — toast de erro + empty state devem aparecer
- [ ] Testes de erro de fetch: Acessar `/exercises/<id-inexistente>` — toast + redirect para `/exercises`
- [ ] Testes de erro de rede: Simular erro 500 do Supabase — mensagem deve ser amigável (não stack trace)
- [ ] Testes de integração: Verificar que `aria-live` anuncia mudança de resultados ao aplicar filtros

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `components/catalog/ExerciseSearchBar.vue` — aria-label no input
- `components/catalog/ExerciseFilters.vue` — labels em selects, focus trap no drawer
- `components/catalog/ExerciseGrid.vue` — aria-live, aria-busy
- `components/catalog/ExerciseSortSelect.vue` — label acessível
- `pages/exercises/index.vue` — handler de erro global, estado hasError
- `pages/exercises/[id].vue` — handler de erro com redirect
- `composables/useExercises.ts` — try/catch nas funções de fetch
- `composables/useToast.ts` — exibição de toasts de erro
- `assets/css/tailwind.css` — possível adição de estilos :focus-visible
- `tasks/prd-catalogo-exercicios/prd.md` — seção 8 (Critérios de Aceite), CA13 e CA14
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Tratamento de erros"
