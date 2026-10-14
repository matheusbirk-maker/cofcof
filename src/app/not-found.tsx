import Link from "next/link";
import { classesBotao } from "@/components/Botao";

export default function NaoEncontrado() {
  return (
    <section className="fundo-manchas">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="titulo-adesivo text-[clamp(3rem,14vw,6rem)] uppercase">
          Cof<span className="destaque">…404</span>
        </h1>
        <p className="mt-6 text-xl font-bold">Engasgamos! Esta página não existe.</p>
        <Link href="/" className={classesBotao("primario", "md", "mt-8")}>
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
