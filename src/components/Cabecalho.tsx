"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { classesBotao } from "./Botao";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/cardapio", rotulo: "Cardápio" },
  { href: "/#historia", rotulo: "Nossa história" },
  { href: "/admin", rotulo: "Gerenciar" },
];

export default function Cabecalho() {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [caminhoDoMenu, setCaminhoDoMenu] = useState(caminho);

  // Fecha o menu mobile ao trocar de página.
  if (caminhoDoMenu !== caminho) {
    setCaminhoDoMenu(caminho);
    setMenuAberto(false);
  }

  // Fecha o menu com a tecla Esc.
  useEffect(() => {
    if (!menuAberto) return;
    const aoPressionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAberto(false);
    };
    document.addEventListener("keydown", aoPressionar);
    return () => document.removeEventListener("keydown", aoPressionar);
  }, [menuAberto]);

  const ativo = (href: string) => (href === "/" ? caminho === "/" : !href.includes("#") && caminho.startsWith(href));

  return (
    <header className="no-escuro relative z-30 bg-espresso text-creme">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 md:h-24">
        <Logo className="translate-y-5 md:translate-y-8" />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={ativo(link.href) ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center px-1 text-lg font-extrabold uppercase tracking-wide transition hover:text-caramelo ${ativo(link.href) ? "text-caramelo" : ""}`}
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin/novo" className={classesBotao("primario", "md", "hidden border-creme shadow-none sm:inline-flex")}>
            Novo produto
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border-2 border-creme lg:hidden"
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuAberto((a) => !a)}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              {menuAberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <nav id="menu-mobile" aria-label="Menu mobile" hidden={!menuAberto} className="border-t border-cafe bg-espresso lg:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col px-4 pb-4 pt-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuAberto(false)}
                aria-current={ativo(link.href) ? "page" : undefined}
                className={`block rounded-lg px-3 py-3 text-lg font-extrabold uppercase hover:bg-cafe ${ativo(link.href) ? "text-caramelo" : ""}`}
              >
                {link.rotulo}
              </Link>
            </li>
          ))}
          <li className="mt-2 sm:hidden">
            <Link href="/admin/novo" onClick={() => setMenuAberto(false)} className={classesBotao("primario", "md", "w-full border-creme shadow-none")}>
              Novo produto
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
