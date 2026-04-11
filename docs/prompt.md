# Atualização do Cronograma - Modelo **SaaS** com Perfis e Monetização

### Visão geral
**Novo Contexto**:Fazer uma **melhoria** no sistema **SaaS** agora com 3 perfis de usuário + Monetização por assinatura(**Não precisar ser feito nesse modulo**) + Funcionalidade Personal Trainer como upsell.

### DEFINIÇÃO DE PERFIS DE USUÁRIO

| Perfil | Acesso | Objetivo Principal |
|--------|--------|--------------------|
| Superadmin (eu) | Painel completo | Gestão do SaaS, analytics, controle de assinaturas e conteúdo |
| Usuário Final   | App mobile (PWA) | Receber treinos personalizados, acompanhar evolução, executar exercícios |
| Personal Trainer (Premium) | Dashboard web + app | Criar treinos para alunos, acompanhar múltiplos perfis, cobrar à parte |

### MÓDULO: GESTÃO DE PAPÉIS E PERMISSÕES | Prioridade: CRÍTICA

- Sistema de roles (Superadmin, User, PT) e permissões
- Fluxo de upgrade: Usuário → Personal Trainer
- Validação de acesso por assinatura/role em rotas e APIs

