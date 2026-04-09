# Tarefa 8.0: Criar UiIconButton

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar `UiIconButton` como botão dedicado para ícones (circular ou quadrado), com variantes `ghost` e `primary`. Pode ser implementado como variante do UiButton existente ou como componente independente que reusa a lógica do UiButton.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Gradientes, glow, sizing do design system
- `ui-ux-pro-max` — Acessibilidade: aria-label para ícones funcionais, focus ring, keyboard nav
- `web-design-guidelines` — Botão de ícone sem texto precisa de aria-label descritivo
</skills>

<requirements>
- Botão circular/quadrado contendo apenas ícone (RF-2.6)
- Variants: `ghost` (transparente com borda) e `primary` (gradiente com glow)
- Sizes: `sm`, `md`, `lg` com dimensões proporcionais
- Disabled e loading states
- Focus ring visível em dark mode (RF-2.7)
- Acessível via teclado (RF-2.8)
- aria-label obrigatório para acessibilidade
</requirements>

## Subtarefas

- [ ] 8.1 Criar `components/ui/UiIconButton.vue` — pode reutilizar UiButton internamente ou estender lógica
- [ ] 8.2 Implementar variants ghost e primary com cores do design system
- [ ] 8.3 Implementar sizes sm (28px), md (36px), lg (44px)
- [ ] 8.4 Exigir prop `ariaLabel` (string) para acessibilidade
- [ ] 8.5 Implementar loading state com spinner proporcional
- [ ] 8.6 Verificar focus ring e keyboard nav

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Interfaces Principais". Forma circular com `rounded-full`. Ghost: bg-transparent + border dark-600 + hover dark-700. Primary: bg-gradient-primary + shadow-glow no hover. Spinner proporcional ao size. Ícone renderizado via slot default.

## Critérios de Sucesso

- UiIconButton renderiza ícone centralizado em botão circular/quadrado
- Variants ghost e primary visualmente distintos
- Sizes sm/md/lg com dimensões corretas
- aria-label obrigatório (TypeScript require)
- Focus ring visível
- Keyboard Enter/Espaço ativa botão

## Testes da Tarefa

- [ ] **Unit — UiIconButton:** Renderiza ícone no center; variant primary aplica gradiente e glow; variant ghost aplica transparente + borda; sizes sm/md/lg aplicam dimensões corretas; disabled state impede interação; loading exibe spinner; aria-label obrigatório (erro de TypeScript se ausente); Enter/Espaço ativa
- [ ] **Acessibilidade:** Verificar que button tem aria-label; role="button" presente; tabindex=0

## Arquivos relevantes

- `components/ui/UiIconButton.vue` — NOVO
- `components/ui/UiButton.vue` — Referência/potencial base
- `tailwind.config.ts` — gradient-primary, shadow-glow
- `docs/DESIGN_SYSTEM.md` — Tokens visuais de botões
