import React, { useEffect, useState } from 'react';
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
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [mensagemLogin, setMensagemLogin] = useState(null); // ex.: sessão expirada
  const [avisoLogin, setAvisoLogin] = useState(null); // ex.: cadastro feito

  // Se qualquer chamada a rota protegida receber 401, o serviço de API
  // avisa por aqui e o app volta para o login com a mensagem pedida.
  useEffect(() => {
    definirAoExpirarSessao(() => {
      setToken(null);
      setNomeUsuario('');
      setUsuarioSelecionado(null);
      setAvisoLogin(null);
      setMensagemLogin('Sua sessão expirou, entre de novo.');
      setTela('login');
    });
  }, []);

  function entrarNoApp(dados, nomeResolvido) {
    setToken(dados.token);
    setNomeUsuario(nomeResolvido || '');
    setMensagemLogin(null);
    setAvisoLogin(null);
    setTela('principal');
  }

  function sairDoApp() {
    setToken(null);
    setNomeUsuario('');
    setUsuarioSelecionado(null);
    setMensagemLogin(null);
    setAvisoLogin(null);
    setTela('login');
  }

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
          abrirUsuario={(usuario) => {
            setUsuarioSelecionado(usuario);
            setTela('editar');
          }}
        />
      )}

      {tela === 'editar' && usuarioSelecionado !== null && (
        <EditarUsuario
          token={token}
          usuario={usuarioSelecionado}
          voltar={() => setTela('usuarios')}
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