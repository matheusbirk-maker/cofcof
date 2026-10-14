import "server-only";
import { normalizar } from "./formatar";
import type { FiltrosProdutos, Produto, ProdutoEntrada } from "./tipos";

/**
 * "Banco de dados" mockado em memória.
 * Os dados voltam ao estado inicial sempre que o servidor reinicia
 * (na Vercel isso acontece a cada nova instância da função).
 */

const AGORA = "2026-09-24T12:00:00.000Z";

const PRODUTOS_INICIAIS: ProdutoEntrada[] = [
  { nome: "Espresso", categoria: "cafes-quentes", preco: 7, tamanho: "50 ml", descricao: "Dose curta e intensa, extraída na hora com grãos torrados na casa.", imagem: "/espresso.png", disponivel: true, destaque: false },
  { nome: "Cappuccino cofcof", categoria: "cafes-quentes", preco: 12.9, tamanho: "240 ml", descricao: "Espresso, leite vaporizado e espuma cremosa, finalizado com canela e cacau.", imagem: "/capuccino.png", disponivel: true, destaque: true },
  { nome: "Latte de caramelo", categoria: "cafes-quentes", preco: 14.5, tamanho: "300 ml", descricao: "Café com bastante leite vaporizado e calda de caramelo salgado da casa.", imagem: "/latte_caramelo.png", disponivel: true, destaque: false },
  { nome: "Mocha", categoria: "cafes-quentes", preco: 15, tamanho: "300 ml", descricao: "Espresso com chocolate meio amargo, leite vaporizado e chantilly.", imagem: "/mocha.png", disponivel: true, destaque: false },
  { nome: "Cold brew", categoria: "cafes-gelados", preco: 13, tamanho: "400 ml", descricao: "Café extraído a frio por 18 horas: suave, adocicado e muito refrescante.", imagem: "/cold_brew.png", disponivel: true, destaque: true },
  { nome: "Frappé de doce de leite", categoria: "cafes-gelados", preco: 18.9, tamanho: "400 ml", descricao: "Café batido com gelo, doce de leite e leite, coberto com chantilly.", imagem: "/frappe.png", disponivel: true, destaque: true },
  { nome: "Affogato", categoria: "cafes-gelados", preco: 16, tamanho: "1 taça", descricao: "Bola de sorvete de creme “afogada” em uma dose quente de espresso.", imagem: "/afogatto.png", disponivel: true, destaque: false },
  { nome: "Chai latte", categoria: "chas-e-outros", preco: 13.5, tamanho: "300 ml", descricao: "Chá preto com especiarias (canela, cardamomo e gengibre) e leite vaporizado.", imagem: "/chai_latte.png", disponivel: true, destaque: false },
  { nome: "Chocolate quente", categoria: "chas-e-outros", preco: 12, tamanho: "250 ml", descricao: "Chocolate cremoso feito com cacau 50% e um toque de baunilha.", imagem: "/choco_quente.png", disponivel: false, destaque: false },
  { nome: "Cookie de chocolate", categoria: "doces", preco: 8.5, tamanho: "1 unidade", descricao: "Cookie crocante por fora e macio por dentro, com gotas de chocolate belga.", imagem: "/cookie.png", disponivel: true, destaque: true },
  { nome: "Bolo de cenoura com brigadeiro", categoria: "doces", preco: 11, tamanho: "1 fatia", descricao: "Bolo fofinho de cenoura com cobertura generosa de brigadeiro.", imagem: "/bolo_de_cenoura.png", disponivel: true, destaque: false },
  { nome: "Cinnamon roll", categoria: "doces", preco: 12.5, tamanho: "1 unidade", descricao: "Massa macia enrolada com canela e açúcar mascavo, coberta com glacê.", imagem: "/cinammon_roll.png", disponivel: true, destaque: false },
  { nome: "Pão de queijo", categoria: "salgados", preco: 6, tamanho: "3 unidades", descricao: "Pão de queijo mineiro, quentinho e saído do forno a toda hora.", imagem: "/pao_de_queijo.png", disponivel: true, destaque: true },
  { nome: "Croissant de presunto e queijo", categoria: "salgados", preco: 14, tamanho: "1 unidade", descricao: "Croissant amanteigado recheado com presunto e queijo, servido quente.", imagem: "/croissant.png", disponivel: true, destaque: false },
  { nome: "Quiche de alho-poró", categoria: "salgados", preco: 15.5, tamanho: "1 fatia", descricao: "Massa podre crocante com recheio cremoso de alho-poró e queijo.", imagem: "/quiche.png", disponivel: false, destaque: false },
];

// Guarda os dados no escopo global para sobreviver ao hot reload em desenvolvimento.
const global = globalThis as unknown as { __cofcof?: { produtos: Produto[]; proximoId: number } };

function banco() {
  if (!global.__cofcof) {
    global.__cofcof = {
      produtos: PRODUTOS_INICIAIS.map((p, i) => ({ ...p, id: String(i + 1), criadoEm: AGORA, atualizadoEm: AGORA })),
      proximoId: PRODUTOS_INICIAIS.length + 1,
    };
  }
  return global.__cofcof;
}

export function listarProdutos(filtros: FiltrosProdutos = {}): Produto[] {
  let lista = [...banco().produtos];

  if (filtros.busca) {
    const termo = normalizar(filtros.busca.trim());
    lista = lista.filter((p) => normalizar(`${p.nome} ${p.descricao}`).includes(termo));
  }
  if (filtros.categoria) lista = lista.filter((p) => p.categoria === filtros.categoria);
  if (filtros.destaque) lista = lista.filter((p) => p.destaque);
  if (filtros.disponivel) lista = lista.filter((p) => p.disponivel);

  switch (filtros.ordenar) {
    case "preco-asc":
      lista.sort((a, b) => a.preco - b.preco);
      break;
    case "preco-desc":
      lista.sort((a, b) => b.preco - a.preco);
      break;
    case "nome":
      lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      break;
  }
  return lista;
}

export function obterProduto(id: string): Produto | undefined {
  return banco().produtos.find((p) => p.id === id);
}

export function criarProduto(entrada: ProdutoEntrada): Produto {
  const db = banco();
  const agora = new Date().toISOString();
  const produto: Produto = { ...entrada, id: String(db.proximoId++), criadoEm: agora, atualizadoEm: agora };
  db.produtos.push(produto);
  return produto;
}

export function atualizarProduto(id: string, entrada: ProdutoEntrada): Produto | undefined {
  const db = banco();
  const indice = db.produtos.findIndex((p) => p.id === id);
  if (indice === -1) return undefined;
  const atualizado: Produto = { ...db.produtos[indice], ...entrada, id, atualizadoEm: new Date().toISOString() };
  db.produtos[indice] = atualizado;
  return atualizado;
}

export function removerProduto(id: string): boolean {
  const db = banco();
  const tamanhoAntes = db.produtos.length;
  db.produtos = db.produtos.filter((p) => p.id !== id);
  return db.produtos.length < tamanhoAntes;
}
