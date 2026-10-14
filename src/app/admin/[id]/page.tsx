import type { Metadata } from "next";
import Link from "next/link";
import EditarProduto from "./EditarProduto";

export const metadata: Metadata = {
  title: "Editar produto",
};

export default async function PaginaEditarProduto({ params }: PageProps<"/admin/[id]">) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-16 md:pt-20">
      <Link href="/admin" className="font-bold text-canela underline underline-offset-4">
        ← Voltar para a lista
      </Link>
      <h1 className="mb-6 mt-3 font-display text-4xl md:text-5xl">Editar produto</h1>
      <EditarProduto id={id} />
    </div>
  );
}
