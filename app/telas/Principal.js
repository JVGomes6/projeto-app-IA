import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { perguntarIA } from '../servicos/ia';

export default function Principal({ nome, irParaUsuarios, sair }) {
  const [confirmandoSair, setConfirmandoSair] = useState(false);

  // Estado do chat. Fica só na memória: ao sair do app, a conversa some.
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);

  // Gera ids únicos para as mensagens e guarda a referência da lista.
  const contadorId = useRef(0);
  const listaRef = useRef(null);

  // Sempre que a lista muda (ou a IA começa/para de pensar),
  // rola para mostrar a mensagem mais recente.
  useEffect(() => {
    if (listaRef.current && mensagens.length > 0) {
      listaRef.current.scrollToEnd({ animated: true });
    }
  }, [mensagens, pensando]);

  // Só deixa enviar se houver texto e a IA não estiver respondendo.
  const podeEnviar = !pensando && texto.trim().length > 0;

  function adicionarMensagem(mensagem) {
    contadorId.current += 1;
    const nova = { id: contadorId.current, tokens: null, ...mensagem };
    setMensagens((atuais) => [...atuais, nova]);
  }

  async function enviarPergunta() {
    const pergunta = texto.trim();
    if (pergunta.length === 0 || pensando) {
      return;
    }

    setTexto('');
    adicionarMensagem({ autor: 'eu', texto: pergunta });
    setPensando(true);

    let respostaApi = null;
    try {
      respostaApi = await perguntarIA(pergunta);
    } catch (erro) {
      respostaApi = null;
    }

    setPensando(false);

    // Resposta certa da API: dados.resposta com o texto e dados.tokens.
    if (
      respostaApi &&
      respostaApi.sucesso &&
      respostaApi.dados &&
      typeof respostaApi.dados.resposta === 'string' &&
      respostaApi.dados.resposta.length > 0
    ) {
      adicionarMensagem({
        autor: 'ia',
        texto: respostaApi.dados.resposta,
        tokens:
          respostaApi.dados.tokens !== undefined &&
          respostaApi.dados.tokens !== null
            ? respostaApi.dados.tokens
            : null,
      });
    } else {
      // Qualquer problema (429, outro erro, rede): mostra em vermelho no chat.
      const motivo =
        respostaApi && respostaApi.mensagem
          ? respostaApi.mensagem
          : 'Não foi possível obter a resposta da IA.';
      adicionarMensagem({ autor: 'erro', texto: motivo });
    }
  }

  function renderMensagem({ item }) {
    const ehMinha = item.autor === 'eu';
    const ehErro = item.autor === 'erro';
    const mostraTokens =
      !ehMinha && !ehErro && item.tokens !== null && item.tokens !== undefined;

    return (
      <View
        style={[
          estilos.linhaMensagem,
          ehMinha ? estilos.linhaDireita : estilos.linhaEsquerda,
        ]}
      >
        <View
          style={[
            estilos.balao,
            ehMinha && estilos.balaoEu,
            !ehMinha && !ehErro && estilos.balaoIA,
            ehErro && estilos.balaoErro,
          ]}
        >
          <Text
            style={[
              estilos.textoBalao,
              ehMinha && estilos.textoBalaoEu,
              ehErro && estilos.textoBalaoErro,
            ]}
          >
            {item.texto}
          </Text>
        </View>

        {mostraTokens ? (
          <Text style={estilos.textoTokens}>
            {item.tokens} {Number(item.tokens) === 1 ? 'token' : 'tokens'}
          </Text>
        ) : null}
      </View>
    );
  }

  function renderPensando() {
    return (
      <View style={[estilos.linhaMensagem, estilos.linhaEsquerda]}>
        <View style={[estilos.balao, estilos.balaoIA]}>
          <Text style={[estilos.textoBalao, estilos.textoPensando]}>
            Pensando...
          </Text>
        </View>
      </View>
    );
  }

  function renderVazio() {
    return (
      <View style={estilos.caixaVazia}>
        <Text style={estilos.textoVazio}>
          Mande a sua primeira pergunta para a IA!
        </Text>
      </View>
    );
  }

  return (
    <View style={estilos.raiz}>
      <View style={estilos.conteudo}>
        <Text style={estilos.saudacao}>Olá, {nome}!</Text>

        {confirmandoSair ? (
          <View style={estilos.caixaConfirmacao}>
            <Text style={estilos.textoConfirmacao}>
              Deseja realmente sair do aplicativo?
            </Text>
            <View style={estilos.linhaBotoes}>
              <Pressable
                style={({ pressed }) => [
                  estilos.botaoPerigo,
                  estilos.botaoMetade,
                  estilos.botaoMetadeEsquerdo,
                  pressed && estilos.botaoPerigoPressionado,
                ]}
                onPress={sair}
              >
                <Text style={estilos.botaoPerigoTexto}>Sim, sair</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  estilos.botaoCancelar,
                  estilos.botaoMetade,
                  pressed && estilos.botaoCancelarPressionado,
                ]}
                onPress={() => setConfirmandoSair(false)}
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
              onPress={irParaUsuarios}
            >
              <Text style={estilos.botaoTexto}>Ver usuários</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                estilos.botaoSair,
                pressed && estilos.botaoSairPressionado,
              ]}
              onPress={() => setConfirmandoSair(true)}
            >
              <Text style={estilos.botaoSairTexto}>Sair</Text>
            </Pressable>
          </View>
        )}

        <View style={estilos.caixaChat}>
          <FlatList
            ref={listaRef}
            data={mensagens}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMensagem}
            ListEmptyComponent={renderVazio}
            ListFooterComponent={pensando ? renderPensando : null}
            contentContainerStyle={estilos.listaMensagens}
            onContentSizeChange={() => {
              if (listaRef.current) {
                listaRef.current.scrollToEnd({ animated: true });
              }
            }}
          />

          <View style={estilos.divisorChat} />

          <View style={estilos.linhaEntrada}>
            <TextInput
              style={[estilos.campoTexto, pensando && estilos.campoTextoDesativado]}
              value={texto}
              onChangeText={setTexto}
              placeholder="Escreva sua pergunta..."
              placeholderTextColor="#9CA3AF"
              editable={!pensando}
              returnKeyType="send"
              onSubmitEditing={enviarPergunta}
            />

            <Pressable
              style={({ pressed }) => [
                estilos.botaoEnviar,
                !podeEnviar && estilos.botaoEnviarDesativado,
                podeEnviar && pressed && estilos.botaoEnviarPressionado,
              ]}
              onPress={enviarPergunta}
              disabled={!podeEnviar}
            >
              <Text style={estilos.botaoEnviarTexto}>Enviar</Text>
            </Pressable>
          </View>
        </View>
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
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
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
    textAlign: 'center',
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

  // ===== Chat com a IA =====
  caixaChat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  listaMensagens: {
    padding: 12,
    flexGrow: 1,
  },
  caixaVazia: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  textoVazio: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  linhaMensagem: {
    marginTop: 8,
    flexDirection: 'column',
  },
  linhaDireita: {
    alignItems: 'flex-end',
  },
  linhaEsquerda: {
    alignItems: 'flex-start',
  },
  balao: {
    maxWidth: '80%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  balaoEu: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  balaoIA: {
    backgroundColor: '#E5E7EB',
    borderBottomLeftRadius: 4,
  },
  balaoErro: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderBottomLeftRadius: 4,
  },
  textoBalao: {
    fontSize: 15,
    lineHeight: 21,
    color: '#111827',
  },
  textoBalaoEu: {
    color: '#FFFFFF',
  },
  textoBalaoErro: {
    color: '#B91C1C',
  },
  textoPensando: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  textoTokens: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
    marginHorizontal: 4,
  },
  divisorChat: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  linhaEntrada: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  campoTexto: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    color: '#111827',
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  campoTextoDesativado: {
    backgroundColor: '#F3F4F6',
  },
  botaoEnviar: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoEnviarPressionado: {
    backgroundColor: '#1D4ED8',
  },
  botaoEnviarDesativado: {
    backgroundColor: '#93C5FD',
  },
  botaoEnviarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});