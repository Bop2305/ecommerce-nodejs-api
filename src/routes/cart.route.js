const express = require('express')
const routes = express.Router()

const { verifyToken } = require('../middlewares/auth.middleware')
const { asyncHandle } = require('../helpers/async.handle')
const { addCart, getListCart, increaseQuantity, decreaseQuantity, deleteCart, deleteCartItem } = require('../controllers/cart.controller')

routes.use(asyncHandle(verifyToken))

routes.post('/add-cart', asyncHandle(addCart))

routes.get('/', asyncHandle(getListCart))

routes.post('/increase-quantity', asyncHandle(increaseQuantity))

routes.post('/decrease-quantity', asyncHandle(decreaseQuantity))

routes.post('/delete-cart', asyncHandle(deleteCart))

routes.delete('/delete-cart-item/:productId', asyncHandle(deleteCartItem))

module.exports = routes