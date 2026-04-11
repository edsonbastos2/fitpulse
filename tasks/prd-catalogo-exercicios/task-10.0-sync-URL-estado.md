# Tarefa 10.0: Sincronização URL ↔ Estado

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a sincronização bidirecional entre os query params da URL e o estado de filtros na página de listagem. Isso permite que filtros sejam compartilháveis via URL, que o botão "voltar" do browser funcione corretamente e que bookmarks mantenham o estado dos filtros.

## Conformidade com Skills Padrões

- `frontend-design` — Padrão Nuxt de manipulação de rotas e query params
- `ui-ux-pro-max` — UX de filtros compartilháveis, persistência de estado via URL

## Requisitos

- Query params da URL → estado de filtros: ao carregar a página, ler query params e aplicar nos filtros
- Estado de filtros → URL: ao mudar qualquer filtro, atualizar os query params via `router.replace()`
- Busca textual deve ter debounce de 300ms antes de atualizar a URL
- Filtros com valor `undefined` ou vazio não devem aparecer na URL
- Página deve ser navegável via botões voltar/avançar do browser

## Subtarefas

- [ ] 10.1 Em `pages/exercises/index.vue`, importar `useRoute` e `useRouter` do Nuxt
- [ ] 10.2 Criar watcher em `route.query` com `{ deep: true, immediate: true }`:
  - Ler `search`, `difficulty`, `muscle`, `equipment`, `type`, `sort`, `page` dos query params
  - Converter tipos (page para number, demais para string | undefined)
  - Aplicar valores no estado `filters`
  - Chamar `fetchExercisesPaginated(filters)`
- [ ] 10.3 Criar watcher em `filters` com `{ deep: true }`:
  - Usar `useDebounceFn` do VueUse com 300ms para evitar atualizações excessivas da URL
  - Filtrar entradas com valor definido (`v !== undefined && v !== ''`)
  - Chamar `router.replace({ query: filteredEntries })`
- [ ] 10.4 Garantir que `page` é resetado para 1 quando filtros mudam (exceto quando navega via paginação)
- [ ] 10.5 Tratar edge case: URL com `page` maior que o total de páginas disponíveis → ajustar para última página válida
- [ ] 10.6 Tratar edge case: URL com valores inválidos (ex: `difficulty=abc`) → ignorar valores desconhecidos
- [ ] 10.7 Testar manualmente: copiar URL com filtros → abrir em nova aba → mesmo estado deve ser restaurado
- [ ] 10.8 Testar manualmente: clicar voltar/avançar do browser → filtros e grid devem atualizar corretamente
- [ ] 10.9 Executar `pnpm lint` para verificar erros

## Detalhes de Implementação

Consultar a seção 6.5 do PRD para o exemplo de watchers de sincronização URL. A techspec.md confirma a sincronização bidirecional via `watch` com debounce de 300ms. Usar `router.replace()` (não `router.push()`) para não criar entradas extras no histórico do browser.

## Critérios de Sucesso

- Acessar `/exercises?search=supino` → busca é aplicada automaticamente
- Aplicar filtro de dificuldade → URL atualiza para `/exercises?difficulty=easy`
- Copiar URL com filtros → abrir em nova aba → filtros são restaurados
- Botão voltar do browser funciona corretamente (restaura estado anterior)
- Busca textual tem debounce de 300ms antes de atualizar URL
- Filtros vazios/undefined não aparecem na URL
- `pnpm lint` passa sem erros

## Testes da Tarefa

- [ ] Testes de integração: Acessar `/exercises?difficulty=easy` — filtro de dificuldade "Fácil" deve estar selecionado e grid filtrado
- [ ] Testes de integração: Acessar `/exercises?search=supino&type=compound` — busca e tipo devem ser aplicados simultaneamente
- [ ] Testes de integração: Mudar filtro de dificuldade → URL deve atualizar com novo query param
- [ ] Testes de integração: Digitar na busca → após 300ms, URL deve atualizar com `search=`
- [ ] Testes de integração: Limpar filtro → query param correspondente deve sumir da URL
- [ ] Testes de integração: Copiar URL com filtros → abrir em aba anônima → mesmo estado de filtros e resultados
- [ ] Testes de integração: Clicar botão voltar do browser após mudar filtro — estado anterior deve ser restaurado
- [ ] Testes de integração: Acessar `/exercises?page=999` (inexistente) — página deve ajustar para última válida ou exibir empty state

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `pages/exercises/index.vue` — modificado para adicionar watchers
- `tasks/prd-catalogo-exercicios/prd.md` — seção 6.5 para exemplo de watchers
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Query Params" e "Sincronização URL"
