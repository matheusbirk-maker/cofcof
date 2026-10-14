import type { RespostaErro } from "@/lib/tipos";

export function erro(status: number, mensagem: string, campos?: Record<string, string>) {
  const corpo: RespostaErro = campos ? { erro: mensagem, campos } : { erro: mensagem };
  return Response.json(corpo, { status });
}

/** Lê o corpo como objeto JSON; retorna null se estiver vazio, malformado ou não for um objeto. */
export async function lerCorpoJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const corpo: unknown = await request.json();
    if (corpo && typeof corpo === "object" && !Array.isArray(corpo)) {
      return corpo as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
