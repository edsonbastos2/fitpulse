# PRD - Módulo de Treinos (Workouts)

## Visão Geral

O FitPulse precisa de um módulo completo de gestão de treinos que permita aos usuários criar, organizar e executar suas sessões de exercício. Atualmente o dashboard exibe estatísticas e um botão "Novo Treino", mas a funcionalidade não existe. Este módulo resolve o problema central do produto: permitir que usuários criem treinos personalizados a partir do catálogo de exercícios, executem sessões com logging detalhado e acompanhem seu progresso ao longo do tempo.

O módulo de treinos é o core do FitPulse — sem ele, o app é apenas um catálogo de exercícios sem utilidade prática.

## Objetivos

- Permitir que **80% dos usuários criem seu primeiro treino** em até 3 minutos após o onboarding
- Alcançar **taxa de conversão de 60%** de treino criado → sessão executada
- Reduzir o tempo médio de criação de treino para **menos de 2 minutos**
- Suportar **logging em tempo real** durante a sessão de treino com no máximo 3 toques por set
- Manter **100% de compatibilidade com o catálogo de exercícios** existente

## Histórias de Usuário

- **Como usuário**, eu quero criar treinos personalizados adicionando exercícios do catálogo, para que eu tenha rotinas organizadas para meus treinos
- **Como usuário**, eu quero iniciar uma sessão de treino e registrar sets (peso, reps, RPE) em tempo real, para que eu acompanhe minha progressão
- **Como usuário**, eu quero ver todos os meus treinos organizados em uma lista, para que eu encontre rapidamente o treino que preciso
- **Como usuário**, eu quero editar e deletar meus treinos, para que eu mantenha minha biblioteca atualizada
- **Como usuário iniciante**, eu quero templates de treino pré-configurados (push/pull/legs, full body), para que eu comece a treinar sem precisar criar do zero
- **Como usuário avançado**, eu quero adicionar notas e configurações específicas por exercício (descanso, RPE target), para que eu personalize minha rotina

## Funcionalidades Principais

### 1. CRUD de Treinos

**O que faz:** Permite criar, visualizar, editar e deletar treinos personalizados.

**Por que é importante:** É a base do módulo — sem treinos criados, não há sessões para executar.

**Como funciona em alto nível:**
- Lista de treinos do usuário com busca e filtros
- Formulário de criação/edição com seleção de exercícios do catálogo
- Cada treino tem: nome, descrição, tipo (strength/cardio/hiit/flexibility/mixed), dificuldade, exercícios associados
- Exercícios dentro do treino têm ordem, sets alvo, reps alvo, descanso e notas

**Requisitos funcionais:**
1. Usuário autenticado pode criar um novo treino com nome, tipo e descrição
2. Usuário pode adicionar exercícios do catálogo ao treino com: sets alvo, reps alvo, descanso (segundos), RPE target, notas
3. Usuário pode reordenar exercícios dentro do treino (drag & drop ou setas)
4. Usuário pode remover exercícios do treino
5. Usuário pode editar nome, tipo, descrição e exercícios de um treino existente
6. Usuário pode deletar um treino (com confirmação)
7. Lista de treinos exibe: nome, tipo, número de exercícios, duração estimada, data de criação
8. Usuário pode buscar treinos por nome
9. Usuário pode filtrar treinos por tipo (strength, cardio, etc.)

### 2. Sessão de Treino Ativa

**O que faz:** Interface de execução de treino com logging em tempo real de cada set.

**Por que é importante:** É onde o valor real acontece — registrar dados reais de treino para progressão.

**Como funciona em alto nível:**
- Usuário seleciona um treino e clica "Iniciar Treino"
- Interface mostra exercício atual com sets a completar
- Para cada set: registrar peso (kg), reps executadas, RPE (1-10), completar
- Timer de descanso entre sets/exercícios
- Navegação: exercício anterior, próximo exercício, pular exercício
- Resumo ao final: duração total, volume, exercícios completados

**Requisitos funcionais:**
1. Usuário pode iniciar uma sessão de treino a partir da lista de treinos
2. Sessão registra started_at e mantém status "in_progress"
3. Para cada exercício, usuário vê: nome, sets alvo, reps alvo, descanso alvo
4. Para cada set, usuário pode registrar: peso (kg), reps, RPE (1-10), marcar como completo
5. Timer de descanso inicia automaticamente ao completar um set
6. Usuário pode navegar entre exercícios (anterior, próximo, pular)
7. Usuário pode adicionar notas ao exercício durante a sessão
8. Sessão pode ser pausada e retomada
9. Ao finalizar, sessão registra completed_at e status "completed"
10. Resumo pós-treino exibe: duração, volume total, exercícios completados, calories estimadas

### 3. Templates de Treino

**O que faz:** Treinos pré-configurados para usuários iniciantes.

**Por que é importante:** Reduz fricção para novos usuários que não sabem criar treinos do zero.

**Como funciona em alto nível:**
- Templates sugeridos na página de criação de treino
- Cada template tem nome, descrição, exercícios pré-configurados
- Usuário pode usar o template como base e personalizar

**Requisitos funcionais:**
1. Templates disponíveis: Push/Pull/Legs (Gym), Full Body (Equipment-Free), Full Body (Dumbbells), Upper/Lower (Dumbbells)
2. Usuário pode visualizar lista de templates antes de criar treino
3. Ao selecionar template, exercícios são pré-carregados no formulário de criação
4. Usuário pode modificar exercícios do template antes de salvar
5. Templates são is_recommended = true e is_template = true no banco

### 4. Histórico de Sessões

**O que faz:** Lista de todas as sessões de treino executadas pelo usuário.

**Por que é importante:** Permite ao usuário ver seu histórico e retomar treinos anteriores.

**Como funciona em alto nível:**
- Lista cronológica de sessões (completadas ou skippadas)
- Cada sessão exibe: treino, data, duração, status, volume
- Usuário pode ver detalhes de uma sessão passada

**Requisitos funcionais:**
1. Usuário pode ver lista de sessões ordenadas por data (mais recente primeiro)
2. Cada sessão exibe: nome do treino, data, duração, status (completed/skipped), volume total
3. Usuário pode ver detalhes de uma sessão: exercícios, sets, peso, reps, RPE
4. Usuário pode filtrar sessões por treino
5. Usuário pode filtrar sessões por período (última semana, mês, etc.)

## Experiência do Usuário

### Personas de Usuário

| Persona | Necessidade Principal |
|---------|----------------------|
| Iniciante | Templates prontos, interface simples, orientação clara |
| Intermediário | Criar treinos personalizados, logging de progressão |
| Avançado | RPE, notas detalhadas, controle total de sets e descanso |

### Fluxos Principais

1. **Dashboard → "Novo Treino" → Selecionar template ou criar do zero → Adicionar exercícios → Salvar**
2. **Lista de treinos → Selecionar treino → "Iniciar Treino" → Executar sets → Finalizar sessão**
3. **Lista de treinos → Editar treino → Modificar exercícios → Salvar alterações**
4. **Lista de treinos → Deletar treino → Confirmar → Treino removido**

### Considerações de UI/UX

- **Mobile-first:** A maioria dos usuários executa treinos no celular (dentro da academia)
- **Botões grandes:** Touch targets de 44x44px mínimo para logging rápido durante o treino
- **Contraste alto:** Interface legível sob luz forte (academia ao ar livre)
- **Feedback imediato:** Confirmação visual ao completar um set (check, animação)
- **Timer visível:** Timer de descanso sempre visível durante a sessão

### Requisitos de Acessibilidade

1. Todos os inputs de logging (peso, reps, RPE) devem ter labels acessíveis
2. Botões de navegação da sessão devem ter aria-label descritivo
3. Timer de descanso deve ter aria-live para anunciar tempo restante
4. Navegação por teclado completa na lista de treinos
5. Confirmação de deletar treino deve ser acessível

## Restrições Técnicas de Alto Nível

- **Framework:** Nuxt 3 + Vue 3 (manter stack atual)
- **Backend:** Supabase (tabelas workouts, workout_exercises, workout_sessions, workout_logs já existem)
- **Autenticação:** Supabase Auth (user_id nos treinos e sessões)
- **Mobile-first:** Interface otimizada para uso durante treino (telas pequenas, toque rápido)
- **Performance:** Sessão ativa deve funcionar com mínimo de lag (logging rápido é crítico)
- **Sem dependências externas de UI:** Usar componentes existentes do design system

## Fora de Escopo

- **Agendamento de treinos** (scheduled_workouts) — fase futura
- **Notificações push** para lembretes de treino — fase futura
- **Compartilhamento de treinos** entre usuários — fase futura
- **IA de recomendações** de treino — fase futura
- **Gráficos de progresso** por exercício — módulo de Progresso (fase futura)
- **Exportação de dados** (CSV, PDF) — fase futura
- **Integração com wearables** (Apple Watch, Garmin) — fase futura
