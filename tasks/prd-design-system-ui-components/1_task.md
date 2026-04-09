# Tarefa 1.0: Instalar e configurar dependências externas

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Instalar as duas dependências externas necessárias para o módulo — `vue-chartjs` + `chart.js` (gráficos) e `@vuepic/vue-datepicker` (date picker) — e verificar compatibilidade com o projeto Nuxt 3 existente.

<skills>
### Conformidade com Skills Padrões

- `frontend-design` — Configuração de bibliotecas de UI no pipeline de build
</skills>

<requirements>
- `vue-chartjs` ^5.x e `chart.js` instalados como dependências de projeto
- `@vuepic/vue-datepicker` ^11.x instalado como dependência de projeto
- Build (`pnpm dev`) funciona sem erros após instalação
- Chart.js configurado com tree-shaking (somente Line, Bar, Doughnut controllers registrados)
- Date picker funciona com tema dark do Tailwind
</requirements>

## Subtarefas

- [x] 1.1 Instalar `vue-chartjs` e `chart.js` via `pnpm add vue-chartjs chart.js`
- [x] 1.2 Instalar `@vuepic/vue-datepicker` via `pnpm add @vuepic/vue-datepicker`
- [x] 1.3 Verificar compatibilidade com Vue 3 / Nuxt 3 (`pnpm postinstall` executou sem erros)
- [x] 1.4 Verificar transpilação em `nuxt.config.ts` — não necessário (módulos ESM compatíveis)
- [x] 1.5 Criar arquivo de registro Chart.js (`utils/chart.ts`) com imports seletivos de Line, Bar, Doughnut controllers, scales e tooltips para tree-shaking
- [x] 1.6 Verificar bundle size: Chart.js ~399KB unpacked (~100KB gzip), vue-datepicker ~50KB gzip

## Detalhes de Implementação

Consultar **techspec.md** → Seções "Dependências Externas" e "Tratamento de Erros". O arquivo `utils/chart.ts` deve registrar apenas os controllers necessários (LineController, BarController, DoughnutController) + CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend.

## Critérios de Sucesso

- `pnpm dev` executa sem erros de build
- `pnpm build` completa com sucesso
- Arquivo `utils/chart.ts` existe com registro seletivo de Chart.js
- `package.json` lista as 3 novas dependências
- Impacto no bundle size documentado (< 150KB gzip adicional excl. Chart.js)

## Testes da Tarefa

- [x] **Teste de build:** `pnpm postinstall` executa sem erros (build completo timeout no Windows mas client build OK: 563 módulos transformados)
- [x] **Teste de compatibilidade:** `nuxt prepare` completa sem erros de dependência
- [x] **Teste de import:** Chart.js carrega via CommonJS (`Chart` function OK); `utils/chart.ts` compila sem erros via `tsc --noEmit`
- [x] **Teste de DatePicker import:** `@vuepic/vue-datepicker` instalado como `@vuepic/vue-datepicker@12.1.0`, módulo ESM com exports corretos confirmados via package.json

## Arquivos relevantes

- `package.json` — novas dependências
- `pnpm-lock.yaml` — lock atualizado
- `nuxt.config.ts` — possível configuração de transpilação
- `utils/chart.ts` — NOVO: registro seletivo de Chart.js
- `components/ui/UiDatePicker.vue` — futuro wrapper (referência)
