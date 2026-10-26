import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { listarUsuarios } from '../servicos/api';

export default function Usuarios({ token, abrirUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await listarUsuarios(token);
      setUsuarios(lista);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  // Carrega a lista assim que a tela abre.
  useEffect(() => {
    carregar();
  }, []);

  // Busca simples pelo nome (inclui o sobrenome na comparação).
  const buscaNormalizada = busca.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) => {
    const nomeCompleto = `${u.nome || ''} ${u.sobrenome || ''}`.toLowerCase();
    return nomeCompleto.includes(buscaNormalizada);
  });

  function renderItem({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [
          estilos.cartao,
          pressed && estilos.cartaoPressionado,
        ]}
        onPress={() => abrirUsuario(item)}
      >
        <Text style={estilos.nome}>
          {item.nome} {item.sobrenome}
        </Text>
        <Text style={estilos.detalhe}>{item.usuario}</Text>
        <Text style={estilos.detalhe}>{item.email}</Text>
      </Pressable>
    );
  }

  return (
    <View style={estilos.raiz}>
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Usuários</Text>

        <TextInput
          style={estilos.input}
          placeholder="Buscar pelo nome..."
          placeholderTextColor="#9CA3AF"
          value={busca}
          onChangeText={setBusca}
        />

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        {carregando ? (
          <ActivityIndicator style={estilos.carregando} color="#2563EB" />
        ) : (
          <FlatList
            style={estilos.lista}
            data={usuariosFiltrados}
            keyExtractor={(item, indice) =>
              item.id !== undefined && item.id !== null
                ? String(item.id)
                : String(indice)
            }
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={estilos.listaVazia}>
                {usuarios.length === 0
                  ? 'Nenhum usuário cadastrado ainda.'
                  : 'Nenhum usuário encontrado para essa busca.'}
              </Text>
            }
          />
        )}

        <Pressable style={estilos.linkBotao} onPress={carregar}>
          <Text style={estilos.linkTexto}>Atualizar lista</Text>
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
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  carregando: {
    marginTop: 32,
  },
  lista: {
    flex: 1,
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cartaoPressionado: {
    backgroundColor: '#EFF6FF',
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  detalhe: {
    fontSize: 14,
    color: '#6B7280',
  },
  listaVazia: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
    fontSize: 14,
  },
  linkBotao: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  linkTexto: {
    color: '#2563EB',
    fontSize: 15,
  },
});