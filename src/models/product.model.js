const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema({
    product_name: { type: String, require: true },
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_image: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_short_desc: { type: String, require: true },
    product_long_desc: { type: String, require: true },
    product_SKU: { type: mongoose.Schema.Types.Mixed, require: true },
    product_type: { type: String, require: true },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    product_slug: { type: String },
    product_ratings_average: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5'],
        set: (val) => Math.round(val * 10) / 10
    },
    is_draft: { type: Boolean, default: true, select: false, index: true },
    is_published: { type: Boolean, default: false, select: false, index: true },
    product_category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    create_at: { type: Date, default: Date.now },
})

productSchema.index({ product_name: 'text', product_short_desc: 'text' })

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

const Product = mongoose.model('Product', productSchema)

const clothesSchema = new mongoose.Schema({
    size: { type: Number, require: true },
    brand: { type: String, require: true },
    ingredients: { type: String, require: true },
    color: { type: String, require: true },
})

const Clothes = mongoose.model('Clothes', clothesSchema)

module.exports = {
    Product,
    Clothes
}