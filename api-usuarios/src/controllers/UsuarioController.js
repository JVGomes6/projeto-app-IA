const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UsuarioModel = require('../models/UsuarioModel')

const {
    responderRequisicaoInvalida,
    responderNaoEncontrado,
    responderErroInterno,
    responderErro,
} = require('../utils/respostas')

const LIMITE_MAXIMO = 100
const LIMITE_PADRAO = 20
const SALT_ROUNDS = 10
const JWT_EXPIRACAO = '1h'

const interpretarPaginacao = (query) => {
    const { pagina, limite } = query

    if (pagina === undefined && limite === undefined) return null

    const paginaNumero = pagina === undefined ? 1 : Number(pagina)
    const limiteNumero = limite === undefined ? LIMITE_PADRAO : Number(limite)

    if (!Number.isInteger(paginaNumero) || paginaNumero < 1) {
        return { erro: 'O parâmetro "pagina" deve ser um inteiro maior ou igual a 1' }
    }
    if (!Number.isInteger(limiteNumero) || limiteNumero < 1) {
        return { erro: 'O parâmetro "limite" deve ser um inteiro maior ou igual a 1' }
    }
    if (limiteNumero > LIMITE_MAXIMO) {
        return { erro: `O parâmetro "limite" não pode passar de ${LIMITE_MAXIMO}` }
    }

    return {
        pagina: paginaNumero,
        limite: limiteNumero,
        offset: (paginaNumero - 1) * limiteNumero,
    }
}

const validarCadastro = ({ nome, sobrenome, email, usuario, senha }) => {
    if (!nome || nome.trim() === '') return 'O nome é obrigatório'
    if (!sobrenome || sobrenome.trim() === '') return 'O sobrenome é obrigatório'
    if (!email || email.trim() === '') return 'O e-mail é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'E-mail inválido'
    if (!usuario || usuario.trim() === '') return 'O usuário é obrigatório'
    if (usuario.trim().length < 3) return 'O usuário deve ter ao menos 3 caracteres'
    if (!senha || senha.length < 6) return 'A senha deve ter ao menos 6 caracteres'
    return null
}

class UsuarioController {

    static async listarTodos(req, res) {
        try {
            const paginacao = interpretarPaginacao(req.query)

            if (paginacao?.erro) {
                return responderRequisicaoInvalida(res, paginacao.erro)
            }

            if (!paginacao) {
                const usuarios = await UsuarioModel.listarTodos()
                return res.status(200).json({
                    sucesso: true,
                    quantidade: usuarios.length,
                    dados: usuarios,
                })
            }

            const [usuarios, total] = await Promise.all([
                UsuarioModel.listarTodos({
                    limite: paginacao.limite,
                    offset: paginacao.offset,
                }),
                UsuarioModel.contarTodos(),
            ])

            return res.status(200).json({
                sucesso: true,
                quantidade: usuarios.length,
                paginacao: {
                    pagina: paginacao.pagina,
                    limite: paginacao.limite,
                    total,
                    totalPaginas: Math.ceil(total / paginacao.limite),
                },
                dados: usuarios,
            })
        } catch (error) {
            return responderErroInterno(res, 'Erro ao listar usuários', error)
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params

            if (!id || isNaN(id)) {
                return responderRequisicaoInvalida(res, 'ID inválido')
            }

            const usuario = await UsuarioModel.buscarPorId(id)

            if (!usuario) {
                return responderNaoEncontrado(res, 'Usuário não encontrado')
            }

            return res.status(200).json({
                sucesso: true,
                dados: usuario,
            })
        } catch (error) {
            return responderErroInterno(res, 'Erro ao buscar usuário', error)
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, sobrenome, email, usuario, senha } = req.body

            const erroValidacao = validarCadastro({
                nome, sobrenome, email, usuario, senha,
            })
            if (erroValidacao) {
                return responderRequisicaoInvalida(res, erroValidacao)
            }

            const emailLimpo = email.trim().toLowerCase()
            const usuarioLimpo = usuario.trim()

            const emailEmUso = await UsuarioModel.buscarPorEmail(emailLimpo)
            if (emailEmUso) {
                return responderRequisicaoInvalida(res, 'E-mail já cadastrado')
            }

            const usuarioEmUso = await UsuarioModel.buscarPorUsuario(usuarioLimpo)
            if (usuarioEmUso) {
                return responderRequisicaoInvalida(res, 'Usuário já cadastrado')
            }

            const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)

            const novoUsuario = await UsuarioModel.criar({
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                email: emailLimpo,
                usuario: usuarioLimpo,
                senha: senhaHash,
            })

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso',
                dados: novoUsuario,
            })
        } catch (error) {
            if (/duplicate key|unique constraint/i.test(error.message)) {
                return responderRequisicaoInvalida(
                    res,
                    'E-mail ou usuário já cadastrado'
                )
            }
            return responderErroInterno(res, 'Erro ao cadastrar usuário', error)
        }
    }

    static async login(req, res) {
        try {
            const { login, senha } = req.body

            if (!login || !senha) {
                return responderRequisicaoInvalida(
                    res,
                    'Informe "login" (e-mail ou usuário) e "senha"'
                )
            }

            const usuario = await UsuarioModel.buscarPorEmailOuUsuario(
                String(login).trim()
            )

            if (!usuario) {
                return responderErro(res, 401, 'Credenciais inválidas')
            }

            if (!usuario.ativo) {
                return responderErro(res, 401, 'Usuário inativo')
            }

            const senhaConfere = await bcrypt.compare(senha, usuario.senha)

            if (!senhaConfere) {
                return responderErro(res, 401, 'Credenciais inválidas')
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    usuario: usuario.usuario,
                    email: usuario.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: JWT_EXPIRACAO }
            )

            // Remove a senha antes de devolver
            const { senha: _ignorada, ...usuarioSemSenha } = usuario

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    usuario: usuarioSemSenha,
                    token,
                },
            })
        } catch (error) {
            return responderErroInterno(res, 'Erro ao realizar login', error)
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params
            const { nome, sobrenome, email, usuario, senha, ativo } = req.body

            if (!id || isNaN(id)) {
                return responderRequisicaoInvalida(res, 'ID inválido')
            }

            const usuarioExiste = await UsuarioModel.buscarPorId(id)
            if (!usuarioExiste) {
                return responderNaoEncontrado(res, 'Usuário não encontrado')
            }

            if (email !== undefined) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
                    return responderRequisicaoInvalida(res, 'E-mail inválido')
                }
                const outro = await UsuarioModel.buscarPorEmail(email.trim())
                if (outro && outro.id !== Number(id)) {
                    return responderRequisicaoInvalida(res, 'E-mail já cadastrado')
                }
            }

            if (usuario !== undefined) {
                if (String(usuario).trim().length < 3) {
                    return responderRequisicaoInvalida(
                        res,
                        'O usuário deve ter ao menos 3 caracteres'
                    )
                }
                const outro = await UsuarioModel.buscarPorUsuario(usuario.trim())
                if (outro && outro.id !== Number(id)) {
                    return responderRequisicaoInvalida(res, 'Usuário já cadastrado')
                }
            }

            let senhaHash
            if (senha !== undefined) {
                if (typeof senha !== 'string' || senha.length < 6) {
                    return responderRequisicaoInvalida(
                        res,
                        'A senha deve ter ao menos 6 caracteres'
                    )
                }
                senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)
            }

            const usuarioAtualizado = await UsuarioModel.atualizar(id, {
                nome: nome?.trim(),
                sobrenome: sobrenome?.trim(),
                email: email !== undefined ? email.trim().toLowerCase() : undefined,
                usuario: usuario?.trim(),
                senha: senhaHash,
                ativo: typeof ativo === 'boolean' ? ativo : undefined,
            })

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso',
                dados: usuarioAtualizado,
            })
        } catch (error) {
            if (/duplicate key|unique constraint/i.test(error.message)) {
                return responderRequisicaoInvalida(
                    res,
                    'E-mail ou usuário já cadastrado'
                )
            }
            return responderErroInterno(res, 'Erro ao atualizar usuário', error)
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params

            if (!id || isNaN(id)) {
                return responderRequisicaoInvalida(res, 'ID inválido')
            }

            const deletado = await UsuarioModel.deletar(id)

            if (!deletado) {
                return responderNaoEncontrado(res, 'Usuário não encontrado')
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário deletado com sucesso',
            })
        } catch (error) {
            return responderErroInterno(res, 'Erro ao deletar usuário', error)
        }
    }
}

module.exports = UsuarioController