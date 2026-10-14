import type { ReactNode } from "react";

export interface PropsControle {
  id: string;
  name: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  className: string;
}

interface CampoFormularioProps {
  nome: string;
  rotulo: string;
  obrigatorio?: boolean;
  dica?: string;
  erro?: string;
  className?: string;
  /** Recebe as props de acessibilidade que devem ir no input/select/textarea. */
  children: (props: PropsControle) => ReactNode;
}

export const classesControle =
  "w-full rounded-xl border-2 border-espresso bg-white px-3 py-2.5 text-base text-espresso placeholder:text-suave aria-invalid:border-erro aria-invalid:bg-[#fff5f4]";

/** Campo de formulário com rótulo, dica e mensagem de erro ligados ao controle por ARIA. */
export default function CampoFormulario({ nome, rotulo, obrigatorio, dica, erro, className = "", children }: CampoFormularioProps) {
  const id = `campo-${nome}`;
  const idDica = dica ? `${id}-dica` : undefined;
  const idErro = erro ? `${id}-erro` : undefined;
  const descritoPor = [idErro, idDica].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-extrabold">
        {rotulo}
        {obrigatorio ? (
          <span className="text-erro" aria-hidden="true"> *</span>
        ) : (
          <span className="font-semibold text-suave"> (opcional)</span>
        )}
      </label>
      {children({
        id,
        name: nome,
        "aria-invalid": Boolean(erro),
        "aria-describedby": descritoPor,
        "aria-required": obrigatorio || undefined,
        className: classesControle,
      })}
      {erro && (
        <p id={idErro} className="mt-1.5 flex items-start gap-1.5 text-sm font-bold text-erro">
          <span aria-hidden="true">⚠</span>
          {erro}
        </p>
      )}
      {dica && (
        <p id={idDica} className="mt-1 text-sm text-suave">
          {dica}
        </p>
      )}
    </div>
  );
}
