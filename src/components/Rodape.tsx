import Link from "next/link";

export default function Rodape() {
  return (
    <footer className="no-escuro bg-espresso text-creme">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-3xl">cofcof</p>
          <p className="mt-2 text-sm text-latte">Café fresquinho, do jeito que você gosta.</p>
        </div>
        <div>
          <h2 className="font-extrabold uppercase tracking-wide text-caramelo">Horário</h2>
          <p className="mt-2 text-sm">Segunda a sexta: 7h às 20h</p>
          <p className="text-sm">Sábado e domingo: 8h às 18h</p>
        </div>
        <div>
          <h2 className="font-extrabold uppercase tracking-wide text-caramelo">Navegue</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link className="underline-offset-4 hover:underline" href="/cardapio">Cardápio</Link></li>
            <li><Link className="underline-offset-4 hover:underline" href="/admin">Gerenciar produtos</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-cafe px-4 py-4 text-center text-xs text-latte">
        © 2026 cofcof. Projeto acadêmico de Desenvolvimento Web.
      </p>
    </footer>
  );
}
