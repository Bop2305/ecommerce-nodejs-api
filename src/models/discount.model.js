const { default: mongoose } = require("mongoose");

const discountSchema = new mongoose.Schema({
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_code: { type: String, require: true },
    discount_type: {type: String, require: true, enum: ['PERCENTAGE', 'CURRENCY']},
    discount_value: { type: Number, require: true },
    discount_min_order_value: { type: Number, require: true },
    discount_max_quantity: { type: Number, require: true },
    discount_max_quantity_per_user: { type: Number, require: true },
    discount_used_count: { type: Number, require: true, default: 0 },
    discount_users_used: { type: Array, default: [] },
    is_published: { type: Boolean, default: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_applies_to: {type: String, require: true, enum: ['ALL', 'SPECIFIC']},
    discount_products_applied: { type: Array, default: [] },
    discount_shop: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    discount_is_active: { type: Boolean, default: true },
    create_at: { type: Date, default: Date.now() },
})

const Discount = mongoose.model('Discount', discountSchema)

module.exports = {
    Discount
}