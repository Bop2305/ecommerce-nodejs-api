const express = require('express')
const routes = express.Router()

const { verifyToken } = require('../middlewares/auth.middleware')
const { asyncHandle } = require('../helpers/async.handle')
const { checkoutReview } = require('../controllers/checkout.controller')

routes.use(asyncHandle(verifyToken))

routes.get('/review', asyncHandle(checkoutReview))

module.exports = routes