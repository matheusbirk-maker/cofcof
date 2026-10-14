"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
  /** Largura máxima do conteúdo (classe Tailwind). */
  largura?: string;
}

/**
 * Modal acessível baseado no elemento nativo <dialog>:
 * prende o foco, fecha com Esc e devolve o foco ao elemento que o abriu.
 */
export default function Modal({ aberto, aoFechar, titulo, children, largura = "max-w-lg" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      onClick={(e) => {
        // Clique fora do conteúdo (no fundo escurecido) fecha o modal.
        if (e.target === ref.current) aoFechar();
      }}
      className={`m-auto w-[calc(100%-2rem)] ${largura} rounded-2xl border-4 border-espresso bg-creme p-0 text-espresso shadow-bloco`}
    >
      <div className="flex items-start justify-between gap-4 border-b-2 border-espresso bg-latte px-5 py-4">
        <h2 id={idTitulo} className="font-display text-2xl leading-tight">
          {titulo}
        </h2>
        <button
          type="button"
          onClick={aoFechar}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-espresso bg-white text-xl font-bold hover:bg-creme"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{aberto && children}</div>
    </dialog>
  );
}
