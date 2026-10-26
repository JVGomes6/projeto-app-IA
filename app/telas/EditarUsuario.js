import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { alterarUsuario, buscarUsuario, excluirUsuario } from '../servicos/api';

export default function EditarUsuario({
  token,
  usuario,
  voltar,
  definirAviso,
  aoExcluirConta,
}) {
  const [formulario, setFormulario] = useState({
    nome: usuario.nome || '',
    sobrenome: usuario.sobrenome || '',
    email: usuario.email || '',
    usuario: usuario.usuario || '',
  });
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Ao abrir a tela, busca na API os dados mais recentes deste usuário.
  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const atual = await buscarUsuario(usuario.id, token);
        if (ativo && atual) {
          setFormulario({
            nome: atual.nome || usuario.nome || '',
            sobrenome: atual.sobrenome || usuario.sobrenome || '',
            email: atual.email || usuario.email || '',
            usuario: atual.usuario || usuario.usuario || '',
          });
        }
      } catch (e) {
        // Se falhar, seguimos com os dados que vieram da lista.
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  function atualizarCampo(campo, valor) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function salvar() {
    if (salvando || excluindo) return;
    if (
      formulario.nome.trim() === '' ||
      formulario.sobrenome.trim() === '' ||
      formulario.email.trim() === '' ||
      formulario.usuario.trim() === ''
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    setErro(null);
    try {
      await alterarUsuario(
        usuario.id,
        {
          nome: formulario.nome.trim(),
          sobrenome: formulario.sobrenome.trim(),
          email: formulario.email.trim(),
          usuario: formulario.usuario.trim(),
        },
        token
      );
      if (definirAviso) {
        definirAviso('Alterações salvas com sucesso.');
      }
      voltar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (salvando || excluindo) return;
    setExcluindo(true);
    setErro(null);
    try {
      await excluirUsuario(usuario.id, token);
      aoExcluirConta(); // sai do app e avisa na tela de login
    } catch (e) {
      setErro(e.message);
      setConfirmando(false);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <View style={estilos.raiz}>
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={estilos.botaoVoltar} onPress={voltar}>
          <Text style={estilos.botaoVoltarTexto}>Voltar</Text>
        </Pressable>

        <Text style={estilos.titulo}>Editar usuário</Text>

        <TextInput
          style={estilos.input}
          placeholder="Nome"
          placeholderTextColor="#9CA3AF"
          value={formulario.nome}
          onChangeText={(valor) => atualizarCampo('nome', valor)}
        />

        <TextInput
          style={estilos.input}
          placeholder="Sobrenome"
          placeholderTextColor="#9CA3AF"
          value={formulario.sobrenome}
          onChangeText={(valor) => atualizarCampo('sobrenome', valor)}
        />

        <TextInput
          style={estilos.input}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={formulario.email}
          onChangeText={(valor) => atualizarCampo('email', valor)}
        />

        <TextInput
          style={estilos.input}
          placeholder="Usuário"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          value={formulario.usuario}
          onChangeText={(valor) => atualizarCampo('usuario', valor)}
        />

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        {confirmando ? (
          <View style={estilos.caixaConfirmacao}>
            <Text style={estilos.textoConfirmacao}>
              Tem certeza que deseja excluir sua conta? Você será desconectado
              e esta ação não pode ser desfeita.
            </Text>
            <View style={estilos.linhaBotoes}>
              <Pressable
                style={({ pressed }) => [
                  estilos.botaoPerigo,
                  estilos.botaoMetade,
                  estilos.botaoMetadeEsquerdo,
                  pressed && estilos.botaoPerigoPressionado,
                ]}
                onPress={excluir}
                disabled={excluindo}
              >
                <Text style={estilos.botaoPerigoTexto}>
                  {excluindo ? 'Excluindo...' : 'Sim, excluir'}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  estilos.botaoCancelar,
                  estilos.botaoMetade,
                  pressed && estilos.botaoCancelarPressionado,
                ]}
                onPress={() => setConfirmando(false)}
                disabled={excluindo}
              >
                <Text style={estilos.botaoCancelarTexto}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <Pressable
              style={({ pressed }) => [
                estilos.botao,
                pressed && estilos.botaoPressionado,
              ]}
              onPress={salvar}
              disabled={salvando}
            >
              <Text style={estilos.botaoTexto}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                estilos.botaoExcluir,
                pressed && estilos.botaoExcluirPressionado,
              ]}
              onPress={() => setConfirmando(true)}
            >
              <Text style={estilos.botaoExcluirTexto}>Excluir minha conta</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  conteudo: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingRight: 12,
  },
  botaoVoltarTexto: {
    color: '#2563EB',
    fontSize: 15,
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
    marginBottom: 12,
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
  botaoExcluir: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoExcluirPressionado: {
    backgroundColor: '#FEE2E2',
  },
  botaoExcluirTexto: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  caixaConfirmacao: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 14,
  },
  textoConfirmacao: {
    color: '#991B1B',
    fontSize: 14,
    marginBottom: 12,
  },
  linhaBotoes: {
    flexDirection: 'row',
  },
  botaoMetade: {
    flex: 1,
  },
  botaoMetadeEsquerdo: {
    marginRight: 10,
  },
  botaoPerigo: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoPerigoPressionado: {
    backgroundColor: '#B91C1C',
  },
  botaoPerigoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  botaoCancelar: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoCancelarPressionado: {
    backgroundColor: '#E5E7EB',
  },
  botaoCancelarTexto: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});