const jwt = require('jsonwebtoken')

const {
    responderErro,
} = require('../utils/respostas')

const autenticar = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return responderErro(res, 401, 'Token não informado')
    }

    const token = header.slice(7).trim()

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = payload
        return next()
    } catch (error) {
        return responderErro(res, 401, 'Token inválido ou expirado')
    }
}

module.exports = { autenticar }