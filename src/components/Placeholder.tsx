import { IconeXicara } from "./Logo";

interface PlaceholderProps {
  /** Descrição da imagem que deve entrar neste espaço futuramente. */
  rotulo: string;
  className?: string;
  /** Mostra a borda tracejada (desligue quando o contêiner já tiver borda). */
  borda?: boolean;
  /** Classe de cor de fundo. */
  fundo?: string;
}

/**
 * Espaço reservado para imagens que serão adicionadas depois.
 * Para trocar, basta substituir este componente por um <Image> com o arquivo real.
 */
export default function Placeholder({ rotulo, className = "", borda = true, fundo = "bg-latte" }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Imagem ilustrativa: ${rotulo}`}
      className={`flex flex-col items-center justify-center gap-2 ${borda ? "border-2 border-dashed border-suave" : ""} ${fundo} p-4 text-center text-suave ${className}`}
    >
      <IconeXicara className="size-10" />
      <span aria-hidden="true" className="text-xs font-bold uppercase tracking-wide">
        {rotulo}
      </span>
    </div>
  );
}
