import type { NextRequest } from "next/server";
import { criarProduto, listarProdutos } from "@/lib/db";
import type { Ordenacao } from "@/lib/tipos";
import { validarProduto } from "@/lib/validacao";
import { erro, lerCorpoJson } from "../utils";

const ORDENACOES: Ordenacao[] = ["nome", "preco-asc", "preco-desc"];

// GET /api/produtos?busca=&categoria=&destaque=true&disponivel=true&ordenar=
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const ordenar = params.get("ordenar") as Ordenacao | null;

  if (ordenar && !ORDENACOES.includes(ordenar)) {
    return erro(400, `Ordenação inválida. Use: ${ORDENACOES.join(", ")}.`);
  }

  const dados = listarProdutos({
    busca: params.get("busca") ?? undefined,
    categoria: params.get("categoria") ?? undefined,
    destaque: params.get("destaque") === "true",
    disponivel: params.get("disponivel") === "true",
    ordenar: ordenar ?? undefined,
  });

  return Response.json({ dados, total: dados.length });
}

// POST /api/produtos
export async function POST(request: NextRequest) {
  const corpo = await lerCorpoJson(request);
  if (!corpo) return erro(400, "O corpo da requisição deve ser um JSON válido.");

  const resultado = validarProduto(corpo);
  if (!resultado.valido) {
    return erro(422, "Alguns campos são inválidos.", resultado.erros);
  }

  const produto = criarProduto(resultado.dados);
  return Response.json({ dados: produto }, { status: 201 });
}
