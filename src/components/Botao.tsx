import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "perigo";
type Tamanho = "md" | "sm";

const VARIANTES: Record<Variante, string> = {
  primario: "bg-canela text-white hover:bg-canela-escuro",
  secundario: "bg-white text-espresso hover:bg-latte",
  perigo: "bg-erro text-white hover:bg-[#8f1e18]",
};

const TAMANHOS: Record<Tamanho, string> = {
  md: "min-h-11 px-5 py-2 text-base",
  sm: "min-h-9 px-3 py-1.5 text-sm",
};

/** Classes do botão — também usadas em links que devem parecer botões. */
export function classesBotao(variante: Variante = "primario", tamanho: Tamanho = "md", extra = "") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-espresso font-extrabold uppercase tracking-wide",
    "shadow-bloco-sm transition hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTES[variante],
    TAMANHOS[tamanho],
    extra,
  ].join(" ");
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: Tamanho;
  carregando?: boolean;
}

export default function Botao({
  variante,
  tamanho,
  carregando = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...resto
}: BotaoProps) {
  return (
    <button
      type={type}
      className={classesBotao(variante, tamanho, className)}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...resto}
    >
      {carregando && (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
