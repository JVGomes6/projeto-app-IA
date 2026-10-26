// =====================================================================
// API de IA — responde perguntas sobre o regulamento de TCC usando a
// Gemini API (https://ai.google.dev/gemini-api/docs).
//
// Rotas:
//   GET  /saude     -> { "status": "OK" }
//   POST /perguntar -> recebe { "pergunta": "..." } e responde com base no PDF
// =====================================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const AssistenteDocumento = require('./assistente-documento');

const app = express();

// CORS liberado: o app (React Native no navegador) vai chamar essa API de outra origem
app.use(cors());

// Transforma o corpo JSON da requisição em req.body
app.use(express.json());

// O assistente carrega o PDF uma única vez, quando a API sobe
const assistente = new AssistenteDocumento();

// GET /saude — usado para saber se a API está no ar
app.get('/saude', (req, res) => {
  res.json({ status: 'OK' });
});

// POST /perguntar — pergunta sobre o regulamento
app.post('/perguntar', async (req, res) => {
  const pergunta =
    typeof req.body?.pergunta === 'string' ? req.body.pergunta.trim() : '';

  // Recusa pergunta vazia
  if (pergunta === '') {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'A pergunta é obrigatória e não pode ficar vazia.',
      dados: null,
    });
  }

  // Recusa pergunta com mais de 500 caracteres
  if (pergunta.length > 500) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'A pergunta não pode ter mais de 500 caracteres.',
      dados: null,
    });
  }

  try {
    const { resposta, tokens } = await assistente.perguntar(pergunta);

    return res.json({
      sucesso: true,
      mensagem: 'Pergunta respondida com sucesso.',
      dados: {
        resposta,
        tokens,
      },
    });
  } catch (erro) {
    // Log enxuto: mostra o status HTTP real e a mensagem oficial da Gemini.
    // (Muito mais fácil de diagnosticar do que o objeto de erro inteiro.)
    console.error(
      'Erro na Gemini API — status:',
      erro?.status ?? '(sem status)',
      '| mensagem:',
      erro?.message
    );

    // Cota DIÁRIA do modelo esgotada (ex.: "daily generation request quota
    // (20 requests) exhausted") — diferente do limite por minuto!
    if (ehErroDeCotaDiaria(erro)) {
      return res.status(429).json({
        sucesso: false,
        mensagem:
          'A cota diária gratuita deste modelo acabou (ex.: 20 perguntas/dia). Troque o GEMINI_MODELO no .env para outro modelo grátis (ex.: gemini-3.6-flash ou gemini-3.1-flash-lite) ou aguarde o reset da cota.',
        dados: null,
      });
    }

    // Limite de uso da Gemini API (quota / taxa de requisições) -> 429
    if (ehErroDeLimiteDeUso(erro)) {
      return res.status(429).json({
        sucesso: false,
        mensagem:
          'Limite de uso da Gemini API atingido. Tente novamente em alguns instantes.',
        dados: null,
      });
    }

    // Modelo descontinuado ou nome inexistente -> a Gemini responde 404 NOT_FOUND
    // Ex.: "models/gemini-2.5-flash is no longer available to new users"
    if (ehErroDeModeloIndisponivel(erro)) {
      return res.status(500).json({
        sucesso: false,
        mensagem:
          'O modelo configurado em GEMINI_MODELO não está disponível para esta chave. Use gemini-3.8-flash no .env.',
        dados: null,
      });
    }

    // Chave inválida ou sem permissão -> 500 com mensagem que ajuda a achar o problema
    if (ehErroDeChave(erro)) {
      return res.status(500).json({
        sucesso: false,
        mensagem:
          'Chave da Gemini API inválida ou sem permissão. Verifique o GEMINI_API_KEY no .env.',
        dados: null,
      });
    }

    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao consultar a Gemini API. Tente novamente.',
      dados: null,
    });
  }
});

// A biblioteca @google/genai lança ApiError com a propriedade .status (código HTTP)
function ehErroDeLimiteDeUso(erro) {
  const texto = String(erro?.message ?? '');
  return (
    erro?.status === 429 ||
    texto.includes('429') ||
    texto.includes('RESOURCE_EXHAUSTED') ||
    texto.toLowerCase().includes('quota')
  );
}

// Modelo que não existe mais ou nome errado -> 404 NOT_FOUND da Gemini
// (ex.: gemini-2.5-flash está bloqueado para chaves novas; usar gemini-3.8-flash)
function ehErroDeModeloIndisponivel(erro) {
  const texto = String(erro?.message ?? '').toLowerCase();
  return (
    erro?.status === 404 ||
    texto.includes('no longer available') ||
    (texto.includes('model') && texto.includes('not found'))
  );
}

function ehErroDeChave(erro) {
  const texto = String(erro?.message ?? '');
  return (
    erro?.status === 401 ||
    erro?.status === 403 ||
    texto.includes('API_KEY_INVALID') ||
    texto.toLowerCase().includes('api key not valid')
  );
}

// Rota que não existe -> 404 em JSON
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    dados: null,
  });
});

// Tratador de erros (ex.: corpo com JSON inválido) -> resposta em JSON
app.use((erro, req, res, proximo) => {
  if (erro?.type === 'entity.parse.failed') {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'O corpo da requisição não é um JSON válido.',
      dados: null,
    });
  }

  console.error('Erro inesperado:', erro);
  return res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor.',
    dados: null,
  });
});

// Na Vercel (função serverless) não pode chamar app.listen; na sua máquina, sim.
if (process.env.VERCEL !== '1') {
  const PORTA = process.env.PORT || 3001;
  app.listen(PORTA, () => {
    console.log(`API de IA no ar em http://localhost:${PORTA}`);
  });
}

// Exportado para a Vercel usar (veja api/index.js e vercel.json)
module.exports = app;