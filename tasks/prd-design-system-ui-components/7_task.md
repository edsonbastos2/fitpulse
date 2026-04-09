# Tarefa 7.0: Criar UiRangeSlider

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar `UiRangeSlider` do zero usando Vue 3 + CSS puro (sem bibliotecas externas), com slider de faixa, valor exibido, min/max/step configuráveis e suporte opcional a dual-handle para seleção de intervalo.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Gradientes, track styling, handle styling do design system
- `ui-ux-pro-max` — Acessibilidade: aria-valuenow, aria-valuemin, aria-valuemax, keyboard arrows
</skills>

<requirements>
- Valor atual exibido acima ou ao lado do handle (RF-4.10)
- min, max, step configuráveis via props (RF-4.11)
- Modo dual-handle opcional para seleção de intervalo (RF-4.12)
- Navegação por teclado: Arrow keys ajustam valor (RF-4.13)
- Focus ring visível (RF-4.14)
- Label, error, hint consistentes com UiInput
</requirements>

## Subtarefas

- [x] 7.1 Criar `components/ui/UiRangeSlider.vue` com slider single-handle usando `<input type="range">` nativo estilizado (overlay invisível sobre visual custom)
- [x] 7.2 Exibição do valor atual em tooltip acima do handle (single e dual mode)
- [x] 7.3 Modo dual-handle: dois inputs range sobrepostos, z-index dinâmico (handle arrastado fica por cima), handles não se cruzam (`start <= end`)
- [x] 7.4 Estilos design system: track `dark-700`, fill `bg-gradient-primary`, handles `bg-gradient-primary` + `shadow-glow` + `border-primary-400`
- [x] 7.5 Keyboard nav: Arrow Left/Right/Up/Down incrementa/decrementa por step (single mode); dual mode usa drag nativo do range input
- [x] 7.6 Label, error (`role="alert"`), hint wrappers consistentes com UiInput; min/max labels opcionais

## Detalhes de Implementação

Consultar **techspec.md** → Seção "Decisões Principais" (UiRangeSlider puro Vue + CSS). Usar `<input type="range">` nativo com CSS customizado para track (`::-webkit-slider-runnable-track`) e thumb (`::-webkit-slider-thumb`). Dual-handle: dois inputs range sobrepostos com posicionamento absoluto, z-index gerenciado pelo valor. Gradiente no track via `background: linear-gradient(to right, primary-500 0%, primary-500 X%, dark-700 X%, dark-700 100%)` onde X = porcentagem do valor.

## Critérios de Sucesso

- UiRangeSlider renderiza slider estilizado com gradiente primary
- Valor exibido em tooltip acima do handle
- Props min/max/step funcionam corretamente
- Modo dual-handle seleciona intervalo [min, max]
- Arrow keys ajustam valor por step
- Focus ring visível no handle
- label/error/hint consistentes com UiInput

## Testes da Tarefa

- [x] **Unit — UiRangeSlider (single):** Valor padrão renderiza; mover slider emite `update:modelValue` com número; min/max/step respeitados; tooltip exibe valor formatado; Arrow Right/Left incrementa/decrementa por step; label/error/hint renderizam; error com `role="alert"`; `aria-valuemin/max/now` presentes
- [x] **Unit — UiRangeSlider (dual):** Modo range com dois handles; emite `[start, end]`; handles não se cruzam (`start <= end` via `Math.min/Math.max`); z-index dinâmico no drag; tooltips separados para start e end
- [x] **Estilização:** Track usa `bg-dark-700`; fill usa `bg-gradient-primary` com `left/width` dinâmicos; handles usam `bg-gradient-primary` + `shadow-glow` + `border-primary-400`; hover `scale-110`, active `scale-95`
- [x] **Acessibilidade:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax` no input; label/aria-label descritivo; `aria-describedby` conecta a erro/hint; focus ring via `focus-within:ring-2` no handle visual

## Arquivos relevantes

- `components/ui/UiRangeSlider.vue` — NOVO
- `components/ui/UiInput.vue` — Referência visual para label/error/hint
- `tailwind.config.ts` — Cores primary, dark, gradientes
- `assets/css/tailwind.css` — Possível CSS custom para slider
