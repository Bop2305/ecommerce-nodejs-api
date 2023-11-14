const express = require('express')
const routes = express.Router()

routes.use('/auth', require('./auth/auth.route'))

routes.use('/product', require('./product.route'))

routes.use('/discount', require('./discount.route'))

routes.use('/cart', require('./cart.route'))

module.exports = routes
