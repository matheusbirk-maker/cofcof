import Image from "next/image";
import type { Produto } from "@/lib/tipos";
import Placeholder from "./Placeholder";

/** Mostra a imagem do produto ou um placeholder enquanto não houver imagem cadastrada. */
export default function ImagemProduto({ produto, className = "" }: { produto: Produto; className?: string }) {
  if (!produto.imagem) {
    return <Placeholder rotulo={produto.nome} className={className} borda={false} />;
  }
  return (
    <div className={`relative overflow-hidden bg-latte ${className}`}>
      <Image src={produto.imagem} alt={produto.nome} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
    </div>
  );
}
