import Image from "next/image";
import Link from "next/link";

/** Logo circular que "vaza" para fora do cabeçalho, como na referência. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="cofcof: página inicial"
      className={`flex size-20 shrink-0 -rotate-6 items-center justify-center overflow-hidden rounded-full border-4 border-espresso bg-creme shadow-bloco transition hover:rotate-0 md:size-28 ${className}`}
    >
      <Image
        src="/icone.jpg"
        alt=""
        width={112}
        height={112}
        className="size-full object-cover"
      />
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
