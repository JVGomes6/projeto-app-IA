import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
  aoSair,
}) {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const lista = await listarUsuarios(token);
      setUsuarios(lista || []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Aviso (ex.: "Alterações salvas") some sozinho depois de 4 segundos
  useEffect(() => {
    if (aviso && limparAviso) {
      const timer = setTimeout(limparAviso, 4000);
      return () => clearTimeout(timer);
    }
  }, [aviso, limparAviso]);

  const termo = busca.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nome} ${u.sobrenome}`.toLowerCase().includes(termo)
  );

  return (
    <View style={estilos.tela}>
      {/* Cabeçalho: título + botão Sair */}
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Usuários</Text>
        <Pressable
          style={({ pressed }) => [
            estilos.botaoSair,
            pressed && estilos.botaoSairAtivo,
          ]}
          onPress={() => aoSair && aoSair()}
        >
          <Text style={estilos.textoBotaoSair}>Sair</Text>
        </Pressable>
      </View>

      {/* Aviso verde (ex.: alterações salvas) */}
      {aviso ? (
        <View style={estilos.aviso}>
          <Text style={estilos.textoAviso}>{aviso}</Text>
        </View>
      ) : null}

      <TextInput
        style={estilos.campoBusca}
        placeholder="Buscar pelo nome..."
        value={busca}
        onChangeText={setBusca}
      />

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      {carregando ? (
        <ActivityIndicator style={estilos.carregando} color="#2563eb" />
      ) : (
        <ScrollView
          style={estilos.lista}
          contentContainerStyle={estilos.conteudoLista}
        >
          {usuariosFiltrados.length === 0 && (
            <Text style={estilos.semResultados}>
              Nenhum usuário encontrado.
            </Text>
          )}

          {usuariosFiltrados.map((u) => {
            const ehVoce = String(u.id) === String(usuarioId);
            return (
              <Pressable
                key={String(u.id)}
                style={({ pressed }) => [
                  estilos.cartao,
                  pressed && estilos.cartaoPressionado,
                ]}
                onPress={() => abrirUsuario && abrirUsuario(u)}
              >
                <View style={estilos.linhaNome}>
                  <Text style={estilos.nome}>
                    {u.nome} {u.sobrenome}
                  </Text>
                  {ehVoce && <Text style={estilos.etiquetaVoce}>Você</Text>}
                </View>
                <Text style={estilos.textoSecundario}>{u.usuario}</Text>
                <Text style={estilos.textoSecundario}>{u.email}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <Pressable onPress={carregar}>
        <Text style={estilos.linkAtualizar}>Atualizar lista</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#f4f5f7',
    padding: 20,
    paddingTop: 50,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  botaoSair: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    cursor: 'pointer',
  },
  botaoSairAtivo: {
    backgroundColor: '#dc2626',
  },
  textoBotaoSair: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aviso: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  textoAviso: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  campoBusca: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  erro: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 8,
  },
  carregando: {
    marginTop: 24,
  },
  lista: {
    flex: 1,
  },
  conteudoLista: {
    paddingBottom: 12,
  },
  semResultados: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
    fontSize: 14,
  },
  cartao: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    cursor: 'pointer',
  },
  cartaoPressionado: {
    backgroundColor: '#f9fafb',
  },
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
  },
  etiquetaVoce: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  textoSecundario: {
    color: '#6b7280',
    fontSize: 13,
  },
  linkAtualizar: {
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 12,
    cursor: 'pointer',
  },
});