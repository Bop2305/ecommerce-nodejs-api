const express = require('express')
const { signUp } = require('../../controllers/auth.controller')
const routes = express.Router()

routes.post('/sign-up', signUp)

module.exports = routes