import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { cadastrarUsuario } from '../servicos/api';

export default function Cadastro({ aoCadastrar, voltar }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function cadastrar() {
    if (salvando) return;
    if (
      nome.trim() === '' ||
      sobrenome.trim() === '' ||
      email.trim() === '' ||
      usuario.trim() === '' ||
      senha === ''
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    setErro(null);
    try {
      await cadastrarUsuario({
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        usuario: usuario.trim(),
        senha: senha,
      });
      aoCadastrar(); // cadastrou: volta para o login
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.titulo}>Criar conta</Text>
        <Text style={estilos.subtitulo}>Preencha os dados abaixo</Text>

        <TextInput
          style={estilos.input}
          placeholder="Nome"
          placeholderTextColor="#9CA3AF"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={estilos.input}
          placeholder="Sobrenome"
          placeholderTextColor="#9CA3AF"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <TextInput
          style={estilos.input}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={estilos.input}
          placeholder="Usuário"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={estilos.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.botaoPressionado,
          ]}
          onPress={cadastrar}
          disabled={salvando}
        >
          <Text style={estilos.botaoTexto}>
            {salvando ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </Pressable>

        <Pressable style={estilos.linkBotao} onPress={voltar}>
          <Text style={estilos.linkTexto}>Voltar para o login</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
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
    marginBottom: 20,
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