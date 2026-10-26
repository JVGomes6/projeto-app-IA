// =====================================================================
// Este arquivo existe só para a Vercel: ele transforma o app Express
// (index.js da raiz) em uma função serverless. Não precisa mexer nele.
// =====================================================================

const app = require('../index');

module.exports = app;