const { BadRequestErrorResponse } = require("../core/error.response")
const { CreatedSuccessResponse, OKSuccessResponse } = require("../core/success.response")
const { ProductService } = require("../services/product.service")
const { ProductCategoryService } = require("../services/productCategory.service")

const addProduct = async (req, res) => {
    const product = req.body
    const userId = req.userId

    const productCategory = await ProductCategoryService.getCategoryById(product.productCategoryId)

    if (!productCategory) throw new BadRequestErrorResponse("Product category not found")

    const createdProduct = await ProductService.addProduct(productCategory.category_name, { ...product, userId })

    if (!createdProduct) throw new BadRequestErrorResponse("Create product failed")

    new CreatedSuccessResponse({ message: 'Created product success', data: { product: createdProduct } }).send(res)
}

const getProducts = async (req, res) => {
    const userId = req.userId
    const isDraft = req.body.isDraft
    const isPublished = req.body.isPublished
    const limit = req.body.limit
    const skip = req.body.skip

    const products = await ProductService.getProducts({ userId, isDraft, isPublished, limit, skip })

    if (!products) throw new BadRequestErrorResponse("Products not found")

    new OKSuccessResponse({ data: { products } }).send(res)
}

const updateProduct = async (req, res) => {
    const userId = req.userId
    const productId = req.params.productId
    const product = req.body

    const updatedProduct = await ProductService.updateProduct({ userId, productId, product })

    if (!updatedProduct) throw new BadRequestErrorResponse('Update product failed')

    new OKSuccessResponse({ message: 'Update product success', data: { product: updatedProduct } }).send(res)
}

const getListSearchProduct = async (req, res) => {
    const keySearch = req.params.keySearch

    const products = await ProductService.getListSearchProduct(keySearch)

    new OKSuccessResponse({ message: 'Get products success', data: { products } }).send(res)
}

const getAllProduct = async (req, res) => {
    const { limit, page, sort, filter } = req.query

    const select = req.body.select

    const products = await ProductService.getAllProduct({ limit, page, sort, filter, select })

    new OKSuccessResponse({ message: 'Get products success', data: { products } }).send(res)
}

const getProductById = async (req, res) => {
    const productId = req.params.productId
    const unselect = req.body.unselect

    const product = await ProductService.getProductById({ productId, unselect })

    if (!product) throw new BadRequestErrorResponse('Product not found')

    new OKSuccessResponse({ message: 'Get products success', data: { product } }).send(res)
}

const deleteProduct = async (req, res) => {
    const userId = req.userId
    const productId = req.params.productId

    const deletedProduct = await ProductService.deleteProduct({ userId, productId })

    if (!deletedProduct) throw new BadRequestErrorResponse('Delete product failed')

    console.log('deletedProduct', deletedProduct);

    new OKSuccessResponse({ message: 'Delete product success' }).send(res)
}

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    getListSearchProduct,
    getAllProduct,
    getProductById,
    deleteProduct
}