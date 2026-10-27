// Serviço de comunicação com a API de IA.
// Fica separado do api.js (que cuida do login), porque a IA não usa token.

// Endereço da API de IA.
// Enquanto testa no computador: http://localhost:3001 (porta onde a api-ia roda).
// Quando publicar a API na Vercel, troque para https://SEU-PROJETO.vercel.app
const ENDERECO_IA = 'http://localhost:3001';

// Envia uma pergunta para a IA e devolve o que a API responde:
// { sucesso: true, mensagem: ..., dados: { resposta, tokens } } em caso de sucesso,
// { sucesso: false, mensagem: 'motivo do erro', dados: null } em caso de erro.
export async function perguntarIA(pergunta) {
  try {
    const respostaHttp = await fetch(`${ENDERECO_IA}/perguntar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pergunta }),
    });

    // Tenta ler o corpo da resposta como JSON.
    let corpo = null;
    try {
      corpo = await respostaHttp.json();
    } catch (erroJson) {
      corpo = null;
    }

    // A API respondeu no formato esperado (com sucesso true/false).
    if (corpo && typeof corpo.sucesso === 'boolean') {
      return corpo;
    }

    // Respondeu com erro HTTP, mas fora do formato esperado.
    if (!respostaHttp.ok) {
      return {
        sucesso: false,
        mensagem: `A API de IA respondeu com o erro ${respostaHttp.status}.`,
        dados: null,
      };
    }

    // Respondeu ok, mas fora do formato esperado.
    return {
      sucesso: false,
      mensagem: 'A API de IA devolveu uma resposta inesperada.',
      dados: null,
    };
  } catch (erro) {
    // Falha de rede, endereço errado, API desligada ou CORS bloqueando.
    return {
      sucesso: false,
      mensagem: `Não foi possível conectar à API de IA em ${ENDERECO_IA}. Confira se ela está rodando e se o endereço está certo.`,
      dados: null,
    };
  }
}