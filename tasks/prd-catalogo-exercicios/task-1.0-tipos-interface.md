# Tarefa 1.0: Tipos e Interface (ExerciseFilters, ExerciseQueryParams)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar as interfaces TypeScript `ExerciseFilters` e `ExerciseQueryParams` ao arquivo `types/index.ts`. Esses tipos são a fundação para toda a comunicação entre a URL, o composable `useExercises` e os componentes do catálogo de exercícios.

## Conformidade com Skills Padrões

Nenhuma skill específica necessária — esta é uma tarefa pura de tipagem TypeScript.

## Requisitos

- As interfaces devem ser compatíveis com os query params da URL descritos no PRD
- Os tipos devem ser exportados e reutilizáveis por qualquer componente que consuma filtros
- `ExerciseQueryParams` deve permitir valores `string | undefined` para cada chave

## Subtarefas

- [x] 1.1 Abrir `types/index.ts` e ler o conteúdo atual para entender onde inserir os novos tipos
- [x] 1.2 Adicionar interface `ExerciseFilters` com as propriedades: `search?`, `difficulty?`, `muscleGroup?`, `equipment?`, `type?`, `sort?`, `page?`
- [x] 1.3 Adicionar type `ExerciseQueryParams` como `Partial<Record<keyof ExerciseFilters, string>>`
- [x] 1.4 Verificar se os tipos existentes (`Exercise`, `MuscleGroup`, `Equipment`) já existem e estão compatíveis
- [x] 1.5 Executar `pnpm lint` para garantir que não há erros de tipagem

## Detalhes de Implementação

Consultar a seção "Tipos TypeScript" (6.4) do PRD e a seção "Interfaces Principais" da techspec.md para a definição exata das interfaces. Os tipos devem ser colocados no final do arquivo `types/index.ts`, após as interfaces existentes de banco de dados.

## Critérios de Sucesso

- [x] `ExerciseFilters` possui todas as 7 propriedades opcionais com tipos corretos
- [x] `ExerciseQueryParams` é um tipo utilitário derivado de `ExerciseFilters`
- [x] `pnpm lint` passa sem erros
- [x] Tipos são exportáveis e importáveis por outros arquivos sem erro de compilação

## Testes da Tarefa

- [x] Testes de unidade: Importar `ExerciseFilters` e `ExerciseQueryParams` em um arquivo temporário e verificar que o IntelliSense reconhece as propriedades corretamente
- [x] Testes de integração: Criar um objeto `ExerciseFilters` com todos os campos preenchidos e verificar que o TypeScript não reclama de tipo
- [x] Testes de integração: Verificar que `ExerciseQueryParams` aceita `Record<string, string | undefined>` vindo de `route.query`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `types/index.ts` — arquivo a ser modificado
- `tasks/prd-catalogo-exercicios/prd.md` — seção 6.4 para definição dos tipos
- `tasks/prd-catalogo-exercicios/techspec.md` — seção "Interfaces Principais"
