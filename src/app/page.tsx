import Image from "next/image";
import Link from "next/link";
import { classesBotao } from "@/components/Botao";
import DestaquesHome from "@/components/DestaquesHome";
import Placeholder from "@/components/Placeholder";
import SeloCircular from "@/components/SeloCircular";
import { CATEGORIAS } from "@/lib/tipos";

export default function Home() {
  return (
    <>
      {/* Hero — inspirado na referência: fundo com manchas, título "adesivo" e selos redondos */}
      <section aria-labelledby="titulo-hero" className="fundo-manchas relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-16 md:pt-20 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 id="titulo-hero" className="titulo-adesivo text-[clamp(2.4rem,11vw,6rem)] uppercase">
              Café
              <br />
              fresquinho
              <br />
              do jeito <span className="destaque">cofcof!</span>
            </h1>
            <p className="mt-6 max-w-md text-lg font-bold">
              Grãos torrados na casa, doces saindo do forno e aquele cheirinho que faz qualquer um parar na porta.
            </p>
            <Link href="/cardapio" className={classesBotao("secundario", "md", "mt-8 min-h-16 border-[3px]! px-6! text-lg! shadow-bloco! sm:px-8! sm:text-2xl!")}>
              Ver o cardápio completo
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border-4 border-espresso bg-creme shadow-bloco">
              <Image
                src="/foto_principal.png"
                alt="Foto principal da cafeteria"
                fill
                sizes="(min-width: 448px) 448px, 100vw"
                className="object-cover"
              />
            </div>
            <SeloCircular texto="Grãos torrados na casa" className="absolute -right-2 -top-6 rotate-6 sm:-right-10" />
            <SeloCircular texto="Feito na hora, sempre!" className="absolute -bottom-6 -left-2 -rotate-6 sm:-left-10" />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section aria-labelledby="titulo-categorias" className="border-y-4 border-espresso bg-caramelo">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h2 id="titulo-categorias" className="sr-only">
            Categorias do cardápio
          </h2>
          <ul className="flex flex-wrap justify-center gap-3">
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <Link href={`/cardapio?categoria=${c.id}`} className={classesBotao("secundario", "md", "rounded-full")}>
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Destaques (GET /api/produtos?destaque=true) */}
      <section aria-labelledby="titulo-destaques" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-extrabold uppercase tracking-wide text-canela">Os queridinhos</p>
            <h2 id="titulo-destaques" className="font-display text-4xl md:text-5xl">
              Destaques da casa
            </h2>
          </div>
          <Link href="/cardapio" className="font-extrabold text-canela underline underline-offset-4 hover:text-canela-escuro">
            Ver todos os produtos →
          </Link>
        </div>
        <DestaquesHome />
      </section>

      {/* Nossa história */}
      <section id="historia" aria-labelledby="titulo-historia" className="scroll-mt-4 border-t-4 border-espresso bg-latte">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
            <Image
              src="/nossa_historia.png"
              alt="Espaço da cafeteria"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-extrabold uppercase tracking-wide text-canela">Nossa história</p>
            <h2 id="titulo-historia" className="font-display text-4xl md:text-5xl">
              Tudo começou com uma tosse
            </h2>
            <p className="mt-4 text-lg">
              O nome veio do primeiro café que torramos: o fogo passou do ponto, a cozinha encheu de fumaça e todo
              mundo saiu tossindo — <em>cof, cof!</em> A torra melhorou muito desde então, mas o nome ficou.
            </p>
            <p className="mt-4 text-lg">
              Hoje servimos cafés especiais de pequenos produtores, com doces e salgados preparados todos os dias na
              nossa cozinha.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
