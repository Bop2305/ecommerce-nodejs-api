const { default: mongoose } = require("mongoose")

const cartItemSchema = new mongoose.Schema({
    cart_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'Cart'},
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    product_name: {type: String, require: true},
    product_price: {type: Number, require: true},
    quantity: {type: Number, require: true},
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' },
})

const CartItem = mongoose.model('CartItem', cartItemSchema)

module.exports = {
    CartItem
}