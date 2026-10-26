import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  buscarUsuario,
  alterarUsuario,
  excluirUsuario,
} from '../servicos/api';

export default function EditarUsuario({
  token,
  usuario,
  usuarioId,
  voltar,
  definirAviso,
  aoExcluirConta,
}) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  const [confirmandoSalvar, setConfirmandoSalvar] = useState(false);
  const [confirmandoExcluir, setConfirmandoExcluir] = useState(false);

  // Regra de segurança: só é possível editar o PRÓPRIO perfil.
  // Se o id do usuário logado não estiver disponível, por segurança
  // a tela fica somente leitura.
  const ehMeuPerfil =
    usuarioId !== null &&
    usuarioId !== undefined &&
    String(usuario.id) === String(usuarioId);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const resposta = await buscarUsuario(usuario.id, token);
        let u = resposta;
        if (
          resposta &&
          typeof resposta.usuario === 'object' &&
          resposta.usuario !== null
        ) {
          u = resposta.usuario;
        }
        if (!ativo) return;
        setNome(u.nome || '');
        setSobrenome(u.sobrenome || '');
        setEmail(u.email || '');
        setLogin(u.usuario || '');
      } catch (e) {
        if (!ativo) return;
        setErro(e.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [usuario.id, token]);

  async function salvar() {
    if (
      nome.trim() === '' ||
      sobrenome.trim() === '' ||
      email.trim() === '' ||
      login.trim() === ''
    ) {
      setErro('Preencha todos os campos antes de salvar.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      await alterarUsuario(
        usuario.id,
        {
          nome: nome.trim(),
          sobrenome: sobrenome.trim(),
          email: email.trim(),
          usuario: login.trim(),
        },
        token
      );
      if (definirAviso) definirAviso('Alterações salvas com sucesso.');
      voltar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
      setConfirmandoSalvar(false);
    }
  }

  async function excluirMinhaConta() {
    setExcluindo(true);
    setErro('');
    try {
      await excluirUsuario(usuario.id, token);
      if (aoExcluirConta) aoExcluirConta();
    } catch (e) {
      setErro(e.message);
    } finally {
      setExcluindo(false);
      setConfirmandoExcluir(false);
    }
  }

  return (
    <ScrollView
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={estilos.titulo}>
        {ehMeuPerfil ? 'Meu perfil' : 'Detalhes do usuário'}
      </Text>

      {!ehMeuPerfil && (
        <View style={estilos.avisoLeitura}>
          <Text style={estilos.textoAvisoLeitura}>
            Você está vendo o perfil de outro usuário.{'\n'}Apenas consulta —
            não é possível alterar os dados de outras pessoas.
          </Text>
        </View>
      )}

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      {carregando ? (
        <ActivityIndicator style={estilos.carregando} color="#2563eb" />
      ) : (
        <>
          <Text style={estilos.rotulo}>Nome</Text>
          <TextInput
            style={[estilos.campo, !ehMeuPerfil && estilos.campoDesabilitado]}
            value={nome}
            onChangeText={setNome}
            editable={ehMeuPerfil}
            placeholder="Nome"
          />

          <Text style={estilos.rotulo}>Sobrenome</Text>
          <TextInput
            style={[estilos.campo, !ehMeuPerfil && estilos.campoDesabilitado]}
            value={sobrenome}
            onChangeText={setSobrenome}
            editable={ehMeuPerfil}
            placeholder="Sobrenome"
          />

          <Text style={estilos.rotulo}>E-mail</Text>
          <TextInput
            style={[estilos.campo, !ehMeuPerfil && estilos.campoDesabilitado]}
            value={email}
            onChangeText={setEmail}
            editable={ehMeuPerfil}
            placeholder="email@exemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={estilos.rotulo}>Usuário (login)</Text>
          <TextInput
            style={[estilos.campo, !ehMeuPerfil && estilos.campoDesabilitado]}
            value={login}
            onChangeText={setLogin}
            editable={ehMeuPerfil}
            placeholder="usuário"
            autoCapitalize="none"
          />
        </>
      )}

      {/* Botões de salvar e excluir: SOMENTE no próprio perfil */}
      {ehMeuPerfil && !carregando && (
        <>
          {confirmandoSalvar ? (
            <View style={estilos.painelSalvar}>
              <Text style={estilos.textoConfirmacaoSalvar}>
                Deseja realmente salvar as alterações?
              </Text>
              <View style={estilos.linhaBotoes}>
                <Pressable
                  style={({ pressed }) => [
                    estilos.botao,
                    estilos.botaoVerde,
                    pressed && estilos.botaoPressionado,
                  ]}
                  onPress={salvar}
                  disabled={salvando}
                >
                  <Text style={estilos.textoBotaoClaro}>
                    {salvando ? 'Salvando...' : 'Sim, salvar'}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    estilos.botao,
                    estilos.botaoNeutro,
                    pressed && estilos.botaoPressionado,
                  ]}
                  onPress={() => setConfirmandoSalvar(false)}
                >
                  <Text style={estilos.textoBotaoNeutro}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                estilos.botao,
                estilos.botaoAzul,
                pressed && estilos.botaoPressionado,
              ]}
              onPress={() => setConfirmandoSalvar(true)}
            >
              <Text style={estilos.textoBotaoClaro}>Salvar alterações</Text>
            </Pressable>
          )}

          {confirmandoExcluir ? (
            <View style={estilos.painelExcluir}>
              <Text style={estilos.textoConfirmacaoExcluir}>
                Tem certeza que deseja excluir sua conta?{'\n'}Esta ação não
                pode ser desfeita.
              </Text>
              <View style={estilos.linhaBotoes}>
                <Pressable
                  style={({ pressed }) => [
                    estilos.botao,
                    estilos.botaoVermelho,
                    pressed && estilos.botaoPressionado,
                  ]}
                  onPress={excluirMinhaConta}
                  disabled={excluindo}
                >
                  <Text style={estilos.textoBotaoClaro}>
                    {excluindo ? 'Excluindo...' : 'Sim, excluir'}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    estilos.botao,
                    estilos.botaoNeutro,
                    pressed && estilos.botaoPressionado,
                  ]}
                  onPress={() => setConfirmandoExcluir(false)}
                >
                  <Text style={estilos.textoBotaoNeutro}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                estilos.botao,
                estilos.botaoVermelhoClaro,
                pressed && estilos.botaoPressionado,
              ]}
              onPress={() => setConfirmandoExcluir(true)}
            >
              <Text style={estilos.textoBotaoVermelho}>
                Excluir minha conta
              </Text>
            </Pressable>
          )}
        </>
      )}

      {!carregando && (
        <Pressable onPress={voltar}>
          <Text style={estilos.linkVoltar}>Voltar para a lista</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  conteudo: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  avisoLeitura: {
    backgroundColor: '#fef9c3',
    borderWidth: 1,
    borderColor: '#fde047',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  textoAvisoLeitura: {
    color: '#854d0e',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  erro: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 8,
  },
  carregando: {
    marginTop: 24,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  campo: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 12,
  },
  campoDesabilitado: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
  },
  botao: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
    flex: 1,
    cursor: 'pointer',
  },
  botaoAzul: {
    backgroundColor: '#2563eb',
  },
  botaoVerde: {
    backgroundColor: '#16a34a',
  },
  botaoVermelho: {
    backgroundColor: '#dc2626',
  },
  botaoVermelhoClaro: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  botaoNeutro: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  botaoPressionado: {
    opacity: 0.85,
  },
  textoBotaoClaro: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoBotaoVermelho: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoBotaoNeutro: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  painelSalvar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  textoConfirmacaoSalvar: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  painelExcluir: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  textoConfirmacaoExcluir: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  linkVoltar: {
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
    paddingVertical: 14,
    marginTop: 4,
    cursor: 'pointer',
  },
});