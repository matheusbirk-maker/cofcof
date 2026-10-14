# cofcof ☕

Site da cafeteria **cofcof**: página inicial, cardápio com busca e filtros e uma área para gerenciar os produtos.

Feito com **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**. A API REST fica nas *Route Handlers* do próprio Next.js e usa dados mockados em memória.

## como rodar em local host

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

Outros comandos: `npm run build` (build de produção), `npm start` (serve o build) e `npm run lint`.

## Telas

| Rota | Descrição |
| --- | --- |
| `/` | Home: hero, categorias, destaques (via API) e "Nossa história" |
| `/cardapio` | Catálogo com busca, filtro por categoria, ordenação, filtro de disponíveis e modal de detalhes |
| `/admin` | Lista de produtos: pausar/retomar venda, editar e excluir (com confirmação) |
| `/admin/novo` | Formulário de cadastro |
| `/admin/[id]` | Formulário de edição |

## API REST (`src/app/api/produtos`)

| Método | Rota | O que faz | Respostas |
| --- | --- | --- | --- |
| GET | `/api/produtos?busca=&categoria=&destaque=true&disponivel=true&ordenar=` | Lista e filtra | 200, 400 |
| GET | `/api/produtos/:id` | Busca um produto | 200, 404 |
| POST | `/api/produtos` | Cria | 201, 400, 422 |
| PUT | `/api/produtos/:id` | Substitui todos os dados | 200, 400, 404, 422 |
| PATCH | `/api/produtos/:id` | Altera campos (ex.: `disponivel`) | 200, 400, 404, 422 |
| DELETE | `/api/produtos/:id` | Exclui | 204, 404 |

Os erros seguem o formato `{ "erro": "mensagem", "campos": { "nome": "..." } }`. No front, `src/lib/api.ts` trata falha de rede, respostas fora do formato esperado e códigos HTTP, e mostra as mensagens em alertas, nos campos do formulário e em notificações.

> Os dados ficam em memória (`src/lib/db.ts`) e voltam ao estado inicial quando o servidor reinicia.

## Requisitos da atividade

- **3+ telas responsivas:** Home, Cardápio, Gerenciar e Formulário (novo/editar).
- **Componentes reutilizáveis:** `CartaoProduto`, `Modal`, `Botao`, `CampoFormulario`, `Placeholder`, `Estados`, `SeloCircular`, entre outros, em `src/components`.
- **Interações:** busca com *debounce*, filtro por categoria, ordenação, modal de detalhes, menu mobile, alternador de disponibilidade, modal de confirmação de exclusão e notificações.
- **Formulário:** 8 campos (5 obrigatórios), validados no cliente e no servidor com as mesmas regras (`src/lib/validacao.ts`), com mensagem por campo e resumo de erros.
- **HTTP:** GET, POST, PUT, PATCH e DELETE.
- **Acessibilidade:** Lighthouse 100 em todas as páginas (mobile e desktop). Inclui link "pular para o conteúdo", foco visível, contraste AA, `aria-invalid`/`aria-describedby` nos campos e modal com `<dialog>` nativo.

# imagem

As imagens inseridas neste README ilustram a interface do projeto, destacando a home, o cardápio e o painel administrativo. Elas ajudam a visualizar a identidade visual da cafeteria, a organização das telas e a experiência do usuário em cada fluxo principal da aplicação.