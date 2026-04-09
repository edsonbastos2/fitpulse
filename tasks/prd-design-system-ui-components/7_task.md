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

- [ ] 7.1 Criar `components/ui/UiRangeSlider.vue` com slider single-handle usando `<input type="range">` nativo estilizado
- [ ] 7.2 Implementar exibição do valor atual acima do handle (tooltip)
- [ ] 7.3 Implementar modo dual-handle para range (dois inputs range sobrepostos com CSS)
- [ ] 7.4 Aplicar estilos do design system: track dark-700, fill gradient-primary, handle primary-500 com glow
- [ ] 7.5 Implementar keyboard nav: Arrow Left/Right decrementa/incrementa por step
- [ ] 7.6 Adicionar label, error, hint wrappers consistentes com UiInput

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

- [ ] **Unit — UiRangeSlider (single):** Valor padrão renderiza; mover slider emite update:modelValue; min/max/step respeitados; tooltip exibe valor atual; Arrow Right incrementa por step; Arrow Left decrementa; label/error/hint renderizam
- [ ] **Unit — UiRangeSlider (dual):** Modo range com dois handles; emite array [start, end]; handles não se cruzam (start <= end); ambos navegáveis por teclado
- [ ] **Estilização:** Verificar que track usa dark-700, fill usa gradient-primary, handle usa primary-500
- [ ] **Acessibilidade:** Verificar aria-valuenow, aria-valuemin, aria-valuemax no input; focus-visible no handle

## Arquivos relevantes

- `components/ui/UiRangeSlider.vue` — NOVO
- `components/ui/UiInput.vue` — Referência visual para label/error/hint
- `tailwind.config.ts` — Cores primary, dark, gradientes
- `assets/css/tailwind.css` — Possível CSS custom para slider
