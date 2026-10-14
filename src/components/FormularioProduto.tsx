"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ErroApi, mensagemDeErro } from "@/lib/api";
import { CATEGORIAS, type Produto, type ProdutoEntrada } from "@/lib/tipos";
import { validarProduto, type ErrosCampos } from "@/lib/validacao";
import Botao, { classesBotao } from "./Botao";
import CampoFormulario from "./CampoFormulario";

interface Valores {
  nome: string;
  categoria: string;
  preco: string;
  tamanho: string;
  descricao: string;
  imagem: string;
  disponivel: boolean;
  destaque: boolean;
}

const ROTULOS: Record<keyof ProdutoEntrada, string> = {
  nome: "Nome",
  categoria: "Categoria",
  preco: "Preço",
  tamanho: "Tamanho / porção",
  descricao: "Descrição",
  imagem: "Endereço da imagem",
  disponivel: "Disponível",
  destaque: "Destaque",
};

function valoresIniciais(produto?: Produto): Valores {
  return {
    nome: produto?.nome ?? "",
    categoria: produto?.categoria ?? "",
    preco: produto ? produto.preco.toFixed(2).replace(".", ",") : "",
    tamanho: produto?.tamanho ?? "",
    descricao: produto?.descricao ?? "",
    imagem: produto?.imagem ?? "",
    disponivel: produto?.disponivel ?? true,
    destaque: produto?.destaque ?? false,
  };
}

interface FormularioProdutoProps {
  produto?: Produto;
  textoEnviar: string;
  /** Envia os dados validados para a API. Pode lançar ErroApi. */
  aoEnviar: (dados: ProdutoEntrada) => Promise<void>;
}

export default function FormularioProduto({ produto, textoEnviar, aoEnviar }: FormularioProdutoProps) {
  const [valores, setValores] = useState<Valores>(() => valoresIniciais(produto));
  const [erros, setErros] = useState<ErrosCampos>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const resumoRef = useRef<HTMLDivElement>(null);

  function alterar<K extends keyof Valores>(campo: K, valor: Valores[K]) {
    const novos = { ...valores, [campo]: valor };
    setValores(novos);
    // Depois da primeira tentativa de envio, revalida enquanto a pessoa corrige.
    if (tentouEnviar) {
      const resultado = validarProduto({ ...novos });
      setErros(resultado.valido ? {} : resultado.erros);
    }
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTentouEnviar(true);
    setErroGeral(null);

    const resultado = validarProduto({ ...valores });
    if (!resultado.valido) {
      setErros(resultado.erros);
      requestAnimationFrame(() => resumoRef.current?.focus());
      return;
    }

    setErros({});
    setEnviando(true);
    try {
      await aoEnviar(resultado.dados);
    } catch (erro) {
      // Erros de validação devolvidos pela API (422) aparecem nos campos.
      if (erro instanceof ErroApi && erro.campos) setErros(erro.campos as ErrosCampos);
      setErroGeral(mensagemDeErro(erro));
      requestAnimationFrame(() => resumoRef.current?.focus());
    } finally {
      setEnviando(false);
    }
  }

  const listaErros = Object.entries(erros) as [keyof ProdutoEntrada, string][];
  const temResumo = listaErros.length > 0 || erroGeral;

  return (
    <form onSubmit={enviar} noValidate className="space-y-6">
      <p className="text-sm text-suave">
        Campos marcados com <span className="font-bold text-erro">*</span> são obrigatórios.
      </p>

      {temResumo && (
        <div
          ref={resumoRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border-[3px] border-erro bg-[#fbe4e2] p-4 text-espresso focus:outline-none"
        >
          <p className="font-extrabold text-erro">
            {erroGeral ?? "Não foi possível salvar. Corrija os campos abaixo:"}
          </p>
          {listaErros.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {listaErros.map(([campo, mensagem]) => (
                <li key={campo}>
                  <a href={`#campo-${campo}`} className="font-bold underline underline-offset-2">
                    {ROTULOS[campo]}
                  </a>
                  : {mensagem}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <CampoFormulario nome="nome" rotulo={ROTULOS.nome} obrigatorio erro={erros.nome} className="md:col-span-2">
          {(props) => (
            <input {...props} type="text" autoComplete="off" maxLength={60} value={valores.nome} onChange={(e) => alterar("nome", e.target.value)} placeholder="Ex.: Cappuccino cremoso" />
          )}
        </CampoFormulario>

        <CampoFormulario nome="categoria" rotulo={ROTULOS.categoria} obrigatorio erro={erros.categoria}>
          {(props) => (
            <select {...props} value={valores.categoria} onChange={(e) => alterar("categoria", e.target.value)}>
              <option value="">Selecione…</option>
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          )}
        </CampoFormulario>

        <CampoFormulario nome="preco" rotulo={`${ROTULOS.preco} (R$)`} obrigatorio erro={erros.preco} dica="Use vírgula para os centavos, ex.: 12,90">
          {(props) => (
            <input {...props} type="text" inputMode="decimal" value={valores.preco} onChange={(e) => alterar("preco", e.target.value)} placeholder="0,00" />
          )}
        </CampoFormulario>

        <CampoFormulario nome="tamanho" rotulo={ROTULOS.tamanho} obrigatorio erro={erros.tamanho} dica="Ex.: 300 ml, 1 fatia, 3 unidades">
          {(props) => (
            <input {...props} type="text" maxLength={30} value={valores.tamanho} onChange={(e) => alterar("tamanho", e.target.value)} />
          )}
        </CampoFormulario>

        <CampoFormulario nome="imagem" rotulo={ROTULOS.imagem} erro={erros.imagem} dica="Deixe em branco para usar a imagem provisória.">
          {(props) => (
            <input {...props} type="url" value={valores.imagem} onChange={(e) => alterar("imagem", e.target.value)} placeholder="https://…" />
          )}
        </CampoFormulario>

        <CampoFormulario
          nome="descricao"
          rotulo={ROTULOS.descricao}
          obrigatorio
          erro={erros.descricao}
          dica={`${valores.descricao.trim().length}/300 caracteres (mínimo 10)`}
          className="md:col-span-2"
        >
          {(props) => (
            <textarea {...props} rows={4} maxLength={300} value={valores.descricao} onChange={(e) => alterar("descricao", e.target.value)} />
          )}
        </CampoFormulario>
      </div>

      <fieldset className="rounded-xl border-2 border-espresso bg-white p-4">
        <legend className="px-1 font-extrabold">Opções de exibição</legend>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3">
            <input type="checkbox" name="disponivel" className="size-5 accent-canela" checked={valores.disponivel} onChange={(e) => alterar("disponivel", e.target.checked)} />
            Disponível para venda
          </label>
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3">
            <input type="checkbox" name="destaque" className="size-5 accent-canela" checked={valores.destaque} onChange={(e) => alterar("destaque", e.target.checked)} />
            Mostrar nos destaques da página inicial
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/admin" className={classesBotao("secundario")}>
          Cancelar
        </Link>
        <Botao type="submit" carregando={enviando}>
          {enviando ? "Salvando…" : textoEnviar}
        </Botao>
      </div>
    </form>
  );
}
