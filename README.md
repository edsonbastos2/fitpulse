# FitPulse - PWA de Gestão de Treinos

## 🚀 Começando

1. **Instale as dependências:**
```bash
pnpm install
```

2. **Configure o Supabase:**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Copie as credenciais do projeto
   - Edite o arquivo `.env` com suas credenciais

3. **Configure o banco de dados:**
   - Acesse o SQL Editor no Supabase
   - Execute os scripts de criação de tabelas (em `/supabase/migrations/`)

4. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

5. **Acesse:** [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
fitpulse/
├── assets/css/          # Estilos globais e Tailwind
├── components/          # Componentes Vue reutilizáveis
│   ├── ui/              # Componentes base (botões, inputs, etc.)
│   ├── layout/          # Layouts (navbar, sidebar, etc.)
│   ├── workout/         # Componentes de treino
│   ├── exercise/       # Componentes de exercício
│   ├── profile/        # Componentes de perfil
│   └── dashboard/      # Componentes do dashboard
├── composables/        # Composables Vue reutilizáveis
├── layouts/            # Layouts de página
├── middleware/          # Middlewares Nuxt (auth, etc.)
├── pages/              # Páginas da aplicação
│   ├── auth/           # Páginas de autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── workouts/      # Gerenciamento de treinos
│   ├── exercises/     # Biblioteca de exercícios
│   ├── profile/       # Perfil do usuário
│   └── settings/       # Configurações
├── plugins/            # Plugins Nuxt
├── public/             # Arquivos estáticos
├── server/             # API server (se necessário)
├── stores/             # Stores Pinia (se necessário)
├── types/              # Tipos TypeScript
└── utils/              # Funções utilitárias
```

## 🎨 Design System

O projeto utiliza um design system customizado com:

- **Cores Primárias:** Indigo (#6366f1) - energia e tecnologia
- **Cores Secundárias:** Emerald (#10b981) - saúde e progresso
- **Cores de Destaque:** Rose (#f43f5e) - alertas e conquistas

### Componentes Principais

- `.card` - Cartões com suporte a hover e gradientes
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` - Botões estilizados
- `.input` - Campos de formulário com validação visual
- `.stat-card` - Cards de estatísticas
- `.badge` - Tags e badges coloridos

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia o servidor de desenvolvimento

# Build
pnpm build        # Build para produção
pnpm generate     # Gerar site estático

# Linting
pnpm lint         # Verificar código
pnpm lint:fix     # Corrigir erros automaticamente

# Outros
pnpm postinstall  # Prepara o Nuxt após instalação
```

## 📱 PWA

O projeto é configurado como PWA com:
- Service Worker para cache offline
- Manifest para instalação no celular
- Suporte a notificações push (futuro)

## 🔐 Autenticação

O Supabase é usado para autenticação com:
- Email/Password
- OAuth (Google, GitHub)
- Recuperação de senha

## 📊 Banco de Dados

Principais tabelas:
- `users` - Perfis de usuário
- `user_profiles` - Preferências e objetivos
- `exercises` - Biblioteca de exercícios
- `workouts` - Treinos criados
- `workout_sessions` - Sessões de treino
- `workout_logs` - Logs de execução

## 🤝 Contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - use livremente para seus projetos!
