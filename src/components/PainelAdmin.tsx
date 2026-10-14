"use client";

import Link from "next/link";
import { useState } from "react";
import { api, mensagemDeErro } from "@/lib/api";
import { formatarPreco } from "@/lib/formatar";
import { nomeCategoria, type Produto } from "@/lib/tipos";
import { useRequisicao } from "@/lib/useRequisicao";
import Botao, { classesBotao } from "./Botao";
import { EstadoErro, EstadoVazio } from "./Estados";
import Modal from "./Modal";
import { useNotificar } from "./Notificacoes";

export default function PainelAdmin() {
  const notificar = useNotificar();
  const { dados, erro, carregando, recarregar, alterarDados } = useRequisicao("admin", (signal) =>
    api.listarProdutos({ ordenar: "nome" }, signal),
  );
  const [emAndamento, setEmAndamento] = useState<string | null>(null);
  const [paraExcluir, setParaExcluir] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  function substituirNaLista(produto: Produto) {
    alterarDados((d) => ({ ...d, dados: d.dados.map((p) => (p.id === produto.id ? produto : p)) }));
  }

  // PATCH /api/produtos/:id — pausa ou retoma a venda
  async function alternarDisponivel(produto: Produto) {
    setEmAndamento(produto.id);
    try {
      const { dados: atualizado } = await api.alterarProduto(produto.id, { disponivel: !produto.disponivel });
      substituirNaLista(atualizado);
      notificar("sucesso", `“${atualizado.nome}” agora está ${atualizado.disponivel ? "disponível" : "esgotado"}.`);
    } catch (e) {
      notificar("erro", mensagemDeErro(e));
    } finally {
      setEmAndamento(null);
    }
  }

  // DELETE /api/produtos/:id
  async function confirmarExclusao() {
    if (!paraExcluir) return;
    setExcluindo(true);
    try {
      await api.excluirProduto(paraExcluir.id);
      alterarDados((d) => ({ total: d.total - 1, dados: d.dados.filter((p) => p.id !== paraExcluir.id) }));
      notificar("sucesso", `“${paraExcluir.nome}” foi excluído.`);
      setParaExcluir(null);
    } catch (e) {
      notificar("erro", mensagemDeErro(e));
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    // Esqueleto com a mesma altura da lista, para a página não "pular" quando os dados chegam.
    return (
      <div role="status" aria-label="Carregando produtos">
        <div className="mb-4 h-6" />
        <ul className="space-y-4" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <li key={i} className="h-[146px] animate-pulse rounded-2xl border-[3px] border-latte-escuro bg-white md:h-[100px]" />
          ))}
        </ul>
      </div>
    );
  }
  if (erro) return <EstadoErro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!dados || dados.dados.length === 0) {
    return (
      <EstadoVazio titulo="Nenhum produto cadastrado">
        <Link href="/admin/novo" className="font-bold text-canela underline">
          Cadastre o primeiro produto
        </Link>
      </EstadoVazio>
    );
  }

  return (
    <>
      <p className="mb-4 font-bold text-suave">{dados.total} produtos cadastrados</p>
      <ul className="space-y-4">
        {dados.dados.map((produto) => (
          <li
            key={produto.id}
            className="flex flex-col gap-4 rounded-2xl border-[3px] border-espresso bg-white p-4 shadow-bloco-sm md:flex-row md:items-center"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold uppercase tracking-wide text-canela">{nomeCategoria(produto.categoria)}</p>
              <h2 className="truncate font-display text-xl">{produto.nome}</h2>
              <p className="text-sm text-suave">
                {formatarPreco(produto.preco)} · {produto.tamanho}
                {produto.destaque && " · Destaque"}
              </p>
              {!produto.disponivel && (
                <span className="mt-1 inline-block rounded-full bg-espresso px-2.5 py-0.5 text-xs font-bold uppercase text-creme">
                  Esgotado
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={produto.disponivel}
                aria-label={`À venda: ${produto.nome}`}
                disabled={emAndamento === produto.id}
                onClick={() => alternarDisponivel(produto)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-espresso bg-creme px-3 font-bold disabled:opacity-60"
              >
                <span
                  aria-hidden="true"
                  className={`relative h-6 w-11 rounded-full border-2 border-espresso transition ${produto.disponivel ? "bg-sucesso" : "bg-latte-escuro"}`}
                >
                  <span
                    className={`absolute top-0.5 size-4 rounded-full border-2 border-espresso bg-white transition-all ${produto.disponivel ? "left-5" : "left-0.5"}`}
                  />
                </span>
                À venda
              </button>

              <Link href={`/admin/${produto.id}`} className={classesBotao("secundario", "sm", "min-h-11")}>
                Editar<span className="sr-only"> {produto.nome}</span>
              </Link>
              <Botao variante="perigo" tamanho="sm" className="min-h-11" onClick={() => setParaExcluir(produto)}>
                Excluir<span className="sr-only"> {produto.nome}</span>
              </Botao>
            </div>
          </li>
        ))}
      </ul>

      <Modal aberto={paraExcluir !== null} aoFechar={() => setParaExcluir(null)} titulo="Excluir produto?">
        <p>
          Tem certeza de que deseja excluir <strong>{paraExcluir?.nome}</strong> do cardápio? Esta ação não pode ser
          desfeita.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Botao variante="secundario" onClick={() => setParaExcluir(null)} disabled={excluindo}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={confirmarExclusao} carregando={excluindo}>
            Sim, excluir
          </Botao>
        </div>
      </Modal>
    </>
  );
}
