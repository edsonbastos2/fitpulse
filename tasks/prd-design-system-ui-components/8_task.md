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

- [x] 8.1 Criar `components/ui/UiIconButton.vue` — componente independente focado em ícones (circular por padrão)
- [x] 8.2 Variants: `primary` (bg-gradient-primary + shadow-glow hover) e `ghost` (bg-dark-700/50 + border dark-600 + hover dark-600)
- [x] 8.3 Sizes: sm (28px / w-7 h-7), md (36px / w-9 h-9), lg (44px / w-11 h-11) com ícones proporcionais
- [x] 8.4 Prop `ariaLabel: string` obrigatória (TypeScript required) — sem fallback para texto interno
- [x] 8.5 Loading state com spinner `animate-spin` proporcional ao size
- [x] 8.6 Focus ring `focus:ring-primary-500` visível em dark mode; `focus:ring-offset-2` + `focus:ring-offset-dark-900`

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

- [x] **Unit — UiIconButton:** Renderiza ícone via slot no centro; variant primary aplica `bg-gradient-primary` + `shadow-glow` no hover; variant ghost aplica `bg-dark-700/50` + `border-dark-600` + hover; sizes sm (w-7 h-7), md (w-9 h-9), lg (w-11 h-11) com ícones proporcionais (3.5, 4, 5); `disabled` impede interação (opacity-50 + cursor-not-allowed); `loading` exibe spinner `animate-spin` e desabilita clique; `ariaLabel` é required no TypeScript (erro de compilação se ausente); prop `square` muda `rounded-full` para `rounded-xl`
- [x] **Acessibilidade:** `aria-label` sempre presente (prop required); `aria-busy="true"` quando loading; `role="button"` nativo do `<button>`; focus ring `focus:ring-primary-500` visível em dark mode com `focus:ring-offset-2`; keyboard Enter/Espaço ativa (comportamento nativo do `<button>`)

## Arquivos relevantes

- `components/ui/UiIconButton.vue` — NOVO
- `components/ui/UiButton.vue` — Referência/potencial base
- `tailwind.config.ts` — gradient-primary, shadow-glow
- `docs/DESIGN_SYSTEM.md` — Tokens visuais de botões
