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

- [x] 10.1 Importar `useRoute` e `useRouter` do Nuxt
- [x] 10.2 Criar watcher em `route.query` com `{ deep: true, immediate: true }` para restaurar filtros
- [x] 10.3 Criar watcher em `filters` com `useDebounceFn` (300ms) para atualizar URL
- [x] 10.4 Resetar `page` para 1 quando filtros mudam (exceto paginação)
- [x] 10.5 Tratar edge case: URL com `page` maior que total → ajustar para última página válida
- [x] 10.6 Tratar edge case: URL com valores inválidos → ignorar valores desconhecidos
- [x] 10.7 Flag `isRestoringFromUrl` para prevenir loop de sincronização
- [x] 10.8 Filtrar entradas vazias/undefined antes de atualizar URL
- [x] 10.9 Executar `pnpm lint` para verificar erros

## Critérios de Sucesso

- [x] Acessar `/exercises?search=supino` → busca é aplicada automaticamente
- [x] Aplicar filtro de dificuldade → URL atualiza para `/exercises?difficulty=easy`
- [x] Copiar URL com filtros → abrir em nova aba → filtros são restaurados
- [x] Botão voltar do browser funciona corretamente (restaura estado anterior)
- [x] Busca textual tem debounce de 300ms antes de atualizar URL
- [x] Filtros vazios/undefined não aparecem na URL
- [x] `pnpm lint` passa sem erros

## Testes da Tarefa

- [x] Testes de integração: Acessar `/exercises?difficulty=easy` — filtro de dificuldade "Fácil" deve estar selecionado e grid filtrado
- [x] Testes de integração: Acessar `/exercises?search=supino&type=compound` — busca e tipo devem ser aplicados simultaneamente
- [x] Testes de integração: Mudar filtro de dificuldade → URL deve atualizar com novo query param
- [x] Testes de integração: Digitar na busca → após 300ms, URL deve atualizar com `search=`
- [x] Testes de integração: Limpar filtro → query param correspondente deve sumir da URL
- [x] Testes de integração: Copiar URL com filtros → abrir em aba anônima → mesmo estado de filtros e resultados
- [x] Testes de integração: Clicar botão voltar do browser após mudar filtro — estado anterior deve ser restaurado
- [x] Testes de integração: Acessar `/exercises?page=999` (inexistente) — página deve ajustar para última válida ou exibir empty state

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `pages/exercises/index.vue` — modificado para adicionar watchers
- `tasks/prd-catalogo-exercicios/prd.md` — seção 6.5 para exemplo de watchers
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Query Params" e "Sincronização URL"
