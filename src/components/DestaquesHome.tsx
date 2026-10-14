"use client";

import { api } from "@/lib/api";
import { useRequisicao } from "@/lib/useRequisicao";
import CartaoProduto from "./CartaoProduto";
import { EstadoErro, EstadoVazio, GradeCarregando } from "./Estados";

export default function DestaquesHome() {
  const { dados, erro, carregando, recarregar } = useRequisicao("destaques", (signal) =>
    api.listarProdutos({ destaque: true, disponivel: true }, signal),
  );

  if (carregando) return <GradeCarregando quantidade={3} />;
  if (erro) return <EstadoErro mensagem={erro} aoTentarNovamente={recarregar} />;
  if (!dados || dados.dados.length === 0) {
    return <EstadoVazio titulo="Nenhum destaque no momento">Confira o cardápio completo.</EstadoVazio>;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dados.dados.map((produto) => (
        <li key={produto.id}>
          <CartaoProduto produto={produto} href={`/cardapio?produto=${produto.id}`} />
        </li>
      ))}
    </ul>
  );
}
