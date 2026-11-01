# Aplicativo de usuários e assistente de TCC

Este repositório contém três partes: um aplicativo Expo/React Native, uma API
para cadastro e autenticação de usuários e uma API de IA que responde perguntas
com base no PDF disponibilizado no projeto.

## Acessar o projeto online

- **Aplicativo web:** [abrir o app](https://projeto-app-ia-app.vercel.app/)
- **API de usuários:** [verificar a API](https://projeto-app-ia-2h3z.vercel.app/saude)
- **API de IA:** [verificar a API](https://projeto-app-ia.vercel.app/saude)

## O que o aplicativo faz?

- Permite cadastrar usuários e entrar com e-mail ou nome de usuário.
- Mantém uma sessão autenticada com token JWT e permite listar, consultar,
  editar e excluir usuários.
- Envia perguntas sobre o documento de TCC para uma API de IA. A resposta deve
  se basear no documento e indicar a seção ou artigo relevante.

## Estrutura

| Pasta | Responsabilidade | Endereço local |
|---|---|---|
| `app/` | Aplicativo Expo/React Native | Expo (normalmente porta 8081) |
| `api-usuarios/` | API Express, autenticação JWT e acesso ao PostgreSQL | `http://localhost:3000` |
| `api-ia/` | API Express que envia o PDF e a pergunta ao modelo de IA | `http://localhost:3001` |

As APIs são processos separados. Para usar todas as funções, inicie o banco de
dados e as duas APIs antes de iniciar o aplicativo.

## Requisitos

- Node.js 20 ou superior e npm.
- PostgreSQL para a API de usuários.
- Uma chave de API Gemini para a API de IA.
- Expo Go para executar em um dispositivo físico, ou um emulador/navegador.

## Instalação e execução

Abra um terminal na raiz do repositório e configure cada parte separadamente.
Mantenha os terminais das APIs abertos enquanto usar o aplicativo.

### 1. Banco de dados e API de usuários

Crie o banco e a tabela executando o script com o cliente `psql` instalado:

```powershell
psql -U postgres -f .\api-usuarios\src\utils\banco.sql
```

Crie `api-usuarios/.env` com os dados do seu PostgreSQL e um segredo JWT forte:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_usuarios
DB_USER=postgres
DB_PASSWORD=sua_senha_local_do_postgres
JWT_SECRET=gere_um_segredo_longo_e_aleatorio
```

Instale as dependências e inicie a API:

```powershell
cd .\api-usuarios
npm install
npm run dev
```

A API ficará em `http://localhost:3000`. Verifique se está ativa em
`http://localhost:3000/saude`.

### 2. API de IA

Crie uma chave no [Google AI Studio](https://aistudio.google.com/apikey).
Copie `api-ia/.env.example` para `api-ia/.env` e preencha `GEMINI_API_KEY` com
sua chave. O arquivo `.env` não deve ser enviado ao Git.

```powershell
Copy-Item .\api-ia\.env.example .\api-ia\.env
```

Depois, em um terminal aberto na raiz do repositório, instale as dependências
e inicie o servidor:

```powershell
cd .\api-ia
npm install
npm run dev
```

A API ficará em `http://localhost:3001`. A rota de verificação é
`http://localhost:3001/saude`. O documento carregado pela API está em
`api-ia/documentos/regulamento-tcc.pdf`.

### 3. Aplicativo Expo

Em outro terminal, na raiz do repositório:

```powershell
cd .\app
npm install
npm start
```

Siga as instruções do Expo no terminal: pressione `w` para abrir a versão web
ou escaneie o QR code com o Expo Go. Também é possível iniciar diretamente com
`npm run web` ou `npm run android`.

Por padrão, o aplicativo chama as APIs em `localhost`. Para executar em um
celular físico ou em um emulador, ajuste os endereços em
`app/servicos/api.js` (usuários) e `app/servicos/ia.js` (IA) para um endereço
acessível pelo dispositivo, como o IP local do computador. No emulador Android
use, em geral, `10.0.2.2` para acessar o computador host.

### Publicar a API de usuários na Vercel com Neon

A API de usuários pode ser implantada como um projeto Vercel separado. O
repositório inclui um adaptador serverless em `api-usuarios/api/index.js` e a
configuração de rotas em `api-usuarios/vercel.json`. Ao importar o repositório,
selecione `api-usuarios` como **Root Directory**.

Cadastre estas variáveis em **Project Settings → Environment Variables**:

- `DATABASE_URL`: URL de conexão PostgreSQL do Neon, copiada de **Connect →
  Postgres database → Node.js → .env**. Mantenha essa credencial privada.
- `JWT_SECRET`: segredo forte e aleatório usado para assinar os tokens de login.

Depois do deploy, teste `/saude` no domínio gerado. Para conectar o app, troque
`URL_API` em `app/servicos/api.js` para
`https://SEU-DOMINIO.vercel.app/api/usuarios` e publique novamente o app web.
As rotas abertas de cadastro e login ficam em `/api/usuarios` e
`/api/usuarios/login`; as demais exigem o token JWT.

## API de IA: endereço e exemplo de pedido

Localmente, envie pedidos para:

```text
POST http://localhost:3001/perguntar
Content-Type: application/json
```

Corpo de exemplo (pode copiar e colar em uma ferramenta REST):

```json
{
  "pergunta": "Quais são as margens padrão para os documentos acadêmicos segundo o manual?"
}
```

A API aceita perguntas de até 500 caracteres. Também há exemplos de chamadas e
validações em `api-ia/testes.http` (use a extensão REST Client do VS Code).
Uma resposta bem-sucedida inclui `dados.resposta` e `dados.tokens`.

### Endereço online

O endpoint publicado para enviar perguntas é:

```text
POST https://projeto-app-ia.vercel.app/perguntar
Content-Type: application/json
```

Use o mesmo JSON de exemplo acima. O app usa essa API por meio da constante
`ENDERECO_IA` em `app/servicos/ia.js`. A API de usuários é publicada
separadamente; seu endereço está configurado em `URL_API`, no arquivo
`app/servicos/api.js`.

## Qual IA é usada: DeepSeek, Z.AI ou outra?

Atualmente, o código **não está configurado para DeepSeek nem Z.AI**. A API usa
a **Gemini**, pela biblioteca oficial `@google/genai`, e o modelo configurado
por padrão é `gemini-3.8-flash`.

Essa escolha permite enviar o PDF junto com a pergunta diretamente ao modelo,
e a integração Gemini já está implementada no projeto. A instrução do sistema
orienta a resposta a usar somente o documento, citar a seção/artigo e informar
quando não encontrar a resposta. Para trocar para DeepSeek ou Z.AI seria
necessário alterar a integração da API; basta trocar a chave ou o nome do
modelo não é suficiente.

## Onde ficam a chave, o token e a senha?

- **Chave da API de IA:** `GEMINI_API_KEY` em `api-ia/.env`. Ela é usada apenas
  pelo servidor da API de IA; não coloque essa chave no aplicativo. O arquivo
  `api-ia/.env.example` é apenas um modelo, sem uma chave válida.
- **Token JWT:** a API de usuários cria o token no login, em
  `api-usuarios/src/controllers/UsuarioController.js`. O segredo usado para
  assiná-lo é `JWT_SECRET`, definido em `api-usuarios/.env`; a verificação do
  token fica em `api-usuarios/src/middlewares/auth.js`. No aplicativo, o token
  retornado pelo login fica somente na memória (`app/App.js`) e é enviado nas
  chamadas protegidas.
- **Senha do usuário:** não é armazenada como texto nem criptografada de forma
  reversível. `bcryptjs` cria um hash com `bcrypt.hash` no cadastro e o banco
  guarda esse hash na coluna `usuarios.senha`. No login, `bcrypt.compare`
  verifica a senha informada. O modelo de usuário evita devolver esse campo nas
  respostas públicas.
- **Instrução do sistema:** fica no código, na constante
  `INSTRUCAO_SISTEMA` de `api-ia/assistente-documento.js`. Ela contém as regras
  de resposta enviadas ao modelo; **não é uma chave nem um segredo de acesso**.

Não publique arquivos `.env`, chaves Gemini, senhas de banco, `JWT_SECRET` ou
tokens. Se uma chave real já tiver sido compartilhada ou enviada ao repositório,
revogue-a no provedor e gere uma nova.
