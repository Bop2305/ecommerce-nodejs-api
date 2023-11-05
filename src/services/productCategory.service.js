const { ProductCategory } = require("../models/productCategories.model")

class ProductCategoryService {
    static async getCategoryById(id) {
        const category = await ProductCategory.findById(id)

        return category
    }
}

module.exports = {
    ProductCategoryService
}