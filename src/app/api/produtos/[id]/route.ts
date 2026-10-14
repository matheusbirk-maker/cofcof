import type { NextRequest } from "next/server";
import { atualizarProduto, obterProduto, removerProduto } from "@/lib/db";
import { validarProduto } from "@/lib/validacao";
import { erro, lerCorpoJson } from "../../utils";

type Contexto = RouteContext<"/api/produtos/[id]">;

const NAO_ENCONTRADO = "Produto não encontrado.";

// GET /api/produtos/:id
export async function GET(_request: NextRequest, ctx: Contexto) {
  const { id } = await ctx.params;
  const produto = obterProduto(id);
  if (!produto) return erro(404, NAO_ENCONTRADO);
  return Response.json({ dados: produto });
}

// PUT /api/produtos/:id — substitui todos os dados do produto
export async function PUT(request: NextRequest, ctx: Contexto) {
  const { id } = await ctx.params;
  if (!obterProduto(id)) return erro(404, NAO_ENCONTRADO);

  const corpo = await lerCorpoJson(request);
  if (!corpo) return erro(400, "O corpo da requisição deve ser um JSON válido.");

  const resultado = validarProduto(corpo);
  if (!resultado.valido) return erro(422, "Alguns campos são inválidos.", resultado.erros);

  return Response.json({ dados: atualizarProduto(id, resultado.dados) });
}

// PATCH /api/produtos/:id — altera apenas os campos enviados (ex.: { "disponivel": false })
export async function PATCH(request: NextRequest, ctx: Contexto) {
  const { id } = await ctx.params;
  const atual = obterProduto(id);
  if (!atual) return erro(404, NAO_ENCONTRADO);

  const corpo = await lerCorpoJson(request);
  if (!corpo) return erro(400, "O corpo da requisição deve ser um JSON válido.");

  // Mescla com os dados atuais e valida o resultado completo.
  const resultado = validarProduto({ ...atual, ...corpo });
  if (!resultado.valido) return erro(422, "Alguns campos são inválidos.", resultado.erros);

  return Response.json({ dados: atualizarProduto(id, resultado.dados) });
}

// DELETE /api/produtos/:id
export async function DELETE(_request: NextRequest, ctx: Contexto) {
  const { id } = await ctx.params;
  if (!removerProduto(id)) return erro(404, NAO_ENCONTRADO);
  return new Response(null, { status: 204 });
}
