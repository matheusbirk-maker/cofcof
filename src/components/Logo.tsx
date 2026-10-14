import Link from "next/link";

/** Logo circular que "vaza" para fora do cabeçalho, como na referência. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="cofcof: página inicial"
      className={`flex size-20 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-4 border-espresso bg-creme font-display leading-[0.85] text-espresso shadow-bloco transition hover:rotate-0 md:size-28 ${className}`}
    >
      <IconeXicara className="mb-0.5 size-5 text-canela md:size-7" />
      <span className="text-xl md:text-3xl">cof</span>
      <span className="text-xl md:text-3xl">cof</span>
    </Link>
  );
}

export function IconeXicara({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <path d="M6 2v2M10 2v2M14 2v2" />
    </svg>
  );
}
