# PRD - Sistema de Roles e Permissões SaaS

## Visão Geral

O FitPulse evoluirá de um aplicativo de gestão de treinos para uma plataforma SaaS multi-perfil. Este PRD define o sistema de **roles (papéis) e permissões** que permitirá três perfis distintos de usuário — **Superadmin**, **Usuário Final** e **Personal Trainer** — cada um com acesso a funcionalidades e dados adequados ao seu contexto de uso.

O sistema resolverá o problema de **diferenciação competitiva** ao oferecer experiências customizadas: usuários finais recebem treinos personalizados via PWA, enquanto Personal Trainers (perfil premium) gerenciam múltiplos alunos através de um dashboard web dedicado. O Superadmin mantém controle total sobre gestão do SaaS, analytics e conteúdo.

## Objetivos

- **Definir 3 perfis de usuário** com permissões claras e isoladas: Superadmin, Usuário Final e Personal Trainer
- **Habilitar fluxo de upgrade** de Usuário Final para Personal Trainer sem perda de dados ou histórico
- **Validar acesso por role** em todas as rotas protegidas e APIs do sistema
- **Manter compatibilidade** com sistema de autenticação e banco de dados existentes do FitPulse (Supabase Auth + Postgres)
- **Métrica de sucesso**: Zero violações de acesso entre perfis; 100% das rotas protegidas validando role antes de renderizar

## Histórias de Usuário

### Persona 1 — Superadmin (Administrador da Plataforma)
- **Como** Superadmin, eu quero visualizar métricas globais de uso da plataforma (usuários ativos, assinaturas, receita) **para que** eu possa tomar decisões de negócio informadas
- **Como** Superadmin, eu quero gerenciar planos de assinatura e conteúdo da biblioteca de exercícios **para que** eu controle o catálogo disponível para todos os usuários
- **Como** Superadmin, eu quero acessar o painel completo de administração **para que** eu possa auditar e operar toda a plataforma

### Persona 2 — Usuário Final (Aluno)
- **Como** Usuário Final, eu quero acessar o app PWA no meu celular **para que** eu possa executar meus treinos personalizados em qualquer lugar
- **Como** Usuário Final, eu quero ver meu histórico de treinos e evolução **para que** eu possa acompanhar meu progresso
- **Como** Usuário Final, eu quero poder fazer upgrade para o perfil de Personal Trainer **para que** eu possa acessar funcionalidades premium e gerenciar meus próprios alunos

### Persona 3 — Personal Trainer (Instrutor Premium)
- **Como** Personal Trainer, eu quero acessar um dashboard web dedicado **para que** eu possa gerenciar meus alunos e criar treinos personalizados para cada um
- **Como** Personal Trainer, eu quero visualizar o progresso dos meus alunos **para que** eu possa ajustar treinos e acompanhar evolução
- **Como** Personal Trainer, eu quero manter acesso ao app PWA como usuário final **para que** eu também possa executar meus próprios treinos

### Casos Extremos
- **Como** sistema, quando um usuário tenta acessar uma rota sem permissão, deve ser redirecionado para uma página de acesso negado com opção de upgrade
- **Como** sistema, quando um Personal Trainer perde sua assinatura premium, seu acesso ao dashboard deve ser revogado mas seus dados de aluno devem ser preservados
- **Como** sistema, um usuário pode ter múltiplos roles (ex: PT também é Usuário Final) e deve poder alternar entre contextos

## Funcionalidades Principais

### 1. Sistema de Roles e Permissões

**O que faz**: Define e gerencia papéis de usuário (Superadmin, User, Personal Trainer) com permissões granulares associadas a cada role.

**Por que é importante**: É a base de toda a diferenciação do modelo SaaS. Sem roles bem definidos, não é possível oferecer experiências distintas nem validar acesso corretamente.

**Como funciona em alto nível**:
- Cada usuário possui um ou mais roles associados ao seu perfil no banco de dados
- Roles são validados no middleware de rotas e em endpoints de API
- Permissões são mapeadas: quais roles podem acessar quais recursos e executar quais ações

**Requisitos Funcionais**:

| # | Requisito |
|---|-----------|
| RF-01 | O sistema deve armazenar roles de usuário em tabela associativa (`user_roles`) vinculada ao perfil do usuário |
| RF-02 | Cada usuário pode possuir múltiplos roles simultaneamente (ex: User + Personal Trainer) |
| RF-03 | O sistema deve validar o role ativo do usuário antes de renderizar rotas protegidas |
| RF-04 | O middleware de autenticação existente deve ser estendido para validar roles além de apenas autenticação |
| RF-05 | O sistema deve suportar 3 roles iniciais: `superadmin`, `user`, `personal_trainer` |
| RF-06 | O sistema deve permitir consulta eficiente de permissões por role para validação em APIs |

### 2. Validação de Acesso por Rota e API

**O que faz**: Garante que apenas usuários com roles adequados possam acessar rotas e endpoints específicos.

**Por que é importante**: Previne vazamento de dados entre perfis e garante que cada usuário veja apenas o que lhe é permitido.

**Como funciona em alto nível**:
- Rotas protegidas especificam quais roles são necessários para acesso
- Middleware intercepta a requisição, valida o role do usuário e permite ou nega acesso
- APIs verificam permissões antes de executar operações sensíveis

**Requisitos Funcionais**:

| # | Requisito |
|---|-----------|
| RF-07 | Cada rota protegida deve declarar explicitamente quais roles têm acesso permitido |
| RF-08 | Usuários sem permissão devem ser redirecionados para página de "Acesso Negado" com opção de upgrade |
| RF-09 | Endpoints de API devem retornar HTTP 403 (Forbidden) quando o usuário não possui role adequado |
| RF-10 | Rotas públicas (landing page, login, registro) não devem exigir validação de role |
| RF-11 | O sistema deve logar tentativas de acesso não autorizado para auditoria |

### 3. Fluxo de Upgrade: Usuário → Personal Trainer

**O que faz**: Permite que um Usuário Final faça upgrade para o perfil de Personal Trainer, ganhando acesso ao dashboard web e funcionalidades premium.

**Por que é importante**: É o mecanismo de monetização e conversão do modelo SaaS. Deve ser fluido e sem perda de dados.

**Como funciona em alto nível**:
- Usuário solicita upgrade através da interface
- Sistema valida pré-requisitos (ex: assinatura ativa)
- Sistema atribui o role `personal_trainer` ao usuário mantendo o role `user`
- Usuário ganha acesso imediato ao dashboard de PT

**Requisitos Funcionais**:

| # | Requisito |
|---|-----------|
| RF-12 | O sistema deve permitir que um usuário com role `user` solicite upgrade para `personal_trainer` |
| RF-13 | Após upgrade, o usuário deve manter seu role `user` e ganhar o role `personal_trainer` (roles cumulativos) |
| RF-14 | O sistema deve preservar todos os dados e histórico do usuário após o upgrade |
| RF-15 | O usuário deve poder alternar entre contexto de Usuário Final e Personal Trainer na interface |
| RF-16 | O sistema deve validar pré-requisitos de elegibilidade antes de permitir o upgrade |

### 4. Isolamento de Dados entre Perfis

**O que faz**: Garante que dados sensíveis de cada perfil sejam acessíveis apenas a roles autorizados.

**Por que importante**: Proteção de privacidade e conformidade com expectativas de cada perfil de usuário.

**Como funciona em alto nível**:
- Dados de alunos são visíveis apenas pelo próprio aluno e pelo seu Personal Trainer vinculado
- Dados administrativos (analytics, gestão de conteúdo) são visíveis apenas pelo Superadmin
- Personal Trainers veem apenas seus próprios alunos, não alunos de outros PTs

**Requisitos Funcionais**:

| # | Requisito |
|---|-----------|
| RF-17 | Um Personal Trainer deve visualizar apenas dados dos alunos vinculados a ele |
| RF-18 | Dados corporais e de saúde de um usuário devem ser visíveis apenas por ele e seu PT vinculado |
| RF-19 | O Superadmin deve ter acesso de leitura a todos os dados da plataforma para fins de auditoria |
| RF-20 | O sistema deve impedir que um usuário acesse dados de outro usuário sem vínculo explícito |

## Experiência do Usuário

### Personas e Necessidades

| Persona | Contexto de Uso | Necessidades Principais |
|---------|----------------|------------------------|
| Superadmin | Desktop, uso administrativo | Dashboard completo, métricas, controle total |
| Usuário Final | Mobile (PWA), em academia ou em casa | Interface rápida, acesso direto ao treino atual, histórico visual |
| Personal Trainer | Desktop (dashboard) + Mobile (PWA) | Gestão de múltiplos alunos, criação de treinos, acompanhamento de progresso |

### Fluxos Principais

1. **Onboarding de novo usuário**: Registro → Role `user` atribuído automaticamente → Acesso ao PWA
2. **Upgrade para PT**: Solicitação → Validação → Role `personal_trainer` adicionado → Acesso ao dashboard desbloqueado
3. **Acesso negado**: Tentativa de acessar rota sem permissão → Página "Acesso Negado" → CTA para upgrade ou voltar

### Considerações de UI/UX

- Usuários devem saber claramente qual perfil estão usando no momento
- Indicador visual do perfil ativo (badge/tag) na interface
- Transição suave entre contextos quando usuário possui múltiplos roles
- Página de "Acesso Negado" deve ser informativa, não punitiva — explicar o que é necessário e oferecer caminho de upgrade

### Acessibilidade

- Todas as páginas de erro e acesso negado devem ser navegáveis por teclado
- Mensagens de permissão devem ter suporte a screen readers (ARIA labels)
- Contraste adequado em badges e indicadores de perfil
- Documentação de permissões disponível em linguagem simples

## Restrições Técnicas de Alto Nível

- **Integração com sistema existente**: Deve reutilizar Supabase Auth (já implementado) e esquema de banco de dados Postgres existente
- **Migração de dados**: Usuários existentes devem receber role `user` automaticamente na migração
- **Segurança**: Roles devem ser validados tanto no cliente (middleware de rotas) quanto no servidor (Row Level Policies do Supabase ou validação em API)
- **Performance**: Validação de permissões não deve adicionar mais de 50ms ao tempo de resposta de rotas
- **Conformidade**: Dados de saúde dos usuários devem respeitar LGPD — acesso restrito e auditável
- **Escalabilidade**: Design do sistema de roles deve suportar adição futura de novos perfis sem refatoração

## Fora de Escopo

- **Integração de gateways de pagamento** (Stripe, Mercado Pago, etc.) — será definido em PRD futuro
- **Implementação técnica detalhada** de middleware, schemas de banco de dados ou queries — pertence à Tech Spec
- **Funcionalidades específicas do dashboard do Personal Trainer** (criação de treinos para alunos, acompanhamento em tempo real) — será definido em PRD dedicado
- **Sistema de cobrança e billing** (planos, faturas, trial) — será definido em PRD de Monetização
- **Notificações push para alunos** — fora de escopo deste PRD
- **Relatórios avançados de analytics para Superadmin** — será definido em PRD futuro
