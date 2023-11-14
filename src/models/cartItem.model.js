const { default: mongoose } = require("mongoose")

const cartItemSchema = new mongoose.Schema({
    cart_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'Cart'},
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, require: true},
}, {
    timeseries: {
        createAt: 'create_at',
        updateAt: 'modified_at'
    }
})

const CartItem = mongoose.model('CartItem', cartItemSchema)

module.exports = {
    CartItem
}