import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { definirAoExpirarSessao } from './servicos/api';
import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import Principal from './telas/Principal';
import Usuarios from './telas/Usuarios';
import EditarUsuario from './telas/EditarUsuario';

// Sem biblioteca de navegação: este componente guarda qual tela está
// aberta no estado "tela" e troca de tela apenas mudando esse estado.
export default function App() {
  const [tela, setTela] = useState('login');
  const [token, setToken] = useState(null); // vive só na memória do app
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [usuarioId, setUsuarioId] = useState(null); // id do usuário logado
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [mensagemLogin, setMensagemLogin] = useState(null); // ex.: sessão expirada
  const [avisoLogin, setAvisoLogin] = useState(null); // ex.: cadastro feito
  const [avisoUsuarios, setAvisoUsuarios] = useState(null); // ex.: alterações salvas

  // Se qualquer chamada a rota protegida receber 401, o serviço de API
  // avisa por aqui e o app volta para o login com a mensagem pedida.
  useEffect(() => {
    definirAoExpirarSessao(() => {
      setToken(null);
      setNomeUsuario('');
      setUsuarioId(null);
      setUsuarioSelecionado(null);
      setAvisoLogin(null);
      setAvisoUsuarios(null);
      setMensagemLogin('Sua sessão expirou, entre de novo.');
      setTela('login');
    });
  }, []);

  function entrarNoApp(dados, usuario) {
    setToken(dados.token);
    setNomeUsuario(usuario.nome || '');
    setUsuarioId(
      usuario.id !== undefined && usuario.id !== null ? usuario.id : null
    );
    setMensagemLogin(null);
    setAvisoLogin(null);
    setAvisoUsuarios(null);
    setTela('principal');
  }

  function sairDoApp() {
    setToken(null);
    setNomeUsuario('');
    setUsuarioId(null);
    setUsuarioSelecionado(null);
    setMensagemLogin(null);
    setAvisoLogin(null);
    setAvisoUsuarios(null);
    setTela('login');
  }

  // Chamado quando o usuário exclui a própria conta:
  // sai do app e avisa na tela de login.
  function contaExcluida() {
    setToken(null);
    setNomeUsuario('');
    setUsuarioId(null);
    setUsuarioSelecionado(null);
    setMensagemLogin(null);
    setAvisoUsuarios(null);
    setAvisoLogin('Sua conta foi excluída do aplicativo.');
    setTela('login');
  }

  const limparAvisoUsuarios = useCallback(() => {
    setAvisoUsuarios(null);
  }, []);

  function voltarAoLoginAposCadastro() {
    setAvisoLogin('Cadastro realizado! Entre com seu usuário e senha.');
    setMensagemLogin(null);
    setTela('login');
  }

  return (
    <View style={estilos.raiz}>
      <StatusBar style="auto" />

      {tela === 'login' && (
        <Login
          mensagem={mensagemLogin}
          aviso={avisoLogin}
          aoEntrar={entrarNoApp}
          irParaCadastro={() => {
            setMensagemLogin(null);
            setAvisoLogin(null);
            setTela('cadastro');
          }}
        />
      )}

      {tela === 'cadastro' && (
        <Cadastro
          aoCadastrar={voltarAoLoginAposCadastro}
          voltar={() => setTela('login')}
        />
      )}

      {tela === 'principal' && (
        <Principal
          nome={nomeUsuario}
          irParaUsuarios={() => setTela('usuarios')}
          sair={sairDoApp}
        />
      )}

      {tela === 'usuarios' && (
        <Usuarios
          token={token}
          usuarioId={usuarioId}
          aviso={avisoUsuarios}
          limparAviso={limparAvisoUsuarios}
          abrirUsuario={(usuario) => {
            setAvisoUsuarios(null);
            setUsuarioSelecionado(usuario);
            setTela('editar');
          }}
          aoSair={sairDoApp}
        />
      )}

      {tela === 'editar' && usuarioSelecionado !== null && (
        <EditarUsuario
          token={token}
          usuario={usuarioSelecionado}
          usuarioId={usuarioId}
          voltar={() => setTela('usuarios')}
          definirAviso={setAvisoUsuarios}
          aoExcluirConta={contaExcluida}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
});