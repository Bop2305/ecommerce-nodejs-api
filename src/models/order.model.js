const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
    fullname: {type: String, require: true},
    phone_number: {type: Number, require: true},
    total_price: {type: Number, require: true},
    order_status: {type: String, require: true, enum: ['SUCCESS', 'SHIPPING', 'FAILED']},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' },
})

const Order = mongoose.model('Order', orderSchema)

module.exports = {
    Order
}