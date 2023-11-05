const express = require('express')
const routes = express.Router()

routes.use('/auth', require('./auth/auth.route'))

routes.use('/product', require('./product.route'))

module.exports = routes
