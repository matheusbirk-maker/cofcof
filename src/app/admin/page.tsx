import type { Metadata } from "next";
import Link from "next/link";
import { classesBotao } from "@/components/Botao";
import PainelAdmin from "@/components/PainelAdmin";

export const metadata: Metadata = {
  title: "Gerenciar produtos",
  description: "Área para cadastrar, editar, pausar e excluir produtos do cardápio da cofcof.",
};

export default function PaginaAdmin() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 md:pt-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-extrabold uppercase tracking-wide text-canela">Área administrativa</p>
          <h1 className="font-display text-4xl md:text-5xl">Gerenciar produtos</h1>
          <p className="mt-2 max-w-xl text-suave">
            Cadastre novos itens, edite informações, pause a venda de produtos esgotados ou remova-os do cardápio.
          </p>
        </div>
        <Link href="/admin/novo" className={classesBotao("primario")}>
          + Novo produto
        </Link>
      </div>
      <PainelAdmin />
    </div>
  );
}
