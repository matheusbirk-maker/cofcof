import type {
  FiltrosProdutos,
  Produto,
  ProdutoEntrada,
  RespostaErro,
  RespostaItem,
  RespostaLista,
} from "./tipos";

/** Erro padronizado para qualquer falha ao falar com a API. */
export class ErroApi extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly campos?: Record<string, string>,
  ) {
    super(message);
    this.name = "ErroApi";
  }
}

const MENSAGENS_POR_STATUS: Record<number, string> = {
  400: "A requisição enviada é inválida.",
  404: "O item solicitado não foi encontrado.",
  422: "Alguns campos são inválidos.",
  500: "O servidor encontrou um erro. Tente novamente em instantes.",
};

async function requisitar<T>(url: string, init: RequestInit = {}): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new ErroApi("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.", 0);
  }

  if (resposta.status === 204) return undefined as T;

  const corpo = (await resposta.json().catch(() => null)) as T | RespostaErro | null;

  if (!resposta.ok) {
    const erro = corpo as RespostaErro | null;
    throw new ErroApi(
      erro?.erro ?? MENSAGENS_POR_STATUS[resposta.status] ?? `Erro inesperado (código ${resposta.status}).`,
      resposta.status,
      erro?.campos,
    );
  }
  if (corpo === null) throw new ErroApi("A resposta do servidor veio em um formato inesperado.", resposta.status);

  return corpo as T;
}

function montarQuery(filtros: FiltrosProdutos): string {
  const params = new URLSearchParams();
  if (filtros.busca?.trim()) params.set("busca", filtros.busca.trim());
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  if (filtros.destaque) params.set("destaque", "true");
  if (filtros.disponivel) params.set("disponivel", "true");
  if (filtros.ordenar) params.set("ordenar", filtros.ordenar);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const api = {
  /** GET /api/produtos */
  listarProdutos(filtros: FiltrosProdutos = {}, signal?: AbortSignal) {
    return requisitar<RespostaLista<Produto>>(`/api/produtos${montarQuery(filtros)}`, { signal });
  },

  /** GET /api/produtos/:id */
  obterProduto(id: string, signal?: AbortSignal) {
    return requisitar<RespostaItem<Produto>>(`/api/produtos/${encodeURIComponent(id)}`, { signal });
  },

  /** POST /api/produtos */
  criarProduto(dados: ProdutoEntrada) {
    return requisitar<RespostaItem<Produto>>("/api/produtos", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  /** PUT /api/produtos/:id */
  atualizarProduto(id: string, dados: ProdutoEntrada) {
    return requisitar<RespostaItem<Produto>>(`/api/produtos/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  /** PATCH /api/produtos/:id */
  alterarProduto(id: string, dados: Partial<ProdutoEntrada>) {
    return requisitar<RespostaItem<Produto>>(`/api/produtos/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
  },

  /** DELETE /api/produtos/:id */
  excluirProduto(id: string) {
    return requisitar<void>(`/api/produtos/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroApi) return erro.message;
  return "Ocorreu um erro inesperado. Tente novamente.";
}
