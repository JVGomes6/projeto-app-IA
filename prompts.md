# Histórico de prompts e decisões

Este arquivo registra os pedidos enviados nesta conversa sobre a documentação,
a publicação do projeto e os testes. Os textos dos pedidos foram mantidos em
português, com pequenas quebras de linha para facilitar a leitura. Imagens
anexadas são identificadas, mas não reproduzidas aqui. Nenhuma senha, chave de
API, segredo JWT ou URL privada está incluída.

## Prompts enviados

1. **README do aplicativo**

   > faça um read.me do meu aplicativo e coloque na raiz do meu projeto:  
   > dentro mdo meu read.me coloque:  
   > o que o aplicativo faz? como instalar e rodar cada parte?  
   > e coloque onde trás o endereço online da API-IA com um pedio de exemplo para cpioar e colar.  
   > qual ia (DeepSeek e Z.Ai) e porque?  
   > Onde está no código o token e a senha criptografada ??  
   > A chave ee a instrução do sistema?

2. **Publicação na Vercel**

   > como  eu coloco o meu projeto para rodar na vercel?  
   > já tenhuo uma conta na vercel e este projeto ja está no github.

3. **Escolha do preset da Vercel**

   > Em "Application Preset" eu mantenho "services" ou eu mudo para "Node"?

4. **Confirmação da configuração**

   > assim?

5. **Resultado do primeiro acesso**

   > agora está assim

6. **Teste do domínio**

   > apareceu isto

7. **Esclarecimento sobre o botão Visit**

   > em new project cliquei em "Visiti" e retornou esta image na url

8. **Verificação do endpoint**

   > cliquei no link qeu tu me passou e acareceu isso

9. **Onde clicar**

   > onde eu clico nesta imagem?

10. **Pedido de passo a passo**

    > o que eu faço agora?  
    > monte um passo a passo

11. **Configuração da publicação do app**

    > assim?

12. **Confirmação**

    > Assim?

13. **Verificação do que falta**

    > falta alguma coisa?

14. **Resultado do deploy do app**

    > deu certo?

15. **Erro ao cadastrar**

    > tentei e deu isso. Falta os próximos passos?

16. **Criação do banco gratuito**

    > como faço o primeiro passo?

17. **Cartão de crédito**

    > ele está me pedindo para colocar o meu cartão de crédito.

18. **Alternativa ao cartão**

    > eu ja tenhjo um banco de cados local. o postgres não tem com oeu fazer um bd gratuito no vercel ou usar o meu local mesmo?

19. **Configuração do Neon**

    > ok estou nesta página o que eu faço agora e quais são os outros passos?

20. **Tela de criação do projeto Neon**

    > e aqui o que eu faço?

21. **Criação da tabela**

    > deu certo? qual é o próximo passo?

22. **Dados de conexão do Neon**

    > assim?

23. **Aba de conexão PostgreSQL**

    > assim?

24. **Próxima etapa da API de usuários**

    > agora vamos ao próximo passo.

25. **Deploy da API de usuários**

    > o que falta?

26. **Comando para gerar segredo JWT**

    > posso rodar na pasta raiz do projeto? (projeto-app)  
    > "node -e "console.log(require('crypto').randomBytes(32).toString('hex'))""

27. **Posição do segredo JWT**

    > coloquei o resultado ali está no lugar certo?

28. **Confirmação de autoria das alterações**

    > chat você fez estas alterações?

29. **Deploy após push**

    > ja fiz o push posso fazer o deploy agora?

30. **Resultado do deploy**

    > deu certo?

31. **API de usuários respondendo**

    > deu certinho

32. **Teste das duas rotas**

    > duas imagens um sem o "/saude"  
    > e outra com o "/saude"  
    > as duas deram certo o que eu faço agora?

33. **Atualização do endereço no app**

    > fiz o push e agora?

34. **Cadastro e conversa com o chat**

    > deu certo para me cadastrar  
    > e para conversar com o chat. veja na imagem

35. **Checagem final**

    > esta tudo dando certo.  
    > falta alguma coisa?

36. **Link público no repositório**

    > tem algum lugar dos arquivos e pasatas para eu colocar este link "[app](https://projeto-app-ia-app.vercel.app/)"?

37. **Este arquivo**

    > faça um arquivo "prompts.md" para eu baixar com todos os prompts que eu te enviei  
    > com o o que você decidiu sozinha e o que eu decidi por você? e o que você errou

## Decisões tomadas por você

- Escolheu publicar o projeto usando sua conta Vercel e o repositório do GitHub.
- Seguiu com projetos separados para o app web, a API de IA e a API de usuários,
  em vez de configurar tudo como um único projeto multissserviço.
- Preferiu procurar uma opção de PostgreSQL gratuita após o Render pedir cartão
  e escolheu o Neon para criar o banco.
- Criou a tabela `usuarios` no Neon.
- Gerou localmente o valor de `JWT_SECRET`, cadastrou as variáveis de ambiente
  na Vercel e fez push das alterações para o GitHub.
- Testou as rotas de saúde, cadastro, login e chat e confirmou que funcionaram.
- Forneceu o endereço público do app para ser incluído no README.

## Decisões e ações feitas pelo assistente

- Inspecionei o repositório e identifiquei as três partes: app Expo, API de
  usuários e API de IA.
- Recomendei publicar os serviços em projetos Vercel separados e, inicialmente,
  usar um provedor PostgreSQL hospedado, pois o banco local não é acessível pelo
  site publicado.
- Sugeri o Neon como alternativa quando o Render pediu cartão.
- Editei o README com instruções de instalação, execução, endpoints e segurança.
- Substituí o valor sensível que estava no exemplo `api-ia/.env.example` por um
  placeholder e ajustei o `.gitignore` para permitir versionar o exemplo, mas
  continuar ignorando os arquivos `.env` reais.
- Adaptei a API de usuários para aceitar `DATABASE_URL` sem remover o suporte
  às variáveis locais antigas, exportar o Express para uma função da Vercel e
  incluir uma configuração `vercel.json`.
- Atualizei a URL da API de IA no app, corrigi a URL da API de usuários após o
  domínio ser informado e adicionei os links públicos ao README.
- Executei verificações de sintaxe e um teste local da rota `/saude`. Também
  testei a API de IA publicada com uma pergunta válida e com entradas inválidas.
- Não fiz commit nem push. Você executou o push e os deploys pela sua conta.

## Erros, imprecisões e correções

- **Chave no exemplo de ambiente:** o arquivo `api-ia/.env.example` continha
  uma sequência com aparência de chave real. Eu a substituí por um placeholder,
  mas não confirmei se a chave era válida ou se já havia sido exposta. Se ela
  era uma credencial real, revogue-a no Google AI Studio e gere outra; trocar
  o exemplo no arquivo não invalida a chave antiga.
- **Interpretação de capturas da Vercel:** em alguns momentos tratei mensagens
  e telas como se indicassem um domínio de exemplo ou uma rota específica sem
  confirmar primeiro o endereço completo mostrado. Isso causou instruções
  confusas até você enviar capturas com o domínio real. O domínio deve sempre
  ser copiado do painel da implantação.
- **Deploys e publicação:** por texto, não consigo confirmar sozinho que um
  push ou deploy ocorreu. Quando disse para verificar o estado, a confirmação
  dependia das telas e dos testes que você compartilhou.
- **Tokens da pergunta ao chat:** o teste da API de IA retornou cerca de 219 mil
  tokens, aparentemente porque o PDF inteiro é enviado junto a cada pergunta.
  Eu alertei sobre o consumo, mas deveria ter destacado com mais clareza que
  esse valor é muito alto e que convém revisar a estratégia antes de uso
  frequente. A resposta também pode variar se o documento ou modelo mudar.
- **Descrição da senha:** em algumas respostas usei “senha criptografada” por
  simplicidade. Tecnicamente, `bcryptjs` gera um hash unidirecional; não é
  criptografia reversível.
- **Documentação inicial:** o README inicialmente tinha instruções de deploy
  genéricas e um endereço Vercel de exemplo. Depois que os domínios reais foram
  informados, atualizei os links e a configuração documentada.

## Situação registrada ao criar este arquivo

Segundo os testes e as capturas compartilhadas na conversa, o app web, a API
de usuários conectada ao Neon e a API de IA estavam respondendo, e você conseguiu
cadastrar uma conta e enviar uma pergunta ao chat. Isso registra o resultado
observado durante a conversa, não uma verificação contínua dos serviços.

---

## Histórico integrado dos arquivos anteriores

Esta seção organiza, por fase do desenvolvimento, o conteúdo dos cinco arquivos
fornecidos em `Downloads`:

- `Histórico de prompts e decisões.md` — criação da API de usuários e problemas
  de autenticação PostgreSQL/pgAdmin.
- `diferenças react web.md` — comparação conceitual entre React web e React
  Native.
- `react native api.md` — criação do app, integração com usuários e restrição de
  edição de perfis.
- `implementação api.md` — inclusão do chat no app e integração com a API de IA.
- `deepseek_markdown_20261031_00800c.md` — criação, testes e depuração da API de
  IA baseada na Gemini.

### Registro dos prompts das etapas anteriores

Os registros abaixo foram consolidados dos cinco arquivos-fonte listados acima,
preservando a ordem dos prompts dentro de cada etapa. Quando o próprio arquivo
de origem marca um prompt como reconstituído, ele continua identificado assim:
não há como recuperar palavras exatas que não constam nos materiais disponíveis.
Nenhum conteúdo de arquivo `.env`, senha real ou chave foi copiado para esta
seção.

#### API de usuários e PostgreSQL

1. **Solicitação inicial (texto registrado no arquivo-fonte):**

   > Vou te mandar em anexo o código de uma API de tarefas feita pelo meu professor, em Node.js, Express 5 e PostgreSQL (CommonJS). A estrutura de pastas é esta: server.js, package.json, src/config/database.js, src/constants/status.js, src/controllers/TarefaController.js, src/models/TarefaModel.js, src/routes/tarefaRoutes.js, src/utils/respostas.js.
   > O QUE EU QUERO: Transformar essa API de tarefas numa API de cadastro de usuários, que vai servir de login para um aplicativo de celular. Mantenha a mesma organização em camadas e o mesmo formato de resposta.
   > O BANCO: PostgreSQL, banco app_usuarios, uma tabela só, usuarios, com: id, nome, sobrenome, email, usuario, senha, ativo, data de criação e data de alteração. E-mail e usuário não podem se repetir. Me dê o script banco.sql.
   > AS ROTAS, em /api/usuarios: Cadastrar e fazer login ficam abertas. Listar todos, buscar por id, alterar e excluir só funcionam para quem fez login.
   > A SEGURANÇA, que é obrigatória: Senha com bcryptjs, nunca volta em resposta, login confere e devolve token JWT válido por 1 hora dentro de dados.token. Rotas fechadas exigem Authorization: ****** Sem token, 401. JWT_SECRET no .env. .gitignore para node_modules e .env.
   > PARA RODAR E TESTAR: nodemon, script npm run dev. .env com usuário postgres e senha postgres. testes.http para REST Client com pedidos na ordem: cadastrar, login, listar sem token (401), listar com token, buscar por id, alterar, excluir. Reaproveitar token com # @name login.
   > COMO ME DEVOLVER: Cada arquivo completo num bloco de código, caminho em cima. Dizer novos, mudados e para apagar. Comandos para rodar no fim.

2. **Problema com npm:** o arquivo-fonte registra saída do terminal mostrando avisos do `npm install`, uma tentativa de digitar `n` e a API rodando, seguida do pedido “me responda em português brasileiro”.
3. **Erro de autenticação no banco:** imagens do VS Code com erro 500 de autenticação PostgreSQL e do pgAdmin com a tabela criada.
4. **Erro no pgAdmin:** imagem com “Connection lost” e a pergunta “o que é isso?”
5. **Senha não resolvida:** “ele continuou pedindo a senha”.
6. **Edição do `pg_hba.conf`:** imagem do arquivo e a pergunta “assim?”
7. **Execução do comando SQL:** imagem do pgAdmin com o comando ainda não executado e `\q` no fim; pergunta “assim?”

#### Primeiros estudos e app Expo

1. **Comparação React web × React Native (transcrição do arquivo-fonte):**

   > Pesquise nas duas documentações oficiais, react.dev (React) e reactnative.dev (React Native), e me explique o que muda para quem já fez uma interface em React para o navegador e agora vai fazer um app de celular em React Native.
   > Quero uma tabela curta, de no máximo 8 linhas, com três colunas: o que eu usava no React web, o que uso no React Native, e uma frase explicando a diferença. Foque no que aparece num app simples: os elementos da tela, o texto, a imagem, o campo de digitar, o botão e o clique, o estilo (CSS) e onde o app roda.
   > No fim, cite os links das páginas da documentação que você usou.

2. **Primeira versão do app (transcrição do arquivo-fonte):**

   > Agora quero criar um app em React Native, com Expo e em JavaScript, que vai conversar com uma API de usuários que eu já fiz, em Node.js e Express. A API roda em http://localhost:3000 e tem a rota GET /saude, que responde {"status":"OK"}.
   > A estrutura de pastas vai ser esta, com a API e o app lado a lado:
   > projeto-app/
   >   api-tarefas/ (o original do professor, não mexer)
   >   api-usuarios/ (a API de usuários, já pronta)
   >   app/ (o app novo)
   > O QUE EU QUERO NESTA PRIMEIRA VERSÃO: uma tela só, que chama GET /saude a cada 5 segundos e mostra “API conectada” em verde quando responde e “Sem conexão com a API” em vermelho quando não responde. Deixe o endereço da API numa constante no topo do arquivo, com um comentário.
   > COMO VOU RODAR: no navegador, com o Expo para web, no meu computador com Windows.
   > COMO ME DEVOLVER: (1) comandos para criar o projeto na pasta app usando o template blank e instalar o que falta para o navegador; (2) App.js completo; (3) comando para rodar.

3. **Pedido do arquivo de prompts:** “faça um arquivo "prompts.md" para eu baixar com todos os prompts que eu te enviei com o o que você decidiu sozinha e o que eu decidi por você? e o que você errou”.

#### App de usuários (React Native + Expo)

O arquivo-fonte marca os prompts 1 a 4 como reconstituídos; as palavras abaixo
reproduzem essa reconstituição, não uma transcrição literal:

1. **Pedido inicial (reconstituído):**

   > Continuar um app React Native + Expo (JavaScript, template blank, rodando na web no Windows) que conversa com a API de usuários pronta (Node/Express em http://localhost:3000, respostas no formato `{ sucesso, mensagem, dados }`).
   > Estrutura: `projeto-app/` contendo `api-tarefas/` (não mexer), `api-usuarios/` (não mexer) e `app/`.
   > Telas: Login (usuário/senha; recusa mostra a mensagem da API), Cadastro (nome, sobrenome, e-mail, usuário, senha → volta ao login), Principal (pós-login, “Olá, <nome>”, botão para usuários, botão sair, resto em branco para futuro chat), Usuarios (lista da API + busca por nome), EditarUsuario (abre ao tocar num usuário; altera nome/sobrenome/e-mail/usuário; excluir com confirmação).
   > Regras de token: login devolve `dados.token`; token só na memória do app; rotas fechadas levam `Authorization: ******`; 401 volta ao login com “Sua sessão expirou, entre de novo”; sair apaga o token; token/senha nunca aparecem na tela.
   > Organização: sem biblioteca de navegação (App.js guarda a tela por estado), um arquivo por tela em `app/telas/`, todas as chamadas em `app/servicos/api.js` com a URL em constante no topo, visual simples que caiba em celular.
   > Entrega: árvore de arquivos, arquivos completos em blocos de código com caminho, comandos de instalação se preciso.
   > Anexo: conteúdo do `testes.http` com as rotas POST /api/usuarios, POST /api/usuarios/login, GET /api/usuarios, GET /api/usuarios/:id, PUT /api/usuarios/:id, DELETE /api/usuarios/:id.

2. **Conferência da árvore (reconstituído):** “era para ficar assim?”, com uma imagem da árvore de arquivos do projeto aberta no VS Code.
3. **Erro ao iniciar o Expo (reconstituído):** “o npm run dev ja está ativo em um terminal / isso eu coloquei em outro terminal o que está dando de errado?”, com log de `npm expo start --web` respondendo `Unknown command: 'expo'`.
4. **Novos requisitos (reconstituído):**

   > faltou adicionar o botão de 'sair' no aplicativo / o usuário logado deve alterar apenas as suas informações, as informações de outro usuário ele não pode mexer / coloque avisos e botões de confirmação / antes de mais nada me dê um passo a passo para eu enviar este projeto para o meu GitHub / depois me retorne um passo a passo completo com tudo que eu preciso fazer para adicionarmos as novas alterações.

Os prompts 5 a 8 estão registrados como literais:

5. **Botão sair na tela de usuários:** “coloque um botão de 'sair' nesta tela que ao clicar no botão e ele me leve novamente a tela de login.”
6. **Integração com o `App.js`:** envio do código completo do `App.js` e pergunta sobre onde inserir `<Usuarios token={token} idLogado={idLogado} abrirUsuario={abrirUsuario} aoSair={sairDoApp} />`.
7. **Restrição de edição:** “chat infelizmente um usuário pode fazer alterações nas informações de outro usuário como nome sobrenome email e usuário. faça um código que o usuário não pode mudar estes campos de outros usuários.”
8. **Arquivo `prompts.md`:** “faça um arquivo prompts.md para eu baixar com todos os prompts que eu te enviei com o o que você decidiu sozinha e o que eu decidi por você? e o que você errou”.

#### Chat de IA no app

1. **Adicionar o chat (transcrição do arquivo-fonte):**

   > Tenho um app em React Native, com Expo e em JavaScript, que roda no navegador. Ele já tem login, e depois do login abre a tela principal, que está no fim desta mensagem. Quero colocar nela um chat que conversa com uma API de IA que eu já fiz e que está on-line.
   >
   > A API DA IA
   >
   > O endereço fica numa constante no topo de um arquivo novo, app/servicos/ia.js, separado do api.js que já existe. Por enquanto use https://SEU-PROJETO.vercel.app, que eu troco pelo meu.
   > POST /perguntar, com o corpo { "pergunta": "..." }.
   > Responde { sucesso, mensagem, dados }, com a resposta em dados.resposta e os tokens gastos em dados.tokens.
   > Se der erro, sucesso vem false e o motivo vem em mensagem (por exemplo, 429 quando passa do limite de uso).
   > Esta API não precisa do token do login.
   >
   > O QUE EU QUERO NA TELA PRINCIPAL
   >
   > Manter o "Olá, " e os botões de usuários e de sair, que já existem.
   > Embaixo, o chat: as mensagens em balões, as minhas à direita e as da IA à esquerda, um campo para digitar e um botão de enviar.
   > Enquanto a IA responde, mostrar "Pensando..." e não deixar mandar outra pergunta.
   > Embaixo de cada resposta da IA, em letra pequena e cinza, quantos tokens ela gastou.
   > Se a API der erro, mostrar a mensagem dela no chat, em vermelho.
   > A conversa fica só na memória: sair do app apaga.
   >
   > COMO ME DEVOLVER
   >
   > Os arquivos novos e os alterados.
   > Cada arquivo completo, do começo ao fim, num bloco de código separado, com o caminho escrito em cima.
   > A TELA PRINCIPAL DE HOJE (app/telas/TelaPrincipal.js) [o arquivo-fonte registra que o código completo da tela foi anexado ao pedido; ele não está reproduzido aqui].

2. **Erro de conexão:** “Deu este erro ao rodar. Corrija e me devolva inteiros os arquivos que mudarem.” Acompanhado de quatro imagens do app, dos terminais das APIs e do Expo.
3. **Conversa funcionando:** “chat deu certo está correndo perfeitamente. Você consegue acessar outras conversdas qeu eu tenho no Z.ai?”
4. **Pedido do arquivo:** “faça um arquivo "prompts.md" em formato para eu copiar e colar com todos os prompts que eu te enviei com o o que você decidiu sozinha e o que eu decidi por você? e o que você errou”.

#### API de IA (`api-ia`)

O documento-fonte identifica os prompts 1 a 7 como reconstituídos ou resumidos;
seguem com a mesma ressalva:

1. Criar uma API `api-ia` com Node.js, Express e JavaScript CommonJS para responder perguntas com base no PDF `api-ia/documentos/regulamento-tcc.pdf`, usando a Gemini API e documentação oficial; o projeto já contém `api-tarefas/`, `api-usuarios/` e `app/`.
2. Conferir a estrutura de pastas (imagem).
3. Enviar o resultado de `git check-ignore -v api-ia\.env`.
4. Enviar o resultado de `npm install` e `npm run dev`.
5. Informar que os testes 1, 4 e 5 passaram.
6. Perguntar se a chave do AI Studio no formato novo iniciado por `AQ.` funciona.
7. Relatar erro 429 no `gemini-3.8-flash` e erro 500 nos modelos `gemini-2.5-flash` e `gemini-2.0-flash`.

O documento-fonte identifica os registros seguintes como literais ou associados
a logs/imagens:

8. Enviar o log de erro 404 do modelo `gemini-2.5-flash` e dizer “no segundo teste”.
9. Pedir: “me passe os códigos completos para eu copiar e colar e substituir os arquivos inteiros”.
10. Enviar o PDF e dizer: “é este o tcc que eu coloquei, está tudo assim.”
11. Relatar “ERRO DE NOVO DE LIMITE DE GEMINI”, com imagem do erro.
12. Relatar “A 2 DEU CERTO A TRES DEU ERRO DE SERVIDOR E A 6 DEU ERRO DE SERVIDOR”, acompanhado de log.
13. Informar: “todos deram certo”.
14. Pedir um arquivo `prompts.md` com os prompts enviados, decisões de cada parte e erros da assistente.

Os registros 8 e 12 foram associados a logs; as imagens e os logs originais não
são reproduzidos nesta transcrição.

#### Publicação e conferências atuais

Os prompts desta etapa permanecem na seção inicial **“Prompts enviados”**,
na ordem em que foram registrados nesta conversa. Capturas são descritas junto
aos respectivos pedidos; valores de credenciais não foram copiados.

Os registros se sobrepõem e alguns prompts são identificados nos próprios
arquivos como reconstituídos, não literais. Por isso, a ordem abaixo representa
a sequência lógica do projeto. Só atribuo datas exatas quando elas aparecem nos
materiais.

### Fase 1 — Comparação React web e React Native

**Pedido registrado:** pesquisar as documentações React e React Native e
comparar, em tabela curta, elementos da interface, texto, imagens, campos,
botões/eventos, estilos e ambiente de execução, citando as páginas consultadas.

**Decisões registradas como suas:** limitar as fontes às documentações oficiais,
definir os tópicos e o formato da tabela.

**Decisões registradas como da assistente Z.ai (GLM):** escolher as páginas
específicas, acrescentar uma linha sobre rolagem, mencionar `TouchableOpacity`,
separar o que permanece igual do que muda e oferecer uma comparação prática.

**Correções reconhecidas no arquivo de origem:** dizer que o layout usa “só
Flexbox” foi exagerado, pois o registro observa também posicionamento absoluto;
a descrição de herança de estilo foi simplificada demais, pois o registro
observa herança limitada em textos aninhados.

### Fase 2 — API de usuários e banco PostgreSQL local

**Pedido registrado:** transformar uma API de tarefas do professor em uma API de
cadastro/login de usuários com Node.js, Express 5, PostgreSQL e CommonJS,
mantendo as camadas e o formato de resposta. O escopo incluía tabela `usuarios`,
unicidade de e-mail e nome de usuário, cadastro/login públicos, rotas
autenticadas, hash bcrypt, JWT com validade de uma hora, `.env`, `.gitignore`,
script SQL e testes REST Client.

**Decisões registradas como suas:** stack e organização em camadas, campos e
rotas, formato das respostas, regras de segurança e formato de entrega dos
arquivos.

**Decisões registradas como da assistente Z.ai (GLM):** criar middleware
separado de autenticação, selecionar explicitamente os campos públicos,
adicionar validações de e-mail e tamanhos mínimos, aceitar e-mail ou usuário no
login e tratar erros de unicidade com uma resposta amigável.

**Conferências registradas como feitas por você:** instalação e execução da
API; criação/conferência da tabela pelo pgAdmin; apresentação de mensagens e
imagens do erro de autenticação do PostgreSQL; repetição da tentativa quando a
senha continuou sendo solicitada. O arquivo não registra uma bateria final
numerada de testes dessa fase.

**Erros registrados pela assistente e correções/observações:**

- A orientação para redefinir a senha pelo Query Tool do pgAdmin não resolveu o
  problema porque a conexão já falhava com a senha armazenada; a própria
  assistente registrou que deveria ter orientado primeiro um método que não
  dependesse daquela conexão.
- A instrução sobre `pg_hba.conf` não identificou com precisão as linhas
  aplicáveis; você alterou linhas de replicação. A assistente reconheceu que
  deveria ter apontado as linhas de `all`.
- Não foi explicado que `\q` é comando do terminal `psql`, não do Query Tool do
  pgAdmin. A assistente registrou que deveria ter esclarecido isso antes.

### Fase 3 — App Expo: monitoramento e comparação de plataforma

**Pedidos registrados:** criar um app Expo em JavaScript para web no Windows
que consultasse `GET /saude` a cada cinco segundos; também houve um pedido
separado de comparação entre React web e React Native, registrado na Fase 1.

**Decisões registradas como suas:** usar Expo/React Native, manter as APIs
existentes e apresentar o estado da API na interface com o endereço em uma
constante.

**Decisões registradas como da assistente Z.ai (GLM):** usar `fetch`, verificar
status e conteúdo da resposta, executar a primeira consulta imediatamente,
limpar o intervalo ao desmontar e acrescentar um texto indicando a URL e o
período de consulta.

**Correções e limitações anotadas no arquivo de origem:** o estado inicial
podia mostrar erro antes da primeira verificação; a orientação de CORS não
cobria a alternativa de módulos ES; faltou avisar que o gerador Expo pode
encontrar uma pasta `app` já existente; e a indicação de versão mínima de Node
foi aproximada. O timeout de `fetch` foi registrado como limitação conhecida,
não como bug.

### Fase 4 — App de usuários (React Native + Expo)

**Pedido registrado:** criar telas de login, cadastro, principal, lista de
usuários e edição, consumindo a API existente. O registro especifica token só em
memória, chamadas centralizadas em `app/servicos/api.js`, navegação por estado e
mensagem de sessão expirada.

**Decisões registradas como suas:** conteúdo das telas, regras de sessão,
estrutura de pastas, não alterar as APIs nessa fase, compatibilidade com web e
formato de entrega.

**Decisões registradas como da assistente Z.ai (GLM):** callback global para
401, resolução do nome a partir dos dados disponíveis, confirmações inline,
estilo visual, marcação do próprio usuário na lista e detalhes de apresentação.

**Pedidos e conferências subsequentes registrados:** você pediu o botão “Sair”
na tela de usuários; apresentou o `App.js` real para corrigir o ponto de
integração; relatou que ainda era possível alterar os dados de outro usuário e
solicitou uma restrição. O arquivo registra que, após mostrar o componente
real, as props foram alinhadas a `usuarioId`, `aviso`, `limparAviso` e outras
que já existiam no app.

**Erros reconhecidos e correções registradas:**

- Um exemplo inicial usou props que não correspondiam ao `App.js` real
  (`idLogado`, entre outras); depois, a integração foi reescrita usando os
  nomes existentes.
- A primeira restrição de edição não impediu, na prática, alterações em outros
  perfis. Após seu relato, foi descrito um modo somente leitura para perfis
  alheios e edição apenas do próprio perfil.
- O arquivo registra que a restrição implementada no app era apenas de
  interface e que uma garantia no servidor exigiria validação na API.
- Também foi registrada uma falha menor na opção usada para verificar sintaxe,
  corrigida durante aquela sessão.
- O arquivo de origem registra dificuldades de execução (`npm expo` em vez de
  `npx expo`, pasta de terminal inadequada e nomes de arquivos divergentes dos
  imports); isso é separado de erro de lógica da assistente.

**Conferências registradas:** a assistente relata testes próprios da camada de
serviço com API simulada (8/8) e verificação sintática. Isso é uma conferência
da assistente descrita no arquivo de origem, não um teste executado por você.

### Fase 5 — API de IA e integração do chat

Esta fase tem dois materiais complementares: o diário da API de IA e o
histórico de inclusão do chat no app. O diário da API informa que os testes
finais daquela sessão ocorreram em **26/10/2026**; por isso, a API é descrita
antes da integração do chat. As datas exatas do histórico do chat não estão
registradas.

#### API de IA

**Pedido registrado:** criar uma API Node.js/Express que respondesse perguntas
com base no PDF e expusesse `GET /saude` e `POST /perguntar`. O nome do PDF era
`regulamento-tcc.pdf`, mas a conferência posterior identificou seu conteúdo
como o Manual de Normalização de Documentos Científicos da ABNT do SiBi/UFPR.

**Decisões registradas como suas:** usar JavaScript/CommonJS, manter a API no
projeto, fornecer o PDF, criar a chave no Google AI Studio, pedir arquivos
completos e executar/reportar os testes. O diário registra `gemini-3.6-flash`
como o modelo que você configurou e validou naquela bateria local.

**Decisões registradas como da assistente Z.ai (GLM):** usar a biblioteca
`@google/genai`, enviar o PDF em base64 junto à pergunta, definir instruções de
sistema para respostas limitadas ao documento, padronizar o JSON, criar os
cenários de teste e tratar erros de cota, modelo, chave e disponibilidade.

**Conferências registradas como feitas por você:** teste de instalação e
execução local; conferência de que `.env` era ignorado pelo Git; testes das
rotas de saúde, validações de entrada e perguntas baseadas/no conteúdo externo
ao manual; envio de logs e capturas para investigar respostas 404, 429 e 503.
O diário informa que os seis cenários de teste passaram em 26/10/2026.

**Erros reconhecidos e correções registradas:**

- A assistente inicialmente atribuiu a falha ao endpoint, quando o log apontou
  indisponibilidade dos modelos usados com aquela chave; depois ajustou o
  tratamento e a orientação de modelo.
- Um teste inicial foi escrito supondo conteúdo típico de regulamento de TCC
  antes de conferir o PDF; depois foi adaptado a tópicos que o documento contém.
- Um erro 429 foi tratado inicialmente como limite por minuto, mas a evidência
  enviada por você apontou cota diária; a orientação foi corrigida.
- Uma correção foi enviada em partes, e o diário associa isso a uma função que
  faltou no arquivo colado (`ehErroDeCotaDiaria`); depois os arquivos completos
  foram entregues e foi anotado retry para erro 503.
- Um comentário sobre disponibilidade de modelos foi corrigido por não
  distinguir a restrição de conta/chave.

#### Integração do chat no app

**Pedido registrado:** adicionar chat à tela principal, usando um arquivo de
serviço separado, enviando `POST /perguntar`, mostrando mensagens em balões,
estado “Pensando...”, tokens e erros, sem persistir a conversa.

**Decisões registradas como suas:** contrato do endpoint, comportamento e
apresentação das mensagens, tokens, erros e duração da conversa em memória.

**Decisões registradas como da assistente Z.ai (GLM):** nome `perguntarIA`,
tratamento adicional de respostas inesperadas e falhas de rede, cores e detalhes
de layout, envio por Enter e rolagem automática.

**Correção registrada:** o primeiro erro de conexão ocorreu porque a URL ainda
era o placeholder; a assistente então alterou a configuração local para
`http://localhost:3001` e tornou a mensagem de rede mais informativa.

**Limitações anotadas:** a conversa podia zerar ao navegar para usuários e
voltar, e o teclado virtual poderia cobrir o campo em um celular. O registro
diz que essas limitações não foram alteradas naquela etapa.

### Fase 6 — Publicação e conferências na Vercel/Neon

Esta fase corresponde à conversa registrada neste arquivo, de **31/10/2026 a
01/11/2026**.

**Decisões tomadas por você:** publicar o app e as APIs na Vercel, optar por
projetos separados durante a configuração, usar o Neon quando o Render pediu
cartão, criar a tabela no Neon, gerar localmente o `JWT_SECRET`, fazer push e
seguir as instruções de deploy.

**Ações técnicas registradas como feitas por Copilot nesta conversa:**

- Criar/atualizar o README com instruções locais e links de produção.
- Preparar a API de usuários para aceitar `DATABASE_URL`, exportar o Express
  para a Vercel e adicionar `api/index.js` e `vercel.json`.
- Apontar o app para os domínios públicos das APIs que você compartilhou.
- Executar checagens de sintaxe/configuração e smoke test local.
- Testar diretamente a API de IA publicada: saúde, pergunta válida, pergunta
  vazia e pergunta acima do limite. O resultado reportado foi sucesso para o
  caso válido e HTTP 400 para os dois casos inválidos.

**Conferências realizadas por você, conforme as mensagens e capturas:**

1. Verificou a rota `/saude` da API de IA e viu `{"status":"OK"}`.
2. Executou os pedidos de `testes.http` na URL publicada e informou que todos
   deram certo.
3. Viu o deploy do app marcado como publicado em produção e abriu a tela de
   login na prévia.
4. Criou o projeto Neon e executou o SQL da tabela; a tela exibiu
   “Instrução executada com sucesso”.
5. Conferiu as rotas raiz e `/saude` da API de usuários; as respostas mostradas
   indicavam a API funcionando.
6. Fez push, testou o cadastro e confirmou que conseguiu cadastrar-se.
7. Testou o chat online e mostrou a resposta à pergunta sobre TCC.
8. Informou que o fluxo estava funcionando.

**Correções e imprecisões desta fase registradas pela assistente:** em algumas
orientações, um domínio ainda não confirmado foi tratado como exemplo ou uma
resposta de captura foi interpretada antes de confirmar o endereço completo.
Depois, os domínios reais fornecidos por você foram colocados nas instruções e
no README. A assistente também reconheceu que não executou o push/deploy por
você: você realizou essas ações na sua conta.

**Observação de consumo registrada:** uma chamada válida à API de IA retornou
aproximadamente 219 mil tokens. O diário da API descreve o envio do PDF inteiro
em cada pergunta; portanto o valor merece acompanhamento. Esse número é o
resultado daquela chamada, não uma medição de todas as perguntas nem uma
garantia de consumo futuro.

### Etapa posterior — investigação de timeout da API de IA

Em **01/11/2026**, você informou que o chat online mostrava uma falha ao
conectar à API de IA. A conferência direta mostrou que `/saude` respondia, mas
uma chamada válida a `/perguntar` terminava com HTTP 504. Os Runtime Logs da
Vercel confirmaram execuções encerradas após 30 segundos. Também mostraram uma
resposta 503 do Gemini por alta demanda e um `ReferenceError` porque
`ehErroDeCotaDiaria` era chamada sem estar definida no código implantado.

**Correções feitas por Copilot no código:**

- Adicionar `ehErroDeCotaDiaria` para classificar erros de cota diária sem
  causar `ReferenceError`.
- Tratar HTTP 503 e mensagens de alta demanda/sobrecarga como indisponibilidade
  temporária do Gemini, respondendo ao cliente com uma mensagem para tentar
  novamente mais tarde.
- Aumentar de 30 para 60 segundos o `maxDuration` da função em
  `api-ia/vercel.json`. A aplicação desse limite depende do plano da Vercel.

**Validação registrada:** verificações locais confirmaram a sintaxe do servidor,
a configuração de 60 segundos e as respostas HTTP 429 para cota diária e 503
para alta demanda simulada. Você informou que fez push das alterações; a
conclusão do novo deploy e o teste online após o deploy ainda precisam ser
confirmados. Aumentar o tempo não elimina uma sobrecarga temporária do Gemini.

### Fase 7 — melhorias de orientação e navegação no app

**Pedidos registrados em 01/11/2026:**

1. Na tela principal, adicionar uma linha explicando o que o usuário pode
   perguntar ao chat. A tela passou a apresentar uma orientação inicial sobre
   perguntas relacionadas ao documento, com exemplos de assuntos.
2. Na tela de usuários mostrada em uma captura, adicionar um botão para voltar
   à tela principal. O botão **Voltar** retorna sem encerrar a sessão; o botão
   **Sair** continua disponível para voltar ao login.
3. Atualizar este `README.md` e este `prompts.md` para registrar as mudanças.

**Decisões de implementação:** manter o texto de orientação na tela vazia do
chat, sem alterar o campo de entrada nem o comportamento de envio; fazer a
navegação da lista à tela principal por uma callback já controlada pelo estado
de telas em `app/App.js`.

**Conferências registradas:** a compilação web do app passou após as mudanças.
As prévias foram abertas no navegador; a tela de usuários da prévia usou dados
de exemplo apenas temporariamente, sem manter esses dados no código final.

## IAs utilizadas — distinção entre assistentes e modelo do aplicativo

| Uso | IA identificada nos registros | O que os materiais permitem afirmar |
|---|---|---|
| Assistente nas sessões anteriores sobre a API de usuários, o app Expo, o chat e a API de IA | **Z.ai (GLM)** | Os arquivos de histórico identificam explicitamente a assistente como Z.ai, modelo GLM. |
| Modelo consultado em tempo de execução pelo chat do projeto | **Google Gemini** | A API do projeto usa `@google/genai` e o diário registra `gemini-3.6-flash` como configuração testada naquela sessão. |
| Assistente nesta conversa de README, Vercel, Neon e organização deste arquivo | **Copilot SDK no VS Code** | As alterações e instruções desta sessão foram feitas por este assistente. |
| Motivo da preferência inicial pelo DeepSeek | **Informado por você nesta conversa** | Você explicou que escolheu o DeepSeek porque o professor o usou em aula. Isso registra a motivação acadêmica, mas não altera o fato de que a API atualmente integrada no código chama a Gemini. |
| DeepSeek em tempo de execução no app | **foi utilizado no início de acordo com a aula 4** | Sendo utilizado nas primeirs gerações de arquivos backend. |

### Diferença entre as IAs citadas

- **Z.ai (GLM)** e **Copilot SDK no VS Code** aparecem como assistentes usados
  para ajudar a escrever, corrigir, explicar ou documentar o projeto em sessões
  diferentes.
- **Gemini** é o provedor/modelo que o aplicativo chama pela API de IA.
- **DeepSeek** é citado na pergunta inicial sobre qual IA usar, mas os materiais
  do projeto não mostram uma integração dele em tempo de execução. Você explicou
  que a preferência veio do uso feito pelo professor em aula.
- Os registros diferem sobre a configuração do modelo Gemini: o diário da API
  informa `gemini-3.6-flash` como o modelo validado em 26/10/2026; o histórico
  desta conversa observou no repositório um exemplo com `gemini-3.8-flash` e
  uma configuração da Vercel mascarada. Portanto, estes documentos não
  permitem afirmar qual modelo está configurado agora na Vercel.

## Índice lógico dos materiais de origem

1. `diferenças react web.md` — fundamentos React web × React Native.
2. `Histórico de prompts e decisões.md` — API de usuários e autenticação
   PostgreSQL local.
3. `react native api.md` — construção do app e integração com a API de usuários.
4. `deepseek_markdown_20261031_00800c.md` — desenvolvimento e testes da API
   Gemini.
5. `implementação api.md` — inclusão do chat no app e sua conexão com a API.
6. Conversa registrada neste `prompts.md` — deploy, Neon, verificações de
   produção, cadastro, teste do chat e investigação do timeout da API de IA.

Os cinco arquivos-fonte continuam em `Downloads`; seus prompts e registros
disponíveis foram consolidados acima. A consolidação não acrescenta validações
externas nem transforma prompts que as fontes marcam como reconstituídos em
transcrições literais.
