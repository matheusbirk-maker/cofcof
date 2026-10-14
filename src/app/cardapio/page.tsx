import type { Metadata } from "next";
import { Suspense } from "react";
import Catalogo from "@/components/Catalogo";
import { GradeCarregando } from "@/components/Estados";

export const metadata: Metadata = {
  title: "Cardápio",
  description: "Cafés quentes e gelados, chás, doces e salgados da cofcof. Busque e filtre por categoria.",
};

export default function PaginaCardapio() {
  return (
    <>
      <section className="fundo-manchas border-b-4 border-espresso">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:pt-20">
          <h1 className="titulo-adesivo text-[clamp(2.4rem,11vw,4.5rem)] uppercase">
            Nosso <span className="destaque">cardápio</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg font-bold">
            Escolha seu café, encontre um docinho para acompanhar e clique em um produto para ver os detalhes.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* useSearchParams exige um limite de Suspense */}
        <Suspense fallback={<GradeCarregando />}>
          <Catalogo />
        </Suspense>
      </div>
    </>
  );
}
