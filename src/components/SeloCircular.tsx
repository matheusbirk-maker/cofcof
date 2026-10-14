/** Selo redondo com texto, como os balões da referência. */
export default function SeloCircular({ texto, className = "" }: { texto: string; className?: string }) {
  return (
    <p
      className={`flex size-32 items-center justify-center rounded-full border-4 border-espresso bg-white p-4 text-center text-sm font-black uppercase leading-tight shadow-bloco md:size-40 md:text-base ${className}`}
    >
      {texto}
    </p>
  );
}
