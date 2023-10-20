const express = require('express')
const routes = express.Router()

routes.use('/auth', require('./auth/auth.route'))

module.exports = routes
