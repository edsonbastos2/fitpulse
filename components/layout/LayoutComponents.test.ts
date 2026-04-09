/**
 * Testes manuais da Tarefa 2.0 — Layout Subcomponents
 *
 * Como Vitest não está instalado no projeto, estes testes devem ser
 * verificados manualmente no navegador ou adicionados ao suite de testes futuro.
 *
 * Para cada teste: abrir a página no navegador, inspecionar o DOM e confirmar.
 */

// ============================================================
// LayoutSidebar — Testes Unitários Manuais
// ============================================================

/**
 * TESTE 1: Renderiza itens de navegação corretamente
 * Passos:
 *   1. Montar LayoutSidebar com navItems = [{ label: 'Dashboard', icon: 'home', to: '/dashboard' }]
 *   2. Inspecionar DOM
 * Esperado: Link "Dashboard" visível com ícone home
 */

/**
 * TESTE 2: Destaca item ativo baseado na rota atual
 * Passos:
 *   1. Navegar para /dashboard
 *   2. Verificar sidebar
 * Esperado: Link "Dashboard" tem classe `nav-link-active` e `aria-current="page"`
 */

/**
 * TESTE 3: Oculta em viewport mobile (<1024px)
 * Passos:
 *   1. Redimensionar navegador para 375px de largura
 *   2. Inspecionar DOM
 * Esperado: Elemento sidebar tem classe `hidden`
 */

/**
 * TESTE 4: Exibe user section com nome/email
 * Passos:
 *   1. Estar logado com usuário "João Silva" / "joao@email.com"
 *   2. Verificar seção inferior da sidebar
 * Esperado: Avatar com iniciais "JS", nome "João Silva", email truncado
 */

/**
 * TESTE 5: Acessibilidade — keyboard navigation
 * Passos:
 *   1. Focar no primeiro link da sidebar com Tab
 *   2. Pressionar Tab repetidamente
 * Esperado: Tab navega por todos os links; Enter abre página; aria-current="page" no ativo
 */

// ============================================================
// LayoutNavbar — Testes Unitários Manuais
// ============================================================

/**
 * TESTE 6: Hamburger toggle abre/fecha drawer
 * Passos:
 *   1. Abrir em viewport mobile (<1024px)
 *   2. Clicar botão hamburger
 * Esperado: Drawer aparece com animação; aria-expanded muda para true
 */

/**
 * TESTE 7: Drawer fecha com Escape
 * Passos:
 *   1. Abrir drawer mobile
 *   2. Pressionar Escape
 * Esperado: Drawer fecha com animação
 */

/**
 * TESTE 8: Slot de logo funciona
 * Passos:
 *   1. Passar slot `logo` customizado
 * Esperado: Logo customizado renderiza no lugar do default
 */

/**
 * TESTE 9: Link de navegação fecha drawer
 * Passos:
 *   1. Abrir drawer mobile
 *   2. Clicar em um link
 * Esperado: Drawer fecha após clique
 */

// ============================================================
// LayoutFooter — Testes Unitários Manuais
// ============================================================

/**
 * TESTE 10: Footer responsivo — desktop
 * Passos:
 *   1. Abrir em viewport >= 640px
 * Esperado: Grid 3 colunas (Brand, Links, Info) visível
 */

/**
 * TESTE 11: Footer responsivo — mobile
 * Passos:
 *   1. Abrir em viewport < 640px
 * Esperado: Uma linha central com "FitPulse © 2026"
 */

/**
 * TESTE 12: Slot info funciona
 * Passos:
 *   1. Passar slot `info` customizado
 * Esperado: Conteúdo customizado renderiza no lugar do copyright default
 */

// ============================================================
// Integração — LayoutSidebar + LayoutNavbar
// ============================================================

/**
 * TESTE 13: Sidebar visível em desktop, Navbar em mobile
 * Passos:
 *   1. Abrir página em 1440px
 *   2. Redimensionar para 375px
 *   3. Redimensionar de volta para 1440px
 * Esperado: Sidebar aparece/some corretamente; Navbar aparece/some corretamente; sem duplicação
 */

/**
 * TESTE 14: Sem conflito visual entre componentes
 * Passos:
 *   1. Montar Sidebar + Navbar juntos
 *   2. Verificar sobreposição, z-index, espaçamento
 * Esperado: Sidebar fixed esquerda, navbar fixed topo, sem sobreposição indesejada
 */

// ============================================================
// Acessibilidade
// ============================================================

/**
 * TESTE 15: ARIA roles presentes
 * Passos:
 *   1. Inspecionar DOM
 * Esperado:
 *   - Sidebar: role="navigation", aria-label="Menu principal"
 *   - Navbar: role="banner"
 *   - Nav links: aria-current="page" no ativo
 *   - Hamburger: aria-expanded=true/false, aria-label="Abrir/Fechar menu"
 *   - Footer: role="contentinfo"
 */

console.log('Task 2.0 — Testes manuais documentados. Executar no navegador.')
