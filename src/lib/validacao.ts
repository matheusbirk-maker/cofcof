import { CATEGORIAS, type ProdutoEntrada } from "./tipos";

export type ErrosCampos = Partial<Record<keyof ProdutoEntrada, string>>;

export type ResultadoValidacao =
  | { valido: true; dados: ProdutoEntrada }
  | { valido: false; erros: ErrosCampos };

/**
 * Valida os dados de um produto. É usada tanto no formulário (cliente)
 * quanto nas rotas da API (servidor), garantindo as mesmas regras nos dois lados.
 */
export function validarProduto(entrada: Record<string, unknown>): ResultadoValidacao {
  const erros: ErrosCampos = {};

  const nome = texto(entrada.nome);
  if (!nome) erros.nome = "Informe o nome do produto.";
  else if (nome.length < 3) erros.nome = "O nome deve ter pelo menos 3 caracteres.";
  else if (nome.length > 60) erros.nome = "O nome deve ter no máximo 60 caracteres.";

  const categoria = texto(entrada.categoria);
  if (!categoria) erros.categoria = "Selecione uma categoria.";
  else if (!CATEGORIAS.some((c) => c.id === categoria)) erros.categoria = "Categoria inválida.";

  const precoBruto = typeof entrada.preco === "string" ? entrada.preco.replace(",", ".").trim() : entrada.preco;
  const preco = precoBruto === "" || precoBruto === undefined || precoBruto === null ? NaN : Number(precoBruto);
  if (precoBruto === "" || precoBruto === undefined || precoBruto === null) erros.preco = "Informe o preço.";
  else if (!Number.isFinite(preco)) erros.preco = "O preço deve ser um número (ex.: 12,90).";
  else if (preco <= 0) erros.preco = "O preço deve ser maior que zero.";
  else if (preco > 999) erros.preco = "O preço deve ser no máximo R$ 999,00.";

  const descricao = texto(entrada.descricao);
  if (!descricao) erros.descricao = "Informe a descrição.";
  else if (descricao.length < 10) erros.descricao = "A descrição deve ter pelo menos 10 caracteres.";
  else if (descricao.length > 300) erros.descricao = "A descrição deve ter no máximo 300 caracteres.";

  const tamanho = texto(entrada.tamanho);
  if (!tamanho) erros.tamanho = "Informe o tamanho ou a porção (ex.: 300 ml).";
  else if (tamanho.length > 30) erros.tamanho = "O tamanho deve ter no máximo 30 caracteres.";

  const imagem = texto(entrada.imagem);
  if (imagem && !/^(https?:\/\/|\/)\S+$/.test(imagem)) {
    erros.imagem = "Informe um endereço válido (começando com http://, https:// ou /).";
  }

  if (Object.keys(erros).length > 0) return { valido: false, erros };

  return {
    valido: true,
    dados: {
      nome,
      categoria: categoria as ProdutoEntrada["categoria"],
      preco: Math.round(preco * 100) / 100,
      descricao,
      tamanho,
      imagem,
      disponivel: entrada.disponivel !== false,
      destaque: entrada.destaque === true,
    },
  };
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}
