import Link from "next/link";
import { formatarPreco } from "@/lib/formatar";
import { nomeCategoria, type Produto } from "@/lib/tipos";
import ImagemProduto from "./ImagemProduto";

interface CartaoProdutoProps {
  produto: Produto;
  /** Se informado, o cartão vira um botão (ex.: abrir o modal de detalhes). */
  aoSelecionar?: (produto: Produto) => void;
  /** Se informado, o cartão vira um link. */
  href?: string;
  /** Nível do título, para manter a hierarquia correta de cabeçalhos na página. */
  nivelTitulo?: "h2" | "h3";
}

/** Cartão de produto reutilizado na Home (destaques) e no Cardápio. */
export default function CartaoProduto({ produto, aoSelecionar, href, nivelTitulo: Titulo = "h3" }: CartaoProdutoProps) {
  const classesAcao =
    "after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none";

  const nome = aoSelecionar ? (
    <button type="button" onClick={() => aoSelecionar(produto)} className={`text-left ${classesAcao}`}>
      {produto.nome}
      <span className="sr-only">, ver detalhes</span>
    </button>
  ) : href ? (
    <Link href={href} className={classesAcao}>
      {produto.nome}
    </Link>
  ) : (
    produto.nome
  );

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-[3px] border-espresso bg-white shadow-bloco transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-canela ${
        aoSelecionar || href ? "hover:-translate-y-1" : ""
      }`}
    >
      <div className="relative border-b-[3px] border-espresso">
        <ImagemProduto produto={produto} className="aspect-[4/3] w-full" />
        {produto.destaque && (
          <span className="absolute left-3 top-3 rounded-full border-2 border-espresso bg-caramelo px-3 py-0.5 text-xs font-extrabold uppercase text-espresso">
            Destaque
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-canela">{nomeCategoria(produto.categoria)}</p>
        <Titulo className="font-display text-xl leading-tight">{nome}</Titulo>
        <p className="line-clamp-2 text-sm text-suave">{produto.descricao}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="text-xl font-black">{formatarPreco(produto.preco)}</p>
          {produto.disponivel ? (
            <span className="text-sm text-suave">{produto.tamanho}</span>
          ) : (
            <span className="rounded-full bg-espresso px-2.5 py-0.5 text-xs font-bold uppercase text-creme">Esgotado</span>
          )}
        </div>
      </div>
    </article>
  );
}
