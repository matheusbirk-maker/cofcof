import type { ReactNode } from "react";
import Botao from "./Botao";

/** Esqueleto exibido enquanto os produtos carregam. */
export function GradeCarregando({ quantidade = 6 }: { quantidade?: number }) {
  return (
    <div role="status" aria-label="Carregando produtos" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: quantidade }, (_, i) => (
        <div key={i} aria-hidden="true" className="animate-pulse overflow-hidden rounded-2xl border-[3px] border-latte-escuro bg-white">
          <div className="aspect-[4/3] bg-latte" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 rounded bg-latte" />
            <div className="h-5 w-2/3 rounded bg-latte" />
            <div className="h-3 w-full rounded bg-latte" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EstadoErro({ mensagem, aoTentarNovamente }: { mensagem: string; aoTentarNovamente?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border-[3px] border-erro bg-[#fbe4e2] p-6 text-center">
      <p className="font-display text-2xl text-erro">Ops! Algo deu errado.</p>
      <p className="mt-2 text-espresso">{mensagem}</p>
      {aoTentarNovamente && (
        <Botao variante="secundario" className="mt-4" onClick={aoTentarNovamente}>
          Tentar novamente
        </Botao>
      )}
    </div>
  );
}

export function EstadoVazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border-[3px] border-dashed border-suave bg-white p-8 text-center">
      <p className="font-display text-2xl">{titulo}</p>
      {children && <div className="mt-2 text-suave">{children}</div>}
    </div>
  );
}
