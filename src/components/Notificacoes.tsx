"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Tipo = "sucesso" | "erro";

interface Notificacao {
  id: number;
  tipo: Tipo;
  mensagem: string;
}

type Notificar = (tipo: Tipo, mensagem: string) => void;

const ContextoNotificacoes = createContext<Notificar | null>(null);

export function useNotificar(): Notificar {
  const notificar = useContext(ContextoNotificacoes);
  if (!notificar) throw new Error("useNotificar deve ser usado dentro de <ProvedorNotificacoes>.");
  return notificar;
}

/** Exibe mensagens temporárias (toasts) de sucesso ou erro, anunciadas por leitores de tela. */
export function ProvedorNotificacoes({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Notificacao[]>([]);
  const proximoId = useRef(1);

  const remover = useCallback((id: number) => {
    setItens((atuais) => atuais.filter((n) => n.id !== id));
  }, []);

  const notificar = useCallback<Notificar>(
    (tipo, mensagem) => {
      const id = proximoId.current++;
      setItens((atuais) => [...atuais, { id, tipo, mensagem }]);
      setTimeout(() => remover(id), 5000);
    },
    [remover],
  );

  return (
    <ContextoNotificacoes.Provider value={notificar}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:left-auto sm:right-4 sm:items-end"
      >
        {itens.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border-2 border-espresso px-4 py-3 font-bold shadow-bloco ${
              n.tipo === "sucesso" ? "bg-[#e3f1e5] text-sucesso" : "bg-[#fbe4e2] text-erro"
            }`}
          >
            <span aria-hidden="true">{n.tipo === "sucesso" ? "✔" : "⚠"}</span>
            <p className="flex-1">{n.mensagem}</p>
            <button
              type="button"
              onClick={() => remover(n.id)}
              className="-m-1 rounded p-1 text-espresso hover:bg-black/10"
              aria-label="Fechar notificação"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ContextoNotificacoes.Provider>
  );
}
