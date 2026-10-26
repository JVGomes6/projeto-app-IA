const express = require('express')
const UsuarioController = require('../controllers/UsuarioController')
const { autenticar } = require('../middlewares/auth')

const router = express.Router()

// Rotas abertas
router.post('/', UsuarioController.cadastrar)
router.post('/login', UsuarioController.login)

// Rotas protegidas
router.get('/', autenticar, UsuarioController.listarTodos)
router.get('/:id', autenticar, UsuarioController.buscarPorId)
router.put('/:id', autenticar, UsuarioController.atualizar)
router.delete('/:id', autenticar, UsuarioController.deletar)

module.exports = router