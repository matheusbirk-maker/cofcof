"use client";

import { useRouter } from "next/navigation";
import { EstadoErro } from "@/components/Estados";
import FormularioProduto from "@/components/FormularioProduto";
import { useNotificar } from "@/components/Notificacoes";
import { api } from "@/lib/api";
import { useRequisicao } from "@/lib/useRequisicao";

export default function EditarProduto({ id }: { id: string }) {
  const router = useRouter();
  const notificar = useNotificar();
  // GET /api/produtos/:id
  const { dados, erro, carregando, recarregar } = useRequisicao(`produto:${id}`, (signal) => api.obterProduto(id, signal));

  if (carregando) return <p role="status" className="font-bold">Carregando produto…</p>;
  if (erro || !dados) return <EstadoErro mensagem={erro ?? "Produto não encontrado."} aoTentarNovamente={recarregar} />;

  return (
    <div className="rounded-2xl border-[3px] border-espresso bg-creme p-5 shadow-bloco md:p-8">
      <FormularioProduto
        produto={dados.dados}
        textoEnviar="Salvar alterações"
        aoEnviar={async (entrada) => {
          // PUT /api/produtos/:id
          const { dados: atualizado } = await api.atualizarProduto(id, entrada);
          notificar("sucesso", `“${atualizado.nome}” foi atualizado.`);
          router.push("/admin");
        }}
      />
    </div>
  );
}
