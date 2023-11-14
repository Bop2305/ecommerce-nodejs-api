const express = require('express')
const routes = express.Router()

const { verifyToken } = require('../middlewares/auth.middleware')
const { asyncHandle } = require('../helpers/async.handle')
const { addCart } = require('../controllers/cart.controller')

routes.use(asyncHandle(verifyToken))

routes.post('/add-cart', asyncHandle(addCart))

module.exports = routes