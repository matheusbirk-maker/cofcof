"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatarPreco } from "@/lib/formatar";
import { CATEGORIAS, nomeCategoria, type Ordenacao } from "@/lib/tipos";
import { useRequisicao } from "@/lib/useRequisicao";
import CartaoProduto from "./CartaoProduto";
import { classesControle } from "./CampoFormulario";
import { EstadoErro, EstadoVazio, GradeCarregando } from "./Estados";
import ImagemProduto from "./ImagemProduto";
import Modal from "./Modal";

const ORDENACOES: { valor: Ordenacao; rotulo: string }[] = [
  { valor: "nome", rotulo: "Nome (A–Z)" },
  { valor: "preco-asc", rotulo: "Menor preço" },
  { valor: "preco-desc", rotulo: "Maior preço" },
];

export default function Catalogo() {
  const router = useRouter();
  const caminho = usePathname();
  const params = useSearchParams();

  // Os filtros ficam na URL: dá para compartilhar o link e usar o botão "voltar".
  const busca = params.get("busca") ?? "";
  const categoria = params.get("categoria") ?? "";
  const ordenar = (params.get("ordenar") as Ordenacao | null) ?? "nome";
  const somenteDisponiveis = params.get("disponiveis") === "1";
  const idSelecionado = params.get("produto");

  function atualizarUrl(mudancas: Record<string, string | null>, modo: "push" | "replace" = "replace") {
    const novos = new URLSearchParams(params.toString());
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor) novos.set(chave, valor);
      else novos.delete(chave);
    }
    const query = novos.toString();
    router[modo](query ? `${caminho}?${query}` : caminho, { scroll: false });
  }

  // Campo de busca com "debounce": só atualiza a URL (e chama a API) 350 ms depois de parar de digitar.
  const [textoBusca, setTextoBusca] = useState(busca);
  const [buscaAnterior, setBuscaAnterior] = useState(busca);
  if (busca !== buscaAnterior) {
    setBuscaAnterior(busca);
    setTextoBusca(busca);
  }
  useEffect(() => {
    if (textoBusca.trim() === busca) return;
    const timer = setTimeout(() => atualizarUrl({ busca: textoBusca.trim() || null }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só reage ao texto digitado
  }, [textoBusca]);

  // GET /api/produtos com os filtros
  const lista = useRequisicao(`${busca}|${categoria}|${ordenar}|${somenteDisponiveis}`, (signal) =>
    api.listarProdutos({ busca, categoria, ordenar, disponivel: somenteDisponiveis }, signal),
  );

  // GET /api/produtos/:id para o modal de detalhes
  const detalhe = useRequisicao(`detalhe:${idSelecionado ?? ""}`, (signal) =>
    idSelecionado ? api.obterProduto(idSelecionado, signal) : Promise.resolve(null),
  );

  const temFiltros = Boolean(busca || categoria || somenteDisponiveis || ordenar !== "nome");
  const produtos = lista.dados?.dados ?? [];

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <form role="search" aria-label="Filtrar produtos" onSubmit={(e) => e.preventDefault()} className="block rounded-2xl border-[3px] border-espresso bg-white p-4 shadow-bloco md:p-6">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div>
            <label htmlFor="busca" className="mb-1.5 block font-extrabold">
              Buscar produto
            </label>
            <input
              id="busca"
              type="search"
              value={textoBusca}
              onChange={(e) => setTextoBusca(e.target.value)}
              placeholder="Ex.: caramelo, pão de queijo…"
              className={classesControle}
            />
          </div>
          <div>
            <label htmlFor="ordenar" className="mb-1.5 block font-extrabold">
              Ordenar por
            </label>
            <select id="ordenar" value={ordenar} onChange={(e) => atualizarUrl({ ordenar: e.target.value === "nome" ? null : e.target.value })} className={classesControle}>
              {ORDENACOES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <p id="rotulo-categorias" className="mb-2 font-extrabold">
            Categoria
          </p>
          <div role="group" aria-labelledby="rotulo-categorias" className="flex flex-wrap gap-2">
            {[{ id: "", nome: "Todas" }, ...CATEGORIAS].map((c) => {
              const ativa = categoria === c.id;
              return (
                <button
                  key={c.id || "todas"}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => atualizarUrl({ categoria: c.id || null })}
                  className={`min-h-11 rounded-full border-2 border-espresso px-4 py-1.5 font-bold transition ${
                    ativa ? "bg-espresso text-creme" : "bg-creme hover:bg-latte"
                  }`}
                >
                  {c.nome}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 font-bold">
            <input
              type="checkbox"
              className="size-5 accent-canela"
              checked={somenteDisponiveis}
              onChange={(e) => atualizarUrl({ disponiveis: e.target.checked ? "1" : null })}
            />
            Mostrar só produtos disponíveis
          </label>
          {temFiltros && (
            <button
              type="button"
              onClick={() => router.replace(caminho, { scroll: false })}
              className="min-h-11 font-extrabold text-canela underline underline-offset-4 hover:text-canela-escuro"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </form>

      {/* Resultados */}
      <section aria-labelledby="titulo-resultados">
        <h2 id="titulo-resultados" className="sr-only">
          Produtos
        </h2>
        <p role="status" className="mb-4 font-bold text-suave">
          {lista.carregando
            ? "Carregando produtos…"
            : lista.erro
              ? ""
              : `${produtos.length} ${produtos.length === 1 ? "produto encontrado" : "produtos encontrados"}${
                  categoria ? ` em ${nomeCategoria(categoria)}` : ""
                }`}
        </p>

        {lista.carregando ? (
          <GradeCarregando />
        ) : lista.erro ? (
          <EstadoErro mensagem={lista.erro} aoTentarNovamente={lista.recarregar} />
        ) : produtos.length === 0 ? (
          <EstadoVazio titulo="Nenhum produto encontrado">Tente buscar por outro termo ou limpe os filtros.</EstadoVazio>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => (
              <li key={produto.id}>
                <CartaoProduto produto={produto} aoSelecionar={(p) => atualizarUrl({ produto: p.id }, "push")} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal de detalhes */}
      <Modal
        aberto={Boolean(idSelecionado)}
        aoFechar={() => atualizarUrl({ produto: null })}
        titulo={detalhe.dados?.dados.nome ?? (detalhe.erro ? "Produto indisponível" : "Carregando…")}
        largura="max-w-2xl"
      >
        {detalhe.carregando ? (
          <p role="status">Carregando detalhes…</p>
        ) : detalhe.erro ? (
          <EstadoErro mensagem={detalhe.erro} aoTentarNovamente={detalhe.recarregar} />
        ) : detalhe.dados ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <ImagemProduto produto={detalhe.dados.dados} className="aspect-square w-full rounded-xl border-2 border-espresso" />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-extrabold uppercase tracking-wide text-canela">
                {nomeCategoria(detalhe.dados.dados.categoria)}
              </p>
              <p>{detalhe.dados.dados.descricao}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="font-bold">Preço</dt>
                <dd className="text-xl font-black">{formatarPreco(detalhe.dados.dados.preco)}</dd>
                <dt className="font-bold">Tamanho</dt>
                <dd>{detalhe.dados.dados.tamanho}</dd>
                <dt className="font-bold">Situação</dt>
                <dd className={detalhe.dados.dados.disponivel ? "font-bold text-sucesso" : "font-bold text-erro"}>
                  {detalhe.dados.dados.disponivel ? "Disponível" : "Esgotado"}
                </dd>
              </dl>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
