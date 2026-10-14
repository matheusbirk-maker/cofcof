"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mensagemDeErro } from "./api";

interface Resultado<T> {
  chave: string;
  dados?: T;
  erro?: string;
}

/**
 * Executa uma requisição sempre que `chave` muda e expõe os estados
 * de carregamento, sucesso e erro. Requisições antigas são canceladas.
 */
export function useRequisicao<T>(chave: string, buscar: (signal: AbortSignal) => Promise<T>) {
  const [versao, setVersao] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);
  const buscarRef = useRef(buscar);
  const chaveAtual = `${chave}#${versao}`;

  useEffect(() => {
    buscarRef.current = buscar;
  });

  useEffect(() => {
    const controle = new AbortController();
    buscarRef.current(controle.signal).then(
      (dados) => {
        if (!controle.signal.aborted) setResultado({ chave: chaveAtual, dados });
      },
      (erro: unknown) => {
        if (!controle.signal.aborted) setResultado({ chave: chaveAtual, erro: mensagemDeErro(erro) });
      },
    );
    return () => controle.abort();
  }, [chaveAtual]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  /** Atualiza os dados localmente (ex.: após um PATCH ou DELETE), sem refazer a requisição. */
  const alterarDados = useCallback((atualizar: (dados: T) => T) => {
    setResultado((r) => (r && r.dados !== undefined ? { ...r, dados: atualizar(r.dados) } : r));
  }, []);

  const atual = resultado?.chave === chaveAtual ? resultado : null;

  return {
    dados: atual?.dados,
    erro: atual?.erro,
    carregando: atual === null,
    recarregar,
    alterarDados,
  };
}
