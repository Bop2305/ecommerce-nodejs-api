const express = require('express')
const routes = express.Router()

const { verifyToken } = require('../middlewares/auth.middleware')
const { asyncHandle } = require('../helpers/async.handle')
const { createDiscount, updateDiscount, deletedDiscount, getAllDiscount, getListProductByDiscount, getDiscountAmount, cancelDiscount } = require('../controllers/discount.controller')

routes.get('/all-product/:discountId', asyncHandle(getListProductByDiscount))

routes.use(asyncHandle(verifyToken))

routes.get('/all-discount', asyncHandle(getAllDiscount))

routes.post('/create-discount', asyncHandle(createDiscount))

routes.patch('/update-discount/:discountId', asyncHandle(updateDiscount))

routes.delete('/delete-discount/:discountId', asyncHandle(deletedDiscount))

routes.get('/discount-amount/:discountId', asyncHandle(getDiscountAmount))

routes.post('/cancel-discount/:discountId', asyncHandle(cancelDiscount))

module.exports = routes