const express = require('express')
const { signUp, refreshToken, signIn } = require('../../controllers/auth.controller')
const routes = express.Router()

routes.post('/sign-up', signUp)

routes.post('/sign-in', signIn)

routes.post('/refresh-token', refreshToken)

module.exports = routes