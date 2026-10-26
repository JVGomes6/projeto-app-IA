import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// A tela Principal fica em branco de propósito no resto:
// é aqui que o chat vai entrar depois.
export default function Principal({ nome, irParaUsuarios, sair }) {
  return (
    <View style={estilos.raiz}>
      <View style={estilos.conteudo}>
        <Text style={estilos.saudacao}>Olá, {nome}!</Text>

        <Pressable
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.botaoPressionado,
          ]}
          onPress={irParaUsuarios}
        >
          <Text style={estilos.botaoTexto}>Ver usuários</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            estilos.botaoSair,
            pressed && estilos.botaoSairPressionado,
          ]}
          onPress={sair}
        >
          <Text style={estilos.botaoSairTexto}>Sair</Text>
        </Pressable>
      </View>
    </View>
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
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
  },
  botao: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  botaoPressionado: {
    backgroundColor: '#1D4ED8',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  botaoSair: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoSairPressionado: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  botaoSairTexto: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});