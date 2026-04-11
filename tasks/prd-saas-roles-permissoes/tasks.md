# Resumo de Tarefas de Implementação — Sistema de Roles e Permissões SaaS

## Tarefas

- [ ] [1.0 Tipos e Constantes de Roles](./1.0_tipos-constantes-roles.md)
- [ ] [2.0 Migration do Schema de Roles](./2.0_migration-schema-roles.md)
- [ ] [3.0 Composable `useRoles`](./3.0_composable-useRoles.md)
- [ ] [4.0 Extensão do `useAuth`](./4.0_extensao-useAuth.md)
- [ ] [5.0 Middleware `role-guard`](./5.0_middleware-role-guard.md)
- [ ] [6.0 Ajuste do `middleware/auth`](./6.0_ajuste-middleware-auth.md)
- [ ] [7.0 Página `access-denied`](./7.0_pagina-access-denied.md)
- [ ] [8.0 Componente `RoleSwitcher`](./8.0_componente-RoleSwitcher.md)
- [ ] [9.0 Server Middleware de Validação de Roles](./9.0_server-middleware-role-validation.md)
- [ ] [10.0 Proteção de Rotas Existentes e Testes E2E](./10.0_protecao-rotas-e2e.md)

## Dependências

```
1.0 ──▶ 3.0 ──▶ 4.0 ──┐
         │              ▼
2.0 ─────┤         5.0 ──▶ 7.0 ──▶ 10.0
         │              │
         └──────────────┼──▶ 8.0
                        │
                        └──▶ 9.0

6.0 (paralela, sem dependências)
```
