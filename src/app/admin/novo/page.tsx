import type { Metadata } from "next";
import Link from "next/link";
import NovoProduto from "./NovoProduto";

export const metadata: Metadata = {
  title: "Novo produto",
};

export default function PaginaNovoProduto() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-16 md:pt-20">
      <Link href="/admin" className="font-bold text-canela underline underline-offset-4">
        ← Voltar para a lista
      </Link>
      <h1 className="mb-6 mt-3 font-display text-4xl md:text-5xl">Novo produto</h1>
      <div className="rounded-2xl border-[3px] border-espresso bg-creme p-5 shadow-bloco md:p-8">
        <NovoProduto />
      </div>
    </div>
  );
}
