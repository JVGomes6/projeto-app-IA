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
    console.error('Erro ao consultar a Gemini API:', erro);

    // Limite de uso da Gemini API (quota / taxa de requisições) -> 429
    if (ehErroDeLimiteDeUso(erro)) {
      return res.status(429).json({
        sucesso: false,
        mensagem:
          'Limite de uso da Gemini API atingido. Tente novamente em alguns instantes.',
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