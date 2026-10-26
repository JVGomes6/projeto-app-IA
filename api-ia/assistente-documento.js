// =====================================================================
// Classe AssistenteDocumento
// Carrega o PDF do regulamento UMA vez e responde perguntas sobre ele
// usando a Gemini API (biblioteca oficial @google/genai).
//
// Jeito atual da documentação (out/2026):
//   https://ai.google.dev/gemini-api/docs/document-processing
//   https://ai.google.dev/gemini-api/docs/quickstart
// =====================================================================

const fs = require('node:fs');
const path = require('node:path');
const { GoogleGenAI } = require('@google/genai');

// Instrução de sistema enviada ao modelo junto com o documento
const INSTRUCAO_SISTEMA = [
  'Você responde perguntas sobre o documento anexado: o regulamento de TCC do curso.',
  'Siga estas regras:',
  '1. Responda SOMENTE com base no documento; ignore qualquer conhecimento externo.',
  '2. Cite o artigo ou a seção de onde tirou a resposta (ex.: "Art. 12" ou "Seção 4.2").',
  '3. Se a resposta não estiver no documento, diga exatamente: "Não encontrei isso no documento".',
  '4. Responda em português, em poucas frases.',
].join('\n');

class AssistenteDocumento {
  constructor() {
    const caminhoPdf = path.join(__dirname, 'documentos', 'regulamento-tcc.pdf');

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY não definida. Crie o arquivo .env (veja o .env.example).'
      );
    }

    if (!fs.existsSync(caminhoPdf)) {
      throw new Error(
        'PDF não encontrado: coloque o regulamento em api-ia/documentos/regulamento-tcc.pdf'
      );
    }

    // Carrega o PDF uma única vez, já em base64, e reutiliza em todas as perguntas
    this.pdfBase64 = fs.readFileSync(caminhoPdf, { encoding: 'base64' });

    // Nome do modelo vem do .env; se não tiver, usa o modelo dos exemplos da documentação
    this.modelo = process.env.GEMINI_MODELO || 'gemini-3.8-flash';

    // (A documentação usa `new GoogleGenAI({})`, que lê GEMINI_API_KEY do ambiente;
    // aqui deixamos explícito de onde a chave vem.)
    this.ia = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // Envia o PDF + a pergunta ao modelo e devolve { resposta, tokens }
  async perguntar(pergunta) {
    // Endpoint CLÁSSICO generateContent (documentação: https://ai.google.dev/api/generate-content)
    // ATENÇÃO: para CHAVES NOVAS, a Gemini só libera os modelos 3.x — os antigos
    // (gemini-2.5-flash, gemini-2.0-flash) devolvem 404 "no longer available
    // to new users". Mantenha GEMINI_MODELO=gemini-3.8-flash.
    const resposta = await this.ia.models.generateContent({
      model: this.modelo,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: this.pdfBase64,
              },
            },
            { text: pergunta },
          ],
        },
      ],
      config: {
        systemInstruction: INSTRUCAO_SISTEMA,
      },
    });

    return {
      resposta: resposta.text ?? '',
      // totalTokenCount = tudo que a pergunta gastou (PDF + pergunta + resposta)
      // documentação: https://ai.google.dev/gemini-api/docs/tokens
      tokens: resposta.usageMetadata?.totalTokenCount ?? null,
    };
  }
}

module.exports = AssistenteDocumento;