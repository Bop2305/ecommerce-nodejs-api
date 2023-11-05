const { BadRequestErrorResponse } = require("../core/error.response")
const { Product, Clothes } = require("../models/product.model")
const { findProducts, getListSearchProduct, getProductById, getAllProduct } = require("../models/repositories/product.repo")
const { removeUndefinedObject, updateNestObjectParser } = require("../utils/appUtils")
const { ProductCategoryService } = require("./productCategory.service")

const Categories = {
    'CLOTHES': 'Clothes'
}

class ProductObject {
    constructor(
        { productName, productPrice, productQuantity, productImage,
            productThumb, productShortDesc, productLongDesc, productSKU,
            productAttributes, productType, productCategoryId, userId }
    ) {
        this.product_name = productName
        this.product_price = productPrice
        this.product_quantity = productQuantity
        this.product_image = productImage
        this.product_thumb = productThumb
        this.product_short_desc = productShortDesc
        this.product_long_desc = productLongDesc
        this.product_SKU = productSKU
        this.product_attributes = productAttributes
        this.product_type = productType
        this.product_category = productCategoryId
        this.user = userId
    }

    async addProduct() {
        return await Product.create(this)
    }

    async updateProduct(productId) {

        return await Product.findByIdAndUpdate(productId, updateNestObjectParser(this), { new: true })
    }
}

class ClothesObject extends ProductObject {
    async addProduct() {
        this.product_attributes = await Clothes.create(this.product_attributes)
        return super.addProduct()
    }

    async updateProduct({ productId, productAttributesId }) {
        removeUndefinedObject(this.product_attributes)

        if (this.product_attributes) await Clothes.findByIdAndUpdate(productAttributesId, this.product_attributes, { new: true })
        
        return super.updateProduct(productId)
    }
}

class ClothesFactory {
    static createProduct(product) {
        return new ClothesObject(product)
    }

    static async addProduct(product) {
        const clothes = this.createProduct(product)
        return await clothes.addProduct()
    }

    static async updateProduct({ productId, productAttributesId, product }) {
        const clothes = this.createProduct(product)
        return await clothes.updateProduct({ productId, productAttributesId })
    }
}

class ProductService {
    static productRegistry = {}

    static registerProduct(type, productClass) {
        this.productRegistry[type] = productClass
        return this.productRegistry
    }

    static addProduct(categoryName, product) {
        const productFactory = this.productRegistry[categoryName]

        if (!productFactory) throw new BadRequestErrorResponse('Product category not found')

        return productFactory.addProduct(product)
    }

    static async getProductById({ productId, unselect = ['__v', 'create_at'] }) {
        const product = await getProductById({ productId, unselect })

        return product
    }

    static async getAllProduct({
        limit = 20,
        page = 1,
        sort = 'ctime',
        filter = { is_published: true },
        select = ['product_name', 'product_price', 'product_short_desc']
    }) {
        const product = await getAllProduct({ limit, page, sort, filter, select })

        return product
    }

    static async getProducts({ userId, isDraft, isPublished, limit = 20, skip = 0 }) {
        const query = {};

        if (userId) {
            query.user = userId;
        }

        if (isDraft !== undefined) {
            query.is_draft = isDraft;
        }

        if (isPublished !== undefined) {
            query.is_published = isPublished;
        }

        const products = await findProducts({ query, limit, skip })

        return products
    }

    static async updateProduct({ userId, productId, product }) {
        /**
         * Remove properties null or undefined
         * Find product
         * If attributes update attributes
         * Update product
        */
        removeUndefinedObject(product)

        const foundProduct = await Product.findOne({
            _id: productId,
            user: userId
        })

        if (!foundProduct) throw new BadRequestErrorResponse('Product not found')

        const productCategory = await ProductCategoryService.getCategoryById(foundProduct.product_category)

        const productFactory = this.productRegistry[productCategory.category_name]

        if (!productFactory) throw new BadRequestErrorResponse('Product category not found')

        const productAttributesId = foundProduct.product_attributes._id

        return await productFactory.updateProduct({ productId, productAttributesId, product })
    }

    static async deleteProduct({ userId, productId }) {
        const deletedProduct = await Product.findOneAndRemove({ _id: productId, user: userId })

        return deletedProduct
    }

    static async getListSearchProduct(keySearch) {

        const products = await getListSearchProduct(keySearch)

        return products
    }
}

ProductService.registerProduct(Categories['CLOTHES'], ClothesFactory)

module.exports = {
    ProductService
}