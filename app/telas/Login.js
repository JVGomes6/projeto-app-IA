import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { entrar, listarUsuarios } from '../servicos/api';

export default function Login({ mensagem, aviso, aoEntrar, irParaCadastro }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [entrando, setEntrando] = useState(false);

  // Descobre quem é o usuário logado (id e nome). O id serve para o app
  // saber qual registro ele pode editar; o nome, para o "Olá, <nome>".
  // 1) tenta os dados que a própria API devolver no login;
  // 2) se não vier tudo, procura na lista pelo login digitado;
  // 3) por último, usa o próprio login digitado como nome.
  async function resolverUsuario(dados, loginUsado) {
    let id = null;
    let nome = null;

    if (dados && dados.usuario) {
      if (dados.usuario.id !== undefined && dados.usuario.id !== null) {
        id = dados.usuario.id;
      }
      if (dados.usuario.nome) {
        nome = dados.usuario.nome;
      }
    }
    if (nome === null && dados && dados.nome) {
      nome = dados.nome;
    }

    if (id === null || nome === null) {
      try {
        const lista = await listarUsuarios(dados.token);
        const eu = lista.find(
          (u) => u.email === loginUsado || u.usuario === loginUsado
        );
        if (eu) {
          if (id === null && eu.id !== undefined && eu.id !== null) {
            id = eu.id;
          }
          if (nome === null && eu.nome) {
            nome = eu.nome;
          }
        }
      } catch (e) {
        // Se falhar aqui, seguimos para o fallback abaixo.
      }
    }

    return { id: id, nome: nome !== null ? nome : loginUsado };
  }

  async function fazerLogin() {
    if (entrando) return;
    if (login.trim() === '' || senha === '') {
      setErro('Preencha o usuário e a senha.');
      return;
    }

    setEntrando(true);
    setErro(null);
    try {
      const dados = await entrar(login.trim(), senha);
      if (!dados || !dados.token) {
        setErro('A API não devolveu o token de acesso.');
        return;
      }
      const usuario = await resolverUsuario(dados, login.trim());
      aoEntrar(dados, usuario);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Bem-vindo</Text>
        <Text style={estilos.subtitulo}>Entre para continuar</Text>

        {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}
        {mensagem ? <Text style={estilos.mensagemSessao}>{mensagem}</Text> : null}

        <TextInput
          style={estilos.input}
          placeholder="Usuário ou e-mail"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          value={login}
          onChangeText={setLogin}
          onSubmitEditing={fazerLogin}
        />

        <TextInput
          style={estilos.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={fazerLogin}
        />

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.botaoPressionado,
          ]}
          onPress={fazerLogin}
          disabled={entrando}
        >
          <Text style={estilos.botaoTexto}>{entrando ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>

        <Pressable style={estilos.linkBotao} onPress={irParaCadastro}>
          <Text style={estilos.linkTexto}>Não tem conta? Cadastre-se</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  conteudo: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitulo: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
  },
  aviso: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  mensagemSessao: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#111827',
  },
  erro: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoPressionado: {
    backgroundColor: '#1D4ED8',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkBotao: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkTexto: {
    color: '#2563EB',
    fontSize: 15,
  },
});