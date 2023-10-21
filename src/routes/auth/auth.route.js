const express = require('express')
const { signUp, refreshToken } = require('../../controllers/auth.controller')
const routes = express.Router()

routes.post('/sign-up', signUp)

routes.post('/refresh-token', refreshToken)

module.exports = routes