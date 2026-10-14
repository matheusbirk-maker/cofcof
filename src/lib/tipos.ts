export const CATEGORIAS = [
  { id: "cafes-quentes", nome: "Cafés quentes" },
  { id: "cafes-gelados", nome: "Cafés gelados" },
  { id: "chas-e-outros", nome: "Chás e outros" },
  { id: "doces", nome: "Doces" },
  { id: "salgados", nome: "Salgados" },
] as const;

export type CategoriaId = (typeof CATEGORIAS)[number]["id"];

export interface Produto {
  id: string;
  nome: string;
  categoria: CategoriaId;
  preco: number;
  descricao: string;
  tamanho: string;
  imagem: string;
  disponivel: boolean;
  destaque: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

/** Campos que o cliente envia ao criar (POST) ou substituir (PUT) um produto. */
export type ProdutoEntrada = Omit<Produto, "id" | "criadoEm" | "atualizadoEm">;

export type Ordenacao = "nome" | "preco-asc" | "preco-desc";

export interface FiltrosProdutos {
  busca?: string;
  categoria?: string;
  destaque?: boolean;
  disponivel?: boolean;
  ordenar?: Ordenacao;
}

/** Formato das respostas da API. */
export interface RespostaLista<T> {
  dados: T[];
  total: number;
}

export interface RespostaItem<T> {
  dados: T;
}

export interface RespostaErro {
  erro: string;
  campos?: Record<string, string>;
}

export function nomeCategoria(id: string): string {
  return CATEGORIAS.find((c) => c.id === id)?.nome ?? id;
}
