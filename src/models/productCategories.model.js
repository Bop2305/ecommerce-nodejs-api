const { default: mongoose } = require("mongoose");

const productCategorySchema = new mongoose.Schema({
    category_name: { type: String, require: true, unique: true },
    create_at: { type: Date, default: Date.now }
})

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema)

module.exports = {
    ProductCategory
}