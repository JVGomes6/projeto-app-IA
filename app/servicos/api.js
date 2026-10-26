// ==============================================================
// Todas as chamadas à API de usuários ficam NESTE arquivo.
// Para apontar para outro endereço, troque só a constante abaixo.
// ==============================================================
const URL_API = 'http://localhost:3000/api/usuarios';

// --------------------------------------------------------------
// O App.js registra aqui a função que volta ao login quando a API
// responder 401 em alguma rota protegida (sessão expirada).
// --------------------------------------------------------------
let aoExpirarSessao = null;

export function definirAoExpirarSessao(funcao) {
  aoExpirarSessao = funcao;
}

// --------------------------------------------------------------
// Função interna: faz o pedido (fetch) e devolve { status, json }.
// Se a rota for protegida (token enviado) e a API responder 401,
// avisa o App.js e interrompe a chamada com a mensagem de sessão.
// --------------------------------------------------------------
async function pedir(rota, metodo, corpo, token) {
  const cabecalhos = { 'Content-Type': 'application/json' };
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${URL_API}${rota}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === null ? undefined : JSON.stringify(corpo),
    });
  } catch (erro) {
    throw new Error('Não foi possível conectar à API.');
  }

  let json = null;
  try {
    json = await resposta.json();
  } catch (erro) {
    json = null; // resposta sem corpo JSON
  }

  if (resposta.status === 401 && token) {
    if (aoExpirarSessao) {
      aoExpirarSessao();
    }
    throw new Error('Sua sessão expirou, entre de novo.');
  }

  return { status: resposta.status, json };
}

function mensagemDaResposta(json, mensagemPadrao) {
  if (json && typeof json.mensagem === 'string' && json.mensagem.length > 0) {
    return json.mensagem;
  }
  return mensagemPadrao;
}

function deuCerto(json, status) {
  if (json && json.sucesso === true) {
    return true;
  }
  // API respondeu 2xx sem corpo: também consideramos sucesso.
  return json === null && status >= 200 && status < 300;
}

// 1. Cadastrar usuário (rota pública)
export async function cadastrarUsuario(dados) {
  const { status, json } = await pedir('', 'POST', dados, null);
  if (!deuCerto(json, status)) {
    throw new Error(mensagemDaResposta(json, 'Não foi possível cadastrar o usuário.'));
  }
  return json ? json.dados : null;
}

// 2. Login (rota pública) — devolve json.dados, que contém o token
export async function entrar(login, senha) {
  const { status, json } = await pedir('/login', 'POST', { login, senha }, null);
  if (!deuCerto(json, status)) {
    throw new Error(mensagemDaResposta(json, 'Não foi possível entrar.'));
  }
  return json ? json.dados : null;
}

// 3. Listar usuários (rota protegida)
export async function listarUsuarios(token) {
  const { status, json } = await pedir('', 'GET', null, token);
  if (!deuCerto(json, status)) {
    throw new Error(mensagemDaResposta(json, 'Não foi possível listar os usuários.'));
  }
  return json && Array.isArray(json.dados) ? json.dados : [];
}

// 4. Buscar um usuário por id (rota protegida)
export async function buscarUsuario(id, token) {
  const { status, json } = await pedir(`/${id}`, 'GET', null, token);
  if (!deuCerto(json, status)) {
    throw new Error(mensagemDaResposta(json, 'Não foi possível buscar o usuário.'));
  }
  return json ? json.dados : null;
}

// 5. Alterar um usuário (rota protegida)
export async function alterarUsuario(id, campos, token) {
  const { status, json } = await pedir(`/${id}`, 'PUT', campos, token);
  if (!deuCerto(json, status)) {
    throw new Error(mensagemDaResposta(json, 'Não foi possível alterar o usuário.'));
  }
  return json ? json.dados : null;
}

// 6. Excluir um usuário (rota protegida)
export async function excluirUsuario(id, token) {
  const { status, json } = await pedir(`/${id}`, 'DELETE', null, token);
  if (!deuCerto(json, status)) {
    throw new Error(mensagemDaResposta(json, 'Não foi possível excluir o usuário.'));
  }
  return json ? json.dados : null;
}