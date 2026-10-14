import type { Metadata, Viewport } from "next";
import { Nunito, Titan_One } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import { ProvedorNotificacoes } from "@/components/Notificacoes";
import "./globals.css";

const titan = Titan_One({
  variable: "--font-titan",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: "cofcof | Cafeteria",
    template: "%s | cofcof",
  },
  description: "cofcof: cafeteria com cafés especiais, doces e salgados feitos na hora. Confira nosso cardápio.",
};

export const viewport: Viewport = {
  themeColor: "#1f1612",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${titan.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-md bg-espresso px-4 py-2 font-bold text-creme focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <ProvedorNotificacoes>
          <Cabecalho />
          <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Rodape />
        </ProvedorNotificacoes>
      </body>
    </html>
  );
}
