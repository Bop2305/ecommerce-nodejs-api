const express = require('express')
const routes = express.Router()

const { verifyToken, checkRole, checkPermission } = require('../middlewares/auth.middleware')
const { asyncHandle } = require('../helpers/async.handle')
const { addProduct, getProducts, updateProduct, getListSearchProduct, getProductById, getAllProduct, deleteProduct } = require('../controllers/product.controller')

routes.get('/search/:keySearch', asyncHandle(getListSearchProduct))

routes.get('/:productId', asyncHandle(getProductById))

routes.get('/', asyncHandle(getAllProduct))

routes.get('/get-product', asyncHandle(getProducts))

routes.use(asyncHandle(verifyToken))

routes.post('/add-product', [asyncHandle(checkRole(['Admin'])), asyncHandle(checkPermission('All'))], asyncHandle(addProduct))

routes.patch('/update-product/:productId', [asyncHandle(checkRole(['Admin'])), asyncHandle(checkPermission('All'))], asyncHandle(updateProduct))

routes.delete('/delete-product/:productId', [asyncHandle(checkRole(['Admin'])), asyncHandle(checkPermission('All'))], asyncHandle(deleteProduct))

module.exports = routes