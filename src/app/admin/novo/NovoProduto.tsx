"use client";

import { useRouter } from "next/navigation";
import FormularioProduto from "@/components/FormularioProduto";
import { useNotificar } from "@/components/Notificacoes";
import { api } from "@/lib/api";

export default function NovoProduto() {
  const router = useRouter();
  const notificar = useNotificar();

  return (
    <FormularioProduto
      textoEnviar="Cadastrar produto"
      aoEnviar={async (dados) => {
        // POST /api/produtos
        const { dados: criado } = await api.criarProduto(dados);
        notificar("sucesso", `“${criado.nome}” foi cadastrado!`);
        router.push("/admin");
      }}
    />
  );
}
