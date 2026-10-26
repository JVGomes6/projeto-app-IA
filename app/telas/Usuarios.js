import React, { useEffect, useRef, useState } from 'react';
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

export default function Usuarios({
  token,
  usuarioId,
  aviso,
  limparAviso,
  abrirUsuario,
}) {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [avisoRestricao, setAvisoRestricao] = useState(null);
  const timerAviso = useRef(null);

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

  // O aviso verde (de sucesso) desaparece sozinho depois de alguns segundos.
  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(limparAviso, 4000);
    return () => clearTimeout(timer);
  }, [aviso, limparAviso]);

  // Garante que o timer do aviso amarelo seja limpo ao sair da tela.
  useEffect(() => {
    return () => {
      if (timerAviso.current) {
        clearTimeout(timerAviso.current);
      }
    };
  }, []);

  function mostrarAvisoRestricao(texto) {
    setAvisoRestricao(texto);
    if (timerAviso.current) {
      clearTimeout(timerAviso.current);
    }
    timerAviso.current = setTimeout(() => setAvisoRestricao(null), 4000);
  }

  function ehOUsuarioLogado(usuario) {
    return (
      usuarioId !== null &&
      usuario.id !== undefined &&
      String(usuario.id) === String(usuarioId)
    );
  }

  // Regra de segurança: só o próprio usuário pode abrir a edição.
  function tocarCartao(usuario) {
    if (limparAviso) {
      limparAviso();
    }
    if (!ehOUsuarioLogado(usuario)) {
      mostrarAvisoRestricao(
        usuarioId === null
          ? 'Não foi possível identificar o seu usuário. Entre novamente.'
          : 'Você só pode editar o seu próprio usuário.'
      );
      return;
    }
    abrirUsuario(usuario);
  }

  // Busca simples pelo nome (inclui o sobrenome na comparação).
  const buscaNormalizada = busca.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) => {
    const nomeCompleto = `${u.nome || ''} ${u.sobrenome || ''}`.toLowerCase();
    return nomeCompleto.includes(buscaNormalizada);
  });

  function renderItem({ item }) {
    const souEu = ehOUsuarioLogado(item);
    return (
      <Pressable
        style={({ pressed }) => [
          estilos.cartao,
          souEu && estilos.cartaoProprio,
          pressed && estilos.cartaoPressionado,
        ]}
        onPress={() => tocarCartao(item)}
      >
        <View style={estilos.linhaNome}>
          <Text style={estilos.nome}>
            {item.nome} {item.sobrenome}
          </Text>
          {souEu ? <Text style={estilos.etiquetaVoce}>Você</Text> : null}
        </View>
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

        {aviso ? <Text style={estilos.avisoSucesso}>{aviso}</Text> : null}
        {avisoRestricao ? (
          <Text style={estilos.avisoRestricao}>{avisoRestricao}</Text>
        ) : null}
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
  avisoSucesso: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  avisoRestricao: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
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
  cartaoProprio: {
    borderColor: '#2563EB',
  },
  cartaoPressionado: {
    backgroundColor: '#EFF6FF',
  },
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  etiquetaVoce: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 8,
    overflow: 'hidden',
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