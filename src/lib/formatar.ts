const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatarPreco(valor: number): string {
  return moeda.format(valor);
}

/** Remove acentos e deixa em minúsculas, para buscas sem diferenciar "café" de "cafe". */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
